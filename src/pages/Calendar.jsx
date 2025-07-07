import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const CalendarPage = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patientsMap, setPatientsMap] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointments, setSelectedAppointments] = useState([]);

  useEffect(() => {
    const all = JSON.parse(localStorage.getItem("appointments")) || [];
    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    const map = {};
    patients.forEach(p => {
      map[p.id] = {
        name: p.name,
        contact: p.contact,
        healthInfo: p.healthInfo,
      };
    });
    setAppointments(all);
    setPatientsMap(map);
  }, []);

  const getDateAppointments = (date) => {
    const day = date.toISOString().split("T")[0];
    return appointments.filter(a => a.date.startsWith(day));
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    const selected = getDateAppointments(date);
    setSelectedAppointments(selected);
  };

  const tileClassName = ({ date }) => {
    const appts = getDateAppointments(date);
    return appts.length > 0 ? "appointment-day" : null;

  };

  if (user?.role !== "Admin") return <div className="p-8 text-red-600">Access Denied</div>;

  return (
    <div className="flex">
      <Sidebar />
<div className="ml-64 flex flex-col w-full min-h-screen">
        <Header />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Appointment Calendar</h1>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded shadow">
              <Calendar
                onClickDay={handleDayClick}
                tileClassName={tileClassName}
              />
            </div>

            {selectedDate && (
              <div className="bg-white p-4 rounded shadow">
                <h2 className="text-lg font-semibold text-blue-600 mb-2">
                  Appointments on {selectedDate.toDateString()}
                </h2>
                {selectedAppointments.length > 0 ? (
                  <ul className="space-y-3 text-sm">
                    {selectedAppointments.map((a) => {
                      const p = patientsMap[a.patientId];
                      return (
                        <li key={a.id} className="border p-3 rounded bg-gray-50">
                          <p><strong>Time:</strong> {a.date.split("T")[1]}</p>
                          <p><strong>Patient:</strong> {p?.name || a.patientId}</p>
                          <p><strong>Contact:</strong> {p?.contact || "-"}</p>
                          <p><strong>Health Info:</strong> {p?.healthInfo || "-"}</p>
                          <p><strong>Problem:</strong> {a.description}</p>
                          <p><strong>Status:</strong> {a.status}</p>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No appointments for this day.</p>
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default CalendarPage;

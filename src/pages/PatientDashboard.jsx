import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

const PatientDashboard = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    dob: "",
    contact: "",
    description: "",
    date: ""
  });

  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("appointments")) || [];
    const userAppointments = stored.filter((a) => a.patientId === user.id);
    setAppointments(userAppointments);
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newAppointment = {
      id: `a${Date.now()}`,
      patientId: user.id,
      name: form.name,
      dob: form.dob,
      contact: form.contact,
      description: form.description,
      date: form.date,
      status: "Pending"
    };

    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const updatedAppointments = [...allAppointments, newAppointment];
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
    setAppointments(updatedAppointments.filter((a) => a.patientId === user.id));

    setForm({ name: "", dob: "", contact: "", description: "", date: "" });
  };

  const upcoming = appointments.filter((a) => a.status === "Pending");
  const history = appointments.filter((a) => a.status !== "Pending");

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex flex-col w-full min-h-screen">
        <Header />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-2xl font-bold text-blue-700 mb-6">Book Appointment</h1>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded shadow-md max-w-xl mb-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full Name"
                required
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="dob"
                value={form.dob}
                onChange={handleChange}
                placeholder="Date of Birth"
                required
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="contact"
                value={form.contact}
                onChange={handleChange}
                placeholder="Contact"
                required
                className="border p-2 rounded"
              />
              <input
                type="datetime-local"
                name="date"
                value={form.date}
                onChange={handleChange}
                required
                className="border p-2 rounded"
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your symptoms"
                required
                className="border p-2 rounded col-span-1 md:col-span-2"
              />
            </div>
            <button
              type="submit"
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Book Appointment
            </button>
          </form>

          {/* Upcoming Appointments */}
          <div className="mb-10">
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Upcoming Appointments</h2>
            {upcoming.length > 0 ? (
              <ul className="space-y-3">
                {upcoming.map((a) => (
                  <li key={a.id} className="bg-white p-4 rounded shadow">
                    <p><strong>Date:</strong> {a.date}</p>
                    <p><strong>Problem:</strong> {a.description}</p>
                    <p><strong>Status:</strong> {a.status}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No upcoming appointments.</p>
            )}
          </div>

          {/* Appointment History */}
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Appointment History</h2>
            {history.length > 0 ? (
              <ul className="space-y-3">
                {history.map((a) => (
                  <li key={a.id} className="bg-white p-4 rounded shadow">
                    <p><strong>Date:</strong> {a.date}</p>
                    <p><strong>Status:</strong> {a.status}</p>
                    <p><strong>Cost:</strong> ₹{a.cost || "Not Added"}</p>
                    <p><strong>Note:</strong> {a.comment || "-"}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No history found.</p>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PatientDashboard;

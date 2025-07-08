import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [paymentInfo, setPaymentInfo] = useState({ cost: "", comment: "" });

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    const storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
    setAppointments(storedAppointments);
    setPatients(storedPatients);
  }, []);

  const getPatientName = (id) => {
    const patient = patients.find((p) => p.id === id);
    return patient ? patient.name : "Unknown";
  };

  const updateStatus = (id, newStatus) => {
    const updatedAppointments = appointments.map((appt) =>
      appt.id === id ? { ...appt, status: newStatus } : appt
    );
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));

    if (newStatus === "Completed") {
      const completedAppt = updatedAppointments.find((a) => a.id === id);
      const existingPatients = JSON.parse(localStorage.getItem("patients")) || [];

      const patientExists = existingPatients.some((p) => p.id === completedAppt.patientId);
      if (!patientExists) {
        const newPatient = {
          id: completedAppt.patientId,
          name: completedAppt.name || completedAppt.email || "Unnamed",
          dob: completedAppt.dob || "",
          contact: completedAppt.contact || "",
          healthInfo: completedAppt.description || "Not specified",
        };
        const updatedPatients = [...existingPatients, newPatient];
        localStorage.setItem("patients", JSON.stringify(updatedPatients));
        setPatients(updatedPatients);
      }
    }
  };

const handleCompleteWithPayment = () => {
  const updated = appointments.map((a) =>
    a.id === selectedAppointmentId
      ? {
          ...a,
          status: "Completed",
          cost: paymentInfo.cost || "0",
          comment: paymentInfo.comment,
        }
      : a
  );
  setAppointments(updated);
  localStorage.setItem("appointments", JSON.stringify(updated));

  // Update patients list if it's a new patient
  const completedAppt = updated.find((a) => a.id === selectedAppointmentId);
  const existingPatients = JSON.parse(localStorage.getItem("patients")) || [];

  const patientExists = existingPatients.some((p) => p.id === completedAppt.patientId);
  if (!patientExists) {
    const newPatient = {
      id: completedAppt.patientId,
      name: completedAppt.name || completedAppt.email || "Unnamed",
      dob: completedAppt.dob || "",
      contact: completedAppt.contact || "",
      healthInfo: completedAppt.description || "Not specified",
    };
    const updatedPatients = [...existingPatients, newPatient];
    localStorage.setItem("patients", JSON.stringify(updatedPatients));
    setPatients(updatedPatients);
  }

  setShowPaymentModal(false);
  setPaymentInfo({ cost: "", comment: "" });
};


  const next10 = [...appointments]
    .filter((a) => a.status !== "Completed" && a.status !== "Cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 10);

  const completed = appointments.filter((a) => a.status === "Completed").length;
  const pending = appointments.filter((a) => a.status === "Pending").length;
  const revenue = appointments.reduce((sum, a) => sum + (parseFloat(a.cost) || 0), 0);

  const topPatients = Object.entries(
    appointments.reduce((acc, curr) => {
      acc[curr.patientId] = (acc[curr.patientId] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const patient = patients.find((p) => p.id === id);
      return { name: patient?.name || `Unknown (ID: ${id})`, count };
    });

  const upcomingAppointments = appointments
    .filter((a) => a.status !== "Completed" && a.status !== "Cancelled")
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const historyAppointments = appointments
    .filter((a) => a.status === "Completed" || a.status === "Cancelled")
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-64 flex flex-col w-full min-h-screen">
        <Header />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold text-blue-700 mb-6">Admin Dashboard</h1>

          {/* KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            <KPI label="Next 10 Appointments" value={next10.length} />
            <KPI label="Pending Treatments" value={pending} color="text-yellow-600" />
            <KPI label="Completed Treatments" value={completed} color="text-green-600" />
            <KPI label="Total Revenue" value={`₹${revenue.toFixed(2)}`} color="text-blue-600" />
            <div className="bg-white p-4 shadow rounded text-center col-span-1 lg:col-span-2">
              <p className="text-lg font-semibold text-blue-700">Top Patients</p>
              {topPatients.length > 0 ? (
                <ul className="text-sm mt-2">
                  {topPatients.map((p, i) => (
                    <li key={i}>
                      👤 <strong>{p.name}</strong> — {p.count} visit{p.count > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 mt-2">No patient data</p>
              )}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">Upcoming Appointments</h2>
            {upcomingAppointments.length > 0 ? (
              <div className="space-y-4">
                {upcomingAppointments.map((a) => (
                  <div key={a.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                    <p><strong>Patient:</strong> {getPatientName(a.patientId)}</p>
                    <p><strong>Date:</strong> {a.date}</p>
                    <p><strong>Contact:</strong> {a.contact || "-"}</p>
                    <p><strong>Problem:</strong> {a.description}</p>
                    <p><strong>Status:</strong> {a.status}</p>

                    <div className="mt-3 flex gap-3">
                      <button
                        onClick={() => {
                          setSelectedAppointmentId(a.id);
                          setShowPaymentModal(true);
                        }}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded"
                      >
                        Mark Completed
                      </button>
                      <button
                        onClick={() => updateStatus(a.id, "Cancelled")}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No upcoming appointments.</p>
            )}
          </section>

          {/* Appointment History */}
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-gray-700">Appointment History</h2>
            {historyAppointments.length > 0 ? (
              <div className="space-y-4">
                {historyAppointments.map((a) => (
                  <div key={a.id} className="bg-white p-4 rounded shadow border-l-4 border-gray-400">
                    <p><strong>Patient:</strong> {getPatientName(a.patientId)}</p>
                    <p><strong>Date:</strong> {a.date}</p>
                    <p><strong>Contact:</strong> {a.contact || "-"}</p>
                    <p><strong>Problem:</strong> {a.description}</p>
                    <p><strong>Status:</strong> {a.status}</p>
                    <p><strong>Cost:</strong> ₹{a.cost || "Not Added"}</p>
                    {a.comment && <p><strong>Note:</strong> {a.comment}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No appointment history yet.</p>
            )}
          </section>

          {/* Payment Modal */}
          {showPaymentModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                <h2 className="text-xl font-semibold mb-4">Enter Treatment Cost</h2>
                <input
                  type="number"
                  placeholder="Cost in ₹"
                  value={paymentInfo.cost}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, cost: e.target.value })}
                  className="border w-full p-2 rounded mb-3"
                />
                <input
                  type="text"
                  placeholder="Optional comment"
                  value={paymentInfo.comment}
                  onChange={(e) => setPaymentInfo({ ...paymentInfo, comment: e.target.value })}
                  className="border w-full p-2 rounded mb-3"
                />
                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 bg-gray-500 text-white rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCompleteWithPayment}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
};

const KPI = ({ label, value, color = "text-gray-600" }) => (
  <div className="bg-white p-4 shadow rounded text-center">
    <p className={`text-xl font-bold ${color}`}>{value}</p>
    <p className="text-sm text-gray-500">{label}</p>
  </div>
);

export default AdminDashboard;

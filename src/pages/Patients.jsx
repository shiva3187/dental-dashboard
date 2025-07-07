// src/pages/Patients.jsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Patients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newPatient, setNewPatient] = useState({
    id: "",
    name: "",
    dob: "",
    contact: "",
    healthInfo: "",
  });
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [showAppointmentsFor, setShowAppointmentsFor] = useState(null);

  useEffect(() => {
    const storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
    const currentUserIsPatient = storedPatients.some((p) => p.id === user?.id);

    if (!currentUserIsPatient && user?.role === "Patient") {
      const newPatients = [...storedPatients, { id: user.id, name: user.email }];
      localStorage.setItem("patients", JSON.stringify(newPatients));
      setPatients(newPatients);
    } else {
      setPatients(storedPatients);
    }

    const allAppointments = JSON.parse(localStorage.getItem("appointments")) || [];
    setAppointments(allAppointments);
  }, [user]);

  const handleAddOrUpdatePatient = () => {
    if (!newPatient.id || !newPatient.name) return;
    const existingIndex = patients.findIndex(p => p.id === newPatient.id);
    let updated;

    if (existingIndex !== -1) {
      updated = [...patients];
      updated[existingIndex] = newPatient;
    } else {
      updated = [...patients, newPatient];
    }

    localStorage.setItem("patients", JSON.stringify(updated));
    setPatients(updated);
    setNewPatient({ id: "", name: "", dob: "", contact: "", healthInfo: "" });
    setEditingPatientId(null);
  };

  const handleEditPatient = (patient) => {
    setNewPatient(patient);
    setEditingPatientId(patient.id);
  };

  const handleDeletePatient = (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;
    const updated = patients.filter(p => p.id !== id);
    localStorage.setItem("patients", JSON.stringify(updated));
    setPatients(updated);
  };

  return (
    <div className="flex">
      <Sidebar />
<div className="ml-64 flex flex-col w-full min-h-screen">
        <Header />
        <main className="flex-1 p-6 bg-gray-100">
          <h1 className="text-3xl font-bold mb-6 text-blue-700">Patients</h1>

          {user?.role === "Admin" && (
            <div className="bg-white p-4 mb-6 rounded shadow max-w-2xl">
              <h2 className="text-xl font-semibold mb-2">
                {editingPatientId ? "Edit Patient" : "Add New Patient"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  placeholder="Patient ID"
                  value={newPatient.id}
                  onChange={(e) => setNewPatient({ ...newPatient, id: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  placeholder="Full Name"
                  value={newPatient.name}
                  onChange={(e) => setNewPatient({ ...newPatient, name: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  type="date"
                  placeholder="DOB"
                  value={newPatient.dob}
                  onChange={(e) => setNewPatient({ ...newPatient, dob: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  placeholder="Contact"
                  value={newPatient.contact}
                  onChange={(e) => setNewPatient({ ...newPatient, contact: e.target.value })}
                  className="border p-2 rounded"
                />
                <input
                  placeholder="Health Info"
                  value={newPatient.healthInfo}
                  onChange={(e) => setNewPatient({ ...newPatient, healthInfo: e.target.value })}
                  className="border p-2 rounded col-span-2"
                />
              </div>
              <div className="flex gap-3 mt-3">
                <button
                  onClick={handleAddOrUpdatePatient}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  {editingPatientId ? "Update" : "Add Patient"}
                </button>
                {editingPatientId && (
                  <button
                    onClick={() => {
                      setNewPatient({ id: "", name: "", dob: "", contact: "", healthInfo: "" });
                      setEditingPatientId(null);
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {patients.map((patient) => {
              const patientAppointments = appointments.filter((a) => a.patientId === patient.id);
              return (
                <div key={patient.id} className="bg-white p-4 rounded shadow border-l-4 border-blue-500">
                  <h2 className="text-xl font-semibold">{patient.name}</h2>
                  <p className="text-sm text-gray-600">ID: {patient.id}</p>
                  <p className="text-sm text-gray-600">DOB: {patient.dob || "-"}</p>
                  <p className="text-sm text-gray-600">Contact: {patient.contact || "-"}</p>
                  <p className="text-sm text-gray-600">Health: {patient.healthInfo || "-"}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/incidents/${patient.id}`)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      View Incidents
                    </button>
                    <button
                      onClick={() => setShowAppointmentsFor(showAppointmentsFor === patient.id ? null : patient.id)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"
                    >
                      {showAppointmentsFor === patient.id ? "Hide" : "Appointments"}
                    </button>
                    <button
                      onClick={() => handleEditPatient(patient)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>

                  {showAppointmentsFor === patient.id && (
                    <div className="mt-3">
                      <h3 className="font-semibold text-sm mb-1">Appointments:</h3>
                      <ul className="text-sm text-gray-700 space-y-1 max-h-40 overflow-y-auto">
                        {patientAppointments.length > 0 ? (
                          patientAppointments.map((a) => (
                            <li key={a.id}>
                              • {a.date} — {a.status}
                            </li>
                          ))
                        ) : (
                          <li>No appointments found.</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Patients;

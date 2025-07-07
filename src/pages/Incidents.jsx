// src/pages/Incidents.jsx
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

const Incidents = () => {
  const { patientId } = useParams();
  const [incidents, setIncidents] = useState([]);
  const [patientName, setPatientName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    cost: "",
    status: "",
    nextDate: "",
    file: null,
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("incidents")) || [];
    setIncidents(stored.filter(i => i.patientId === patientId));

    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    const patient = patients.find(p => p.id === patientId);
    setPatientName(patient?.name || patientId);
  }, [patientId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => setFormData({
    title: "",
    description: "",
    comments: "",
    appointmentDate: "",
    cost: "",
    status: "",
    nextDate: "",
    file: null,
  });

  const saveIncidents = (all) => {
    localStorage.setItem("incidents", JSON.stringify(all));
    setIncidents(all.filter(i => i.patientId === patientId));
  };

  const handleAddOrUpdate = () => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = formData.file ? reader.result : null;
      let all = JSON.parse(localStorage.getItem("incidents")) || [];

      if (editingId) {
        all = all.map((i) =>
          i.id === editingId
            ? {
                ...i,
                ...formData,
                files: base64 ? [{ name: formData.file.name, url: base64 }] : i.files,
              }
            : i
        );
        setEditingId(null);
      } else {
        const newIncident = {
          id: `i${Date.now()}`,
          patientId,
          ...formData,
          files: base64 ? [{ name: formData.file.name, url: base64 }] : [],
        };
        all.push(newIncident);
      }

      saveIncidents(all);
      resetForm();
    };

    if (formData.file) {
      reader.readAsDataURL(formData.file);
    } else {
      reader.onloadend();
    }
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete?");
    if (!confirmed) return;
    const all = JSON.parse(localStorage.getItem("incidents")) || [];
    saveIncidents(all.filter((i) => i.id !== id));
  };

  const handleEdit = (incident) => {
    setEditingId(incident.id);
    setFormData({
      title: incident.title,
      description: incident.description,
      comments: incident.comments,
      appointmentDate: incident.appointmentDate,
      cost: incident.cost,
      status: incident.status,
      nextDate: incident.nextDate,
      file: null,
    });
  };

  return (
    <div className="flex">
      <Sidebar />
<div className="ml-64 flex flex-col w-full min-h-screen">
        <Header />
        <main className="flex-1 p-6 bg-gray-50">
          <div className="bg-white shadow rounded-lg p-6 max-w-4xl mx-auto mb-6">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              {editingId ? "Edit Incident" : "Add Incident"} — Patient: {patientName}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" className="border p-2 rounded" />
              <input name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded" />
              <input name="comments" value={formData.comments} onChange={handleChange} placeholder="Comments" className="border p-2 rounded" />
              <input name="appointmentDate" type="datetime-local" value={formData.appointmentDate} onChange={handleChange} className="border p-2 rounded" />
              <input name="cost" value={formData.cost} onChange={handleChange} placeholder="Cost" className="border p-2 rounded" />
              <input name="status" value={formData.status} onChange={handleChange} placeholder="Status" className="border p-2 rounded" />
              <input name="nextDate" type="datetime-local" value={formData.nextDate} onChange={handleChange} className="border p-2 rounded" />
              <input type="file" accept=".png,.jpg,.jpeg,.pdf" onChange={(e) => setFormData({ ...formData, file: e.target.files[0] })} className="border p-2 col-span-2 rounded" />
            </div>
            <div className="space-x-2 mt-4">
              <button onClick={handleAddOrUpdate} className="bg-blue-600 text-white px-4 py-2 rounded">
                {editingId ? "Update" : "Add"} Incident
              </button>
              {editingId && (
                <button onClick={() => { resetForm(); setEditingId(null); }} className="bg-gray-500 text-white px-4 py-2 rounded">
                  Cancel
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {incidents.map((i) => (
              <div key={i.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                <div className="flex justify-between">
                  <strong>{i.title}</strong>
                  <span className="text-sm text-gray-500">{i.status}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{i.description}</p>
                <p className="text-xs text-gray-400">Appointment: {i.appointmentDate}</p>
                {i.files?.length > 0 && (
                  <div className="mt-2">
                    {i.files.map((file, index) => (
                      <div key={index} className="flex gap-3 items-center">
                        <a href={file.url} target="_blank" rel="noopener noreferrer" download={file.name} className="text-blue-600 underline">
                          {file.name}
                        </a>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-3 flex gap-2">
                  <button onClick={() => handleEdit(i)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">Edit</button>
                  <button onClick={() => handleDelete(i.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Incidents;

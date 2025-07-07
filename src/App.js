import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PrivateRoute from "./routes/PrivateRoute";

import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Incidents from "./pages/Incidents";
import Calendar from "./pages/Calendar";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard";

function AppWrapper() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<Login />} />

      {/* Role-based Dashboard */}
      <Route
  path="/dashboard"
  element={
    <PrivateRoute>
      {user?.role === "Admin" ? <AdminDashboard /> : <PatientDashboard />}
    </PrivateRoute>
  }
/>


      {/* Admin Only Routes */}
      <Route
        path="/patients"
        element={
          <PrivateRoute>
            <Patients />
          </PrivateRoute>
        }
      />
      <Route
        path="/incidents/:patientId"
        element={
          <PrivateRoute>
            <Incidents />
          </PrivateRoute>
        }
      />
      <Route
        path="/calendar"
        element={
          <PrivateRoute>
            <Calendar />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppWrapper />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

# 🦷 Dental Dashboard(Frontend Only)

A complete dental center management system for Admins and Patients. Built using React, Tailwind CSS, and Context API with **localStorage** for data simulation. No backend or external APIs used.

---

## 🔗 Deployed App  
(https://dental-dashboard-five.vercel.app/dashboard)

## 📁 GitHub Repo  
[https://github.com/shiva3187/dental-dashboard](https://github.com/shiva3187/dental-dashboard)

---

## 🧑‍⚕️ Login Credentials

| Role   | Email             | Password     |
|--------|-------------------|--------------|
| Admin  | admin@mail.com    | admin123     |
| Patient | john@mail.com     | patient123   |

---

## 🛠️ Tech Stack

- React (functional components)
- React Router v6
- Context API for auth/state
- Tailwind CSS for styling
- LocalStorage for persistence
- File upload (image/PDF preview)
- Role-based protected routes

---

## 📌 Core Features

### 🔐 Authentication
- Hardcoded users with roles
- Session persistence via localStorage

### 🩺 Admin Dashboard
- View next 10 appointments
- KPIs: revenue, top patients, completed/pending
- Calendar view (clickable dates)
- Add/edit/delete patients
- View appointment history
- Upload & preview files
- Mark appointment complete with payment form

### 👤 Patient Dashboard
- Book appointment with full details
- View own upcoming appointments
- History with cost, notes, uploaded files

---

## 🧠 Architecture

- `/context/AuthContext` – Manages login, role, and user data
- `/pages/` – Views like AdminDashboard, PatientDashboard, Calendar, Login, Patients, Incidents
- `/components/` – Shared Sidebar, Header, Footer
- `localStorage` is used to simulate backend and persist session, patients, appointments, and file uploads

---

## ⚠️ Limitations

- No real backend (by design)
- No email notifications
- All users hardcoded
- localStorage resets on browser clear

---

## 📦 Installation & Run Locally

```bash
git clone https://github.com/shiva3187/dental-dashboard
cd dental-dashboard
npm install
npm start

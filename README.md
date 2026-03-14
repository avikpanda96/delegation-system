# Delegation Management System with RBAC

## 🎯 Project Overview
This is a **full-stack Delegation Management System** built with **Node.js (Express)**, **React.js (Vite)**, and **MySQL**, implementing **Role-Based Access Control (RBAC)**.  

Three roles are supported:

- **Super Admin** – Create Admin/User, Manage Roles, View/Delete Any Delegation, View Reports  
- **Admin** – Create User, Create/Assign Delegation, Update Status, View Reports (limited)  
- **User** – View assigned delegations, update status (own), view own report  

The system includes **authentication**, **JWT-based authorization**, **activity logs**, **dashboard charts**, and **deployment on free platforms**.

---

## 🌐 Live Deployment

- **Frontend (React/Vite)**: [https://deligationsystem.netlify.app/](https://deligationsystem.netlify.app/)  
- **Backend (Node/Express)**: [https://delegation-system.onrender.com](https://delegation-system.onrender.com)  
- **Database (MySQL on Railway)**: Configuration info below  
- **GitHub Repository**: [https://github.com/avikpanda96/delegation-system](https://github.com/avikpanda96/delegation-system.git)

---

## 🗃️ Database Info (Railway MySQL)

```env 
MYSQL_DATABASE=railway
MYSQLUSER=root
MYSQL_PASSWORD=ITpyoEAphuEdyrJkrhKQKaWBchWEutiD
MYSQLHOST=gondola.proxy.rlwy.net
MYSQL_PORT=34987

delegation-system/
│
├── backend/
│   ├── src/
│   │   ├── config/       # DB & JWT config
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # DB queries
│   │   ├── routes/       # API endpoints
│   │   ├── middlewares/  # Auth & role checks
│   │   ├── utils/        # Hashing & logging helpers
│   │   ├── app.js
│   │   └── server.js
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── api/          # Axios setup
│   │   ├── pages/        # Login, Register, Dashboard, Users, Delegations, Reports, NotFound
│   │   ├── components/   # Navbar, ProtectedRoute, ChartBox
│   │   ├── context/      # AuthContext
│   │   ├── routes/       # AppRoutes
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database/
│   └── schema.sql
│
└── README.md



🔑 Features
Authentication

Register, Login, Logout

JWT-based auth

Password hashing (bcrypt)

Role-based protected routes

Roles & Permissions
Role	Permissions
Super Admin	Create Admin/User, Delete Any Delegation, Manage Roles, View All Delegations, View Reports
Admin	Create User, Create/Assign Delegation, Update Status, View Reports (limited)
User	View Assigned Delegations, Update Status, View Own Report
Delegations

Admin can create & assign delegations

Super Admin can delete any delegation

Users see only their assigned delegations

Delegation table shows assigned user, status, and actions

Reports

Charts using Recharts

Shows delegation status distribution

RBAC: Super Admin sees all, Admin sees assigned, User sees own

UI/UX

Responsive design

Dynamic RBAC buttons (create/delete etc.)

Eye icon to toggle password visibility


⚡ Local Setup
Backend
cd backend
npm install

Create .env:

DB_HOST=gondola.proxy.rlwy.net
DB_NAME=railway
DB_USER=root
DB_PASSWORD=ITpyoEAphuEdyrJkrhKQKaWBchWEutiD
DB_PORT=34987
JWT_SECRET=secret123
JWT_EXPIRES=1d
PORT=5000

Start backend:

npm start

API runs on http://localhost:5000.

Frontend
cd frontend
npm install

Create .env:

VITE_API_URL=http://localhost:5000

Start frontend:

npm run dev

Frontend runs on http://localhost:5173.

🧪 Default Login Credentials

role - Super Admin	email - superadmin@test.com
	pass - 123456
Admin	avikpanda96@gmail.com
	pass - 123456
for add Delegation refenxe user Id 11 that present on db

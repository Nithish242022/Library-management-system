# Library Management System

A **full‑stack demo** that pairs a **Flask** backend (SQLite) with a **React** frontend built on **Vite**.  
The UI features a portal‑based login, a glass‑morphism dashboard, and CRUD pages for **Books** and **Members**.

## 🎯 Features

| Feature | Description |
|--------|-------------|
| Multi‑portal login (Student / Faculty / Librarian) | Demo credentials auto‑filled |
| Dashboard widgets | Total books, active loans, total fines, recent transactions |
| Books CRUD | List, create, edit, delete |
| Members CRUD | List, create, edit, delete |
| Issue / Return transactions | Auto‑calculates overdue fines |
| Responsive glass‑morphism design | No Tailwind – pure CSS |
| API proxy | Vite automatically proxies `/api/*` to Flask (`localhost:5000`) |
| Ready for Docker / CI | Docker‑compose and GitHub Actions workflow included |

## 📂 Repository layout

library-management-system/
│
├─ backend/                       # Flask API (Python)
│   ├─ app.py                     # All REST endpoints
│   ├─ db.py                      # SQLite helper (init + execute_query)
│   └─ requirements.txt          # Python dependencies
│
├─ frontend/                      # React UI (Vite)
│   ├─ package.json               # npm deps – includes react‑router‑dom
│   ├─ vite.config.js            # Vite dev‑server proxy → http://localhost:5000
│   ├─ index.html                 # Root HTML file
│   └─ src/
│       ├─ main.jsx               # React entry point
│       ├─ App.jsx                # Top‑level component (login ↔ dashboard switch)
│       ├─ pages/                # Page‑level components
│       │   ├─ LoginPage.jsx      # Portal‑based login UI
│       │   ├─ Dashboard.jsx      # Dashboard widgets + recent activity
│       │   ├─ BooksPage.jsx      # Books CRUD table & filters
│       │   └─ MembersPage.jsx    # Members CRUD table & filters
│       ├─ components/           # Re‑usable UI components
│       │   └─ Sidebar.jsx        # Navigation drawer (handles sign‑out)
│       ├─ services/            # API abstraction
│       │   └─ api.js             # get / post helpers + login shortcut
│       └─ styles/
│           └─ index.css          # Global CSS (glass‑morphism tokens)
│
├─ .gitignore                     # Ignored files (node_modules, venv, .env, etc.)
├─ README.md                      # Project overview, run instructions, layout

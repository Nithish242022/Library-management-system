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
├─ backend/
│   ├─ app.py
│   ├─ db.py
│   └─ requirements.txt
│
├─ frontend/
│   ├─ package.json
│   ├─ vite.config.js
│   ├─ index.html
│   └─ src/
│       ├─ main.jsx
│       ├─ App.jsx
│       ├─ pages/
│       │   ├─ LoginPage.jsx
│       │   ├─ Dashboard.jsx
│       │   ├─ BooksPage.jsx
│       │   └─ MembersPage.jsx
│       ├─ components/
│       │   └─ Sidebar.jsx
│       ├─ services/
│       │   └─ api.js
│       └─ styles/
│           └─ index.css
│
├─ .gitignore
├─ README.md
│
├─ .gitignore                     # Ignored files (node_modules, venv, .env, etc.)
├─ README.md                      # Project overview, run instructions, layout

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



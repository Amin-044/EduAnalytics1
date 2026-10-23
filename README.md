# EduAnalytics

A student performance analytics system with a React frontend and a PHP/MySQL backend. It lets administrators manage students, subjects, marks and attendance, and gives students an analytics dashboard (average marks, attendance percentage, performance status) plus downloadable result PDFs.

## Features

- Role-based access: Admin (full add/edit/delete rights) and User (view + download results)
- Student management with search
- Marks and attendance entry per student per subject
- Dashboard with charts (subject averages, attendance distribution, student averages)
- Per-student analytics with subject-wise marks and attendance percentages
- Printable result PDF generation

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Bootstrap, Recharts, jsPDF
- **Backend:** PHP (mysqli), Apache (WAMP)
- **Database:** MySQL (`eduanalytics`)

## Project Structure

```
EduAnalytics/
├── backend/
│   ├── api/            # PHP API endpoints
│   └── database.sql    # Schema + seed data (import this)
├── frontend/           # React + Vite app
│   └── src/pages/      # Login, Dashboard, Students, Marks, Attendance, Results, ...
└── Documentation.docx  # Project documentation (if included)
```

## Setup

### 1. Database

1. Start WAMP and open phpMyAdmin (http://localhost/phpmyadmin).
2. Import `backend/database.sql` (creates the `eduanalytics` database with tables and sample data).
   - Or from the command line: `mysql -u root < database.sql`

### 2. Backend

1. Copy the `backend` folder into your WAMP web root so the API is reachable at:
   `http://localhost/EduAnalytics/backend/api`
2. Default DB credentials (`backend/api/db.php`) are `localhost` / user `root` / no password — adjust if your MySQL setup differs.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173`. The API URL is configured in `frontend/.env`:

```
VITE_API_URL=http://localhost/EduAnalytics/backend/api
```

Change this if your backend lives elsewhere.

### 4. Build for production

```bash
cd frontend
npm run build   # outputs to dist/
```

## Default Users

| Name      | Email             | Password | Role    |
|-----------|-------------------|----------|---------|
| Admin     | admin@example.com | password | admin   |
| Demo User | user@example.com  | password | user    |

- **Admin** — full rights: add/edit/delete students, subjects, marks, attendance and manage user roles.
- **User** — view-only access plus downloading results, without being able to modify any data.

Passwords are stored as plain text in `users.password`. New accounts created through the signup page automatically get the `user` role.
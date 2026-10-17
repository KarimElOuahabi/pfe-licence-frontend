# Smart Campus: Frontend

Web client for **Smart Campus**, my Licence final-year project (PFE). It's a campus management portal where administrators, teachers and students manage academic life in one place: schedules, assignments, marks, administrative documents and reclamations (complaints/requests).

The backend repository is not published yet. When it is, it will be linked here.

## Features

- **Three user types** (`Admin`, `Teacher`, `Student`), each with their own login and menu.
- **Schedules:** create, edit and preview timetables, with a calendar view on the home page.
- **Assignments:** create, edit and view assignments.
- **Marks:** teachers enter marks and students see their own.
- **Reclamations:** students submit requests and administrators handle them.
- **Administrative documents:** manage and request official documents.
- **Academic structure management:** CRUD pages for departments, fields (programmes), subjects, students, teachers and admins.
- Reusable data tables, cards and authenticated and unauthenticated layouts.

## Tech stack

React 19 · TypeScript · React Router 7 · Ant Design 5 · Tailwind CSS 4 · Create React App · day.js

## Project structure

```
src/
├── apis/         fetch helpers for the REST API (create, update, list, delete)
├── Components/   shared UI (data table, cards, layouts, side menu)
├── hooks/
├── Pages/        one folder per feature, each with List / Editor / Preview views
├── router/       route definitions
└── types/        shared types (user roles)
```

## Running locally

Requirements: Node.js 18+ and the Smart Campus backend running on `http://localhost:8080`.

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts: `npm run build`, `npm test`.

The API base URL is currently hardcoded to `http://localhost:8080` in `src/apis/index.ts`. Change it there to point at another backend.

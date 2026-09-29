# Hello Blacktops

A minimal full-stack app: **React** (Vite) frontend, **Node.js** (Express) backend, **SQLite** database.
The greeting "Hello Blacktops" is stored in SQLite, served by the API, and displayed by React.

✨ **New:** Admin authentication and elevated access features!

## Project structure
```
hello-blacktops/
├── client/          React app (Vite)
│   └── src/App.jsx  Fetches /api/message and shows admin UI
├── server/          Node.js + Express API
│   ├── db.js        Creates SQLite DB, users table, and seeds data
│   └── index.js     Authentication + admin endpoints
└── package.json     Runs both together
```

## Run locally
Requires Node.js 18+.
```bash
npm install          # installs concurrently
npm run install:all  # installs server + client dependencies
npm run dev          # starts server (5000) and client (5173)
```
Open http://localhost:5173

## Features

### User Authentication
- Session-based authentication with bearer tokens
- Login/logout functionality
- Persistent sessions via localStorage

### Admin Access
- Admin users can update the greeting message
- View all registered users
- Protected admin endpoints with middleware

### Default Users
- **Admin**: username=`admin`, password=`admin123`
- **User**: username=`user`, password=`user123`

## API

### Public Endpoints
- `GET /api/message` → `{ "message": "Hello Blacktops" }`
- `POST /api/login` → Login and get session token
- `POST /api/logout` → Logout (requires auth)
- `GET /api/session` → Get current session info

### Admin Endpoints (require admin privileges)
- `POST /api/admin/message` → Update the greeting message
- `GET /api/admin/users` → List all users

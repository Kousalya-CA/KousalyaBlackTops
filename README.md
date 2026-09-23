# Hello Blacktops

A minimal full-stack app: **React** (Vite) frontend, **Node.js** (Express) backend, **SQLite** database.
The greeting "Hello Blacktops" is stored in SQLite, served by the API, and displayed by React.

## Project structure
```
hello-blacktops/
├── client/          React app (Vite)
│   └── src/App.jsx  Fetches /api/message and shows it
├── server/          Node.js + Express API
│   ├── db.js        Creates SQLite DB and seeds "Hello Blacktops"
│   └── index.js     GET /api/message
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

## API
`GET /api/message` → `{ "message": "Hello Blacktops" }`

# TODO Application in tRPC

A full-stack TODO app built with React + tRPC + MongoDB + Bun.

## Project Structure

```
.
├── react/      # Vite + React frontend
└── server/     # Bun + tRPC backend
```

## Setup

### Server
```bash
cd server
cp .env.example .env   # fill in MONGO_URL and SECRET_KEY
bun install
bun dev                # starts on http://localhost:3000
```

### React Frontend
```bash
cd react
npm install            # or pnpm install
npm run dev            # starts on http://localhost:5173
```

## Environment Variables (server/.env)
- `MONGO_URL` — MongoDB connection string
- `SECRET_KEY` — JWT signing secret

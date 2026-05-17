# HackHub AI-Powered Hackathon Management System

Monorepo scaffold with:

- `backend/` Django + DRF + Channels starter
- `frontend/` React + Vite starter

## Backend (Django)

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements/dev.txt
python manage.py migrate
python manage.py runserver 8000
```

Backend API health endpoint:

- `http://localhost:8000/api/v1/health/`

## Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

- `http://localhost:5173`

Set API URL in frontend env if needed:

- `VITE_API_BASE_URL=http://localhost:8000/api/v1`

## Agent SDK service (Cursor)

For secure AI agent operations, run the dedicated local service:

```bash
cd agent-sdk
npm install
cp .env.example .env
# Set CURSOR_API_KEY in .env (do not commit)
npm run dev
```

Service endpoint:

- `POST http://localhost:8787/agent/prompt`

Django AI bridge endpoint (authenticated):

- `POST /api/v1/ai/cursor/prompt/`

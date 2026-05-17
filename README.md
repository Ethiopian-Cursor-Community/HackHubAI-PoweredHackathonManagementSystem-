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

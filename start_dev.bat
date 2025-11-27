@echo off
echo Starting Real Estate SaaS System...

echo Starting Backend (Django)...
start "Django Backend" cmd /k "cd backend && venv\Scripts\activate && python manage.py runserver"

echo Starting Frontend (React)...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo ====================================================
echo Servers are running!
echo Backend API: http://127.0.0.1:8000
echo Frontend UI: http://localhost:5173
echo ====================================================

@echo off
cd /d "%~dp0"

call venv\Scripts\activate

echo [Windows CPU] Starting Flask app...
start http://localhost:5000

python app.py

pause

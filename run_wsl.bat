@echo off
cd /d "%~dp0"

echo [WSL GPU] Starting Flask app...
wsl bash -lc "cd '/mnt/c/projects/mini project/version 2' && source venv-gpu/bin/activate && python app.py"

pause

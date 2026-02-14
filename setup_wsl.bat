@echo off
cd /d "%~dp0"

echo [WSL GPU] Setting up environment in WSL...
wsl bash -lc "cd '/mnt/c/projects/mini project/version 2' && python3 -m venv venv-gpu && source venv-gpu/bin/activate && pip install --upgrade pip && pip install -r requirements.txt"

echo.
echo ✅ WSL setup complete.
pause

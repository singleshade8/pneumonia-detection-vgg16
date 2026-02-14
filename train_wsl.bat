@echo off
cd /d "%~dp0"

echo [WSL GPU] Training model...
wsl bash -lc "cd '/mnt/c/projects/mini project/version 2' && source venv-gpu/bin/activate && python train.py"

pause

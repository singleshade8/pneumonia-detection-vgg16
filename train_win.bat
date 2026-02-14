@echo off
cd /d "%~dp0"

call venv\Scripts\activate

echo [Windows CPU] Training model...
python train.py

pause

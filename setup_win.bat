@echo off
cd /d "%~dp0"

echo [Windows CPU] Creating virtual environment...
python -m venv venv

call venv\Scripts\activate

echo [Windows CPU] Upgrading pip...
python -m pip install --upgrade pip

echo [Windows CPU] Installing dependencies...
pip install -r requirements.txt

echo.
echo ✅ Windows setup complete.
pause

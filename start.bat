@echo off
cd /d "%~dp0"

echo ==============================
echo  Pneumonia Detection Project
echo ==============================
echo 1. Setup (Windows CPU)
echo 2. Run App (Windows CPU)
echo 3. Train (Windows CPU)
echo 4. Setup (WSL GPU)
echo 5. Run App (WSL GPU)
echo 6. Train (WSL GPU)
echo 0. Exit
echo ==============================

set /p choice=Enter your choice: 

if "%choice%"=="1" call setup_win.bat
if "%choice%"=="2" call run_win.bat
if "%choice%"=="3" call train_win.bat
if "%choice%"=="4" call setup_wsl.bat
if "%choice%"=="5" call run_wsl.bat
if "%choice%"=="6" call train_wsl.bat


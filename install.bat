@echo off
echo ========================================
echo   Journal Reader - Auto Install
echo ========================================
echo.

echo [1/3] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo.
    echo Please install Node.js from: https://nodejs.org/
    echo Download the LTS version
    echo.
    pause
    exit /b 1
)
echo [OK] Node.js installed

echo.
echo [2/3] Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not working
    pause
    exit /b 1
)
echo [OK] npm ready

echo.
echo [3/3] Installing dependencies...
echo This may take a few minutes, please wait...
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Installation failed!
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo You can now:
echo   1. Double-click start.bat to launch
echo   2. Or run: npm run dev:electron
echo.
pause

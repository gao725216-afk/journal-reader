@echo off
echo ========================================
echo   Journal Reader - Starting...
echo ========================================
echo.

if not exist "node_modules" (
    echo [ERROR] Dependencies not installed!
    echo.
    echo Please run install.bat first
    echo.
    pause
    exit /b 1
)

echo [OK] Starting application...
echo.
echo Tips:
echo   - Window will open automatically
echo   - Do not close this terminal
echo   - Press Ctrl+C to stop the app
echo.
echo ========================================
echo.

call npm run dev:electron

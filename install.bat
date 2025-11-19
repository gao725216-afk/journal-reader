@echo off
chcp 65001 >nul
echo ========================================
echo   📚 双语论文阅读器 - 自动安装程序
echo ========================================
echo.

REM 检查Node.js是否安装
echo [1/3] 检查Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未检测到Node.js！
    echo.
    echo 请先安装Node.js: https://nodejs.org/
    echo 推荐下载LTS版本（长期支持版）
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js已安装

REM 检查npm
echo.
echo [2/3] 检查npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm未正常工作
    pause
    exit /b 1
)
echo ✅ npm已就绪

REM 安装依赖
echo.
echo [3/3] 安装依赖包...
echo 这可能需要几分钟，请耐心等待...
echo.
call npm install

if %errorlevel% neq 0 (
    echo.
    echo ❌ 安装失败！
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   ✅ 安装完成！
echo ========================================
echo.
echo 现在你可以：
echo   1. 双击 start.bat 启动应用
echo   2. 或者运行: npm run dev:electron
echo.
pause

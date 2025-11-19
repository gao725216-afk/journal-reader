@echo off
chcp 65001 >nul
echo ========================================
echo   📚 双语论文阅读器 - 启动中...
echo ========================================
echo.

REM 检查node_modules是否存在
if not exist "node_modules" (
    echo ❌ 依赖未安装！
    echo.
    echo 请先运行 install.bat 安装依赖
    echo.
    pause
    exit /b 1
)

echo ✅ 正在启动应用...
echo.
echo 提示：
echo   - 窗口会自动打开
echo   - 不要关闭此命令行窗口
echo   - 按 Ctrl+C 可以停止应用
echo.
echo ========================================
echo.

call npm run dev:electron

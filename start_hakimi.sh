#!/bin/bash

echo "========================================="
echo "  Project HAKIMI: 混沌与救赎"
echo "  启动本地服务器..."
echo "========================================="
echo ""

# 检查 Python 是否安装
if command -v python3 &> /dev/null
then
    echo "✓ 使用 Python 3 启动服务器"
    echo "✓ 访问地址: http://localhost:8000"
    echo "✓ 按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null
then
    echo "✓ 使用 Python 启动服务器"
    echo "✓ 访问地址: http://localhost:8000"
    echo "✓ 按 Ctrl+C 停止服务器"
    echo ""
    python -m http.server 8000
else
    echo "❌ 未找到 Python"
    echo "请安装 Python 或直接双击打开 index.html"
    echo ""
    echo "或者使用 Node.js:"
    echo "  npx http-server"
fi

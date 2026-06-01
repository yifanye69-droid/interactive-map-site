#!/bin/bash
cd "$(dirname "$0")"
echo "========== 环境检查 =========="
echo "项目目录: $(pwd)"
echo ""
echo "--- Node / npm ---"
if command -v node >/dev/null 2>&1; then
  echo "✓ node: $(node -v) ($(which node))"
else
  echo "✗ 未安装 Node.js"
  echo "  请打开 https://nodejs.org 下载 LTS 并安装"
fi
if command -v npm >/dev/null 2>&1; then
  echo "✓ npm:  $(npm -v) ($(which npm))"
else
  echo "✗ 未找到 npm（通常随 Node 一起安装）"
fi
echo ""
echo "--- 项目依赖 ---"
if [ -d node_modules ]; then
  echo "✓ node_modules 已存在"
else
  echo "✗ 未安装依赖，需要运行: npm install"
fi
echo ""
echo "--- 端口 3000 ---"
if lsof -i :3000 >/dev/null 2>&1; then
  echo "✓ 3000 端口有进程（可能 dev 已在运行）"
  lsof -i :3000 | head -3
else
  echo "✗ 3000 端口无服务 → 网站打不开是正常的，需要先 npm run dev"
fi
echo ""
echo "========== 完成 =========="
read -p "按回车键关闭..."

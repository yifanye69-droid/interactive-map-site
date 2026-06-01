#!/bin/bash
cd "$(dirname "$0")"

echo "=========================================="
echo "  节庆岛屿 · Next.js 完整版"
echo "  目录: $(pwd)"
echo "=========================================="
echo ""

# 加载 nvm / fnm / homebrew 等常见 Node 路径
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.nvm/versions/node/$(ls "$HOME/.nvm/versions/node" 2>/dev/null | tail -1)/bin:$HOME/.volta/bin:$HOME/.fnm/current/bin:$PATH"

if ! command -v npm >/dev/null 2>&1; then
  echo "❌ 未找到 npm，请先安装 Node.js LTS："
  echo "   https://nodejs.org"
  echo ""
  echo "安装后重新双击本文件，或在终端执行："
  echo "   cd ~/Desktop/interactive-map-site"
  echo "   npm install && npm run dev"
  read -p "按回车关闭..."
  exit 1
fi

echo "Node: $(node -v)  npm: $(npm -v)"
echo ""

if [ ! -d node_modules ]; then
  echo "首次运行：正在安装依赖（约 1–3 分钟）..."
  npm install
  if [ $? -ne 0 ]; then
    echo "❌ npm install 失败，请检查网络或截图报错发给我"
    read -p "按回车关闭..."
    exit 1
  fi
  echo "✓ 依赖安装完成"
  echo ""
fi

echo "启动开发服务器…"
echo "浏览器将打开: http://localhost:3000"
echo "（关闭本窗口即停止网站）"
echo ""

(sleep 2 && open "http://localhost:3000") 2>/dev/null &
npm run dev

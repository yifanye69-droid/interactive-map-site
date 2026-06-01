#!/bin/bash
# 将三匹小马图复制到 public（请把图源路径改成你的文件位置）
SRC="${1:-$HOME/.cursor/projects/Users-sheep-projects-festival-map/assets/__2026-05-26_22.31.27-14dd0efa-5daf-420d-9782-d89781d4b6b3.png}"
DEST="$(dirname "$0")/../public/characters/ponies.png"
mkdir -p "$(dirname "$DEST")"
if [ -f "$SRC" ]; then
  cp "$SRC" "$DEST"
  echo "已复制: $DEST"
else
  echo "找不到源图: $SRC"
  echo "请手动将三匹小马 PNG 放到 public/characters/ponies.png"
  exit 1
fi

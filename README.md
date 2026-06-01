# 节庆岛屿 · 互动地图（Next.js 完整版）

全屏可交互插画地图：拖拽、缩放、惯性、热点悬停卡片、二级页面跳转。

## 技术栈

- Next.js 15（App Router）
- React 19
- Framer Motion
- Tailwind CSS
- TypeScript
- 热点配置：`src/data/hotspots.json`

## 功能一览

| 功能 | 桌面 | 手机/平板 |
|------|------|-----------|
| 拖拽平移 | ✅ | ✅ |
| 滚轮缩放 | ✅ | — |
| 双指捏合缩放 | — | ✅ |
| 惯性滑动 | ✅ | ✅ |
| 边界限制 | ✅ | ✅ |
| 热点悬停提示卡 | ✅ | 触摸显示 |
| 点击进入二级页 | ✅ | ✅ |

## 快速启动（需要 Node.js）

### 1. 安装 Node.js

下载 LTS：https://nodejs.org

终端验证：

```bash
node -v
npm -v
```

### 2. 安装依赖并启动

```bash
cd ~/Desktop/interactive-map-site
npm install
npm run dev
```

或 **双击** `启动网站.command`（会自动 install + dev）

### 3. 打开网站

浏览器访问：**http://localhost:3000**

> ⚠️ 不要用 Python 打开根目录的 `index.html`，那是旧版静态预览。完整版必须走 `npm run dev`。

## 配置热点

编辑 `src/data/hotspots.json`：

- `x` / `y`：地图上的百分比位置（0–100）
- `route`：二级页路径，如 `/places/guilan-mountain`
- `title` / `description` / `icon`：提示卡内容

## 地图资源

- `public/map/island-map.png`（8285×5390）
- `public/map/island-map-preview.jpg`（加载占位）

## 其他命令

```bash
npm run build   # 生产构建
npm run start   # 运行构建后的站点
npm run lint    # 代码检查
```

## 静态预览（备用，无需 npm）

若暂时无法安装 Node，可使用 `static-legacy/` 中的纯 HTML 版本，见该目录说明。

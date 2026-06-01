(function () {
  "use strict";

  /* 热点配置（与 data/hotspots.json 同步，内嵌保证一定能加载） */
  var CONFIG = {
    mapWidth: 8285,
    mapHeight: 5390,
    minScale: 0.35,
    maxScale: 2.8,
    initialScale: 0.85,
    hotspots: [
      { id: "guilan-mountain", title: "归兰山", description: "传统建筑群与山林舞台，节庆演出与民俗体验的核心区域。", x: 17, y: 20, radius: 4.5, route: "places/guilan-mountain", icon: "⛰️" },
      { id: "performance-arena", title: "露天表演场", description: "环形舞台与蓝色帷幕，团队演出与互动表演的聚集地。", x: 11, y: 14, radius: 3.5, route: "places/performance-arena", icon: "🎭" },
      { id: "basketball-court", title: "运动广场", description: "蓝橙相间的球场，嵌入绿荫与传统建筑之间的活力角落。", x: 22, y: 26, radius: 3, route: "places/basketball-court", icon: "🏀" },
      { id: "horse-racing", title: "西部赛马场", description: "金色太阳拱门下的粉色主舞台，赛马巡游与盛大庆典的主会场。", x: 42, y: 30, radius: 6, route: "places/horse-racing", icon: "🏇" },
      { id: "dragon-boat", title: "江上长歌赛", description: "龙舟竞渡与江畔长歌，水岸亭台间的诗意竞技。", x: 60, y: 38, radius: 5, route: "places/dragon-boat", icon: "🐉" },
      { id: "wanhu-village", title: "万户水寨", description: "水上门户与市集聚落，探索水乡生活与手工艺摊位。", x: 82, y: 42, radius: 4.5, route: "places/wanhu-village", icon: "🏘️" },
      { id: "market-street", title: "节庆市集街", description: "彩棚林立的热闹商街，小吃、手作与巡游队伍络绎不绝。", x: 48, y: 72, radius: 5.5, route: "places/market-street", icon: "🛍️" },
      { id: "flag-procession", title: "旗帜巡游道", description: "沿灰色道路前行的庆典队伍，承载仪式感的巡游路线。", x: 18, y: 78, radius: 4, route: "places/flag-procession", icon: "🚩" }
    ]
  };

  var viewport = document.getElementById("viewport");
  var stage = document.getElementById("stage");
  var hotspotsEl = document.getElementById("hotspots");
  var mapImage = document.getElementById("map-image");

  function setActive(id) {
    hotspotsEl.querySelectorAll(".hotspot").forEach(function (el) {
      el.classList.toggle("is-active", el.dataset.id === id);
    });
  }

  function createHotspot(h) {
    var size = Math.max(36, (h.radius || 4) * 2.2);
    var el = document.createElement("div");
    el.className = "hotspot";
    el.dataset.hotspot = "true";
    el.dataset.id = h.id;
    el.style.left = h.x + "%";
    el.style.top = h.y + "%";

    var href = h.route + ".html";
    el.innerHTML =
      '<a class="hotspot__link" href="' + href + '" style="width:' + size + 'px;height:' + size + 'px" aria-label="' + h.title + '">' +
      '<span class="hotspot__pulse"></span><span class="hotspot__dot"></span></a>' +
      '<div class="hotspot__tooltip"><div class="hotspot__head">' +
      (h.icon ? '<span class="hotspot__icon">' + h.icon + '</span>' : '') +
      '<div><p class="hotspot__title">' + h.title + '</p>' +
      '<p class="hotspot__desc">' + h.description + '</p>' +
      '<p class="hotspot__cta">点击进入 →</p></div></div></div>';

    el.addEventListener("mouseenter", function () { setActive(h.id); });
    el.addEventListener("mouseleave", function () { setActive(null); });
    el.addEventListener("touchstart", function () { setActive(h.id); }, { passive: true });
    return el;
  }

  function renderHotspots() {
    hotspotsEl.innerHTML = "";
    CONFIG.hotspots.forEach(function (h) {
      hotspotsEl.appendChild(createHotspot(h));
    });
  }

  function bindControls(engine) {
    document.querySelectorAll("[data-action]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var a = btn.getAttribute("data-action");
        if (a === "zoom-in") engine.zoomBy(1.2);
        if (a === "zoom-out") engine.zoomBy(1 / 1.2);
        if (a === "reset") engine.reset();
      });
    });
  }

  function boot() {
    renderHotspots();
    var engine = new MapEngine({
      viewport: viewport,
      stage: stage,
      mapWidth: CONFIG.mapWidth,
      mapHeight: CONFIG.mapHeight,
      minScale: CONFIG.minScale,
      maxScale: CONFIG.maxScale,
      initialScale: CONFIG.initialScale
    });
    bindControls(engine);
  }

  function start() {
    fetch("data/hotspots.json")
      .then(function (r) { return r.ok ? r.json() : CONFIG; })
      .then(function (data) {
        if (data && data.hotspots && data.hotspots.length) {
          CONFIG.mapWidth = data.mapWidth || CONFIG.mapWidth;
          CONFIG.mapHeight = data.mapHeight || CONFIG.mapHeight;
          CONFIG.minScale = data.minScale || CONFIG.minScale;
          CONFIG.maxScale = data.maxScale || CONFIG.maxScale;
          CONFIG.initialScale = data.initialScale || CONFIG.initialScale;
          CONFIG.hotspots = data.hotspots;
        }
        boot();
      })
      .catch(function () { boot(); });
  }

  if (mapImage.complete) start();
  else mapImage.addEventListener("load", start);
})();

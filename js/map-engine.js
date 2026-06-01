(function (global) {
  "use strict";
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }

  function MapEngine(opts) {
    this.viewport = opts.viewport;
    this.stage = opts.stage;
    this.mapWidth = opts.mapWidth;
    this.mapHeight = opts.mapHeight;
    this.minScaleMul = opts.minScale || 0.35;
    this.maxScaleMul = opts.maxScale || 2.8;
    this.initialScaleMul = opts.initialScale || 0.85;
    this.boundaryPadding = opts.boundaryPadding || 0.08;
    this.friction = opts.friction || 0.92;
    this.x = 0; this.y = 0; this.scale = 1;
    this.dragging = false;
    this.lastPointer = null;
    this.vx = 0; this.vy = 0;
    this.raf = null;
    this.pointers = new Map();
    this.pinch = null;
    this._bind();
    this.init();
  }

  MapEngine.prototype.getFit = function () {
    var w = this.viewport.clientWidth, h = this.viewport.clientHeight;
    return Math.min(w / this.mapWidth, h / this.mapHeight);
  };
  MapEngine.prototype.getLimits = function () {
    var f = this.getFit();
    return { min: f * this.minScaleMul, max: f * this.maxScaleMul };
  };
  MapEngine.prototype.getBounds = function (scale) {
    var w = this.viewport.clientWidth, h = this.viewport.clientHeight;
    var sw = this.mapWidth * scale, sh = this.mapHeight * scale;
    var px = w * this.boundaryPadding, py = h * this.boundaryPadding;
    var minX, maxX, minY, maxY;
    if (sw <= w) { minX = maxX = (w - sw) / 2; } else { minX = w - sw - px; maxX = px; }
    if (sh <= h) { minY = maxY = (h - sh) / 2; } else { minY = h - sh - py; maxY = py; }
    return { minX: minX, maxX: maxX, minY: minY, maxY: maxY };
  };
  MapEngine.prototype.apply = function () {
    this.stage.style.transform = "translate3d(" + this.x + "px," + this.y + "px,0) scale(" + this.scale + ")";
  };
  MapEngine.prototype.clamp = function () {
    var b = this.getBounds(this.scale);
    this.x = clamp(this.x, b.minX, b.maxX);
    this.y = clamp(this.y, b.minY, b.maxY);
    this.apply();
  };
  MapEngine.prototype.init = function () {
    var fit = this.getFit(), lim = this.getLimits();
    this.scale = clamp(fit * this.initialScaleMul, lim.min, lim.max);
    this.x = (this.viewport.clientWidth - this.mapWidth * this.scale) / 2;
    this.y = (this.viewport.clientHeight - this.mapHeight * this.scale) / 2;
    this.clamp();
  };
  MapEngine.prototype.stopInertia = function () {
    if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
  };
  MapEngine.prototype.startInertia = function () {
    var self = this;
    this.stopInertia();
    function step() {
      if (Math.abs(self.vx) < 0.12 && Math.abs(self.vy) < 0.12) { self.raf = null; return; }
      self.x += self.vx; self.y += self.vy;
      self.vx *= self.friction; self.vy *= self.friction;
      self.clamp();
      self.raf = requestAnimationFrame(step);
    }
    this.raf = requestAnimationFrame(step);
  };
  MapEngine.prototype.zoomAt = function (cx, cy, ns) {
    var r = this.viewport.getBoundingClientRect();
    var px = cx - r.left, py = cy - r.top;
    var lim = this.getLimits();
    var scale = clamp(ns, lim.min, lim.max);
    var mx = (px - this.x) / this.scale, my = (py - this.y) / this.scale;
    this.x = px - mx * scale; this.y = py - my * scale;
    this.scale = scale;
    this.clamp();
  };
  MapEngine.prototype.zoomBy = function (f) {
    var r = this.viewport.getBoundingClientRect();
    this.zoomAt(r.left + r.width / 2, r.top + r.height / 2, this.scale * f);
  };
  MapEngine.prototype.reset = function () { this.stopInertia(); this.init(); };

  MapEngine.prototype._bind = function () {
    var self = this;
    this.viewport.addEventListener("wheel", function (e) {
      if (e.target.closest("[data-hotspot]")) return;
      e.preventDefault();
      self.stopInertia();
      self.zoomAt(e.clientX, e.clientY, self.scale * (1 - e.deltaY * 0.0012));
    }, { passive: false });
    this.viewport.addEventListener("pointerdown", function (e) {
      if (e.target.closest("[data-hotspot]")) return;
      self.stopInertia();
      self.dragging = true;
      self.viewport.classList.add("is-dragging");
      self.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      self.lastPointer = { x: e.clientX, y: e.clientY, t: performance.now() };
      self.viewport.setPointerCapture(e.pointerId);
    });
    this.viewport.addEventListener("pointermove", function (e) {
      self.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (self.pointers.size === 2) {
        var pts = Array.from(self.pointers.values());
        var d = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
        var cx = (pts[0].x + pts[1].x) / 2, cy = (pts[0].y + pts[1].y) / 2;
        var rect = self.viewport.getBoundingClientRect();
        var px = cx - rect.left, py = cy - rect.top;
        if (!self.pinch) {
          self.pinch = { d: d, scale: self.scale, x: self.x, y: self.y, px: px, py: py };
          self.dragging = false;
        } else {
          var p = self.pinch, lim = self.getLimits();
          var ns = clamp(p.scale * (d / p.d), lim.min, lim.max);
          var mx = (p.px - p.x) / p.scale, my = (p.py - p.y) / p.scale;
          self.scale = ns;
          self.x = p.px - mx * ns; self.y = p.py - my * ns;
          self.clamp();
        }
        return;
      }
      if (!self.dragging || self.pointers.size !== 1 || !self.lastPointer) return;
      var now = performance.now(), dt = Math.max(now - self.lastPointer.t, 1);
      var dx = e.clientX - self.lastPointer.x, dy = e.clientY - self.lastPointer.y;
      self.vx = (dx / dt) * 16; self.vy = (dy / dt) * 16;
      self.x += dx; self.y += dy; self.clamp();
      self.lastPointer = { x: e.clientX, y: e.clientY, t: now };
    });
    function up(e) {
      self.pointers.delete(e.pointerId);
      if (self.pointers.size < 2) self.pinch = null;
      if (self.pointers.size === 0) {
        self.dragging = false;
        self.viewport.classList.remove("is-dragging");
        self.lastPointer = null;
        try { self.viewport.releasePointerCapture(e.pointerId); } catch (err) {}
        self.startInertia();
      }
    }
    this.viewport.addEventListener("pointerup", up);
    this.viewport.addEventListener("pointercancel", up);
    window.addEventListener("resize", function () { self.clamp(); });
  };

  global.MapEngine = MapEngine;
})(window);

// ─────────────────────────────────────────────────────────────
//  Skin3D · visor 3D de skins de Minecraft hecho a mano
//  Dibuja con Canvas 2D (sin WebGL), así anda fluido aunque la
//  aceleración por hardware del navegador esté desactivada.
//  Cada cara del personaje es una sola imagen deformada, por eso
//  dibujar un cuadro cuesta muy poco. Solo redibuja cuando algo
//  cambia (arrastrar, zoom, animación o giro).
// ─────────────────────────────────────────────────────────────
(function () {
  var imgCache = {};

  function loadImage(src) {
    if (imgCache[src]) return imgCache[src];
    imgCache[src] = new Promise(function (res, rej) {
      var im = new Image();
      im.onload = function () { res(im); };
      im.onerror = rej;
      im.src = src;
    });
    return imgCache[src];
  }

  // Copias del skin con distintas luces (mantienen la transparencia)
  var SHADES = [1, 0.9, 0.8, 0.7];
  function shadeSet(img) {
    return SHADES.map(function (k) {
      var c = document.createElement('canvas');
      c.width = img.width; c.height = img.height;
      var x = c.getContext('2d');
      x.imageSmoothingEnabled = false;
      x.drawImage(img, 0, 0);
      if (k < 1) {
        x.globalCompositeOperation = 'source-atop';
        x.fillStyle = 'rgba(0,0,0,' + (1 - k).toFixed(2) + ')';
        x.fillRect(0, 0, c.width, c.height);
      }
      return c;
    });
  }

  // ¿Brazos finos (Alex) o normales (Steve)?
  function isSlim(img) {
    if (img.height < 64) return false;
    try {
      var c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      var x = c.getContext('2d');
      x.drawImage(img, 0, 0);
      var d = x.getImageData(54, 20, 2, 12).data;
      for (var i = 3; i < d.length; i += 4) if (d[i] !== 0) return false;
      return true;
    } catch (e) { return false; }
  }

  // Partes del cuerpo: tamaño, uv base, uv de la capa exterior, pivote y posición
  function buildModel(slim, legacy) {
    var aw = slim ? 3 : 4, ax = slim ? 5.5 : 6;
    function part(name, w, h, d, uv, uv2, pivot, off) {
      return { name: name, w: w, h: h, d: d, uv: uv, uv2: uv2, pivot: pivot, off: off, rx: 0, ry: 0, rz: 0 };
    }
    // off = centro de la caja relativo al pivote
    return [
      part('head', 8, 8, 8, [0, 0], [32, 0], [0, 24, 0], [0, 4, 0]),
      part('body', 8, 12, 4, [16, 16], legacy ? null : [16, 32], [0, 24, 0], [0, -6, 0]),
      part('rightArm', aw, 12, 4, [40, 16], legacy ? null : [40, 32], [-ax, 22, 0], [0, -4, 0]),
      part('leftArm', aw, 12, 4, legacy ? [40, 16] : [32, 48], legacy ? null : [48, 48], [ax, 22, 0], [0, -4, 0]),
      part('rightLeg', 4, 12, 4, [0, 16], legacy ? null : [0, 32], [-2, 12, 0], [0, -6, 0]),
      part('leftLeg', 4, 12, 4, legacy ? [0, 16] : [16, 48], legacy ? null : [0, 48], [2, 12, 0], [0, -6, 0])
    ];
  }

  // Caras de una caja: rect de textura y esquinas (arriba-izq, arriba-der, abajo-izq)
  function boxFaces(p, uv, inf) {
    var w = p.w, h = p.h, d = p.d, u = uv[0], v = uv[1];
    var x0 = p.off[0] - w / 2 - inf, x1 = p.off[0] + w / 2 + inf;
    var y0 = p.off[1] - h / 2 - inf, y1 = p.off[1] + h / 2 + inf;
    var z0 = p.off[2] - d / 2 - inf, z1 = p.off[2] + d / 2 + inf;
    return [
      { t: [u + d, v + d, w, h], c: [[x0, y1, z1], [x1, y1, z1], [x0, y0, z1]] },          // frente
      { t: [u + d + w + d, v + d, w, h], c: [[x1, y1, z0], [x0, y1, z0], [x1, y0, z0]] },  // espalda
      { t: [u, v + d, d, h], c: [[x0, y1, z0], [x0, y1, z1], [x0, y0, z0]] },              // derecha
      { t: [u + d + w, v + d, d, h], c: [[x1, y1, z1], [x1, y1, z0], [x1, y0, z1]] },      // izquierda
      { t: [u + d, v, w, d], c: [[x0, y1, z0], [x1, y1, z0], [x0, y1, z1]] },              // arriba
      { t: [u + d + w, v, w, d], c: [[x0, y0, z1], [x1, y0, z1], [x0, y0, z0]] }           // abajo
    ];
  }

  function rot(p, rx, ry, rz) {
    var x = p[0], y = p[1], z = p[2], c, s, t;
    if (rz) { c = Math.cos(rz); s = Math.sin(rz); t = x * c - y * s; y = x * s + y * c; x = t; }
    if (rx) { c = Math.cos(rx); s = Math.sin(rx); t = y * c - z * s; z = y * s + z * c; y = t; }
    if (ry) { c = Math.cos(ry); s = Math.sin(ry); t = x * c + z * s; z = -x * s + z * c; x = t; }
    return [x, y, z];
  }

  var LIGHT = (function () { var l = [0.3, 0.55, 0.78], n = Math.hypot(l[0], l[1], l[2]); return [l[0] / n, l[1] / n, l[2] / n]; })();

  function Scene(img) {
    this.img = img;
    this.shades = shadeSet(img);
    var legacy = img.height < 64;
    this.parts = buildModel(isSlim(img), legacy);
    this.faces = [];
    var self = this;
    this.parts.forEach(function (p) {
      boxFaces(p, p.uv, 0).forEach(function (f) { f.part = p; f.layer = 0; self.faces.push(f); });
      if (p.uv2) boxFaces(p, p.uv2, p.name === 'head' ? 0.5 : 0.25).forEach(function (f) { f.part = p; f.layer = 1; self.faces.push(f); });
    });
    this.yaw = -0.5; this.pitch = 0.12; this.zoom = 1;
  }

  Scene.prototype.pose = function () {
    var P = {};
    this.parts.forEach(function (p) { p.rx = p.ry = p.rz = 0; P[p.name] = p; });
    P.head.ry = 0.25; P.head.rx = 0.05;
    P.rightArm.rx = -0.55; P.rightArm.rz = -0.08;
    P.leftArm.rx = 0.45; P.leftArm.rz = 0.08;
    P.rightLeg.rx = 0.35;
    P.leftLeg.rx = -0.35;
  };

  Scene.prototype.animate = function (name, t) {
    var P = {};
    this.parts.forEach(function (p) { P[p.name] = p; });
    var run = name === 'run', sp = run ? 9 : 4.2, amp = run ? 0.95 : 0.5;
    var a = Math.sin(t * sp) * amp;
    P.head.ry = Math.sin(t * 0.9) * 0.12; P.head.rx = run ? 0.12 : Math.sin(t * 0.7) * 0.04;
    P.rightArm.rx = a; P.leftArm.rx = -a;
    P.rightArm.rz = run ? -0.1 : -0.04; P.leftArm.rz = run ? 0.1 : 0.04;
    P.rightLeg.rx = -a; P.leftLeg.rx = a;
    this.bob = run ? Math.abs(Math.sin(t * sp)) * 0.7 : 0;
  };

  // Dibuja con perspectiva suave. Orden: partes de atrás hacia adelante
  // (cada parte es una caja convexa, así no se cruzan caras), y dentro
  // de cada parte primero la capa base y después la exterior.
  var CAM = 80; // distancia de la cámara (más chico = más perspectiva)
  Scene.prototype.draw = function (ctx, W, H, opts) {
    opts = opts || {};
    var s = (H * (opts.fill || 0.78) / 34) * this.zoom;
    var cx = W / 2, cy = H * (opts.cy || 0.5);
    var yaw = this.yaw, pitch = this.pitch, bob = this.bob || 0;
    var self = this;
    function world(pt, p) {
      var q = rot(pt, p.rx, p.ry, p.rz);
      q = [q[0] + p.pivot[0], q[1] + p.pivot[1] - 16 + bob, q[2] + p.pivot[2]];
      return rot(q, pitch, yaw, 0);
    }
    function proj(q) {
      var k = CAM / (CAM - q[2]);
      return [cx + q[0] * s * k, cy - q[1] * s * k, q[2]];
    }
    var order = this.parts.map(function (p) { return { p: p, z: world(p.off, p)[2] }; });
    order.sort(function (a, b) { return a.z - b.z; });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.imageSmoothingEnabled = false;
    for (var oi = 0; oi < order.length; oi++) {
      var part = order[oi].p;
      for (var layer = 0; layer < 2; layer++) {
        for (var i = 0; i < this.faces.length; i++) {
          var f = this.faces[i];
          if (f.part !== part || f.layer !== layer) continue;
          var w0 = world(f.c[0], part), w1 = world(f.c[1], part), w2 = world(f.c[2], part);
          var ax = w1[0] - w0[0], ay = w1[1] - w0[1], az = w1[2] - w0[2];
          var bx = w2[0] - w0[0], by = w2[1] - w0[1], bz = w2[2] - w0[2];
          var nx = ay * bz - az * by, ny = az * bx - ax * bz, nz = ax * by - ay * bx;
          // cara de espaldas (mirando desde la cámara en perspectiva)
          var vx = -w0[0], vy = -w0[1], vz = CAM - w0[2];
          if (nx * vx + ny * vy + nz * vz >= 0) continue;
          var nl = Math.hypot(nx, ny, nz) || 1;
          var lam = -(nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]) / nl;
          var shade = lam > 0.7 ? 0 : lam > 0.35 ? 1 : lam > 0 ? 2 : 3;
          var P0 = proj(w0), P1 = proj(w1), P2 = proj(w2), t = f.t;
          var ux = (P1[0] - P0[0]) / t[2], uy = (P1[1] - P0[1]) / t[2];
          var qx = (P2[0] - P0[0]) / t[3], qy = (P2[1] - P0[1]) / t[3];
          var eu = 0.5 / (Math.hypot(ux, uy) || 1), ev = 0.5 / (Math.hypot(qx, qy) || 1);
          ctx.setTransform(ux, uy, qx, qy, P0[0], P0[1]);
          ctx.drawImage(self.shades[shade], t[0], t[1], t[2], t[3], -eu, -ev, t[2] + eu * 2, t[3] + ev * 2);
        }
      }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  };

  function fit(canvas, maxDpr) {
    var box = canvas.parentNode, r = Math.min(window.devicePixelRatio || 1, maxDpr || 1.5);
    var w = Math.max(1, box.clientWidth), h = Math.max(1, box.clientHeight);
    canvas.width = Math.round(w * r); canvas.height = Math.round(h * r);
    canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  }

  // Vista previa quieta: se dibuja una vez
  function drawStatic(canvas, src, opts) {
    return loadImage(src).then(function (img) {
      var sc = new Scene(img);
      sc.pose();
      var paint = function () { fit(canvas, 2); sc.draw(canvas.getContext('2d'), canvas.width, canvas.height, opts); };
      paint();
      if (window.ResizeObserver) new ResizeObserver(paint).observe(canvas.parentNode);
      return true;
    });
  }

  // Visor interactivo
  function create(canvas, src) {
    var ctx = canvas.getContext('2d'), sc = null, anim = null, spin = false, raf = 0, last = 0, t0 = 0, dead = false;
    var ro = null;
    function frame(now) {
      raf = 0;
      if (dead || !sc) return;
      var dt = last ? Math.min((now - last) / 1000, 0.05) : 0;
      last = now;
      if (spin) sc.yaw += dt * 0.8;
      if (anim) sc.animate(anim, (now - t0) / 1000);
      sc.draw(ctx, canvas.width, canvas.height);
      if ((spin || anim) && !document.hidden) raf = requestAnimationFrame(frame);
      else last = 0;
    }
    function redraw() { if (!raf && sc) raf = requestAnimationFrame(frame); }
    function resize() { fit(canvas, 1.5); redraw(); }

    // arrastrar para girar
    var drag = null;
    function down(e) { drag = { x: e.clientX, y: e.clientY }; canvas.setPointerCapture(e.pointerId); if (api.onGrab) api.onGrab(); }
    function move(e) {
      if (!drag || !sc) return;
      sc.yaw += (e.clientX - drag.x) * 0.01;
      sc.pitch = Math.max(-0.7, Math.min(0.7, sc.pitch + (e.clientY - drag.y) * 0.006));
      drag.x = e.clientX; drag.y = e.clientY;
      redraw();
    }
    function up() { drag = null; }
    function wheel(e) {
      if (!sc) return;
      e.preventDefault();
      sc.zoom = Math.max(0.5, Math.min(2.6, sc.zoom * Math.exp(-e.deltaY * 0.0015)));
      redraw();
    }
    function vis() { if (!document.hidden) redraw(); }
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('wheel', wheel, { passive: false });
    document.addEventListener('visibilitychange', vis);

    loadImage(src).then(function (img) {
      if (dead) return;
      sc = new Scene(img);
      sc.pose();
      resize();
      if (window.ResizeObserver) { ro = new ResizeObserver(resize); ro.observe(canvas.parentNode); }
    });

    var api = {
      setAnim: function (name) {
        anim = name === 'walk' || name === 'run' ? name : null;
        t0 = performance.now();
        // Pausa: congela la pose en la que está, como NameMC
        redraw();
      },
      setSpin: function (on) { spin = !!on; redraw(); },
      isSpinning: function () { return spin; },
      dispose: function () {
        dead = true;
        if (raf) cancelAnimationFrame(raf);
        if (ro) ro.disconnect();
        canvas.removeEventListener('pointerdown', down);
        canvas.removeEventListener('pointermove', move);
        canvas.removeEventListener('pointerup', up);
        canvas.removeEventListener('pointercancel', up);
        canvas.removeEventListener('wheel', wheel);
        document.removeEventListener('visibilitychange', vis);
      },
      onGrab: null
    };
    return api;
  }

  window.Skin3D = { create: create, drawStatic: drawStatic };
})();

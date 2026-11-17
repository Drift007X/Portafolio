// Llena la página con los datos de data/site.js
(function () {
  var S = window.SITE;
  if (!S) return;

  function all(sel) { return document.querySelectorAll(sel); }
  function setText(sel, txt) { all(sel).forEach(function (el) { el.textContent = txt; }); }

  // Nombre y título (la parte final va en azul)
  setText('[data-nombre]', S.nombre);
  var h1 = document.querySelector('[data-titulo]');
  if (h1) {
    var acc = S.nombreAcento || '';
    var base = acc && S.nombre.endsWith(acc) ? S.nombre.slice(0, -acc.length) : S.nombre;
    h1.textContent = base;
    if (acc && base !== S.nombre) {
      var sp = document.createElement('span');
      sp.textContent = acc;
      h1.appendChild(sp);
    }
  }

  setText('[data-etiqueta]', S.etiqueta);
  setText('[data-bio]', S.bio);
  setText('[data-bio-suave]', S.bioSuave);
  setText('[data-actualizado]', S.actualizado);
  if (S.trayectoria) setText('[data-trayectoria]', S.trayectoria);
  all('[data-foto]').forEach(function (img) { img.src = S.foto; });
  all('[data-enlinea]').forEach(function (el) { el.hidden = !S.enLinea; });
  document.title = S.nombre;

  // Redes
  var redes = document.querySelector('[data-redes]');
  if (redes) {
    S.redes.forEach(function (r) {
      if (!r.url) return;
      var a = document.createElement('a');
      a.className = 'soc';
      a.href = r.url || '#';
      a.setAttribute('aria-label', r.nombre);
      if (r.url) { a.target = '_blank'; a.rel = 'noopener'; }
      var img = document.createElement('img');
      img.src = 'assets/icons/' + r.icono + '.svg';
      img.alt = '';
      a.appendChild(img);
      redes.appendChild(a);
    });
  }

  // Habilidades
  var sk = document.querySelector('[data-habilidades]');
  if (sk && S.habilidades) {
    S.habilidades.forEach(function (h) {
      var li = document.createElement('li');
      var t = document.createElement('span');
      t.textContent = h;
      li.appendChild(t);
      sk.appendChild(li);
    });
  }

  // Proyectos
  var work = document.querySelector('[data-proyectos]');
  if (work && S.proyectos) {
    S.proyectos.forEach(function (p, i) {
      var card = document.createElement(p.url ? 'a' : 'article');
      card.className = 'wcard';
      if (p.url) { card.href = p.url; card.target = '_blank'; card.rel = 'noopener'; }

      var logo = document.createElement('div');
      logo.className = 'wlogo';
      var tile = document.createElement('div');
      tile.className = 'wtile';
      if (p.logo) {
        var img = document.createElement('img');
        img.src = p.logo;
        img.alt = 'Logo de ' + p.nombre;
        tile.appendChild(img);
        tile.classList.add('wtile--img');
      } else {
        tile.style.background = p.color || '#2C2E35';
        var ini = document.createElement('span');
        ini.className = 'dsp';
        ini.textContent = p.iniciales || p.nombre.slice(0, 2);
        tile.appendChild(ini);
      }
      logo.appendChild(tile);
      var num = document.createElement('span');
      num.className = 'mono wnum';
      num.textContent = String(i + 1).padStart(2, '0');
      logo.appendChild(num);
      card.appendChild(logo);

      var body = document.createElement('div');
      body.className = 'wbody';
      var h = document.createElement('h3');
      h.className = 'dsp';
      h.textContent = p.nombre;
      body.appendChild(h);
      if (p.rol) {
        var r = document.createElement('span');
        r.className = 'wrol';
        r.textContent = p.rol;
        body.appendChild(r);
      }
      if (p.detalle) {
        var d = document.createElement('p');
        d.textContent = p.detalle;
        body.appendChild(d);
      }
      var foot = document.createElement('div');
      foot.className = 'wfoot';
      var m = document.createElement('span');
      m.className = 'mono';
      m.textContent = p.meta || '';
      foot.appendChild(m);
      if (p.url) {
        foot.insertAdjacentHTML('beforeend', '<svg class="ic warr" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>');
      }
      body.appendChild(foot);
      card.appendChild(body);
      work.appendChild(card);
    });
  }

  // Discord: copiar usuario
  var dc = document.querySelector('[data-discord]');
  if (dc) {
    if (!S.discordUsuario) { dc.hidden = true; }
    else {
      setText('[data-discord-user]', S.discordUsuario);
      var hint = dc.querySelector('.copy-hint');
      dc.addEventListener('click', function () {
        var done = function () { hint.textContent = '¡Copiado!'; setTimeout(function () { hint.textContent = 'Copiar'; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(S.discordUsuario).then(done, done);
        else done();
      });
    }
  }

  // Portafolio
  var pfGrid = document.querySelector('[data-pf-grid]');
  if (pfGrid && S.portafolio) {
    var ICONS = {
      Mods: '<path d="M12 2l9 5v10l-9 5-9-5V7z"/><path d="M3 7l9 5 9-5M12 12v10"/>',
      Skins: '<path d="M8 2h8v7H8zM5 10h14v6H5zM8 16h3v6H8zM13 16h3v6h-3z"/>',
      Renders: '<path d="M3 6h4l2-3h6l2 3h4v14H3z"/><path d="M8 13a4 4 0 1 0 8 0a4 4 0 1 0-8 0"/>',
      Modelos: '<path d="M12 2L3 20h18z"/><path d="M12 2v18M7.5 11h9"/>',
      RP: '<path d="M3 3h11v11H3z"/><path d="M10 10h11v11H10z"/>'
    };
    var cats = (S.categorias || []).map(function (c) { return typeof c === 'string' ? { nombre: c, desc: '' } : c; });
    var items = S.portafolio;
    var actual = 'Todo';
    var h = decodeURIComponent((location.hash || '').slice(1)).toLowerCase();
    cats.forEach(function (c) { if (c.nombre.toLowerCase() === h) actual = c.nombre; });

    var q = function (sel) { return document.querySelector(sel); };
    q('[data-pf-total]').textContent = items.length;
    q('[data-pf-cats]').textContent = cats.length;

    // Tarjetas de categoría
    var catList = q('[data-pf-cats-list]');
    cats.forEach(function (c, i) {
      var n = items.filter(function (t) { return t.categoria === c.nombre; }).length;
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'pfc';
      b.setAttribute('role', 'tab');
      b.dataset.cat = c.nombre;
      b.innerHTML =
        '<span class="pfc-top"><span class="mono pfc-idx"></span><svg class="ic pfc-ic" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[c.nombre] || ICONS.Mods) + '</svg></span>' +
        '<span class="dsp pfc-name"></span><span class="pfc-desc"></span>' +
        '<span class="pfc-foot"><span class="mono pfc-n"></span><span class="pfc-bar" aria-hidden="true"></span></span>';
      b.querySelector('.pfc-idx').textContent = String(i + 1).padStart(2, '0');
      b.querySelector('.pfc-name').textContent = c.nombre;
      b.querySelector('.pfc-desc').textContent = c.desc || '';
      b.querySelector('.pfc-n').textContent = n === 0 ? 'Próximamente' : n + (n === 1 ? ' trabajo' : ' trabajos');
      b.addEventListener('click', function () { setCat(actual === c.nombre ? 'Todo' : c.nombre); });
      catList.appendChild(b);
    });
    q('[data-pf-reset]').addEventListener('click', function () { setCat('Todo'); });

    // ── Motor 3D de skins (optimizado) ──
    //  · La librería se descarga solo si hay skins.
    //  · Las vistas previas son imágenes: se dibujan una vez con un único
    //    visor compartido y después se libera la GPU.
    //  · El visor grande dibuja solo cuando algo cambia (al arrastrar o
    //    acercar). Solo anima en continuo si elegís Caminar, Correr o Girar.
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var LIB = 'https://cdn.jsdelivr.net/npm/skinview3d@3/bundles/skinview3d.bundle.js';
    var libPromise = null;
    function load3d() {
      if (window.skinview3d) return Promise.resolve(true);
      if (!window.WebGLRenderingContext) return Promise.resolve(false);
      if (!libPromise) libPromise = new Promise(function (res) {
        var sc = document.createElement('script');
        sc.src = LIB; sc.async = true;
        sc.onload = function () { res(!!window.skinview3d); };
        sc.onerror = function () { res(false); };
        document.head.appendChild(sc);
      });
      return libPromise;
    }
    function skinSrc(p) { return (window.SKIN_DATA && window.SKIN_DATA[p]) || p; }
    function dpr(max) { return Math.min(window.devicePixelRatio || 1, max); }

    function pose(v) {
      var p = v.playerObject, k = p.skin;
      var parts = [p, k, k.head, k.body, k.rightArm, k.leftArm, k.rightLeg, k.leftLeg];
      // Guarda la posición original la primera vez y la restaura después
      if (!v._base) v._base = parts.map(function (o) { return o.position.clone(); });
      parts.forEach(function (o, i) { o.position.copy(v._base[i]); o.rotation.set(0, 0, 0); });
      // Pose de presentación: girado mostrando el costado derecho,
      // cabeza inclinada y el brazo derecho estirado hacia la cámara
      p.rotation.y = 0.48;
      k.head.rotation.set(0.06, 0.12, -0.2);
      k.body.rotation.set(0, 0, -0.03);
      k.rightArm.rotation.set(-1.0, 0.1, 0.12);
      k.leftArm.rotation.set(0.22, 0, 0.1);
      k.rightLeg.rotation.set(-0.28, 0, 0.02);
      k.leftLeg.rotation.set(0.28, 0, -0.02);
    }

    // Pose "Quieto": parado derecho, girado mostrando el frente y el costado derecho
    function poseIdle(v) {
      var p = v.playerObject, k = p.skin;
      var parts = [p, k, k.head, k.body, k.rightArm, k.leftArm, k.rightLeg, k.leftLeg];
      if (!v._base) v._base = parts.map(function (o) { return o.position.clone(); });
      parts.forEach(function (o, i) { o.position.copy(v._base[i]); o.rotation.set(0, 0, 0); });
      p.rotation.y = 0.5;
    }

    // Pose de la tarjeta: parado derecho, girado mostrando el frente y el costado izquierdo
    function posePreview(v) {
      poseIdle(v);
      v.playerObject.rotation.y = -0.45;
    }

    // Vistas previas: un solo visor para todas, que se libera al terminar
    var snapCache = {}, snapQueue = [], snapViewer = null, snapBusy = false, snapIdle = null;
    function snapshot(path) {
      if (snapCache[path]) return snapCache[path];
      snapCache[path] = new Promise(function (res) { snapQueue.push({ path: path, res: res }); runSnaps(); });
      return snapCache[path];
    }
    function runSnaps() {
      if (snapBusy || !snapQueue.length) return;
      snapBusy = true;
      clearTimeout(snapIdle);
      var job = snapQueue.shift();
      if (!snapViewer) {
        var c = document.createElement('canvas');
        snapViewer = new skinview3d.SkinViewer({ canvas: c, width: 420, height: 420, pixelRatio: dpr(2), preserveDrawingBuffer: true });
        snapViewer.renderPaused = true;
        snapViewer.fov = 50; snapViewer.zoom = 1.7;
        snapViewer.animation = null; snapViewer.autoRotate = false;
        snapViewer.controls.enabled = false;
      }
      var done = function (url) { job.res(url); snapBusy = false; if (snapQueue.length) runSnaps(); else snapIdle = setTimeout(freeSnaps, 1500); };
      Promise.resolve(snapViewer.loadSkin(skinSrc(job.path))).then(function () {
        snapViewer._base = null;
        posePreview(snapViewer);
        // Encuadre de la vista previa: primer plano (cabeza y hombros)
        snapViewer.playerObject.position.y -= 8;
        snapViewer.render();
        var url = snapViewer.canvas.toDataURL('image/png');
        // Deshace el corrimiento para que la próxima skin arranque centrada
        snapViewer.playerObject.position.y += 8;
        done(url);
      }, function () { done(null); });
    }
    function freeSnaps() { if (snapViewer) { try { snapViewer.dispose(); } catch (e) {} snapViewer = null; } }

    // Visor grande
    function makeBig(canvas, box, src) {
      var v = new skinview3d.SkinViewer({ canvas: canvas, width: box.clientWidth || 600, height: box.clientHeight || 600, pixelRatio: dpr(1.5) });
      v.renderPaused = true;
      v.fov = 40; v.zoom = 0.85;
      v.animation = null; v.autoRotate = false;
      v.controls.enablePan = false;
      v.controls.enableDamping = false;
      var idle = function () { return !v.animation && !v.autoRotate; };
      var sync = function () {
        var run = !idle() && !document.hidden;
        v.renderPaused = !run;
        if (!run) v.render();
      };
      v.controls.addEventListener('change', function () { if (idle()) v.render(); });
      var ro = window.ResizeObserver ? new ResizeObserver(function () {
        if (box.clientWidth && box.clientHeight) { v.setSize(box.clientWidth, box.clientHeight); if (idle()) v.render(); }
      }) : null;
      if (ro) ro.observe(box);
      var onVis = function () { sync(); };
      document.addEventListener('visibilitychange', onVis);
      Promise.resolve(v.loadSkin(src)).then(function () { poseIdle(v); v.render(); });
      return { v: v, sync: sync, dispose: function () {
        document.removeEventListener('visibilitychange', onVis);
        if (ro) ro.disconnect();
        try { v.dispose(); } catch (e) {}
      } };
    }

    var hasSkins = items.some(function (t) { return t.categoria === 'Skins' && t.skin; });
    var has3d = false;
    var ready3d = hasSkins ? load3d().then(function (ok) { has3d = ok; return ok; }) : Promise.resolve(false);

    var visibles = [], yearSel = 'all';
    function render() {
      catList.querySelectorAll('.pfc').forEach(function (b) {
        var on = b.dataset.cat === actual;
        b.setAttribute('aria-selected', String(on));
        b.classList.toggle('pfc--on', on);
      });
      var enCat = items.filter(function (t) { return actual === 'Todo' || t.categoria === actual; });
      // Años disponibles en esta categoría (de más nuevo a más viejo)
      var years = [];
      enCat.forEach(function (t) { var y = t.anio ? String(t.anio) : 'Sin fecha'; if (years.indexOf(y) < 0) years.push(y); });
      years.sort(function (a, b) { return a === 'Sin fecha' ? 1 : b === 'Sin fecha' ? -1 : b - a; });
      if (yearSel !== 'all' && years.indexOf(yearSel) < 0) yearSel = 'all';
      var yBox = q('[data-pf-years]');
      yBox.innerHTML = '';
      yBox.hidden = years.length < 2;
      ['all'].concat(years).forEach(function (y) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'pf-ychip';
        b.setAttribute('aria-pressed', String(y === yearSel));
        b.innerHTML = '<span></span>';
        b.firstChild.textContent = y === 'all' ? 'Todos los años' : y;
        b.addEventListener('click', function () { yearSel = y; render(); });
        yBox.appendChild(b);
      });
      var yOf = function (t) { return t.anio ? String(t.anio) : 'Sin fecha'; };
      visibles = enCat.filter(function (t) { return yearSel === 'all' || yOf(t) === yearSel; });
      visibles.sort(function (a, b) { return years.indexOf(yOf(a)) - years.indexOf(yOf(b)); });
      q('[data-pf-showing]').textContent = actual + (yearSel !== 'all' ? ' · ' + yearSel : '');
      q('[data-pf-count]').textContent = visibles.length + (visibles.length === 1 ? ' trabajo' : ' trabajos');
      q('[data-pf-reset]').hidden = actual === 'Todo';
      pfGrid.innerHTML = '';
      var groups = {}, curGrid = null;
      visibles.forEach(function (t, i) {
        var y = yOf(t);
        if (!groups[y]) {
          var n = visibles.filter(function (x) { return yOf(x) === y; }).length;
          var sec = document.createElement('section');
          sec.className = 'pf-group';
          sec.innerHTML = '<div class="pf-year"><span class="dsp pf-year-n"></span><span class="pf-year-line" aria-hidden="true"></span><span class="mono pf-year-c"></span></div><div class="pf-grid"></div>';
          sec.querySelector('.pf-year-n').textContent = y;
          sec.querySelector('.pf-year-c').textContent = n + (n === 1 ? ' trabajo' : ' trabajos');
          pfGrid.appendChild(sec);
          groups[y] = sec.querySelector('.pf-grid');
        }
        curGrid = groups[y];
        var card = document.createElement('button');
        card.type = 'button';
        card.className = 'pfi' + (t.destacado ? ' pfi--big' : '') + (t.categoria === 'Skins' ? ' pfi--skin' : '');
        card.style.animationDelay = (i * 50) + 'ms';
        card.setAttribute('aria-label', 'Abrir ' + t.titulo);
        card.innerHTML = '<span class="pfi-img"><img alt="" loading="lazy"></span>' +
          (t.anio ? '<span class="mono pfi-year"></span>' : '') +
          '<span class="pfi-over"><span class="mono pfi-cat"></span><span class="dsp pfi-title"></span>' +
          '<span class="pfi-go"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 15v5h-5M4 4l6 6M20 20l-6-6"/></svg></span></span>';
        var isMod = (t.categoria === 'Mods' || t.categoria === 'RP') && (t.modrinth || t.curseforge || t.logo);
        var isSkin = t.categoria === 'Skins' && t.skin;
        if (isMod) {
          card.classList.add('pfi--mod');
          var mb = card.querySelector('.pfi-img');
          if (t.imagen) mb.querySelector('img').src = t.imagen; else mb.innerHTML = '';
          var over = card.querySelector('.pfi-over');
          over.innerHTML = '<span class="pfm-head"><img class="pfm-logo" alt=""><span class="pfm-tt"><span class="mono pfi-cat"></span><span class="dsp pfi-title"></span></span></span>' +
            '<span class="pfm-desc"></span><span class="pfm-tags"></span>' +
            '<span class="pfm-plat"></span>';
          over.querySelector('.pfm-logo').src = t.logo || t.imagen || '';
          over.querySelector('.pfm-desc').textContent = t.descripcion || '';
          var tags = over.querySelector('.pfm-tags');
          if (t.estado) { var es = document.createElement('span'); es.className = 'pfm-tag pfm-tag--warn'; es.textContent = t.estado; tags.appendChild(es); }
          (t.loaders || []).forEach(function (l) { var x = document.createElement('span'); x.className = 'pfm-tag pfm-tag--l'; x.textContent = l; tags.appendChild(x); });
          var vs = t.versiones || [];
          if (vs.length) { var x = document.createElement('span'); x.className = 'pfm-tag'; x.textContent = vs.length > 2 ? vs[vs.length - 1] + ' – ' + vs[0] : vs.join(' · '); tags.appendChild(x); }
          var plat = over.querySelector('.pfm-plat');
          if (t.modrinth) plat.insertAdjacentHTML('beforeend', '<img src="assets/icons/modrinth.svg" alt="Modrinth">');
          if (t.curseforge) plat.insertAdjacentHTML('beforeend', '<img src="assets/icons/curseforge.svg" alt="CurseForge">');
        } else if (isSkin) {
          card.classList.add('pfi--3d', 'is-loading');
          var box = card.querySelector('.pfi-img');
          box.insertAdjacentHTML('beforeend', '<span class="mono pfi-3d">3D</span>');
          (function (img, cardEl, item) {
            ready3d.then(function (ok) { return ok ? snapshot(item.skin) : null; }).then(function (url) {
              if (url) { img.src = url; }
              else { img.src = item.imagen || item.skin; cardEl.classList.add('pfi--flat'); }
              cardEl.classList.remove('is-loading');
            });
          })(card.querySelector('img'), card, t);
        } else {
          card.querySelector('img').src = t.imagen || t.skin;
        }
        card.querySelector('.pfi-cat').textContent = t.categoria;
        card.querySelector('.pfi-title').textContent = t.titulo;
        if (t.anio) card.querySelector('.pfi-year').textContent = t.anio;
        card.addEventListener('click', function () { openLb(i); });
        curGrid.appendChild(card);
      });
      var empty = q('[data-pf-empty]');
      empty.hidden = visibles.length > 0;
      q('[data-pf-empty-title]').textContent = actual === 'Todo' ? 'Próximamente' : actual + ': próximamente';
    }
    function setCat(c) {
      actual = c;
      yearSel = 'all';
      history.replaceState(null, '', c === 'Todo' ? location.pathname : '#' + encodeURIComponent(c));
      render();
    }

    // Visor
    var lb = q('[data-lb]'), lbIdx = 0, lbViewer = null;
    var lbCanvas = q('[data-lb-canvas]'), lbUi = q('[data-lb-skin-ui]'), lbImg = q('[data-lb-img]');
    function disposeLb() { if (lbViewer) { lbViewer.dispose(); lbViewer = null; } }
    function setAnim(name) {
      if (!lbViewer) return;
      var V = lbViewer.v;
      if (name === 'walk') V.animation = new skinview3d.WalkingAnimation();
      else if (name === 'run') V.animation = new skinview3d.RunningAnimation();
      else { V.animation = null; poseIdle(V); }
      lbUi.querySelectorAll('[data-anim]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.anim === name)); });
      lbViewer.sync();
    }
    lbUi.querySelectorAll('[data-anim]').forEach(function (b) { b.addEventListener('click', function () { setAnim(b.dataset.anim); }); });
    var spinBtn = lbUi.querySelector('[data-spin]');
    spinBtn.addEventListener('click', function () {
      if (!lbViewer) return;
      lbViewer.v.autoRotate = !lbViewer.v.autoRotate;
      spinBtn.setAttribute('aria-pressed', String(lbViewer.v.autoRotate));
      lbViewer.sync();
    });
    var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    function fechaLinda(t) {
      var f = t.fecha || '';
      var m = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/.exec(f);
      if (m) return (m[3] ? parseInt(m[3], 10) + ' de ' : '') + MESES[parseInt(m[2], 10) - 1] + ' de ' + m[1];
      return f || (t.anio ? String(t.anio) : '');
    }
    var RED_ICON = [
      [/youtube\.com|youtu\.be/, 'youtube'], [/(^|\.)x\.com|twitter\.com/, 'x'], [/discord\.(gg|com)/, 'discord'],
      [/modrinth\.com/, 'modrinth'], [/curseforge\.com/, 'curseforge'], [/planetminecraft\.com/, 'planetminecraft']
    ];
    function redIcon(url) {
      var host = ''; try { host = new URL(url).hostname; } catch (e) {}
      for (var i = 0; i < RED_ICON.length; i++) if (RED_ICON[i][0].test(host)) return 'assets/icons/' + RED_ICON[i][1] + '.svg';
      return null;
    }
    function skinInfo(t, meta) {
      function row(label, node) {
        var r = document.createElement('div'); r.className = 'lb-info-row';
        var l = document.createElement('span'); l.className = 'mono'; l.textContent = label;
        r.appendChild(l); r.appendChild(node); meta.appendChild(r);
      }
      if (t.persona) { var n = document.createElement('span'); n.className = 'lb-info-val'; n.textContent = t.persona; row('Persona', n); }
      var fl = fechaLinda(t);
      if (fl) { var d = document.createElement('span'); d.className = 'lb-info-val'; d.textContent = fl; row('Creación', d); }
      var redes = (t.redesPersona || []).filter(function (r) { return r && r.url; });
      if (redes.length) {
        var w = document.createElement('div'); w.className = 'lb-socials';
        redes.forEach(function (r) {
          var a = document.createElement('a'); a.className = 'lb-soc'; a.href = r.url; a.target = '_blank'; a.rel = 'noopener';
          var ic = redIcon(r.url);
          a.innerHTML = (ic ? '<img alt="">' : '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M10 14l4-4M8 12l-2 2a3 3 0 0 0 4 4l2-2M16 12l2-2a3 3 0 0 0-4-4l-2 2"/></svg>') + '<span></span>';
          if (ic) a.querySelector('img').src = ic;
          a.querySelector('span').textContent = r.nombre || (function () { try { return new URL(r.url).hostname.replace('www.', ''); } catch (e) { return r.url; } })();
          w.appendChild(a);
        });
        row('Redes', w);
      }
    }
    function fillLb() {
      var t = visibles[lbIdx];
      if (!t) return;
      disposeLb();
      var sk = t.categoria === 'Skins' && t.skin && has3d;
      lbImg.hidden = sk; lbCanvas.hidden = !sk; lbUi.hidden = !sk;
      if (sk) {
        var media = lbCanvas.parentNode;
        media.classList.add('lb-media--3d');
        requestAnimationFrame(function () {
          lbViewer = makeBig(lbCanvas, media, skinSrc(t.skin));
          lbUi.querySelectorAll('[data-anim]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.anim === 'idle')); });
          spinBtn.setAttribute('aria-pressed', 'false');
          lbViewer.v.controls.addEventListener('start', function () {
            if (!lbViewer || !lbViewer.v.autoRotate) return;
            lbViewer.v.autoRotate = false;
            spinBtn.setAttribute('aria-pressed', 'false');
            lbViewer.sync();
          });
        });
      } else {
        lbCanvas.parentNode.classList.remove('lb-media--3d');
      }
      q('[data-lb-img]').src = t.imagen || t.skin || '';
      q('[data-lb-img]').alt = t.titulo;
      q('[data-lb-img]').classList.toggle('pixel', t.categoria === 'Skins');
      // Mods y RP: el panel muestra solo la información, sin foto
      var infoOnly = t.categoria === 'Mods' || t.categoria === 'RP';
      q('[data-lb-img]').parentNode.hidden = infoOnly;
      q('.lb-inner').classList.toggle('lb-inner--info', infoOnly);
      q('[data-lb-cat]').textContent = t.categoria + (t.anio ? ' · ' + t.anio : '');
      q('[data-lb-title]').textContent = t.titulo;
      var d = q('[data-lb-desc]'); d.textContent = t.descripcion || ''; d.hidden = !t.descripcion;
      var lgo = q('[data-lb-logo]');
      lgo.hidden = !t.logo; if (t.logo) lgo.src = t.logo;
      var meta = q('[data-lb-meta]'); meta.innerHTML = '';
      function metaRow(label, list, cls) {
        if (!list || !list.length) return;
        var row = document.createElement('div'); row.className = 'lb-row';
        var lb2 = document.createElement('span'); lb2.className = 'mono'; lb2.textContent = label; row.appendChild(lb2);
        var wrap = document.createElement('div'); wrap.className = 'lb-tags';
        var MAX = 10, extra = [];
        list.forEach(function (v, i) {
          var x = document.createElement('span'); x.className = 'pfm-tag ' + (cls || ''); x.textContent = v;
          if (i >= MAX) { x.hidden = true; extra.push(x); }
          wrap.appendChild(x);
        });
        if (extra.length) {
          var more = document.createElement('button'); more.type = 'button'; more.className = 'pfm-tag pfm-more';
          more.textContent = '+' + extra.length + ' más';
          more.addEventListener('click', function () { extra.forEach(function (x) { x.hidden = false; }); more.remove(); });
          wrap.appendChild(more);
        }
        row.appendChild(wrap); meta.appendChild(row);
      }
      if (t.categoria === 'Skins') skinInfo(t, meta);
      if (t.estado) metaRow('Estado', [t.estado], 'pfm-tag--warn');
      metaRow('Loaders', t.loaders, 'pfm-tag--l');
      metaRow('Versiones', t.versiones);
      meta.hidden = !meta.children.length;
      var acts = q('[data-lb-actions]'); acts.innerHTML = '';
      function platBtn(href, name, icon, cls) {
        var a = document.createElement('a'); a.className = 'btn plat-btn ' + cls; a.href = href; a.target = '_blank'; a.rel = 'noopener';
        a.innerHTML = '<span><img src="assets/icons/' + icon + '.svg" alt=""> ' + name + '</span>';
        acts.appendChild(a);
      }
      if (t.modrinth) platBtn(t.modrinth, 'Modrinth', 'modrinth', 'plat-btn--mr');
      if (t.curseforge) platBtn(t.curseforge, 'CurseForge', 'curseforge', 'plat-btn--cf');
      if (t.descarga) {
        var a1 = document.createElement('a'); a1.className = 'btn btn--main' + (t.categoria === 'Skins' ? ' btn--wide' : ''); a1.href = t.descarga; a1.target = '_blank'; a1.rel = 'noopener'; a1.setAttribute('download', '');
        a1.innerHTML = t.categoria === 'Skins'
          ? '<span><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M6 9l6 6 6-6M4 21h16"/></svg>Descargar skin</span>'
          : '<span>Descargar</span>';
        acts.appendChild(a1);
      }
      if (t.url) {
        var a2 = document.createElement('a'); a2.className = 'btn'; a2.href = t.url; a2.target = '_blank'; a2.rel = 'noopener';
        a2.innerHTML = '<span>Ver más</span>'; acts.appendChild(a2);
      }
      q('[data-lb-pos]').textContent = String(lbIdx + 1).padStart(2, '0') + ' / ' + String(visibles.length).padStart(2, '0');
      var many = visibles.length > 1;
      q('[data-lb-prev]').hidden = !many; q('[data-lb-next]').hidden = !many;
    }
    function openLb(i) { lbIdx = i; fillLb(); if (lb.showModal) lb.showModal(); else lb.setAttribute('open', ''); }
    function move(d) { lbIdx = (lbIdx + d + visibles.length) % visibles.length; fillLb(); }
    q('[data-lb-close]').addEventListener('click', function () { lb.close(); });
    lb.addEventListener('close', disposeLb);
    q('[data-lb-prev]').addEventListener('click', function () { move(-1); });
    q('[data-lb-next]').addEventListener('click', function () { move(1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') move(-1);
      if (e.key === 'ArrowRight') move(1);
    });

    render();
  }

  // Skins
  var sg = document.querySelector('[data-skins]');
  if (sg) {
    var skins = S.skins || [];
    var sv = document.querySelector('[data-skins-vacio]');
    if (!skins.length) { sg.hidden = true; if (sv) sv.hidden = false; }
    skins.forEach(function (k) {
      var it = document.createElement('article');
      it.className = 'gitem';
      var box = document.createElement('div');
      box.className = 'gimg gimg--skin';
      var img = document.createElement('img');
      img.src = k.imagen; img.alt = 'Skin ' + k.nombre; img.loading = 'lazy';
      box.appendChild(img);
      it.appendChild(box);
      var cap = document.createElement('div');
      cap.className = 'gcap';
      var n = document.createElement('span'); n.className = 'dsp'; n.textContent = k.nombre;
      cap.appendChild(n);
      if (k.descarga) {
        var a = document.createElement('a');
        a.className = 'mono dl'; a.href = k.descarga; a.target = '_blank'; a.rel = 'noopener';
        a.textContent = 'Descargar ↓';
        cap.appendChild(a);
      }
      it.appendChild(cap);
      sg.appendChild(it);
    });
  }

  // Contacto: redes en mosaico
  var rl = document.querySelector('[data-redes-lista]');
  if (rl) {
    S.redes.forEach(function (r) {
      if (!r.url) return;
      var a = document.createElement('a');
      a.className = 'soc-tile'; a.href = r.url; a.target = '_blank'; a.rel = 'noopener';
      a.innerHTML = '<span class="soc-ic"><img alt=""></span><span class="soc-name"></span><svg class="ic soc-arr" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17L17 7M9 7h8v8"/></svg>';
      a.querySelector('img').src = 'assets/icons/' + r.icono + '.svg';
      a.querySelector('.soc-name').textContent = r.nombre;
      a.title = r.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      rl.appendChild(a);
    });
  }

  // Contacto: estado de comisiones
  var com = document.querySelector('[data-com]');
  if (com && S.comisiones) {
    var C = S.comisiones;
    var EST = {
      abiertas: { label: 'Abiertas', title: 'Comisiones abiertas', cls: 'is-open', cta: 'Pedir comisión' },
      espera: { label: 'Lista de espera', title: 'Lista de espera', cls: 'is-wait', cta: 'Anotarme en la lista' },
      cerradas: { label: 'Cerradas', title: 'Comisiones cerradas', cls: 'is-closed', cta: 'Avisame cuando abran' }
    };
    var e = EST[C.estado] || EST.abiertas;
    com.classList.add(e.cls);
    document.querySelector('[data-com-label]').textContent = e.label;
    document.querySelector('[data-com-title]').textContent = e.title;
    var nt = document.querySelector('[data-com-note]');
    nt.textContent = C.nota || ''; nt.hidden = !C.nota;
    var cta = document.querySelector('[data-com-cta]');
    cta.querySelector('span').firstChild.nodeValue = e.cta + ' ';
    if (C.link) cta.href = C.link;
    var sv = document.querySelector('[data-com-servicios]');
    (C.servicios || []).forEach(function (x, i) {
      var row = document.createElement('div');
      row.className = 'com-row' + (x.disponible === false ? ' is-off' : '');
      row.innerHTML = '<span class="mono com-n"></span><span class="com-name"></span><span class="mono com-st"></span>';
      row.querySelector('.com-n').textContent = String(i + 1).padStart(2, '0');
      row.querySelector('.com-name').textContent = x.nombre;
      row.querySelector('.com-st').textContent = x.disponible === false ? 'No disponible' : (x.detalle || 'Disponible');
      sv.appendChild(row);
    });
  }

  var db = document.querySelector('[data-discord-btn]');
  if (db && S.discordUsuario) {
    var note = document.querySelector('[data-copiado]');
    db.addEventListener('click', function () {
      var ok = function () { if (note) { note.textContent = '¡Usuario copiado! Pegalo en Discord para agregarme.'; } };
      if (navigator.clipboard) navigator.clipboard.writeText(S.discordUsuario).then(ok, ok); else ok();
    });
  }

  // Barra superior: cambia al hacer scroll
  var tb = document.querySelector('[data-topbar]');
  if (tb) {
    var onScroll = function () { tb.classList.toggle('is-scrolled', window.scrollY > 8); };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // Menú en celular
  var btn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (btn && menu) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      menu.classList.toggle('open', open);
    });
    menu.addEventListener('click', function (ev) {
      if (ev.target.closest('a')) {
        btn.setAttribute('aria-expanded', 'false');
        btn.setAttribute('aria-label', 'Abrir menú');
        menu.classList.remove('open');
      }
    });
  }
})();

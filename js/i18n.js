// ─────────────────────────────────────────────────────────────
//  Idioma ES / EN
//  Traduce toda la página al instante, sin servicios externos.
//  Busca cada texto en el diccionario (frases exactas) y, si no
//  está, prueba con patrones (números, fechas, etc.). También
//  traduce lo que se agrega después (galería, visor, etc.).
//
//  Para traducir un texto nuevo: agregá una línea en DICT con
//  "texto en español": "text in English".
//  Lo que tenga la clase "notranslate" no se traduce nunca.
// ─────────────────────────────────────────────────────────────
(function () {
  var DICT = {
    // Navegación y general
    'Saltar al contenido': 'Skip to content',
    'Proyectos': 'Projects',
    'Portafolio': 'Portfolio',
    'Contacto': 'Contact',
    'Contactame': 'Contact me',
    'Abrir menú': 'Open menu',
    'Cerrar menú': 'Close menu',
    'Ir al inicio': 'Go to home',
    'Secciones': 'Sections',
    'Redes': 'Social',
    'Idioma': 'Language',
    'En línea': 'Online',
    'Copiar': 'Copy',
    '¡Copiado!': 'Copied!',
    'Discord:': 'Discord:',
    'Ver más': 'See more',
    'Volver al inicio': 'Back to home',
    'Próximamente': 'Coming soon',
    'Lo que hago': 'What I do',
    'Foto de perfil de Drift007_': 'Drift007_ profile picture',
    'Sobre mí': 'About me',

    // Portada
    'Diseñador · Argentina': 'Designer · Argentina',
    'Creador · Argentina': 'Creator · Argentina',
    'El destino se construye a mano.': 'Destiny is built by hand.',
    'Pulo cada detalle hasta que no se parezca a nada más.': 'I polish every detail until it looks like nothing else.',
    'Pixel art': 'Pixel art',
    'Skins de Minecraft': 'Minecraft skins',
    'Renders': 'Renders',
    'Mods': 'Mods',

    // Proyectos
    'Lo que construyo': 'What I build',
    'Todo lo que construyo': 'Everything I build',
    'Co-CEO · Diseñador de pixel art': 'Co-CEO · Pixel art designer',
    'App de escritorio': 'Desktop app',
    'Avatar que reacciona a tu voz, listo para OBS.': 'An avatar that reacts to your voice, ready for OBS.',
    'Escuchá música sin tantos problemas.': 'Listen to music without the hassle.',

    // Portafolio
    'Mis trabajos': 'My work',
    'Trabajos': 'Works',
    'Categorías': 'Categories',
    'Resumen': 'Summary',
    'Mostrando': 'Showing',
    'Todo': 'All',
    'Ver todo ×': 'Show all ×',
    'Todos los años': 'All years',
    'Sin fecha': 'No date',
    'Filtrar por año': 'Filter by year',
    'En preparación': 'In progress',
    'Estoy preparando trabajos para esta categoría. Volvé pronto.': "I'm preparing work for this category. Check back soon.",
    'Texture packs de Minecraft': 'Minecraft texture packs',
    'Contenido para Minecraft': 'Content for Minecraft',
    'Personajes listos para usar': 'Ready-to-use characters',
    'Escenas e imágenes': 'Scenes and images',
    'Modelos': 'Models',
    'Modelos 3D para Minecraft': '3D models for Minecraft',
    'Trabajo': 'Work',
    'Anterior': 'Previous',
    'Siguiente': 'Next',
    'Cerrar': 'Close',
    'Animación': 'Animation',
    'Arrastrá para girar · Rueda para acercar': 'Drag to rotate · Scroll to zoom',
    'Quieto': 'Still',
    'Caminar': 'Walk',
    'Correr': 'Run',
    'Girar': 'Spin',
    'Descargar': 'Download',
    'Descargar skin': 'Download skin',
    'Descargar ↓': 'Download ↓',
    'Persona': 'Person',
    'Creación': 'Created',
    'Estado': 'Status',
    'Versiones': 'Versions',
    'Descontinuado': 'Discontinued',
    'Mi skin principal.': 'My main skin.',
    'Mi skin de 2025.': 'My 2025 skin.',
    'Mi skin de 2024.': 'My 2024 skin.',
    'Mi skin de 2023.': 'My 2023 skin.',
    'Foto de perfil': 'Profile picture',

    // Descripciones de mods y packs
    'Guadañas con estilo vanilla: ataque en área, más alcance y un encantamiento que roba vida.': 'Vanilla-style scythes: area attacks, extra reach and a life-stealing enchantment.',
    'Martillos de minería y combate con efectos en área, habilidades especiales, martillos secretos y mejoras.': 'Mining and combat hammers with area effects, special abilities, secret hammers and upgrades.',
    'Hecho para la serie rol Nucleaquaria: agrega radiación a océanos y ríos, con nuevos peligros bajo el agua.': 'Made for the Nucleaquaria roleplay series: adds radiation to oceans and rivers, with new underwater dangers.',
    'Permite ponerle camuflajes a tus herramientas.': 'Lets you put camouflages on your tools.',
    'Variaciones de supervivencia y contenido de rol, hecho para la serie WAKAMODS de Zhark.': "Survival variations and roleplay content, made for Zhark's WAKAMODS series.",
    'Reemplaza los minerales normales por versiones florales, con la base de Bare Bones.': 'Replaces normal ores with floral versions, on a Bare Bones base.',
    'Cambia tu armadura y herramientas por versiones florales al estilo Bare Bones.': 'Swaps your armor and tools for floral versions in the Bare Bones style.',
    'Convierte el tótem vanilla en uno con temática de capibara.': 'Turns the vanilla totem into a capybara-themed one.',
    'Capibaras en Minecraft sin mods ni cambiar tu mundo, de la forma más vanilla posible.': 'Capybaras in Minecraft without mods or changing your world, as vanilla as it gets.',
    'Trae guadañas a Minecraft de forma limpia, sin perder la experiencia vanilla.': 'Brings scythes to Minecraft cleanly, without losing the vanilla experience.',
    'Cambiá tu calabaza por algo mucho más monstruoso.': 'Trade your pumpkin for something far more monstrous.',
    'Un pequeño Tótem de la Inmortalidad con forma de estrella.': 'A little star-shaped Totem of Undying.',
    'Mejora Minecraft sin romper lo vanilla, explorando todos los cambios de texturas que permite el juego.': 'Improves Minecraft without breaking vanilla, exploring every texture change the game allows.',
    'Oscurece el hierro del juego para que combine mejor con el entorno.': "Darkens the game's iron so it blends better with the world.",
    'Cambia el inventario, el libro de recetas, la barra rápida, los corazones y la armadura. ¿Listo para la misión?': 'Changes the inventory, recipe book, hotbar, hearts and armor. Ready for the mission?',
    'Recolorea todo el bioma de cerezos con texturas, madera y partículas azules.': 'Recolors the whole Cherry Grove biome with blue textures, wood and particles.',
    'Reemplaza tu armadura por una armadura de capibara. ¿Qué puede ser mejor?': 'Replaces your armor with capybara armor. What could be better?',
    'Rediseña todas las interfaces al estilo Beecraft, con temática de abejas.': 'Redesigns every interface in the Beecraft style, with a bee theme.',
    'Cambia las texturas del diamante por versiones color rosa.': 'Swaps diamond textures for pink versions.',

    // Contacto
    'Comisiones': 'Commissions',
    'Abiertas': 'Open',
    'Cerradas': 'Closed',
    'Lista de espera': 'Waitlist',
    'Comisiones abiertas': 'Commissions open',
    'Comisiones cerradas': 'Commissions closed',
    'Pedir comisión': 'Request a commission',
    'Anotarme en la lista': 'Join the waitlist',
    'Avisame cuando abran': 'Notify me when they open',
    'Disponible': 'Available',
    'No disponible': 'Unavailable',
    'Texture packs': 'Texture packs',
    'Usuario de Discord': 'Discord username',
    'Copiar usuario': 'Copy username',
    'Entrar al servidor de Discord': 'Join the Discord server',
    'Mis redes': 'My socials',
    'Hablemos': "Let's talk",
    '¿Un encargo, una colaboración o una idea?': 'A commission, a collab or an idea?',
    'La forma más rápida de hablar conmigo es Discord.': 'The fastest way to reach me is Discord.',
    'Entrar al Discord': 'Join the Discord',
    'Copiar usuario:': 'Copy username:',
    '¡Usuario copiado! Pegalo en Discord para agregarme.': 'Username copied! Paste it in Discord to add me.'
  };

  var MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  var PATTERNS = [
    [/^(\d+) trabajos?$/, function (m) { return m[1] + (m[1] === '1' ? ' work' : ' works'); }],
    [/^\+(\d+) más$/, function (m) { return '+' + m[1] + ' more'; }],
    [/^Desde (\d{4})(.*)$/, function (m) { return 'Since ' + m[1] + m[2]; }],
    [/^(.+): próximamente$/, function (m) { return tr(m[1]) + ': coming soon'; }],
    [/^Abrir (.+)$/, function (m) { return 'Open ' + m[1]; }],
    [/^Logo de (.+)$/, function (m) { return m[1] + ' logo'; }],
    [/^(\d{1,2}) de (\w+) de (\d{4})$/, function (m) { var i = MESES.indexOf(m[2]); return i < 0 ? null : MONTHS[i] + ' ' + m[1] + ', ' + m[3]; }],
    [/^(\w+) de (\d{4})$/, function (m) { var i = MESES.indexOf(m[1]); return i < 0 ? null : MONTHS[i] + ' ' + m[2]; }]
  ];

  function tr(s) {
    if (!s) return s;
    if (Object.prototype.hasOwnProperty.call(DICT, s)) return DICT[s];
    for (var i = 0; i < PATTERNS.length; i++) {
      var m = PATTERNS[i][0].exec(s);
      if (m) { var r = PATTERNS[i][1](m); if (r != null) return r; }
    }
    // Frases unidas con " · ": traduce cada parte
    if (s.indexOf(' · ') > 0) {
      var parts = s.split(' · '), out = parts.map(tr);
      if (out.some(function (p, j) { return p !== parts[j]; })) return out.join(' · ');
    }
    return s;
  }

  var lang = 'es';
  try { lang = localStorage.getItem('lang') || ''; } catch (e) {}
  if (lang !== 'es' && lang !== 'en') lang = (navigator.language || 'es').toLowerCase().indexOf('en') === 0 ? 'en' : 'es';

  var ATTRS = ['aria-label', 'alt', 'title', 'placeholder'];
  function skip(el) { return !el || el.closest && el.closest('.notranslate, script, style, noscript, [translate="no"]'); }

  function doText(node) {
    if (skip(node.parentElement)) return;
    if (node.__es == null) node.__es = node.nodeValue;
    var raw = node.__es, core = raw.trim();
    if (!core) return;
    var val = lang === 'en' ? raw.replace(core, tr(core)) : raw;
    if (node.nodeValue !== val) node.nodeValue = val;
  }
  function doAttrs(el) {
    if (skip(el)) return;
    ATTRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      var key = '__es_' + a;
      if (el[key] == null) el[key] = el.getAttribute(a);
      var val = lang === 'en' ? tr(el[key]) : el[key];
      if (el.getAttribute(a) !== val) el.setAttribute(a, val);
    });
  }
  function walk(root) {
    if (root.nodeType === 3) { doText(root); return; }
    if (root.nodeType !== 1) return;
    doAttrs(root);
    var it = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var n;
    while ((n = it.nextNode())) { if (n.nodeType === 3) doText(n); else doAttrs(n); }
  }

  // Si un texto cambia después (por ejemplo "Copiar" → "¡Copiado!"), se
  // vuelve a tomar el nuevo texto en español como original.
  var busy = false;
  var mo = new MutationObserver(function (list) {
    if (busy) return;
    busy = true;
    list.forEach(function (m) {
      if (m.type === 'characterData') { m.target.__es = m.target.nodeValue; doText(m.target); }
      else if (m.type === 'attributes') { var el = m.target; el['__es_' + m.attributeName] = el.getAttribute(m.attributeName); doAttrs(el); }
      else m.addedNodes.forEach(walk);
    });
    mo.takeRecords();
    busy = false;
  });

  function apply() {
    document.documentElement.lang = lang;
    busy = true;
    walk(document.body);
    mo.takeRecords();
    busy = false;
    document.querySelectorAll('[data-lang]').forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.lang === lang)); });
  }

  function setLang(l) {
    lang = l;
    try { localStorage.setItem('lang', l); } catch (e) {}
    apply();
  }

  // Selector ES / EN en la barra de arriba
  function mountSwitch() {
    var nav = document.querySelector('.topbar .nav');
    if (!nav || nav.querySelector('.lang')) return;
    var box = document.createElement('div');
    box.className = 'lang notranslate';
    box.setAttribute('role', 'group');
    box.setAttribute('aria-label', 'Idioma / Language');
    box.innerHTML = '<button type="button" data-lang="es" lang="es">ES</button><button type="button" data-lang="en" lang="en">EN</button>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('[data-lang]');
      if (b) setLang(b.dataset.lang);
    });
    nav.appendChild(box);
  }

  function start() {
    mountSwitch();
    apply();
    mo.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();

  window.I18N = { t: tr, set: setLang, get: function () { return lang; } };
})();

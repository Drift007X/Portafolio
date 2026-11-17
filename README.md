# Drift007_ · Portafolio

Portafolio de creador: proyectos, mods, texture packs, skins y renders de Minecraft. Hecho con el estilo **Rift** (variante carbón).

Página publicada con GitHub Pages: `https://drift007x.github.io/Portafolio/`

## Cómo cambiar el contenido

Todo lo que se ve sale de **`data/site.js`**: perfil, redes, proyectos, comisiones y trabajos del portafolio.
Cada sección tiene comentarios en español que explican qué poner.

- **Skins:** guardá el `.png` en `assets/skins/` y agregá una línea en `portafolio` con `categoria: "Skins"`.
  Para que el visor 3D funcione abriendo la página con doble clic, la skin también va en `data/skins.js` (en GitHub Pages no hace falta).
- **Mods / RP:** agregá un bloque con logo, versiones y links de Modrinth y CurseForge.
- **Comisiones:** cambiá `estado` a `"abiertas"`, `"espera"` o `"cerradas"`.
- **Inglés:** las traducciones están en `js/i18n.js` (`"texto en español": "text in English"`).

## Publicar cambios

Desde PowerShell, en esta carpeta:

```
git add .
git commit -m "Actualizo el portafolio"
git push
```

GitHub Pages actualiza la página en un minuto aproximadamente.

## Estructura

```
index.html        portada
proyectos.html    todos los proyectos
portafolio.html   trabajos por categoría y año (visor 3D de skins)
contacto.html     contacto y estado de comisiones
css/style.css     estilo Rift
js/main.js        arma las páginas con los datos
js/i18n.js        selector e idioma ES / EN
data/site.js      todos los datos (lo que se edita)
data/skins.js     copias de las skins para el visor 3D
assets/           imágenes, skins e íconos
```

## Próximo paso

Una app de escritorio en **Tauri** para agregar trabajos, editar datos y publicar con un botón, sin tocar código.

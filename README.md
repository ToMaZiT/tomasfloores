# tomasfloores_ 🌌

Sitio web personal con estética oscura y astronómica. Construido con HTML, CSS y JavaScript vanilla — sin frameworks, sin dependencias.

---

## Vista previa

> *A solas en la inmensidad del cosmos, la melancolía es el susurro de las estrellas.*

Un portfolio de fotografía minimalista con fondo estrellado animado, constelaciones SVG, galería asimétrica y parallax suave.

---

## Estructura

```
tomasfloores/
├── index.html   # Estructura y contenido
├── style.css    # Estilos, animaciones y layout
├── main.js      # Canvas de estrellas, parallax y filtros
└── README.md
```

---

## Características

- **Starfield animado** — canvas con ~220 estrellas que parpadean en tiempo real
- **Constelaciones SVG** con efecto parallax al mover el cursor
- **Galería asimétrica** de 7 cards con layout en grid y overlays degradados
- **Filtros por categoría** — Noche / Bosque / Cielo resaltan las fotos correspondientes
- **Animaciones de entrada** escalonadas (stagger) en todos los bloques
- **Responsive** — layout adaptado para móvil
- Sin dependencias externas (solo Google Fonts)

---

## Uso

1. Cloná el repositorio
   ```bash
   git clone https://github.com/tuusuario/tomasfloores.git
   cd tomasfloores
   ```

2. Abrí `index.html` directamente en el navegador  
   *(no requiere servidor local)*

---

## Personalización

### Agregar tus fotos

En `index.html`, reemplazá la clase de color de cada card por una imagen real:

```html
<!-- Antes -->
<div class="photo-card card-1 sky-warm">

<!-- Después -->
<div class="photo-card card-1">
  <img src="fotos/mi-foto.jpg" alt="descripción">
```

### Cambiar los links de redes sociales

Al final de `index.html`, editá la sección `social-links`:

```html
<a href="https://instagram.com/tuusuario">instagram</a>
<a href="https://open.spotify.com/user/tuusuario">spotify</a>
```

### Cambiar la cita

En `index.html`, sección `.quote-text`:

```html
<p class="quote-text">
  Tu frase aquí.
</p>
```

### Ajustar colores

En `style.css`, modificá las variables CSS en `:root`:

```css
:root {
  --bg-deep:    #14181f;  /* fondo principal */
  --text-main:  #d8d4cc;  /* texto claro */
  --text-dim:   #8a8880;  /* texto apagado */
  --gold:       #c8b890;  /* acento dorado */
}
```

---

## Tecnologías

| | |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 | Grid, animaciones, custom properties |
| JavaScript | Canvas API, eventos, DOM |
| Google Fonts | Cormorant Garamond + Raleway |

---

## Licencia

MIT — libre para usar y modificar.

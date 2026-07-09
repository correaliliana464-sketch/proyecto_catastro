# proyecto_catastro

Portal de accesos rápidos — **Dirección Territorial Santander (IGAC)**.

Página estática (HTML + CSS + JS, sin dependencias externas) que reúne en un
solo lugar los enlaces a los sistemas y aplicaciones de uso diario, con buscador,
tema claro/oscuro y agrupación por categorías.

## Archivos
- `index.html` — estructura de la página.
- `styles.css` — estilos (paleta institucional azul, diseño cartográfico).
- `app.js` — datos de las herramientas y lógica (búsqueda, render, tema).
- `igac2.png`, `Gemini_Generated_Image_*.png` — logo IGAC y mapa de la DT Santander.

## Uso
Abrir `index.html` en el navegador (doble clic). No requiere servidor ni conexión.

## Cómo agregar una herramienta
Añade un objeto al array `TOOLS` en `app.js`:
```js
{ nombre:"...", cat:"...", icon:"login", desc:"...", url:"..." }
```
`cat` debe coincidir con una categoría de `ORDER`; `icon` es una de las claves de `ICONS`.

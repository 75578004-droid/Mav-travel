# Herramientas

Dos utilidades para mantener el sitio. Ninguna hace falta para que la web
funcione: sirven para que las fotos no pesen de más y para que los enlaces
se vean bien al compartirlos.

---

## 1. `actualizar-meta.js` — títulos y vista previa de los enlaces

**Cuándo ejecutarlo:** cada vez que edites `js/data.js`.

```bash
node herramientas/actualizar-meta.js
```

Escribe en cada archivo `.html` el título, la descripción, el icono de
pestaña y las etiquetas que WhatsApp y Facebook leen para armar la vista
previa del enlace. Además genera un archivo `tour-<id>.html` por cada tour,
para que al compartir un viaje se vea ese viaje y no la portada.

**¿Por qué un script y no `js/app.js`?** Porque los rastreadores de WhatsApp
y Facebook no ejecutan JavaScript: solo leen el HTML tal como sale del
servidor. Si esas etiquetas las pusiera `app.js`, el enlace compartido
seguiría sin vista previa.

Si borras o renombras un tour, el script elimina su página suelta.

También escribe `robots.txt` y `sitemap.xml`, que son los que le dicen a
Google qué páginas hay. El sitemap necesita `EMPRESA.dominio`: sin dominio no
se puede escribir, porque las direcciones tienen que ser absolutas, y si había
uno de antes lo borra (un sitemap con direcciones que ya no existen es peor
que ninguno).

Del sitemap quedan fuera a propósito `404.html`, `carrito.html`, `tour.html`
—sola muestra «Tour no encontrado», lo bueno son las `tour-<id>.html`— y
`blog.html` mientras no haya artículos.

Escribe entre los marcadores `<!-- meta:inicio -->` y `<!-- meta:fin -->`:
no edites a mano lo que hay entre ellos, se sobrescribe.

---

## 2. `reducir-fotos.html` — versiones ligeras de las fotos

**Cuándo usarlo:** cada vez que añadas una foto a `img/`.

Ábrelo con doble clic; se abre en el navegador. Arrastra las fotos y te
descarga dos versiones de cada una, de 400 y de 800 px. No sube nada a
ningún sitio: todo se hace en tu equipo.

Después:

1. Mueve los archivos descargados a `img/`, junto a las fotos grandes.
2. Añade la ruta de la foto grande a `FOTOS_PEQUENAS`, en `js/data.js`
   (la propia herramienta te dice qué líneas copiar).

**¿Por qué dos tamaños?** Una tarjeta de tour se ve a unos 350 px, pero las
fotos son de 1400. Un móvil con pantalla densa pide el doble de píxeles de
los que ocupa el hueco, así que con solo la de 400 se quedaría corta y
descargaría la de 1400. La de 800 es la que acaba sirviendo a la mayoría de
los teléfonos.

Si olvidas añadir la ruta a `FOTOS_PEQUENAS` no se rompe nada: esa foto
simplemente se sirve en grande.

---

## Las fotos grandes deben medir 1400 px de ancho

Es la medida que el sitio le declara al navegador para que elija bien entre
los tres tamaños. La herramienta avisa si subes una con otro ancho.

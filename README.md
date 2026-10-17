# MAV Travel

Sitio web de **MAV Travel Viajes y Turismo E.I.R.L.**, agencia de viajes y
operador turístico de Huancayo. 17 destinos en Junín, Pasco, Lima e Ica.

Es un sitio estático: HTML, CSS y JavaScript, sin dependencias ni paso de
compilación. Se abre `index.html` y funciona.

---

## Para cambiar cualquier cosa, edita `js/data.js`

Ese es el único archivo de contenido. Ni los HTML ni `js/app.js` tienen
textos escritos a mano: el nombre de la empresa, los tours, los precios, los
textos legales, los colores de las secciones y hasta los títulos del
navegador salen todos de ahí.

Dentro está documentado bloque por bloque.

Los colores de marca están aparte, en las primeras líneas de `css/styles.css`.

### Después de editar `data.js`

```bash
node herramientas/actualizar-meta.js
```

Reescribe los títulos, la vista previa de los enlaces, `robots.txt`,
`sitemap.xml` y una página por tour. Ver [`herramientas/LEEME.md`](herramientas/LEEME.md).

Si añades fotos, abre `herramientas/reducir-fotos.html` en el navegador para
generar sus versiones ligeras.

---

## Cosas que conviene saber

**Los tours no tienen precio a propósito.** MAV cotiza por WhatsApp. El sitio
muestra "A consultar" y oculta el carrito. En cuanto le pongas un número a un
tour en `data.js`, ese tour pasa a venderse con carrito automáticamente.

**Las fotos de los destinos son de Wikimedia Commons**, con licencia abierta
que **exige citar autor y licencia**. Los créditos están al pie de la página
Nosotros y no se pueden quitar sin reemplazar antes las fotos por otras
propias.

**Cada foto tiene tres tamaños** (1400, 800 y 400 px) y el navegador elige. La
portada en móvil pesa 925 KB en vez de 2,1 MB.

---

## Pendiente antes de publicar

- [ ] El **libro de reclamaciones no envía nada**. Es obligatorio en el Perú y
      la empresa debe responder en 15 días hábiles. Se activa pegando la URL de
      un servicio de formularios en `FORMULARIOS.endpoint`.
- [ ] Los **documentos legales no tienen revisión de abogado**
      (`LEGALES_REVISADOS = false`), y faltan por redactar las cláusulas de
      cancelaciones y de seguro de viaje.
- [ ] Faltan el **correo de la empresa** y las **redes sociales**.

---

## Publicación

Se publica con GitHub Pages desde la rama `main`.

Al apuntar un dominio propio, cambia `EMPRESA.dominio` en `js/data.js` y vuelve
a ejecutar el generador: de ahí salen el `canonical`, la vista previa de los
enlaces y el `sitemap.xml`.

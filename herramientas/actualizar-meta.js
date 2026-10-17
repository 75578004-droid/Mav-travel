/* =====================================================================
   GENERADOR DE METADATOS

   Hace dos cosas:

   1. Escribe en cada archivo .html el título, la descripción y las
      etiquetas Open Graph que WhatsApp, Facebook y los buscadores leen
      para armar la vista previa del enlace.

   2. Genera un archivo `tour-<id>.html` por cada tour de data.js, con su
      propio título, resumen e imagen, para que al compartir un tour se
      vea ese tour y no la portada del sitio. Esos archivos se arman a
      partir de tour.html, así que no se desincronizan: basta con volver
      a ejecutar el script.

   3. Escribe robots.txt y sitemap.xml, que son los que le dicen a Google
      qué páginas hay. El sitemap necesita EMPRESA.dominio: sin él no se
      puede escribir, porque las direcciones tienen que ser absolutas.

   ¿Por qué un script y no js/app.js? Porque los rastreadores de WhatsApp
   y Facebook NO ejecutan JavaScript: solo leen el HTML tal como llega del
   servidor. Si estas etiquetas las pusiera app.js, el enlace compartido
   seguiría sin vista previa.

   USO: después de editar js/data.js, ejecute desde la raíz del proyecto:

       node herramientas/actualizar-meta.js

   El sitio funciona igual sin ejecutarlo; lo único que queda desfasado
   es la vista previa al compartir.
   ===================================================================== */

const fs = require('fs');
const path = require('path');

const raiz = path.join(__dirname, '..');
const ES_PAGINA_DE_TOUR = /^tour-.+\.html$/;

/* ---------- Leer js/data.js sin tener que modificarlo ---------- */
function leerDatos() {
  const codigo = fs.readFileSync(path.join(raiz, 'js', 'data.js'), 'utf8');
  return new Function(`${codigo}\nreturn { EMPRESA, PAGINAS, TOURS };`)();
}

const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* Une el dominio con una ruta relativa, sin barras duplicadas. */
const absoluta = (dominio, ruta) =>
  dominio ? `${dominio.replace(/\/+$/, '')}/${String(ruta).replace(/^\/+/, '')}` : '';

/* ---------- Bloque de etiquetas ---------- */
function construirBloque({ EMPRESA, titulo, descripcion, archivo, imagen }, eol) {
  const url = absoluta(EMPRESA.dominio, archivo === 'index.html' ? '' : archivo);
  const imagenUrl = imagen ? absoluta(EMPRESA.dominio, imagen) : '';

  const lineas = [
    '  <!-- meta:inicio · generado por herramientas/actualizar-meta.js · no editar a mano -->',
    `  <title>${esc(titulo)}</title>`,
    `  <meta name="description" content="${esc(descripcion)}">`,
    '  <link rel="icon" href="img/favicon.svg" type="image/svg+xml">',
  ];

  // La página de error se sirve en cualquier dirección equivocada, así que
  // no se declara canónica de nada ni anuncia una URL propia.
  const esError = archivo === '404.html';

  // La página de error se sirve en cualquier dirección equivocada. Si esa
  // dirección lleva carpetas (/algo/otro), las rutas relativas a css/ y js/
  // apuntarían al sitio equivocado y la página saldría sin estilos. Con
  // <base> se fija la raíz real y deja de importar dónde cayó el visitante.
  if (esError && EMPRESA.dominio) {
    const base = new URL(EMPRESA.dominio.replace(/\/+$/, '') + '/').pathname;
    lineas.push(`  <base href="${esc(base)}">`);
  }

  if (url && !esError) lineas.push(`  <link rel="canonical" href="${esc(url)}">`);

  lineas.push(
    '  <meta property="og:type" content="website">',
    `  <meta property="og:locale" content="${esc(String(EMPRESA.locale).replace('-', '_'))}">`,
    `  <meta property="og:site_name" content="${esc(EMPRESA.nombre)}">`,
    `  <meta property="og:title" content="${esc(titulo)}">`,
    `  <meta property="og:description" content="${esc(descripcion)}">`
  );

  if (url && !esError) lineas.push(`  <meta property="og:url" content="${esc(url)}">`);

  if (imagenUrl) {
    lineas.push(`  <meta property="og:image" content="${esc(imagenUrl)}">`);

    // Las medidas solo se declaran para la imagen general, que sí sabemos
    // que es de 1200x630. Las fotos de tour tienen tamaños distintos y
    // anunciar medidas falsas hace que las redes recorten mal.
    if (imagen === EMPRESA.imagenCompartir) {
      lineas.push(
        '  <meta property="og:image:width" content="1200">',
        '  <meta property="og:image:height" content="630">'
      );
    }

    lineas.push('  <meta name="twitter:card" content="summary_large_image">');
  } else {
    lineas.push('  <meta name="twitter:card" content="summary">');
  }

  lineas.push('  <!-- meta:fin -->');
  // Se respeta el fin de línea del archivo para no mezclar CRLF con LF.
  return lineas.join(eol);
}

const ponerBloque = (html, bloque) =>
  html.includes('<!-- meta:inicio')
    ? html.replace(/[ \t]*<!-- meta:inicio[\s\S]*?<!-- meta:fin -->/, bloque)
    // Primera vez: se reemplaza el <title> y el comentario que lo preceda.
    : html.replace(/(?:[ \t]*<!--[^\r\n]*-->\r?\n)?[ \t]*<title>[\s\S]*?<\/title>/, bloque);

/* ---------- 1. Páginas del sitio ---------- */
function actualizarPaginas(datos) {
  const { EMPRESA, PAGINAS } = datos;
  const archivos = fs
    .readdirSync(raiz)
    .filter((f) => f.endsWith('.html') && !ES_PAGINA_DE_TOUR.test(f))
    .sort();

  let escritos = 0;

  for (const archivo of archivos) {
    const ruta = path.join(raiz, archivo);
    const html = fs.readFileSync(ruta, 'utf8');

    const pagina = html.match(/data-page="([^"]+)"/)?.[1];
    if (!pagina) {
      console.log(`  omitido  ${archivo} (no tiene data-page)`);
      continue;
    }

    const eol = html.includes('\r\n') ? '\r\n' : '\n';
    const titulo = pagina === 'inicio'
      ? `${EMPRESA.nombre} – ${EMPRESA.descripcion}`
      : `${PAGINAS[pagina] ?? ''} – ${EMPRESA.nombre}`;

    const nuevo = ponerBloque(html, construirBloque({
      EMPRESA,
      titulo,
      descripcion: EMPRESA.metaDescripcion,
      archivo,
      imagen: EMPRESA.imagenCompartir,
    }, eol));

    if (nuevo === html) {
      console.log(`  sin cambios  ${archivo}`);
      continue;
    }

    fs.writeFileSync(ruta, nuevo, 'utf8');
    console.log(`  ok  ${archivo}`);
    escritos++;
  }

  return { escritos, total: archivos.length };
}

/* ---------- 2. Una página por tour ---------- */
function generarPaginasDeTour(datos) {
  const { EMPRESA, TOURS } = datos;
  const plantilla = fs.readFileSync(path.join(raiz, 'tour.html'), 'utf8');
  const eol = plantilla.includes('\r\n') ? '\r\n' : '\n';

  const vigentes = new Set(TOURS.map((t) => `tour-${t.id}.html`));

  // Un tour renombrado o eliminado no debe dejar su página suelta.
  for (const archivo of fs.readdirSync(raiz)) {
    if (ES_PAGINA_DE_TOUR.test(archivo) && !vigentes.has(archivo)) {
      fs.unlinkSync(path.join(raiz, archivo));
      console.log(`  borrado  ${archivo} (ese tour ya no existe)`);
    }
  }

  for (const t of TOURS) {
    const archivo = `tour-${t.id}.html`;

    const html = ponerBloque(plantilla, construirBloque({
      EMPRESA,
      titulo: `${t.tipo} – ${t.nombre} | ${EMPRESA.nombre}`,
      descripcion: t.resumen,
      archivo,
      // La foto del tour si la tiene; si no, la imagen general del sitio.
      imagen: t.img || EMPRESA.imagenCompartir,
    }, eol)).replace(
      /<body data-page="tour"[^>]*>/,
      `<body data-page="tour" data-tour="${esc(t.id)}">`
    );

    fs.writeFileSync(path.join(raiz, archivo), html, 'utf8');
    console.log(`  ok  ${archivo}`);
  }

  return TOURS.length;
}

/* ---------- 3. robots.txt y sitemap.xml ---------- */
function generarIndexacion(datos) {
  const dominio = datos.EMPRESA.dominio;

  const robots = [
    'User-agent: *',
    'Allow: /',
    '',
    '# Las herramientas de mantenimiento no pintan nada en un buscador.',
    'Disallow: /herramientas/',
  ];
  if (dominio) robots.push('', `Sitemap: ${absoluta(dominio, 'sitemap.xml')}`);
  fs.writeFileSync(path.join(raiz, 'robots.txt'), robots.join('\n') + '\n', 'utf8');

  if (!dominio) {
    // Sin dominio no hay sitemap posible. Si quedó uno de antes se borra:
    // un sitemap con direcciones que ya no existen es peor que ninguno.
    const viejo = path.join(raiz, 'sitemap.xml');
    if (fs.existsSync(viejo)) {
      fs.unlinkSync(viejo);
      console.log('  borrado  sitemap.xml (ya no hay dominio)');
    }
    return { urls: 0 };
  }

  // Fuera del sitemap lo que no es contenido para buscar:
  //   404.html    la página de error
  //   tour.html   sin ?id= muestra «Tour no encontrado»; lo bueno son las
  //               páginas tour-<id>.html que genera este mismo script
  //   carrito.html  es un paso de compra, no una página que buscar
  //   blog.html   solo si todavía no hay artículos
  const fuera = new Set(['404.html', 'tour.html', 'carrito.html']);
  if (!datos.BLOG?.length) fuera.add('blog.html');

  const archivos = fs
    .readdirSync(raiz)
    .filter((f) => f.endsWith('.html') && !fuera.has(f))
    .sort();

  const urls = archivos.map((archivo) => {
    const ruta = archivo === 'index.html' ? '' : archivo;
    const fecha = fs.statSync(path.join(raiz, archivo)).mtime.toISOString().slice(0, 10);
    return `  <url>\n    <loc>${esc(absoluta(dominio, ruta))}</loc>\n    <lastmod>${fecha}</lastmod>\n  </url>`;
  });

  const xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    + urls.join('\n') + '\n</urlset>\n';

  fs.writeFileSync(path.join(raiz, 'sitemap.xml'), xml, 'utf8');
  return { urls: urls.length };
}

/* ---------- Ejecutar ---------- */
const datos = leerDatos();

console.log('Páginas del sitio:');
const paginas = actualizarPaginas(datos);

console.log('\nPáginas de tour:');
const tours = generarPaginasDeTour(datos);

console.log('\nIndexación:');
const indexacion = generarIndexacion(datos);
console.log('  ok  robots.txt');
console.log(indexacion.urls
  ? `  ok  sitemap.xml (${indexacion.urls} direcciones)`
  : '  omitido  sitemap.xml (hace falta EMPRESA.dominio)');

console.log(`\n${paginas.escritos} de ${paginas.total} páginas actualizadas · ${tours} páginas de tour generadas.`);

if (!datos.EMPRESA.dominio) {
  console.log('AVISO: EMPRESA.dominio está vacío: sin él no se generan canonical, og:url, og:image ni sitemap.xml.');
}
if (!datos.EMPRESA.imagenCompartir) {
  console.log('AVISO: EMPRESA.imagenCompartir está vacío: las páginas sin foto propia saldrán sin imagen.');
}

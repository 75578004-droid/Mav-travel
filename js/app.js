/* =====================================================================
   LÓGICA DEL SITIO
   Arma la cabecera y el pie, dibuja los tours a partir de data.js y
   maneja el carrito (guardado en el navegador con localStorage).
   ===================================================================== */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const params = new URLSearchParams(location.search);
/* Un tour con precio null se cotiza por WhatsApp en vez de venderse
   con carrito. En cuanto se le pone un número vuelve a ser vendible. */
const SIN_PRECIO = 'A consultar';
const hayPrecio = t => t && t.precio != null;
const money = n => (n == null ? SIN_PRECIO : `${EMPRESA.moneda.simbolo} ${Number(n).toFixed(2)}`);
const precioFinal = t => t.oferta ?? t.precio;
const waLink = texto => `https://wa.me/${EMPRESA.whatsapp}?text=${encodeURIComponent(texto)}`;
const tourPorId = id => TOURS.find(t => t.id === id);
/* Fecha de hoy en formato aaaa-mm-dd.
   Se calcula en hora local: toISOString() usa UTC y en el Perú adelanta
   el día desde las 7 de la noche, lo que impedía reservar para hoy. */
const hoyISO = () => {
  const ahora = new Date();
  return new Date(ahora.getTime() - ahora.getTimezoneOffset() * 60000)
    .toISOString().slice(0, 10);
};
/* Cada tour tiene su propia página, generada por herramientas/actualizar-meta.js,
   para que al compartirla se vea ese tour y no la portada. */
const urlTour = id => `tour-${id}.html`;
const destinoPorId = id => DESTINOS.find(d => d.id === id);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* Reemplaza los marcadores {empresa}, {razonSocial}, {ruc},
   {direccion}, {email} y {telefono} por los datos de EMPRESA. */
const falta = nombre => `[falta ${nombre}]`;

const tx = (s) => {
  // Un dato vacío se marca en lugar de dejar el hueco: en un documento
  // legal, "con RUC  y domicilio" pasa desapercibido y se publica así.
  const valores = {
    '{empresa}':     EMPRESA.nombre         || falta('nombre comercial'),
    '{razonSocial}': EMPRESA.razonSocial    || falta('razón social'),
    '{ruc}':         EMPRESA.ruc            || falta('RUC'),
    '{direccion}':   EMPRESA.direcciones[0] || falta('dirección'),
    '{domicilioFiscal}': EMPRESA.domicilioFiscal || EMPRESA.direcciones[0] || falta('domicilio fiscal'),
    '{email}':       EMPRESA.email          || falta('correo electrónico'),
    '{telefono}':    EMPRESA.telefono       || falta('teléfono'),
    // Canal para escribir a la empresa: el correo si lo hay, si no el WhatsApp.
    '{contacto}':    EMPRESA.email
      || (EMPRESA.telefono ? `nuestro WhatsApp ${EMPRESA.telefono.split('·')[0].trim()}` : falta('canal de contacto')),
  };
  return Object.entries(valores)
    .reduce((texto, [marca, valor]) => texto.split(marca).join(valor), String(s));
};

/* Datos de EMPRESA sin los cuales no se puede publicar el sitio: los
   exigen las políticas de privacidad y el libro de reclamaciones. */
const DATOS_OBLIGATORIOS = [
  ['razonSocial', 'la razón social'],
  ['ruc', 'el RUC'],
];

const enumerar = (lista) => lista.length < 2
  ? (lista[0] ?? '')
  : `${lista.slice(0, -1).join(', ')} y ${lista[lista.length - 1]}`;

const avisoDatosFaltantes = () => {
  const faltan = DATOS_OBLIGATORIOS.filter(([campo]) => !EMPRESA[campo]).map(([, nombre]) => nombre);
  if (!faltan.length) return '';
  return `<p class="ok" style="margin-bottom:22px"><b>Faltan datos de la empresa.</b>
    Este documento no se puede publicar sin ${esc(enumerar(faltan))}.
    Complétalos en <code>EMPRESA</code>, dentro de <code>js/data.js</code>.</p>`;
};

const ICON = {
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.6 12h11.2L21 7H6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3z"/><path d="M8 10.5h8M8 13.5h5" stroke="#25d366" stroke-width="1.6" stroke-linecap="round"/></svg>',
  pin: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-6.200 7-11.500a7 7 0 0 0-14 0C5 14.800 12 21 12 21z"/><circle cx="12" cy="9.500" r="2.500"/></svg>',
  facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.500 22v-8h2.700l.400-3.200h-3.100V8.800c0-.9.3-1.500 1.600-1.500h1.700V4.400c-.3 0-1.300-.1-2.400-.1-2.400 0-4 1.400-4 4.100v2.400H7.700V14h2.700v8z"/></svg>',
  instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.500" cy="6.500" r="1" fill="currentColor"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 3c.3 2.300 1.700 3.800 4 4v3c-1.500 0-2.800-.4-4-1.200V15a6 6 0 1 1-6-6v3.100A3 3 0 1 0 12 15V3z"/></svg>',
  mountain: '<svg viewBox="0 0 54 34" fill="currentColor"><path d="M0 34 17 8l6 9 7-17 24 34H40L30 16l-7 18z"/></svg>',
};

/* Devuelve un bloque con la foto, o un degradado si no hay foto.

   Cuando hay foto se emite un <img> de verdad y no un fondo CSS: así la
   describe el lector de pantalla, la indexa Google Imágenes y el navegador
   puede aplazar su carga. `alt` sale del elemento (campo `alt`) o del texto
   que pase quien llama; vacío significa que la imagen es decorativa.

   Si el archivo no existe, se descarta el <img> y queda el degradado,
   igual que antes. */
function media(item, clase = '', alt = '', opciones = {}) {
  if (!item.img) {
    return `<div class="media ${clase}" style="--h:${item.hue ?? 200}"></div>`;
  }

  const { prioritaria = false, sizes = '' } = opciones;
  const texto = esc(item.alt ?? alt);
  const respaldo = "this.closest('.media').classList.remove('has-img'); this.remove();";

  // La foto que ya se ve al entrar se pide cuanto antes; el resto espera.
  // Poner loading="lazy" en la de arriba retrasa justo lo que el visitante
  // está mirando.
  const carga = prioritaria
    ? 'fetchpriority="high" decoding="async"'
    : 'loading="lazy" decoding="async"';

  // Si la foto tiene versiones reducidas se ofrecen todas y el navegador
  // elige según el hueco y la densidad de la pantalla. Hace falta la de
  // 800: sin ella, un móvil denso descarta la de 400 y se baja la de 1400.
  const reducida = ancho => esc(item.img.replace(/\.jpg$/i, `-${ancho}.jpg`));
  const responsiva = FOTOS_PEQUENAS.includes(item.img)
    ? ` srcset="${reducida(400)} 400w, ${reducida(800)} 800w, ${esc(item.img)} 1400w"`
      + ` sizes="${esc(sizes || '(max-width: 600px) 88vw, 400px')}"`
    : '';

  return `<div class="media has-img ${clase}" style="--h:${item.hue ?? 200}">
    <img src="${esc(item.img)}"${responsiva} alt="${texto}" ${carga} onerror="${respaldo}">
  </div>`;
}

/* Titulo del navegador y descripcion: salen de PAGINAS y EMPRESA. */
function meta() {
  const pagina = document.body.dataset.page;
  document.title = pagina === 'inicio'
    ? `${EMPRESA.nombre} – ${EMPRESA.descripcion}`
    : `${PAGINAS[pagina] ?? ''} – ${EMPRESA.nombre}`;

  let tag = $('meta[name="description"]');
  if (!tag) {
    tag = document.createElement('meta');
    tag.name = 'description';
    document.head.append(tag);
  }
  tag.content = EMPRESA.metaDescripcion;
}

function logoHTML() {
  const dentro = EMPRESA.logo
    ? `<img src="${esc(EMPRESA.logo)}" alt="${esc(EMPRESA.nombre)}">`
    : `${ICON.mountain}<b>${esc(EMPRESA.nombre)}</b><small>${esc(EMPRESA.subtitulo)}</small>`;
  return `<a class="logo" href="index.html" aria-label="${esc(EMPRESA.nombre)}">${dentro}</a>`;
}

/* ---------- Carrito ---------- */
const MAX_PERSONAS = 50;

const Cart = {
  /* Lee lo guardado y devuelve siempre una lista utilizable: descarta lo que
     no sea un tour vigente, acota las cantidades y vacía las fechas que ya
     pasaron. Informa de lo que tuvo que corregir.

     Es la pieza clave: antes, un tour retirado del catálogo quedaba en el
     carrito y hacía que la fila n de la tabla no fuera el elemento n del
     carrito, así que editar o quitar una fila afectaba a otra. */
  revisar() {
    let crudo;
    try { crudo = JSON.parse(localStorage.getItem('carrito')); } catch { crudo = null; }
    if (!Array.isArray(crudo)) {
      return { items: [], quitados: 0, vencidas: 0, cambio: crudo != null };
    }

    const hoy = hoyISO();
    const items = [];
    let quitados = 0;
    let vencidas = 0;

    for (const linea of crudo) {
      // Un tour sin precio no se puede cobrar: sale del carrito.
      if (!linea || typeof linea !== 'object' || !hayPrecio(tourPorId(linea.id))) { quitados++; continue; }

      const cant = Math.min(MAX_PERSONAS, Math.max(1, parseInt(linea.cant, 10) || 1));
      let fecha = typeof linea.fecha === 'string' ? linea.fecha : '';
      if (fecha && fecha < hoy) { fecha = ''; vencidas++; }

      items.push({ id: linea.id, cant, fecha });
    }

    const cambio = quitados > 0 || vencidas > 0
      || JSON.stringify(items) !== JSON.stringify(crudo);

    return { items, quitados, vencidas, cambio };
  },

  /* guardar() solo escribe; set() además refresca el contador de la cabecera.
     Separarlos evita que get() -> set() -> badge() -> count() -> get() se
     llamen en círculo. */
  guardar(items) {
    try { localStorage.setItem('carrito', JSON.stringify(items)); } catch { /* sin almacenamiento */ }
  },

  get() {
    const estado = Cart.revisar();
    if (estado.cambio) Cart.guardar(estado.items);
    return estado.items;
  },

  set(items) { Cart.guardar(items); Cart.badge(); },

  add(id, cant = 1, fecha = '') {
    if (!hayPrecio(tourPorId(id))) return;
    const items = Cart.get();
    const igual = items.find(i => i.id === id && i.fecha === fecha);
    if (igual) igual.cant = Math.min(MAX_PERSONAS, igual.cant + cant);
    else items.push({ id, cant: Math.min(MAX_PERSONAS, Math.max(1, cant)), fecha });
    Cart.set(items);
    toast('Tour agregado al carrito');
  },

  count: () => Cart.get().reduce((a, i) => a + i.cant, 0),
  total: () => Cart.get().reduce((a, i) => a + precioFinal(tourPorId(i.id)) * i.cant, 0),
  badge() { $$('.cart-count').forEach(e => e.textContent = Cart.count()); },
};

/* Envía los datos de un formulario al endpoint de FORMULARIOS.
   Devuelve { ok, demo, error }: `demo` significa que no hay endpoint
   configurado y por lo tanto no se envió nada. */
async function enviarFormulario(tipo, datos) {
  if (!FORMULARIOS.endpoint) return { ok: false, demo: true };

  try {
    const res = await fetch(FORMULARIOS.endpoint, {
      method: 'POST',
      // Corta la espera a los 15 segundos: sin esto, un servidor que no
      // responde deja el formulario colgado en "Enviando..." para siempre.
      signal: AbortSignal.timeout?.(15000),
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        tipo,
        sitio: EMPRESA.nombre,
        enviado: new Date().toISOString(),
        ...datos,
      }),
    });
    return res.ok
      ? { ok: true, demo: false }
      : { ok: false, demo: false, error: `el servidor respondió ${res.status}.` };
  } catch (err) {
    return {
      ok: false,
      demo: false,
      error: err.name === 'TimeoutError'
        ? 'el servidor tardó demasiado en responder.'
        : 'no se pudo conectar con el servidor.',
    };
  }
}

function toast(msg) {
  let t = $('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.append(t); }
  t.textContent = msg;
  t.classList.add('on');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => t.classList.remove('on'), 2200);
}

/* ---------- Cabecera y pie (iguales en todas las páginas) ---------- */
function layout() {
  const pagina = document.body.dataset.page;
  const link = (href, texto, id) => `<a href="${href}" class="${pagina === id ? 'active' : ''}">${texto}</a>`;
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="saltar" href="#app">Saltar al contenido</a>
    <button class="menu-btn" aria-label="Abrir menú" aria-expanded="false" aria-controls="menu-principal">${ICON.menu}</button>
    ${logoHTML()}
    <div class="nav-bar">
      <ul class="nav" id="menu-principal">
        <li>${link('index.html', esc(PAGINAS.inicio), 'inicio')}</li>
        <li>${link('nosotros.html', esc(PAGINAS.nosotros), 'nosotros')}</li>
        <li>${link('paquetes.html', esc(PAGINAS.paquetes) + ' ▾', 'paquetes')}
          <ul class="sub">
            ${SEDES.map(s => `<li><a href="paquetes.html?sede=${encodeURIComponent(s)}">Sede ${s}</a></li>`).join('')}
            <li><a href="tours.html">${esc(PAGINAS.tours)}</a></li>
          </ul>
        </li>
        <li>${link('faq.html', esc(PAGINAS.faq), 'faq')}</li>
        ${BLOG.length ? `<li>${link('blog.html', esc(PAGINAS.blog), 'blog')}</li>` : ''}
        <li>${link('contacto.html', esc(PAGINAS.contacto), 'contacto')}</li>
      </ul>
      ${VENTA_CON_CARRITO ? `<a class="cart-link" href="carrito.html" aria-label="Carrito">${ICON.cart}<span class="cart-count">0</span></a>` : ''}
    </div>`;
  document.body.prepend(header);

  // <main> no recibe foco por sí solo: sin esto, el enlace de salto mueve
  // la página pero deja el foco en la cabecera y el siguiente tabulador
  // vuelve al menú.
  $('#app')?.setAttribute('tabindex', '-1');
  const botonMenu = $('.menu-btn');
  botonMenu.onclick = () => {
    const abierto = $('.nav').classList.toggle('open');
    botonMenu.setAttribute('aria-expanded', String(abierto));
  };

  const footer = document.createElement('footer');
  footer.className = 'site-footer';
  footer.innerHTML = `
    <div class="wrap foot-grid">
      <div>
        ${logoHTML()}
        <p><b>${esc(EMPRESA.descripcion)}</b></p>
        <p class="dim">${esc(EMPRESA.eslogan)}</p>
        ${Object.keys(EMPRESA.redes).length ? `<div class="social">
          ${Object.entries(EMPRESA.redes).map(([red, url]) => `<a href="${esc(url)}" aria-label="${red}" target="_blank" rel="noopener">${ICON[red]}</a>`).join('')}
        </div>` : ''}
      </div>
      <div>
        <h4>${esc(TEXTOS.footer.mapa)}</h4>
        <ul>
          <li><a href="index.html">${esc(PAGINAS.inicio)}</a></li>
          <li><a href="nosotros.html">${esc(PAGINAS.nosotros)}</a></li>
          <li><a href="paquetes.html">${esc(PAGINAS.paquetes)}</a></li>
          ${BLOG.length ? `<li><a href="blog.html">${esc(PAGINAS.blog)}</a></li>` : ''}
          <li><a href="contacto.html">${esc(PAGINAS.contacto)}</a></li>
        </ul>
      </div>
      <div>
        <h4>${esc(TEXTOS.footer.legales)}</h4>
        <ul>
          <li><a href="faq.html">${esc(PAGINAS.faq)}</a></li>
          ${Object.entries(LEGALES).map(([clave, doc]) => `<li><a href="legal.html?doc=${clave}">${esc(doc.titulo)}</a></li>`).join('')}
          <li><a href="libro-reclamaciones.html">${esc(PAGINAS.reclamos)}</a></li>
        </ul>
      </div>
      <form class="news" id="boletin">
        <h4 style="font-size:1.4rem">${esc(TEXTOS.footer.boletin.titulo)}</h4>
        <p class="dim">${esc(TEXTOS.footer.boletin.texto)}</p>
        <input type="email" name="correo" required placeholder="Ingresa tu correo electrónico" aria-label="Correo electrónico">
        <button class="btn btn-orange" style="border-radius:8px">${esc(TEXTOS.footer.boletin.boton)}</button>
      </form>
    </div>
    <div class="wrap foot-bottom">
      <span>${[`© ${EMPRESA.anio} ${esc(EMPRESA.nombre)}`, EMPRESA.razonSocial && esc(EMPRESA.razonSocial), EMPRESA.ruc && `RUC ${esc(EMPRESA.ruc)}`].filter(Boolean).join(' · ')}</span>
      ${pagosHTML()}
    </div>`;
  document.body.append(footer);
  $('#boletin').onsubmit = e => {
    e.preventDefault();
    const correo = new FormData(e.target).get('correo');
    e.target.reset();
    enviarFormulario('boletin', { correo });
    toast(TEXTOS.footer.boletin.gracias);
  };

  const wa = document.createElement('a');
  wa.className = 'wa-float';
  wa.href = waLink('Hola, deseo información sobre sus tours.');
  wa.target = '_blank'; wa.rel = 'noopener';
  wa.setAttribute('aria-label', 'Escríbenos por WhatsApp');
  wa.innerHTML = ICON.chat;
  document.body.append(wa);

  Cart.badge();
}

/* ---------- Piezas reutilizables ---------- */
const pagosHTML = () => `<div class="pay">${EMPRESA.mediosPago.map(m => `<span>${esc(m)}</span>`).join('')}</div>`;
const precioHTML = t => !hayPrecio(t)
  ? SIN_PRECIO
  : (t.oferta ? `<del>${money(t.precio)}</del>${money(t.oferta)}` : money(t.precio));

/* Si ningún tour tiene precio, el carrito no tiene sentido y se oculta. */
const VENTA_CON_CARRITO = TOURS.some(hayPrecio);

const tourCard = t => `
  <article class="tour-card">
    <a class="tour-img" href="${urlTour(t.id)}">
      ${media(t, '', t.nombre, { sizes: '(max-width: 600px) 88vw, 350px' })}<span class="tag">${t.tipo}</span>${t.oferta ? '<span class="sale">¡Oferta!</span>' : ''}
    </a>
    <h3><a href="${urlTour(t.id)}">${t.tipo} – ${esc(t.nombre)}</a></h3>
    ${hayPrecio(t) ? '<small>Desde</small>' : ''}
    <p class="price">${precioHTML(t)}</p>
    <div class="tour-actions">
      <a class="btn btn-pink" href="${urlTour(t.id)}">Ver Detalles</a>
      <a class="wa-round" href="${waLink(`Hola, quiero información del tour ${t.tipo} – ${t.nombre}.`)}" target="_blank" rel="noopener" aria-label="Consultar por WhatsApp">${ICON.chat}</a>
    </div>
  </article>`;

const postCard = p => `
  <article class="post-card">
    <a href="blog.html?post=${p.id}">${media(p, '', p.titulo, { sizes: '(max-width: 600px) 88vw, 360px' })}</a>
    <small>${new Date(p.fecha + 'T00:00').toLocaleDateString(EMPRESA.locale, { day: 'numeric', month: 'long', year: 'numeric' })}</small>
    <h3><a href="blog.html?post=${p.id}">${esc(p.titulo)}</a></h3>
    <p>${esc(p.resumen)}</p>
    <a class="more" href="blog.html?post=${p.id}">Leer más</a>
  </article>`;

const pageHero = (titulo, migas = []) => `
  <section class="page-hero"><div class="wrap">
    <h1>${esc(titulo)}</h1>
    <p class="crumbs"><a href="index.html">Inicio</a>${migas.map(m => ' / ' + (m.href ? `<a href="${m.href}">${esc(m.t)}</a>` : esc(m.t))).join('')}</p>
  </div></section>`;

/* ---------- Páginas ---------- */
const PAGES = {

  inicio(app) {
    app.innerHTML = `
      <section class="hero">
        ${SLIDES.map((s, i) => `
          <div class="slide ${i === 0 ? 'on' : ''}">
            ${media(s, '', s.titulo, { prioritaria: i === 0, sizes: '100vw' })}
            <div class="wrap slide-body">
              <span class="badge">${esc(s.etiqueta)}</span>
              <h1>${esc(s.titulo)}</h1>
              <p>${esc(s.texto)}</p>
              <a class="btn btn-${s.color}" href="${urlTour(s.tour)}">${VENTA_CON_CARRITO ? 'Comprar Tour' : 'Ver el tour'}</a>
            </div>
          </div>`).join('')}
        <button class="hero-arrow prev" aria-label="Anterior">‹</button>
        <button class="hero-arrow next" aria-label="Siguiente">›</button>
      </section>

      <section class="section"><div class="wrap">
        <h2 class="section-title">${esc(TEXTOS.inicio.destinos)}</h2>
        <div class="dest-grid">
          ${DESTINOS.map(d => `
            <a class="dest-card" href="tours.html?destino=${d.id}">
              ${media(d, '', `${d.nombre}, ${d.region}`, { sizes: '(max-width: 600px) 88vw, 360px' })}
              <span class="dest-info">${ICON.pin}<span><b>${esc(d.nombre)}</b><small>${esc(d.region)}</small></span></span>
            </a>`).join('')}
        </div>
      </div></section>

      <section class="section" style="padding-top:0"><div class="wrap">
        <div class="row-head">
          <h2 class="section-title">${esc(TEXTOS.inicio.masPedidos)}</h2>
          <div class="row-nav"><button data-dir="-1" aria-label="Anterior">‹</button> <button data-dir="1" aria-label="Siguiente">›</button></div>
        </div>
        <div class="tour-row">${TOURS.filter(t => t.destacado).map(tourCard).join('')}</div>
      </div></section>

      <section class="section" style="padding-top:0"><div class="wrap promo">
        <a class="promo-media" href="${esc(EMPRESA.videoPromo)}" target="_blank" rel="noopener">${media({ hue: 50 })}<span class="play">▶</span></a>
        <div>
          <h2>${esc(TEXTOS.inicio.promo.titulo)}</h2>
          <p>${esc(TEXTOS.inicio.promo.texto)}</p>
          <a class="btn btn-teal" href="${waLink(TEXTOS.inicio.promo.whatsapp)}" target="_blank" rel="noopener">${esc(TEXTOS.inicio.promo.boton)}</a>
        </div>
      </div></section>

      ${TESTIMONIOS.length ? `<section class="section testi"><div class="wrap testi-inner">
        ${logoHTML()}
        <div>
          <h2 class="section-title">${esc(tx(TEXTOS.inicio.experiencia))}</h2>
          <div class="testi-cards">
            ${TESTIMONIOS.map((t, i) => `
              <div class="testi-card">
                <p>"${esc(t.texto)}"</p>
                <div class="who">${media({ hue: 40 + i * 90 }, 'avatar')}<span><b>${esc(t.nombre)}</b><small>${esc(t.ciudad)}</small></span></div>
              </div>`).join('')}
          </div>
        </div>
      </div></section>` : ''}

      <section class="section"><div class="wrap perks">
        ${VENTAJAS.map(v => `<div class="perk"><span class="perk-ico">${v.icono}</span><span><b>${esc(v.titulo)}</b><span>${esc(v.texto)}</span></span></div>`).join('')}
      </div></section>

      ${BLOG.length ? `<section class="section" style="padding-top:0"><div class="wrap">
        <h2 class="section-title">${esc(TEXTOS.inicio.blog)}</h2>
        <div class="blog-grid">${BLOG.slice(0, 3).map(postCard).join('')}</div>
      </div></section>` : ''}

      ${GALERIA.length ? `<section class="section" style="padding-top:0"><div class="wrap">
        <h2 class="section-title center">${esc(TEXTOS.inicio.galeria)}</h2>
        <div class="gallery">${GALERIA.map(g => media(g, '', '', { sizes: '(max-width: 600px) 45vw, 190px' })).join('')}</div>
      </div></section>` : ''}`;

    // Diapositivas: cambio automático, con flechas y con pausa.
    const slides = $$('.slide');
    const hero = $('.hero');

    // Las diapositivas ocupan la pantalla completa, así que su foto va en
    // grande. Cargarlas las tres de golpe son cerca de 850 KB de los que
    // dos tercios no se ven hasta pasados seis segundos: se les quita la
    // fuente y se les devuelve justo antes de que les toque salir.
    slides.forEach((slide, i) => {
      if (i === 0) return;
      const img = slide.querySelector('img');
      if (!img || !img.getAttribute('src')) return;
      img.dataset.src = img.getAttribute('src');
      const conjunto = img.getAttribute('srcset');
      if (conjunto) img.dataset.srcset = conjunto;
      img.removeAttribute('srcset');
      img.removeAttribute('src');
    });

    const activarFoto = (n) => {
      const img = slides[n]?.querySelector('img[data-src]');
      if (!img) return;
      if (img.dataset.srcset) img.srcset = img.dataset.srcset;
      img.src = img.dataset.src;
      delete img.dataset.src;
      delete img.dataset.srcset;
    };
    // A quien pide menos animación no se le mueve solo.
    const sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let actual = 0, reloj, pausado = false;

    const programar = () => {
      clearInterval(reloj);
      if (!sinMovimiento && !pausado) reloj = setInterval(() => ir(actual + 1), 6000);
    };

    const ir = n => {
      slides[actual].classList.remove('on');
      actual = (n + slides.length) % slides.length;
      slides[actual].classList.add('on');
      activarFoto(actual);                              // la que se muestra
      activarFoto((actual + 1) % slides.length);        // y la siguiente, lista
      programar();
    };

    // Se detiene mientras el visitante lo mira o lo recorre con el teclado.
    const pausar = (valor) => { pausado = valor; programar(); };
    hero.addEventListener('mouseenter', () => pausar(true));
    hero.addEventListener('mouseleave', () => pausar(false));
    hero.addEventListener('focusin', () => pausar(true));
    hero.addEventListener('focusout', () => pausar(false));

    $('.hero-arrow.prev').onclick = () => ir(actual - 1);
    $('.hero-arrow.next').onclick = () => ir(actual + 1);
    ir(0);

    // Carrusel de tours
    const fila = $('.tour-row');
    $$('.row-nav button').forEach(b => b.onclick = () => fila.scrollBy({ left: b.dataset.dir * fila.clientWidth * 0.7, behavior: 'smooth' }));
  },

  tours(app) {
    const sede = params.get('sede'), destino = params.get('destino'), orden = params.get('orden') || '';
    let lista = TOURS.filter(t => (!sede || t.sede === sede) && (!destino || t.destino === destino));
    if (orden === 'menor') lista.sort((a, b) => precioFinal(a) - precioFinal(b));
    if (orden === 'mayor') lista.sort((a, b) => precioFinal(b) - precioFinal(a));
    if (orden === 'nombre') lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
    const url = cambios => {
      const p = new URLSearchParams(params);
      Object.entries(cambios).forEach(([k, v]) => v ? p.set(k, v) : p.delete(k));
      const q = p.toString();
      return 'tours.html' + (q ? '?' + q : '');
    };
    const titulo = destino ? destinoPorId(destino)?.nombre ?? 'Tours' : sede ? 'Sede ' + sede : PAGINAS.tours;

    app.innerHTML = `
      ${pageHero(titulo, sede || destino ? [{ t: PAGINAS.tours, href: 'tours.html' }, { t: titulo }] : [{ t: PAGINAS.tours }])}
      <section class="section"><div class="wrap shop">
        <aside class="filters">
          <div>
            <h4>Ciudad de salida</h4>
            <ul>
              <li><a href="${url({ sede: '' })}" class="${!sede ? 'on' : ''}">Todas <span>${TOURS.length}</span></a></li>
              ${SEDES.map(s => `<li><a href="${url({ sede: s })}" class="${sede === s ? 'on' : ''}">${s} <span>${TOURS.filter(t => t.sede === s).length}</span></a></li>`).join('')}
            </ul>
          </div>
          <div>
            <h4>Destinos</h4>
            <ul>
              <li><a href="${url({ destino: '' })}" class="${!destino ? 'on' : ''}">Todos</a></li>
              ${DESTINOS.map(d => `<li><a href="${url({ destino: d.id })}" class="${destino === d.id ? 'on' : ''}">${esc(d.nombre)} <span>${TOURS.filter(t => t.destino === d.id).length}</span></a></li>`).join('')}
            </ul>
          </div>
        </aside>
        <div>
          <div class="shop-bar">
            <span>${lista.length} ${lista.length === 1 ? 'resultado' : 'resultados'}</span>
            <label>Ordenar:
              <select id="orden" class="qty" style="width:auto">
                <option value="">Por defecto</option>
                <option value="menor">Precio: menor a mayor</option>
                <option value="mayor">Precio: mayor a menor</option>
                <option value="nombre">Nombre</option>
              </select>
            </label>
          </div>
          ${lista.length ? `<div class="tour-grid">${lista.map(tourCard).join('')}</div>` : '<p class="empty">No hay tours con esos filtros.</p>'}
        </div>
      </div></section>`;
    $('#orden').value = orden;
    $('#orden').onchange = e => location.href = url({ orden: e.target.value });
  },

  paquetes(app) {
    const sede = params.get('sede');
    const sedes = sede && SEDES.includes(sede) ? [sede] : SEDES;
    app.innerHTML = `
      ${pageHero(sede ? 'Sede ' + sede : PAGINAS.paquetes, sede ? [{ t: PAGINAS.paquetes, href: 'paquetes.html' }, { t: 'Sede ' + sede }] : [{ t: PAGINAS.paquetes }])}
      <section class="section"><div class="wrap">
        ${sedes.map(s => {
          const lista = TOURS.filter(t => t.sede === s);
          return `<div class="group">
            <h2 class="section-title">${esc(EMPRESA.nombre)} ${s}</h2>
            ${lista.length ? `<div class="tour-grid">${lista.map(tourCard).join('')}</div>` : '<p class="empty">Pronto tendremos tours en esta sede.</p>'}
          </div>`;
        }).join('')}
      </div></section>`;
  },

  tour(app) {
    // tour-<id>.html trae el id en el body; tour.html?id= sigue funcionando
    // para los enlaces que ya se compartieron antes.
    const t = tourPorId(params.get('id') ?? document.body.dataset.tour);
    if (!t) {
      app.innerHTML = `${pageHero('Tour no encontrado')}<section class="section"><div class="wrap"><p class="empty">Ese tour no existe. <a class="more" href="tours.html">Ver todos los tours</a></p></div></section>`;
      return;
    }
    document.title = `${t.tipo} – ${t.nombre} | ${EMPRESA.nombre}`;
    const hoy = hoyISO();
    const otros = TOURS.filter(o => o.id !== t.id && o.sede === t.sede).slice(0, 3);
    app.innerHTML = `
      ${pageHero(`${t.tipo} – ${t.nombre}`, [{ t: PAGINAS.tours, href: 'tours.html' }, { t: t.nombre }])}
      <section class="section"><div class="wrap">
        <div class="product">
          ${media(t, 'product-main', t.nombre, { prioritaria: true, sizes: '(max-width: 960px) 90vw, 530px' })}
          <div>
            <h1>${t.tipo} – ${esc(t.nombre)}</h1>
            <p class="price">${precioHTML(t)}</p>
            <p class="summary">${esc(t.resumen)}</p>
            <form class="buy" id="comprar">
              <label class="field">Fecha de viaje<input type="date" name="fecha" min="${hoy}" ${hayPrecio(t) ? 'required' : ''}></label>
              <label class="field">Personas<input class="qty" type="number" name="cant" min="1" max="50" value="1" required></label>
              <button class="btn btn-navy">${hayPrecio(t) ? 'Añadir al carrito' : 'Pedir precio por WhatsApp'}</button>
            </form>
            <a class="btn btn-wa" href="${waLink(`Hola, quiero consultar por el tour ${t.tipo} – ${t.nombre}.`)}" target="_blank" rel="noopener">${ICON.chat.replace('<svg', '<svg width="18" height="18"')} Consultar por WhatsApp</a>
            <div class="meta">
              <span>${esc(TEXTOS.tour.pagos)}</span>
              ${pagosHTML()}
              <span style="margin-top:10px">Categoría: <b>${t.tipo}</b></span>
              <span>Sede de salida: <b><a href="paquetes.html?sede=${encodeURIComponent(t.sede)}">${t.sede}</a></b></span>
              <span>Destino: <b>${esc(destinoPorId(t.destino)?.nombre ?? '')}</b></span>
            </div>
          </div>
        </div>

        <div class="detail">
          <div>
            <h2>${esc(TEXTOS.tour.itinerario)}</h2>
            <ul class="steps">${t.itinerario.map(p => `<li><b>📍 ${esc(p.t)}</b>${p.d ? `<span>${esc(p.d)}</span>` : ''}</li>`).join('')}</ul>
          </div>
          <div>
            ${t.incluye.length ? `<div class="box"><h2>${esc(TEXTOS.tour.incluye)}</h2><ul class="checks yes">${t.incluye.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>` : ''}
            ${t.noIncluye.length ? `<div class="box"><h2>${esc(TEXTOS.tour.noIncluye)}</h2><ul class="checks no">${t.noIncluye.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>` : ''}
          </div>
        </div>

        ${otros.length ? `<h2 class="section-title" style="margin-top:64px">También desde ${t.sede}</h2><div class="tour-grid">${otros.map(tourCard).join('')}</div>` : ''}
      </div></section>`;
    $('#comprar').onsubmit = e => {
      e.preventDefault();
      const f = new FormData(e.target);
      const cant = Math.max(1, parseInt(f.get('cant'), 10) || 1);
      const fecha = f.get('fecha');

      if (hayPrecio(t)) {
        Cart.add(t.id, cant, fecha);
        return;
      }

      // Sin precio publicado: se pide la cotización por WhatsApp.
      const cuando = fecha ? fecha.split('-').reverse().join('/') : 'fecha por definir';
      window.open(waLink(
        `Hola, quiero cotizar el tour ${t.tipo} – ${t.nombre}.\nFecha: ${cuando}\nPersonas: ${cant}`
      ), '_blank', 'noopener');
    };
  },

  carrito(app) {
    const pintar = () => {
      // revisar() ya dejó la lista limpia, así que el índice de cada fila
      // coincide con el del carrito guardado.
      const estado = Cart.revisar();
      if (estado.cambio) Cart.set(estado.items);
      const items = estado.items;

      const avisos = [];
      if (estado.quitados) {
        avisos.push(estado.quitados === 1
          ? 'Se quitó un tour que ya no está disponible.'
          : `Se quitaron ${estado.quitados} tours que ya no están disponibles.`);
      }
      if (estado.vencidas) {
        avisos.push(estado.vencidas === 1
          ? 'Una fecha ya pasó: elija una nueva antes de enviar el pedido.'
          : `${estado.vencidas} fechas ya pasaron: elíjalas de nuevo antes de enviar el pedido.`);
      }
      const aviso = avisos.length
        ? `<p class="ok" style="margin-bottom:22px">${esc(avisos.join(' '))}</p>`
        : '';

      if (!items.length) {
        app.innerHTML = `${pageHero(PAGINAS.carrito, [{ t: PAGINAS.carrito }])}<section class="section"><div class="wrap">${aviso}<p class="empty">${esc(TEXTOS.carrito.vacio)}<br><br><a class="btn" href="tours.html">Ver tours</a></p></div></section>`;
        return;
      }

      const hoy = hoyISO();
      app.innerHTML = `
        ${pageHero(PAGINAS.carrito, [{ t: PAGINAS.carrito }])}
        <section class="section"><div class="wrap">${aviso}</div><div class="wrap two">
          <table class="cart-table">
            <thead><tr><th>Tour</th><th>Fecha</th><th>Personas</th><th>Subtotal</th><th></th></tr></thead>
            <tbody>
              ${items.map((i, n) => { const t = tourPorId(i.id); return `
                <tr>
                  <td><div class="cart-item">${media(t, '', t.nombre, { sizes: '64px' })}<span><b>${t.tipo} – ${esc(t.nombre)}</b><br><small class="note">${money(precioFinal(t))} por persona</small></span></div></td>
                  <td><input class="qty fecha" type="date" min="${hoy}" value="${esc(i.fecha)}" data-f="${n}" aria-label="Fecha de viaje"></td>
                  <td><input class="qty" type="number" min="1" max="${MAX_PERSONAS}" value="${i.cant}" data-n="${n}" aria-label="Personas"></td>
                  <td><b>${money(precioFinal(t) * i.cant)}</b></td>
                  <td><button class="link-x" data-x="${n}" aria-label="Quitar">✕</button></td>
                </tr>`; }).join('')}
            </tbody>
          </table>
          <form class="box" id="pedido">
            <h2 style="font-size:1.2rem;margin-bottom:14px">${esc(TEXTOS.carrito.titulo)}</h2>
            <div style="display:grid;gap:12px">
              <label class="field">Nombres y apellidos<input name="nombre" required></label>
              <label class="field">Celular<input name="cel" type="tel" required pattern="[0-9 +]{9,15}"></label>
            </div>
            <div class="total-row" style="margin-top:18px"><span>Total</span><span>${money(Cart.total())}</span></div>
            <button class="btn btn-wa btn-block">${esc(TEXTOS.carrito.boton)}</button>
            <p class="note" style="margin-top:10px">${esc(TEXTOS.carrito.nota)}</p>
          </form>
        </div></section>`;
      $$('[data-n]').forEach(inp => inp.onchange = () => {
        const all = Cart.get();
        all[inp.dataset.n].cant = Math.min(MAX_PERSONAS, Math.max(1, parseInt(inp.value, 10) || 1));
        Cart.set(all);
        pintar();
      });
      $$('[data-f]').forEach(inp => inp.onchange = () => {
        const all = Cart.get();
        all[inp.dataset.f].fecha = inp.value;
        Cart.set(all);   // no se repinta: la fecha no cambia ningún importe
      });
      $$('[data-x]').forEach(b => b.onclick = () => { const all = Cart.get(); all.splice(b.dataset.x, 1); Cart.set(all); pintar(); });
      $('#pedido').onsubmit = e => {
        e.preventDefault();
        const f = new FormData(e.target);
        // Se relee el carrito: cambiar la fecha no repinta, así que `items`
        // podría tener una fecha vieja y el pedido saldría equivocado.
        const lineas = Cart.get().map(i => {
          const t = tourPorId(i.id);
          const fecha = i.fecha ? i.fecha.split('-').reverse().join('/') : 'fecha por definir';
          return `• ${t.tipo} – ${t.nombre} | ${fecha} | ${i.cant} pers. | ${money(precioFinal(t) * i.cant)}`;
        });
        window.open(waLink(`Hola, soy ${f.get('nombre')} (cel. ${f.get('cel')}). Quiero reservar:\n${lineas.join('\n')}\nTotal: ${money(Cart.total())}`), '_blank', 'noopener');
      };
    };
    pintar();
  },

  nosotros(app) {
    app.innerHTML = `
      ${pageHero(PAGINAS.nosotros, [{ t: PAGINAS.nosotros }])}
      <section class="section"><div class="wrap">
        <h2 class="section-title center">${esc(tx(TEXTOS.nosotros.titulo))}</h2>
        <div class="cards3">
          <div class="box"><h3>${esc(TEXTOS.nosotros.mision.titulo)}</h3><p>${esc(TEXTOS.nosotros.mision.texto)}</p></div>
          <div class="box"><h3>${esc(TEXTOS.nosotros.vision.titulo)}</h3><p>${esc(TEXTOS.nosotros.vision.texto)}</p></div>
        </div>
      </div></section>
      <section class="section" style="padding-top:0"><div class="wrap">
        <h2 class="section-title">${esc(TEXTOS.nosotros.equipo)}</h2>
        <div class="team">${EQUIPO.map(p => `<div>${media(p, '', `${p.nombre}, ${p.cargo}`, { sizes: '(max-width: 600px) 45vw, 200px' })}<b>${esc(p.nombre)}</b><span>${esc(p.cargo)}</span></div>`).join('')}</div>
      </div></section>
      <section class="section" style="padding-top:0"><div class="wrap stats">
        ${CIFRAS.map(c => `<div><b>${c.pre}<span data-n="${c.n}" style="color:inherit;font-size:inherit">0</span>${c.suf}</b><span>${esc(c.texto)}</span></div>`).join('')}
      </div></section>
      ${CREDITOS.length ? `<section class="section" style="padding-top:0"><div class="wrap">
        <h2 class="section-title">Créditos de las fotografías</h2>
        <p class="note" style="margin-bottom:16px;max-width:70ch">
          Las fotos de los destinos son de terceros y se usan con licencia abierta.
          Muestran los lugares, no a clientes ni a la empresa.
        </p>
        <ul class="creditos">${CREDITOS.map(c => `<li>
          <a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.obra)}</a>,
          ${esc(c.autor)},
          <a href="${esc(c.urlLicencia)}" target="_blank" rel="noopener">${esc(c.licencia)}</a>,
          vía Wikimedia Commons</li>`).join('')}</ul>
      </div></section>` : ''}

      <section class="section" style="padding-top:0"><div class="wrap"><div class="cta">
        <h2>${esc(TEXTOS.nosotros.cta.titulo)}</h2><p>${esc(TEXTOS.nosotros.cta.texto)}</p>
        <a class="btn btn-orange" href="tours.html">${esc(TEXTOS.nosotros.cta.boton)}</a>
      </div></div></section>`;
    // Contadores animados al entrar en pantalla
    const ver = new IntersectionObserver(entradas => entradas.forEach(en => {
      if (!en.isIntersecting) return;
      ver.unobserve(en.target);
      const fin = +en.target.dataset.n, inicio = performance.now();
      const paso = ahora => { const k = Math.min(1, (ahora - inicio) / 1200); en.target.textContent = Math.round(fin * k); if (k < 1) requestAnimationFrame(paso); };
      requestAnimationFrame(paso);
    }));
    $$('.stats [data-n]').forEach(e => ver.observe(e));
  },

  contacto(app) {
    app.innerHTML = `
      ${pageHero(PAGINAS.contacto, [{ t: PAGINAS.contacto }])}
      <section class="section"><div class="wrap two">
        <form id="contacto">
          <h2 class="section-title" style="margin-bottom:6px">${esc(TEXTOS.contacto.titulo)}</h2>
          <p class="note" style="margin-bottom:22px">${esc(TEXTOS.contacto.nota)}</p>
          <div class="form-grid">
            <label class="field">Nombres y apellidos<input name="nombre" required></label>
            <label class="field">Celular<input name="cel" type="tel" required pattern="[0-9 +]{9,15}"></label>
            <label class="field">Correo electrónico<input name="correo" type="email" required></label>
            <label class="field">Ciudad<input name="ciudad"></label>
            <label class="field full">Sede<select name="sede" required><option value="">-Selecciona-</option>${SEDES.map(s => `<option>${s}</option>`).join('')}</select></label>
            <label class="field full">Mensaje<textarea name="mensaje" rows="5" required></textarea></label>
            <label class="check full"><input type="checkbox" required> Acepto las <a class="more" href="legal.html?doc=privacidad">políticas de privacidad</a>.</label>
          </div>
          <button class="btn btn-orange" style="margin-top:18px">${esc(TEXTOS.contacto.boton)}</button>
        </form>
        <div style="display:grid;gap:16px">
          ${EMPRESA.direcciones.map((d, i) => `<div class="box info-card"><span class="perk-ico">📍</span><span><b>${EMPRESA.direcciones.length > 1 ? `Dirección ${i + 1}` : 'Dónde estamos'}</b><br>${esc(d)}</span></div>`).join('')}
          <div class="box info-card"><span class="perk-ico">✉️</span><span><b>Escríbenos</b><br>${esc(EMPRESA.telefono)}${
            // Sin correo no se pinta un mailto vacío.
            EMPRESA.email ? `<br><a href="mailto:${esc(EMPRESA.email)}">${esc(EMPRESA.email)}</a>` : ''
          }</span></div>
          ${Object.keys(EMPRESA.redes).length ? `<div class="box"><b>Síguenos:</b>
            <div class="social">${Object.entries(EMPRESA.redes).map(([red, url]) => `<a href="${esc(url)}" aria-label="${red}" style="color:#fff" target="_blank" rel="noopener">${ICON[red]}</a>`).join('')}</div>
          </div>` : ''}
        </div>
      </div></section>`;
    $('#contacto').onsubmit = e => {
      e.preventDefault();
      const f = new FormData(e.target);
      // WhatsApp primero: window.open debe ocurrir dentro del gesto del usuario.
      window.open(waLink(`Hola, soy ${f.get('nombre')} (cel. ${f.get('cel')}, ${f.get('correo')}). Ciudad: ${f.get('ciudad') || '-'}. Sede: ${f.get('sede')}.\n${f.get('mensaje')}`), '_blank', 'noopener');
      enviarFormulario('contacto', Object.fromEntries(f));
    };
  },

  faq(app) {
    app.innerHTML = `
      ${pageHero(PAGINAS.faq, [{ t: PAGINAS.faq }])}
      <section class="section"><div class="wrap faq">
        ${FAQ.map(f => `<details><summary>${esc(f.p)}</summary><p>${esc(f.r)}</p></details>`).join('')}
      </div></section>`;
  },

  blog(app) {
    const post = BLOG.find(p => p.id === params.get('post'));
    app.innerHTML = post
      ? `${pageHero(post.titulo, [{ t: PAGINAS.blog, href: 'blog.html' }, { t: post.titulo }])}
         <section class="section"><div class="wrap article">${media(post, '', post.titulo, { prioritaria: true, sizes: '(max-width: 760px) 90vw, 720px' })}${post.cuerpo.map(p => `<p>${esc(p)}</p>`).join('')}<a class="more" href="blog.html">← Volver al blog</a></div></section>`
      : `${pageHero(PAGINAS.blog, [{ t: PAGINAS.blog }])}<section class="section"><div class="wrap blog-grid">${BLOG.map(postCard).join('')}</div></section>`;
  },

  /* Se muestra cuando el visitante llega a una dirección que no existe:
     normalmente un enlace antiguo de un tour que se renombró. Lo que
     importa es que tenga salida, no que pida disculpas. */
  noencontrado(app) {
    app.innerHTML = `
      ${pageHero(PAGINAS.noencontrado, [{ t: PAGINAS.noencontrado }])}
      <section class="section"><div class="wrap" style="max-width:720px">
        <p style="font-size:1.1rem;margin-bottom:10px">
          Esta página ya no está, o la dirección tiene algún error.
        </p>
        <p class="note" style="margin-bottom:28px">
          Si llegaste desde un enlace que te pasamos hace tiempo, es posible que
          ese viaje haya cambiado de nombre. Desde aquí puedes encontrarlo:
        </p>
        <div style="display:flex;flex-wrap:wrap;gap:14px">
          <a class="btn btn-orange" href="tours.html">Ver los ${TOURS.length} destinos</a>
          <a class="btn" href="index.html">Ir al inicio</a>
          <a class="btn btn-wa" href="${waLink('Hola, buscaba un viaje en su página y el enlace no funciona.')}" target="_blank" rel="noopener">Escribir por WhatsApp</a>
        </div>
      </div></section>`;
  },

  legal(app) {
    const clave = LEGALES[params.get('doc')] ? params.get('doc') : 'privacidad';
    const doc = LEGALES[clave];
    const fecha = new Date(doc.actualizado + 'T00:00')
      .toLocaleDateString(EMPRESA.locale, { day: 'numeric', month: 'long', year: 'numeric' });

    document.title = `${doc.titulo} – ${EMPRESA.nombre}`;

    app.innerHTML = `
      ${pageHero(doc.titulo, [{ t: doc.titulo }])}
      <section class="section"><div class="wrap article">
        ${LEGALES_REVISADOS ? '' : `
          <p class="ok"><b>Borrador sin revisión legal.</b> Un abogado debe revisar este texto
          y ajustarlo a la operación real de ${esc(tx('{razonSocial}'))} antes de publicar el sitio.
          Cuando esté conforme, cambie <code>LEGALES_REVISADOS</code> a <code>true</code> en
          <code>js/data.js</code> para que este aviso desaparezca.</p>`}
        ${avisoDatosFaltantes()}
        <p class="note">Última actualización: ${esc(fecha)}</p>
        ${doc.secciones.map(sec => `
          <h2>${esc(tx(sec.h))}</h2>
          ${sec.p.map(parrafo => `<p>${esc(tx(parrafo))}</p>`).join('')}`).join('')}
      </div></section>`;
  },

  reclamos(app) {
    const docs = '<option value="">Selecciona</option><option>DNI</option><option>CE</option><option>Pasaporte</option><option>RUC</option>';
    app.innerHTML = `
      ${pageHero(PAGINAS.reclamos, [{ t: PAGINAS.reclamos }])}
      <section class="section"><div class="wrap" style="max-width:900px">
        ${avisoDatosFaltantes()}
        <p class="note" style="margin-bottom:24px">${[
          EMPRESA.razonSocial,
          EMPRESA.ruc && `RUC ${EMPRESA.ruc}`,
          EMPRESA.domicilioFiscal || EMPRESA.direcciones[0],
        ].filter(Boolean).map(esc).join(' · ')}<br>* Datos requeridos</p>
        <form id="reclamo">
          <fieldset><legend>Identificación del consumidor reclamante</legend><div class="form-grid">
            <label class="field">Nombre *<input name="nombres" required></label>
            <label class="field">Primer apellido *<input name="paterno" required></label>
            <label class="field">Segundo apellido *<input name="materno" required></label>
            <label class="field">Tipo de documento *<select name="tipo_doc" required>${docs}</select></label>
            <label class="field">Número de documento *<input name="nro_doc" required pattern="[A-Za-z0-9]{8,12}"></label>
            <label class="field">Celular *<input name="cel" type="tel" required pattern="[0-9 +]{9,15}"></label>
            <label class="field">Departamento *<select name="dep" required><option value="">Selecciona</option>${DEPARTAMENTOS.map(d => `<option>${d}</option>`).join('')}</select></label>
            <label class="field">Provincia *<input name="prov" required></label>
            <label class="field">Distrito *<input name="dist" required></label>
            <label class="field">Dirección *<input name="direccion" required></label>
            <label class="field">Referencia<input name="referencia"></label>
            <label class="field">Correo electrónico *<input name="correo" type="email" required></label>
            <label class="check full"><input type="checkbox" name="menor" id="menor"> Soy menor de edad</label>
          </div></fieldset>

          <fieldset id="tutor" hidden><legend>Padre / Madre / Tutor</legend><div class="form-grid">
            <label class="field">Nombre<input name="nombre_tutor"></label>
            <label class="field">Correo electrónico<input name="correo_tutor" type="email"></label>
            <label class="field">Tipo de documento<select name="tipo_doc_tutor">${docs}</select></label>
            <label class="field">Número de documento<input name="nro_doc_tutor"></label>
          </div></fieldset>

          <fieldset><legend>Detalle del reclamo y pedido del consumidor</legend><div class="form-grid">
            <label class="field">Tipo de reclamo *<select name="tipo_reclamo" required><option value="">Selecciona</option><option>Reclamación (1)</option><option>Queja (2)</option></select></label>
            <label class="field">Tipo de consumo *<select name="tipo_consumo" required><option value="">Selecciona</option><option>Producto</option><option>Servicio</option></select></label>
            <label class="field">N.º de pedido *<input name="nro_pedido" required></label>
            <label class="field">Monto reclamado (${esc(EMPRESA.moneda.simbolo)})<input name="monto" type="number" min="0" step="0.01"></label>
            <label class="field">Fecha de compra<input name="fch_compra" type="date"></label>
            <label class="field">Fecha de consumo<input name="fch_consumo" type="date"></label>
            <label class="field full">Descripción del producto o servicio *<textarea name="descripcion" rows="3" required></textarea></label>
            <label class="field full">Detalle de la reclamación o queja *<textarea name="detalle" rows="4" required></textarea></label>
            <label class="field full">Pedido del consumidor *<textarea name="pedido" rows="3" required></textarea></label>
          </div></fieldset>

          <p class="note">(1) Reclamación: disconformidad relacionada con los productos o servicios.<br>(2) Queja: disconformidad no relacionada con los productos o servicios, o malestar respecto a la atención al público.</p>
          <p class="note" style="margin:10px 0 18px">La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para interponer una denuncia ante el Indecopi. El proveedor debe dar respuesta en un plazo no mayor a quince (15) días hábiles improrrogables.</p>
          <label class="check"><input type="checkbox" required> Declaro ser el titular del servicio y que los hechos descritos son verdaderos. *</label>
          <label class="check" style="margin-top:8px"><input type="checkbox" required> He leído y acepto las <a class="more" href="legal.html?doc=privacidad">políticas de privacidad</a>. *</label>
          <button class="btn btn-pink" style="margin-top:20px">Enviar reclamo</button>
        </form>
      </div></section>`;
    $('#menor').onchange = e => $('#tutor').hidden = !e.target.checked;
    $('#reclamo').onsubmit = async e => {
      e.preventDefault();
      const form = e.target;
      const boton = form.querySelector('button');
      const datos = Object.fromEntries(new FormData(form));
      const codigo = 'REC-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6);

      $('#reclamo-error')?.remove();
      const etiqueta = boton.textContent;
      boton.disabled = true;
      boton.textContent = 'Enviando...';

      const envio = await enviarFormulario('reclamo', { codigo, ...datos });

      boton.disabled = false;
      boton.textContent = etiqueta;

      // Si falló el envío no se pierde nada de lo escrito: el formulario sigue ahí.
      if (!envio.ok && !envio.demo) {
        const aviso = document.createElement('p');
        aviso.id = 'reclamo-error';
        aviso.className = 'note';
        aviso.style.cssText = 'margin-top:12px;color:var(--pink);font-weight:500';
        aviso.textContent = `No se pudo registrar su reclamo: ${envio.error} Sus datos siguen aquí, inténtelo nuevamente en unos minutos.`;
        boton.after(aviso);
        aviso.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      const cierre = envio.demo
        ? esc(FORMULARIOS.avisoDemo) + ' Imprima o guarde esta página como constancia.'
        : 'Su reclamo quedó registrado. La empresa debe responderle en un plazo no mayor a quince (15) días hábiles. Imprima o guarde esta página como constancia.';

      form.outerHTML = `
        <div class="ok">
          <h2 style="margin-bottom:8px">Hoja de reclamación ${codigo}</h2>
          <p>${esc(datos.nombres)} ${esc(datos.paterno)} ${esc(datos.materno)} · ${esc(datos.tipo_doc)} ${esc(datos.nro_doc)}</p>
          <p>${esc(datos.tipo_reclamo)} · ${esc(datos.tipo_consumo)} · Pedido ${esc(datos.nro_pedido)}</p>
          <p style="margin-top:10px"><b>Detalle:</b> ${esc(datos.detalle)}</p>
          <p><b>Pedido:</b> ${esc(datos.pedido)}</p>
          <p class="note" style="margin-top:14px">${cierre}</p>
          <button class="btn" style="margin-top:14px" onclick="print()">Imprimir constancia</button>
        </div>`;
      scrollTo({ top: 0, behavior: 'smooth' });
    };
  },
};

document.addEventListener('DOMContentLoaded', () => {
  const pagina = document.body.dataset.page;
  meta();
  PAGES[pagina]?.($('#app'));   // la ficha de tour ajusta su propio titulo
  layout();
});

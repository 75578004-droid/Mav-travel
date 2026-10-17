/* =====================================================================
   DATOS DEL SITIO

   ESTE ES EL ÚNICO ARCHIVO QUE HAY QUE EDITAR PARA CAMBIAR DE AGENCIA.
   Ni los HTML ni app.js tienen textos escritos a mano: todo sale de aquí.

     EMPRESA      datos del negocio, moneda, medios de pago y descripción
                  que aparece en buscadores
     FORMULARIOS  a dónde se envían reclamaciones, contacto y boletín
     PAGINAS      nombre de cada página (título del navegador, menú,
                  encabezados y migas de pan)
     LEGALES      privacidad y términos, texto completo
     TEXTOS       títulos y textos de las secciones
     SEDES · DESTINOS · SLIDES · TOURS · TESTIMONIOS · VENTAJAS ·
     BLOG · GALERIA · EQUIPO · CIFRAS · FAQ   contenido del catálogo
     CREDITOS     autoría de las fotografías con licencia abierta

   Donde escribas {empresa} dentro de TEXTOS se reemplaza solo por el
   nombre de la agencia.

   COLORES: están en css/styles.css, en las primeras líneas.

   PRECIOS: si un tour tiene `precio: null`, el sitio muestra "Precio a
   consultar" y lleva a WhatsApp en lugar del carrito. En cuanto le pongas
   un número, ese tour pasa a venderse con carrito automáticamente.

   IMÁGENES: cada elemento tiene un campo `img`. Si está vacío ('') se
   muestra un degradado de color. Para poner una foto real, copia el
   archivo a la carpeta /img y escribe su ruta, p. ej. img: 'img/tarma.jpg'
   Si el archivo no existe, se vuelve al degradado sin romper la página.

   TEXTO ALTERNATIVO: las fotos se describen solas con el nombre del tour,
   del destino o del artículo. Puede escribir uno propio añadiendo un campo
   `alt` a cualquier elemento; en GALERIA es obligatorio ponerlo, porque
   esas fotos no tienen nombre del que deducirlo.
   ===================================================================== */

const EMPRESA = {
  nombre: 'MAV Travel',
  subtitulo: 'HUANCAYO',
  logo: '',                                   // p. ej. 'img/logo.png'
  eslogan: 'Tu viaje, reservado por escrito.',
  descripcion: 'Viajes y turismo',
  whatsapp: '51971618161',                    // código de país + número, sin + ni espacios
  telefono: '971 618 161 · 931 058 159 · 929 370 777',
  email: '',                                  // RECOMENDADO: sin él, los documentos legales
                                              // remiten al WhatsApp como canal de contacto
  direcciones: ['Casa del Artesano, int. Z-6 · Paseo La Breña 136, esq. Real, Huancayo'],
  redes: {},                                  // FALTAN: facebook, instagram, tiktok
  videoPromo: '#',                            // enlace de YouTube de la promo
  ruc: '20602937276',
  razonSocial: 'MAV TRAVEL VIAJES Y TURISMO E.I.R.L.',
  // Domicilio fiscal tal como figura en SUNAT. Es el que debe aparecer en
  // los documentos legales y en el libro de reclamaciones; `direcciones`
  // es el de cara al público, para que el viajero sepa dónde ir.
  domicilioFiscal: 'Av. Paseo de la Breña Nro. 136, Int. Z-6, Huancayo Cercado, Junín',
  anio: 2026,

  // Descripción que aparece en buscadores y al compartir el enlace.
  metaDescripcion: 'MAV Travel, viajes y turismo en Huancayo. 17 destinos de Junín, Pasco, Lima e Ica: tours de un día y paquetes. Cotiza tu viaje por WhatsApp.',

  // Dirección final del sitio, sin barra al final. Hace falta para que
  // WhatsApp y las redes muestren la vista previa del enlace.
  dominio: 'https://75578004-droid.github.io/Mav-travel',   // al comprar dominio propio, cámbialo aquí y vuelve a correr herramientas/actualizar-meta.js
  // Imagen de la vista previa, 1200x630 px. Ruta dentro del proyecto.
  imagenCompartir: 'img/huaytapallana.jpg',

  moneda: { simbolo: 'S/', codigo: 'PEN' },
  locale: 'es-PE',                            // formato de fechas y números

  mediosPago: ['Yape', 'Plin', 'Visa', 'Mastercard'],
};

/* ---------------------------------------------------------------------
   ENVÍO DE FORMULARIOS

   Mientras `endpoint` esté vacío, el libro de reclamaciones, el formulario
   de contacto y el boletín funcionan en modo demostración: no se envía
   nada a ninguna parte.

   Para activarlos, cree un formulario en un servicio de envío por correo
   (Formspree, Getform, Basin, Web3Forms) o publique su propio script, y
   pegue aquí la URL que le entreguen. El sitio envía los datos por POST
   en formato JSON.

   OJO: el libro de reclamaciones es obligatorio en el Perú y la empresa
   debe responder en un plazo máximo de quince (15) días hábiles. No
   publique el sitio sin configurar esto.
   --------------------------------------------------------------------- */
const FORMULARIOS = {
  endpoint: '',
  avisoDemo: 'Modo demostración: este envío todavía no llega a la empresa. Configure FORMULARIOS.endpoint en js/data.js.',
};

/* Nombre de cada página. El título del navegador se arma solo:
   "Nombre de la página – Nombre de la empresa". El inicio usa
   "Nombre de la empresa – descripción". */
const PAGINAS = {
  inicio:   'Inicio',
  nosotros: 'Nosotros',
  paquetes: 'Paquetes y Full Days',
  tours:    'Todos los Tours',
  tour:     'Tour',
  carrito:  'Carrito',
  blog:     'Blog',
  faq:      'Preguntas Frecuentes',
  contacto: 'Contacto',
  legal:    'Legales',
  reclamos: 'Libro de Reclamaciones',
  noencontrado: 'Página no encontrada',
};

/* ---------------------------------------------------------------------
   DOCUMENTOS LEGALES

   BORRADOR. Están redactados para una agencia de viajes peruana, pero
   un abogado debe revisarlos y ajustarlos a la operación real de la
   empresa antes de publicar el sitio. Mientras LEGALES_REVISADOS sea
   false, cada documento muestra un aviso visible de borrador.

   Dentro de estos textos puedes usar: {empresa}, {razonSocial}, {ruc},
   {direccion}, {domicilioFiscal}, {email}, {telefono} y {contacto}. Se
   reemplazan solos con los datos de EMPRESA.

   {direccion} es la oficina de cara al público; {domicilioFiscal} es el
   que figura en SUNAT y es el que corresponde en la identificación legal.

   {contacto} es el canal para escribir a la empresa: usa el correo si lo
   hay y, si no, el WhatsApp. Así el documento se lee bien en ambos casos.
   --------------------------------------------------------------------- */
const LEGALES_REVISADOS = false;

const LEGALES = {
  privacidad: {
    titulo: 'Políticas de Privacidad',
    actualizado: '2026-10-17',
    secciones: [
      { h: '1. Quién trata sus datos', p: [
        '{razonSocial}, con RUC {ruc} y domicilio fiscal en {domicilioFiscal}, en adelante {empresa}, es la responsable del tratamiento de los datos personales que usted nos proporciona a través de este sitio web, de WhatsApp, del teléfono o de manera presencial en nuestra oficina.',
        'Para cualquier asunto relacionado con sus datos personales puede escribirnos a {contacto} o acercarse a nuestra oficina en {direccion}.',
      ]},
      { h: '2. Qué datos recopilamos', p: [
        'Datos de identificación y contacto: nombres y apellidos, tipo y número de documento, celular, correo electrónico y ciudad de residencia.',
        'Datos necesarios para prestar el servicio: destino, fecha de salida, número de adultos y niños, tipo de grupo, punto de recojo, preferencias alimentarias y condiciones de salud relevantes para actividades de altura o esfuerzo físico.',
        'Datos de facturación: los exigidos para emitir el comprobante de pago correspondiente.',
        'Datos de navegación: este sitio guarda su carrito de compras en el almacenamiento local de su navegador. Esa información permanece en su equipo, no se envía a nuestros servidores y usted puede borrarla limpiando los datos del sitio.',
      ]},
      { h: '3. Para qué los usamos', p: [
        'Responder sus cotizaciones, gestionar y confirmar sus reservas, coordinar el servicio con nuestros operadores, emitir los comprobantes de pago, contactarlo ante cambios o emergencias durante el viaje, y cumplir las obligaciones legales y tributarias que nos corresponden.',
        'Si usted lo autoriza expresamente al suscribirse a nuestro boletín, también usaremos su correo para enviarle promociones y novedades. Puede retirar esa autorización en cualquier momento escribiéndonos a {contacto}.',
      ]},
      { h: '4. Base legal y consentimiento', p: [
        'Tratamos sus datos conforme a la Ley N.º 29733, Ley de Protección de Datos Personales, y su reglamento. Al enviarnos un formulario, escribirnos por WhatsApp o contratar un servicio, usted otorga su consentimiento libre, previo, expreso e informado para el tratamiento descrito en este documento.',
        'El consentimiento no es necesario cuando el tratamiento resulta indispensable para ejecutar el contrato del que usted es parte o para cumplir una obligación legal.',
      ]},
      { h: '5. Con quién los compartimos', p: [
        'Compartimos únicamente los datos necesarios con los proveedores que hacen posible el viaje: empresas de transporte turístico, guías, hoteles, restaurantes, operadores locales y compañías de seguros.',
        'También podemos entregarlos a las autoridades competentes cuando una norma lo exija.',
        'No vendemos ni cedemos sus datos personales con fines comerciales a terceros.',
      ]},
      { h: '6. Banco de datos y plazo de conservación', p: [
        'Sus datos se almacenan en los bancos de datos personales que administra {razonSocial} y se conservan mientras dure la relación comercial y, después, durante los plazos que exigen las normas tributarias y de protección al consumidor. Cumplidos esos plazos, los datos se eliminan o anonimizan.',
      ]},
      { h: '7. Sus derechos', p: [
        'Usted puede ejercer en cualquier momento sus derechos de información, acceso, actualización, rectificación, inclusión, oposición, supresión o cancelación sobre sus datos personales.',
        'Para hacerlo, envíe su solicitud a {contacto} indicando su nombre completo, el número de su documento de identidad y el derecho que desea ejercer, adjuntando copia de su documento. Le responderemos dentro de los plazos que establece la ley.',
        'Si considera que no hemos atendido su solicitud, puede presentar un reclamo ante la Autoridad Nacional de Protección de Datos Personales del Ministerio de Justicia y Derechos Humanos.',
      ]},
      { h: '8. Seguridad', p: [
        'Aplicamos medidas técnicas, organizativas y legales razonables para proteger sus datos frente a pérdida, uso indebido, acceso no autorizado o alteración. El acceso a la información está restringido al personal que la necesita para su trabajo.',
      ]},
      { h: '9. Menores de edad', p: [
        'No recopilamos deliberadamente datos de menores de edad sin la autorización de su padre, madre o tutor. Cuando un menor viaja con nosotros, sus datos los proporciona el adulto responsable de la reserva.',
      ]},
      { h: '10. Cambios en esta política', p: [
        'Podemos actualizar este documento para reflejar cambios en nuestra operación o en la normativa. La versión vigente es siempre la publicada en esta página, con su fecha de actualización.',
      ]},
    ],
  },

  terminos: {
    titulo: 'Términos y Condiciones',
    actualizado: '2026-10-17',
    secciones: [
      { h: '1. Alcance', p: [
        'Estas condiciones regulan la contratación de los tours, paquetes y demás servicios que {empresa}, nombre comercial de {razonSocial} con RUC {ruc}, ofrece a través de este sitio web y de sus canales de atención.',
        'Al solicitar una cotización o reservar un servicio usted declara haber leído y aceptado estos términos.',
      ]},
      { h: '2. Cotización, reserva y confirmación', p: [
        'Los precios de nuestros viajes dependen del destino, de la fecha y del número de pasajeros, por lo que se cotizan de forma individual. El pedido enviado desde el sitio web o por WhatsApp constituye una solicitud de cotización, no una reserva confirmada.',
        'Un asesor le enviará el precio por persona y verificará la disponibilidad de la fecha. La reserva queda confirmada únicamente cuando se registra el pago acordado y usted recibe nuestra confirmación con el punto y la hora de encuentro.',
      ]},
      { h: '3. Precios y pagos', p: [
        'Los precios se expresan en soles, por persona, y corresponden al servicio descrito en cada viaje. Aceptamos Yape, Plin, Visa y Mastercard.',
        'Salvo que se indique lo contrario, el precio no incluye entradas, boletos turísticos, alimentación no señalada ni actividades opcionales.',
        'Emitimos el comprobante de pago que corresponda. Para factura, el titular debe proporcionar su RUC y razón social antes de la emisión.',
      ]},
      { h: '4. Cambios y cancelaciones por parte del viajero', p: [
        'Las solicitudes de cambio de fecha o de cancelación deben enviarse por escrito a nuestro WhatsApp de reservas.',
        'PENDIENTE DE DEFINIR: indique aquí su política real, por ejemplo con cuánta anticipación se aceptan cambios sin costo, qué porcentaje se retiene según los días de anticipación y en qué casos el pago no es reembolsable. Esta cláusula debe ser clara y razonable: el Código de Protección y Defensa del Consumidor, Ley N.º 29571, no admite condiciones abusivas.',
        'La no presentación del viajero en el punto y la hora de encuentro, sin aviso previo, se considera cancelación sin derecho a reembolso.',
      ]},
      { h: '5. Cambios y cancelaciones por parte de la agencia', p: [
        'Podemos modificar el itinerario, el orden de las visitas o los proveedores cuando lo exijan razones de seguridad, clima, estado de las vías, disposiciones de la autoridad o circunstancias ajenas a nuestra voluntad, procurando mantener la calidad y el contenido del servicio contratado.',
        'Si un servicio se cancela por causas atribuibles a {empresa}, usted podrá elegir entre reprogramarlo sin costo o recibir la devolución de lo pagado por ese servicio.',
        'Algunas salidas requieren un número mínimo de pasajeros. Si no se alcanza, se lo comunicaremos con la mayor anticipación posible y podrá reprogramar o solicitar la devolución.',
      ]},
      { h: '6. Responsabilidades del viajero', p: [
        'Presentarse en el punto y la hora de encuentro, y portar su documento de identidad original y vigente durante todo el recorrido.',
        'Informar al momento de reservar cualquier condición de salud, alergia, discapacidad, embarazo o tratamiento médico que pueda verse afectado por la actividad, en especial en los viajes a los nevados y a zonas de altura.',
        'Seguir las indicaciones del guía y respetar las normas de los sitios visitados, las áreas naturales protegidas y las comunidades receptoras. Quien ponga en riesgo su seguridad o la del grupo podrá ser separado de la actividad sin derecho a reembolso.',
        'Custodiar sus objetos personales. No respondemos por pérdidas, olvidos o daños de equipaje y pertenencias.',
      ]},
      { h: '7. Salud y actividades de altura', p: [
        'Varios de nuestros destinos se desarrollan a gran altitud o implican caminatas exigentes, en particular el Nevado Huaytapallana, el Cañón de Shutjo y el Bosque de Piedras de Huayllay. Estas actividades no son recomendables para personas con afecciones cardíacas o respiratorias, hipertensión no controlada, embarazo avanzado u otras condiciones que su médico determine.',
        'La decisión de participar es del viajero, quien declara encontrarse en condiciones de realizar la actividad. Recomendamos aclimatarse con anticipación y consultar a un profesional de la salud antes de viajar.',
      ]},
      { h: '8. Límites de responsabilidad', p: [
        'Respondemos por la correcta prestación de los servicios que organizamos directamente, de acuerdo con la Ley N.º 29571 y la normativa de agencias de viajes y turismo.',
        'No respondemos por hechos de caso fortuito o fuerza mayor ni por circunstancias ajenas a nuestro control, tales como fenómenos climáticos, desastres naturales, bloqueos de vías, paros, huelgas, disposiciones de la autoridad, cierres de sitios turísticos o retrasos de terceros proveedores de transporte.',
        'Tampoco respondemos por los servicios opcionales que el viajero contrate por su cuenta con terceros durante el viaje.',
      ]},
      { h: '9. Seguro de viaje', p: [
        'PENDIENTE DE DEFINIR: indique si sus servicios incluyen algún seguro, con qué cobertura, o si recomienda al viajero contratar uno por su cuenta. Sea preciso: no describa como incluida una cobertura que no lo esté.',
      ]},
      { h: '10. Menores de edad', p: [
        'Los menores de edad viajan bajo la responsabilidad del adulto que realiza la reserva y deben estar acompañados durante todo el recorrido, salvo que se indique otra cosa en la ficha del viaje.',
      ]},
      { h: '11. Uso de imágenes', p: [
        'Durante los recorridos podemos tomar fotografías y videos con fines de difusión. Si usted no desea aparecer en ese material, comuníquelo al guía al inicio de la actividad o escríbanos para retirarlo.',
      ]},
      { h: '12. Reclamos', p: [
        'Si algo no salió como esperaba, escríbanos primero por nuestros canales de atención: buscaremos resolverlo directamente.',
        'Usted también puede registrar su reclamo o queja en nuestro Libro de Reclamaciones virtual, disponible en este sitio. Presentar un reclamo no impide acudir a otras vías de solución de controversias ni es requisito previo para denunciar ante el Indecopi.',
      ]},
      { h: '13. Propiedad intelectual', p: [
        'Los textos y logotipos de este sitio pertenecen a {razonSocial} o se usan con autorización. Las fotografías de los destinos son de terceros y se emplean bajo licencias abiertas: su autoría y licencia están detalladas en la página Nosotros.',
      ]},
      { h: '14. Ley aplicable', p: [
        'Estas condiciones se rigen por las leyes de la República del Perú. Cualquier controversia se someterá a los jueces y tribunales del domicilio de la empresa, salvo que una norma de protección al consumidor disponga lo contrario.',
      ]},
    ],
  },
};

/* Títulos y textos de las secciones. Donde escribas {empresa} se
   reemplaza por el nombre de la agencia. */
const TEXTOS = {
  inicio: {
    destinos:    'Por dónde salimos',
    masPedidos:  'Los más pedidos',
    experiencia: 'Viajeros de {empresa}',
    blog:        'Blog de noticias',
    galeria:     'Lo que vas a ver',
    promo: {
      titulo:   'Viajes de promoción y de empresa',
      texto:    'Colegios, institutos y universidades. También excursiones de empresa. Armamos el programa completo para el grupo: movilidad, destinos, alimentación y hospedaje, desde la misma oficina.',
      boton:    'Pedir una propuesta',
      whatsapp: 'Hola, deseo informes sobre viajes de promoción para un grupo.',
    },
  },

  nosotros: {
    titulo: 'Sé el próximo viajero de {empresa}',
    mision: { titulo: 'Qué hacemos', texto: 'Tours de un día por el valle del Mantaro, la selva central, los nevados y cañones de la sierra, y paquetes de dos días a Oxapampa y a Ica con Paracas. Además de los tours armamos el viaje completo: movilidad, traslados, boletos aéreos y terrestres y reserva de hospedaje, todo coordinado desde la misma oficina.' },
    vision: { titulo: 'Dónde estamos', texto: 'En la Casa del Artesano, interior Z-6, en Paseo La Breña 136, esquina con la calle Real, en el centro de Huancayo. Puedes pasar a preguntar o escribirnos antes de salir de casa.' },
    equipo: 'Quién te atiende',
    cta: { titulo: '¿Te animaste?', texto: 'Escríbenos con tu destino, la fecha y cuántos viajan. Te respondemos con el precio y el horario de salida.', boton: 'Ver los 17 destinos' },
  },

  tour: {
    itinerario: 'Qué visitas',
    incluye:    'Incluye',
    noIncluye:  'No incluye',
    pagos:      'Yape, Plin, Visa y Mastercard',
  },

  contacto: {
    titulo: 'Consultas y reservas',
    nota:   'Fanny o Saúl te responden con el precio por persona y el horario de salida.',
    boton:  'Pedir mi cotización',
  },

  carrito: {
    titulo: 'Finalizar reserva',
    nota:   'Un asesor confirmará la disponibilidad y te indicará cómo pagar.',
    boton:  'Enviar pedido por WhatsApp',
    vacio:  'Tu carrito está vacío.',
  },

  footer: {
    mapa:    'Mapa del Sitio',
    legales: 'Legales',
    boletin: {
      titulo: 'Regístrate',
      texto:  'Suscríbete a nuestro boletín para recibir promociones.',
      boton:  'Suscríbete',
      gracias: '¡Gracias por suscribirte!',
    },
  },
};

/* ---------------------------------------------------------------------
   VERSIONES REDUCIDAS DE LAS FOTOS

   Una tarjeta de tour se ve a unos 350 px, pero las fotos son de 1400.
   Por cada foto de esta lista existen un `-400.jpg` y un `-800.jpg` al
   lado, y el navegador baja el que le convenga.

   ¿Por qué dos y no uno? Porque un móvil con pantalla densa necesita el
   doble de píxeles de los que ocupa el hueco: para una tarjeta de 350 px
   pide 700, la de 400 se le queda corta y se bajaría la de 1400. La de
   800 es la que acaba sirviendo a la mayoría de los teléfonos.

   AL AÑADIR UNA FOTO: si no la incluyes aquí no pasa nada, simplemente se
   sirve en grande. Para generar las versiones reducidas abre
   herramientas/reducir-fotos.html en el navegador.

   Las fotos grandes deben tener 1400 px de ancho; es la medida que se
   le declara al navegador.
   --------------------------------------------------------------------- */
const FOTOS_PEQUENAS = [
  'img/arqueologico.jpg',
  'img/artesanal.jpg',
  'img/city-tour.jpg',
  'img/huancaya.jpg',
  'img/huayllay.jpg',
  'img/huaytapallana.jpg',
  'img/ica-paracas.jpg',
  'img/ingenio.jpg',
  'img/monumental.jpg',
  'img/oxapampa.jpg',
  'img/perene.jpg',
  'img/shutjo.jpg',
  'img/tarma.jpg',
  'img/valle-mantaro.jpg',
  'img/villa-rica.jpg',
];

/* Ciudad de salida. Todos los viajes parten de Huancayo. */
const SEDES = ['Huancayo'];

/* Las cuatro zonas en que se agrupa el folleto. */
const DESTINOS = [
  { id: 'valle',  nombre: 'Valle del Mantaro', region: 'Junín',          hue: 95,  img: 'img/valle-mantaro.jpg' },
  { id: 'sierra', nombre: 'Sierra y alturas',  region: 'Junín y Pasco',  hue: 205, img: 'img/huaytapallana.jpg' },
  { id: 'selva',  nombre: 'Selva central',     region: 'Junín y Pasco',  hue: 140, img: 'img/perene.jpg' },
  { id: 'costa',  nombre: 'Costa',             region: 'Ica',            hue: 35,  img: 'img/ica-paracas.jpg' },
];

/* Diapositivas del inicio. `color` es el color del botón. */
const SLIDES = [
  { etiqueta: 'Full Day', titulo: 'NEVADO HUAYTAPALLANA', texto: 'El glaciar que se ve desde Huancayo, entre lagunas de altura. Salida temprano y retorno el mismo día.', tour: 'huaytapallana', color: 'orange', hue: 205, img: 'img/huaytapallana.jpg' },
  { etiqueta: '2D / 1N', titulo: 'OXAPAMPA', texto: 'La colonia austro-alemana de la selva central: iglesia de Santa Rosa, miradores y el manantial La Virgen.', tour: 'oxapampa', color: 'teal', hue: 140, img: 'img/oxapampa.jpg' },
  { etiqueta: 'Full Day', titulo: 'HUANCAYA', texto: 'Cascadas y lagunas turquesa en Nor Yauyos Cochas, con el cañón de Ushco y el puente colonial.', tour: 'huancaya', color: 'navy', hue: 185, img: 'img/huancaya.jpg' },
];

/* precio = precio por persona · oferta = precio rebajado (null si no hay)
   precio: null significa "a consultar": el tour se cotiza por WhatsApp.
   En cuanto pongas un número, ese tour pasa a venderse con carrito. */
const TOURS = [
  /* ---------- Valle del Mantaro ---------- */
  {
    id: 'city-tour', nombre: 'City Tour Huancayo', tipo: 'Full Day', sede: 'Huancayo', destino: 'valle',
    precio: null, oferta: null, destacado: true, hue: 95, img: 'img/city-tour.jpg',
    resumen: 'Un recorrido por Huancayo: los miradores de la ciudad, las formaciones de arcilla de Torre Torre y los parques de Cochas y de los Sombreros.',
    itinerario: [
      { t: 'Mirador de la ciudad', d: '' },
      { t: 'Torre Torre', d: '' },
      { t: 'Parque de los Sombreros', d: '' },
      { t: 'Parque Cochas', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'monumental', nombre: 'Monumental', tipo: 'Full Day', sede: 'Huancayo', destino: 'valle',
    precio: null, oferta: null, destacado: true, hue: 185, img: 'img/monumental.jpg',
    resumen: 'De Orcotuna a Jauja por el norte del valle, con la danza de la Huaconada, el Cristo Pobre y la Laguna de Paca.',
    itinerario: [
      { t: 'Orcotuna', d: '' },
      { t: 'La Huaconada', d: '' },
      { t: 'Formaciones geológicas', d: '' },
      { t: 'Agave', d: '' },
      { t: 'Plaza de Jauja', d: '' },
      { t: 'Cristo Pobre', d: '' },
      { t: 'Planta lechera', d: '' },
      { t: 'Laguna de Paca', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'artesanal', nombre: 'Artesanal', tipo: 'Full Day', sede: 'Huancayo', destino: 'valle',
    precio: null, oferta: null, destacado: true, hue: 35, img: 'img/artesanal.jpg',
    resumen: 'El valle de los oficios: mate burilado en Cochas, textilería, la truchera de Ingenio y el convento de Santa Rosa de Ocopa.',
    itinerario: [
      { t: 'Piedra Parada', d: '' },
      { t: 'Mate burilado', d: '' },
      { t: 'Cochas', d: '' },
      { t: 'Textilería', d: '' },
      { t: 'Ingenio', d: '' },
      { t: 'Pesca (opcional)', d: '' },
      { t: 'Santa Rosa de Ocopa', d: '' },
      { t: 'Cervecería artesanal', d: '' },
      { t: 'San Jerónimo', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'arqueologico', nombre: 'Arqueológico', tipo: 'Full Day', sede: 'Huancayo', destino: 'valle',
    precio: null, oferta: null, destacado: false, hue: 60, img: 'img/arqueologico.jpg',
    resumen: 'El sur del valle por Chupaca: el mirador de Huamanhuata, el puente de cristal, la laguna Ñahuinpuquio y las ruinas de Arwaturo.',
    itinerario: [
      { t: 'Mirador Huamanhuata', d: '' },
      { t: 'Puente Comuneros', d: '' },
      { t: 'Pozo de la Fertilidad', d: '' },
      { t: 'Puente de cristal', d: '' },
      { t: 'Juegos extremos', d: '' },
      { t: 'Copón', d: '' },
      { t: 'Laguna Ñahuinpuquio', d: '' },
      { t: 'Arwaturo', d: '' },
      { t: 'Chupaca', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'sur-historico', nombre: 'Sur Histórico', tipo: 'Full Day', sede: 'Huancayo', destino: 'valle',
    precio: null, oferta: null, destacado: false, hue: 20, img: '',
    resumen: 'El santuario wari de Wariwilca y su museo, el pelado de maíz en Cocharcas, la casa de Flor Pucarina y el mirador de Cáceres.',
    itinerario: [
      { t: 'Santuario de Wariwilca', d: '' },
      { t: 'Plaza Wariwilca', d: '' },
      { t: 'Museo', d: '' },
      { t: 'Cocharcas y pelado de maíz', d: '' },
      { t: 'Portada de Pucará', d: '' },
      { t: 'Casa Flor Pucarina', d: '' },
      { t: 'Mirador de Cáceres', d: '' },
      { t: 'Sesión de fotos', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'ingenio', nombre: 'Ingenio Extremo', tipo: 'Full Day', sede: 'Huancayo', destino: 'valle',
    precio: null, oferta: null, destacado: false, hue: 155, img: 'img/ingenio.jpg',
    resumen: 'Aventura en Ingenio: puente colgante, tirolina, cuatrimotos y las caídas de agua entre los árboles.',
    itinerario: [
      { t: 'Puente colgante', d: '' },
      { t: 'Cuatrimoto', d: '' },
      { t: 'Caída de agua', d: '' },
      { t: 'Tirolina', d: '' },
      { t: 'Mirador', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'bosque-dorado', nombre: 'Bosque Dorado', tipo: 'Full Day', sede: 'Huancayo', destino: 'valle',
    precio: null, oferta: null, destacado: false, hue: 110, img: 'img/valle-mantaro.jpg',
    resumen: 'El bosque de pinos sobre el valle del Mantaro, con mirador, tirolesa y cuatrimotos.',
    itinerario: [
      { t: 'Mirador', d: '' },
      { t: 'Bosque Dorado', d: '' },
      { t: 'Tirolesa', d: '' },
      { t: 'Bosque de pinos', d: '' },
      { t: 'Cuatrimoto', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },

  /* ---------- Sierra y alturas ---------- */
  {
    id: 'huaytapallana', nombre: 'Nevado Huaytapallana', tipo: 'Full Day', sede: 'Huancayo', destino: 'sierra',
    precio: null, oferta: null, destacado: true, hue: 205, img: 'img/huaytapallana.jpg',
    resumen: 'Subida al glaciar del Huaytapallana, el nevado que se ve desde Huancayo, entre lagunas de altura.',
    itinerario: [
      { t: 'Ascenso al nevado', d: '' },
      { t: 'Lagunas de altura', d: '' },
      { t: 'Glaciar', d: '' },
      { t: 'Sesión de fotos', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'shutjo', nombre: 'Cañón de Shutjo', tipo: 'Full Day', sede: 'Huancayo', destino: 'sierra',
    precio: null, oferta: null, destacado: false, hue: 170, img: 'img/shutjo.jpg',
    resumen: 'Camino a Canchayllo entre puyas de Raimondi hasta el cañón de Shutjo, y baños termales antes del retorno.',
    itinerario: [
      { t: 'Canchayllo', d: '' },
      { t: 'Corivinchos', d: '' },
      { t: 'Puyas de Raimondi', d: '' },
      { t: 'Puente colgante', d: '' },
      { t: 'Camino al cañón', d: '' },
      { t: 'El Perfil', d: '' },
      { t: 'Cañón de Shutjo', d: '' },
      { t: 'Baños termales', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'huancaya', nombre: 'Huancaya', tipo: 'Full Day', sede: 'Huancayo', destino: 'sierra',
    precio: null, oferta: null, destacado: true, hue: 185, img: 'img/huancaya.jpg',
    resumen: 'Las cascadas y lagunas turquesa de Nor Yauyos Cochas, con el cañón de Ushco y el puente colonial de Huancaya.',
    itinerario: [
      { t: 'Puente colgante', d: '' },
      { t: 'Tinco', d: '' },
      { t: 'Cañón de Ushco', d: '' },
      { t: 'Laguna Piquecocha', d: '' },
      { t: 'Puente colonial', d: '' },
      { t: 'Laguna Hualhua', d: '' },
      { t: 'Mirador', d: '' },
      { t: 'Plaza de Huancaya', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'huayllay', nombre: 'Huayllay', tipo: 'Full Day', sede: 'Huancayo', destino: 'sierra',
    precio: null, oferta: null, destacado: false, hue: 45, img: 'img/huayllay.jpg',
    resumen: 'El bosque de piedras de Huayllay, en Pasco: rocas gigantes a más de 4 000 metros, llamas, alpacas y aguas termales.',
    itinerario: [
      { t: 'Bosque de piedras', d: '' },
      { t: 'Llamas y alpacas', d: '' },
      { t: 'Aguas termales', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'tarma', nombre: 'Tarma', tipo: 'Full Day', sede: 'Huancayo', destino: 'sierra',
    precio: null, oferta: null, destacado: false, hue: 25, img: 'img/tarma.jpg',
    resumen: 'Tarma, el santuario del Señor de Muruhuay y la gruta de Huagapo, la caverna más profunda del Perú.',
    itinerario: [
      { t: 'Plaza de Tarma', d: '' },
      { t: 'Santuario del Señor de Muruhuay', d: '' },
      { t: 'Gruta de Huagapo', d: '' },
      { t: 'Almuerzo típico', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },

  /* ---------- Selva central ---------- */
  {
    id: 'perene', nombre: 'Valle de Perené', tipo: 'Full Day', sede: 'Huancayo', destino: 'selva',
    precio: null, oferta: null, destacado: true, hue: 140, img: 'img/perene.jpg',
    resumen: 'Bajada a la selva central por Tarma: las cataratas Bayoz y Velo de la Novia, y una visita a una comunidad asháninka.',
    itinerario: [
      { t: 'Tarma', d: '' },
      { t: 'Ingreso a la selva', d: '' },
      { t: 'Puerto Yurinaki', d: '' },
      { t: 'Catarata Bayoz', d: '' },
      { t: 'Velo de la Novia', d: '' },
      { t: 'Almuerzo típico', d: '' },
      { t: 'Comunidad nativa asháninka', d: '' },
      { t: 'Degustación', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'villa-rica', nombre: 'Villa Rica', tipo: 'Full Day', sede: 'Huancayo', destino: 'selva',
    precio: null, oferta: null, destacado: false, hue: 125, img: 'img/villa-rica.jpg',
    resumen: 'La capital del café: catación en Villa Rica, la catarata El León y un paseo en bote por la laguna El Oconal.',
    itinerario: [
      { t: 'Catarata El León', d: '' },
      { t: 'Mirador', d: '' },
      { t: 'Cafetera gigante', d: '' },
      { t: 'Catación de café', d: '' },
      { t: 'Ictioterapia', d: '' },
      { t: 'El Oconal y paseo en bote', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'orquideas', nombre: 'Paraíso de las Orquídeas', tipo: 'Full Day', sede: 'Huancayo', destino: 'selva',
    precio: null, oferta: null, destacado: false, hue: 320, img: '',
    resumen: 'Senderos, miradores y caídas de agua en el Paraíso de las Orquídeas.',
    itinerario: [
      { t: 'Caídas de agua', d: '' },
      { t: 'Senderos', d: '' },
      { t: 'Miradores', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
  {
    id: 'oxapampa', nombre: 'Oxapampa', tipo: '2D / 1N', sede: 'Huancayo', destino: 'selva',
    precio: null, oferta: null, destacado: true, hue: 150, img: 'img/oxapampa.jpg',
    resumen: 'Dos días en la colonia austro-alemana de Oxapampa: la iglesia de Santa Rosa, el mirador de Mesapata y el manantial La Virgen.',
    itinerario: [
      { t: 'Iglesia Santa Rosa', d: '' },
      { t: 'Mirador Mesapata', d: '' },
      { t: 'Manantial La Virgen', d: '' },
      { t: 'Tunqui Cueva', d: '' },
      { t: 'El Wharapo', d: '' },
      { t: 'Canopy (opcional)', d: '' },
      { t: 'Danzas típicas', d: '' },
      { t: 'Degustación', d: '' },
      { t: 'Plaza', d: '' },
    ],
    incluye: ['1 noche de hotel', '2 almuerzos típicos', '2 días de tours'],
    noIncluye: [],
  },

  /* ---------- Costa ---------- */
  {
    id: 'ica-paracas', nombre: 'Ica y Paracas', tipo: '2D / 1N', sede: 'Huancayo', destino: 'costa',
    precio: null, oferta: null, destacado: true, hue: 35, img: 'img/ica-paracas.jpg',
    resumen: 'Dos días en la costa: el oasis de Huacachina con tubulares y sandboard, la reserva de Paracas y las Islas Ballestas.',
    itinerario: [
      { t: 'Oasis de Huacachina', d: '' },
      { t: 'Tubulares y sandboard', d: '' },
      { t: 'Reserva de Paracas', d: '' },
      { t: 'Islas Ballestas', d: '' },
      { t: 'Bodega de pisco', d: '' },
    ],
    incluye: [],
    noIncluye: [],
  },
];

/* Vacío hasta tener testimonios reales, con permiso de quien los escribió.
   La sección no se muestra mientras esté vacía. */
const TESTIMONIOS = [];

const VENTAJAS = [
  { icono: '🚌', titulo: 'Salidas desde Huancayo', texto: 'Punto de encuentro acordado al confirmar.' },
  { icono: '🗺️', titulo: '17 destinos', texto: 'Valle del Mantaro, sierra, selva central y costa.' },
  { icono: '🎓', titulo: 'Viajes de promoción', texto: 'Colegios, institutos, universidades y empresas.' },
  { icono: '💳', titulo: 'Paga como prefieras', texto: 'Yape, Plin, Visa o Mastercard.' },
];

/* Vacío hasta tener artículos reales. El enlace al blog se oculta
   mientras no haya ninguno. */
const BLOG = [];

const GALERIA = [
  { hue: 205, img: 'img/huaytapallana.jpg', alt: 'Nevado Huaytapallana con una laguna al pie' },
  { hue: 185, img: 'img/huancaya.jpg', alt: 'Cascadas turquesa entre cerros en Huancaya' },
  { hue: 140, img: 'img/perene.jpg', alt: 'Catarata Bayoz con visitantes en la poza' },
  { hue: 45, img: 'img/huayllay.jpg', alt: 'Rocas gigantes del Bosque de Piedras de Huayllay' },
  { hue: 95, img: 'img/valle-mantaro.jpg', alt: 'El valle del Mantaro visto desde lo alto' },
  { hue: 35, img: 'img/ica-paracas.jpg', alt: 'Oasis de Huacachina rodeado de dunas' },
];

const EQUIPO = [
  { nombre: 'Fanny', cargo: 'Reservas · 971 618 161', hue: 185 },
  { nombre: 'Saúl', cargo: 'Reservas · 931 058 159', hue: 35 },
];

const CIFRAS = [
  { n: 17, pre: '', suf: '', texto: 'Destinos en el folleto' },
  { n: 4, pre: '', suf: '', texto: 'Zonas: valle, sierra, selva y costa' },
  { n: 2, pre: '', suf: '', texto: 'Paquetes de 2 días y 1 noche' },
  { n: 6, pre: '', suf: '', texto: 'Servicios además de los tours' },
];

const FAQ = [
  { p: '¿Cuánto cuesta un tour?', r: 'El precio depende del destino, la fecha y cuántos viajan, por eso lo cotizamos uno por uno. Escríbenos por WhatsApp con esos tres datos y te respondemos con el precio por persona y el horario de salida.' },
  { p: '¿Cómo reservo un viaje?', r: 'Eliges el destino, nos dices la fecha y cuántos viajan, y un asesor te confirma la disponibilidad y el precio. La reserva queda hecha cuando registras el pago y recibes la confirmación con el punto y la hora de encuentro.' },
  { p: '¿Qué medios de pago aceptan?', r: 'Yape, Plin, Visa y Mastercard.' },
  { p: '¿Desde dónde salen los tours?', r: 'Todos salen de Huancayo. El punto de encuentro se acuerda al confirmar la reserva. Nuestra oficina está en la Casa del Artesano, interior Z-6, en Paseo La Breña 136.' },
  { p: '¿Hacen viajes para colegios, promociones o empresas?', r: 'Sí. Armamos el programa completo para el grupo: destinos, movilidad, alimentación y hospedaje. Escríbenos con la fecha y el número de personas para preparar una propuesta.' },
  { p: '¿Qué incluyen los paquetes de dos días?', r: 'El paquete a Oxapampa incluye una noche de hotel, dos almuerzos típicos y los dos días de tours. Para Ica y Paracas te detallamos lo que incluye al cotizar.' },
  { p: '¿Alquilan movilidad o hacen traslados?', r: 'Sí. Alquilamos auto, minivan o bus según cuántos viajen, y hacemos traslados al aeropuerto de Jauja, a los terminales de bus y a puntos de la ciudad.' },
  { p: '¿Venden boletos y reservan hospedaje?', r: 'Sí. Vendemos boletos aéreos nacionales y boletos de bus a Lima y otras ciudades, y reservamos hoteles en Huancayo y en el destino.' },
];

/* ---------------------------------------------------------------------
   CRÉDITOS DE LAS FOTOGRAFÍAS

   Las fotos de los destinos son de terceros y se usan con licencia
   abierta. Esas licencias EXIGEN citar autor y licencia: no borre esta
   lista ni la sección donde se muestra sin reemplazar antes las fotos
   por otras propias.

   Las fotos muestran los lugares, no a clientes ni a la empresa.
   --------------------------------------------------------------------- */
const CREDITOS = [
  { obra: 'Peru - Huaytapallana Mountain', autor: 'koln21', licencia: 'CC0', url: 'https://commons.wikimedia.org/w/index.php?curid=50671944', urlLicencia: 'https://creativecommons.org/publicdomain/zero/1.0/deed.en' },
  { obra: 'Torre Torre (Huancayo)', autor: 'Huallallo', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=184378145', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Laguna de paca', autor: 'Martintoy', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/w/index.php?curid=8436480', urlLicencia: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  { obra: 'Convento de Santa Rosa de Ocopa, Concepción 02', autor: 'Guillermo Carlos Gómez', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=184725311', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Arwaturo-Junin-4', autor: 'PsamatheM', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=88508340', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Ingenio - panoramio (1)', autor: 'Heiner Amado Cadillo', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/wiki/File:Ingenio_-_panoramio_(1).jpg', urlLicencia: 'https://creativecommons.org/licenses/by-sa/3.0' },
  { obra: 'Valle del Mantaro visto desde Concepción 02', autor: 'Guillermo Carlos Gómez', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=184130371', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Cañón de Shutjo 25', autor: 'Ordzonhyd Rudyard Tarco Palomino', licencia: 'CC BY 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=157327263', urlLicencia: 'https://creativecommons.org/licenses/by/4.0/' },
  { obra: 'Cascadas de Cabracancha, Reserva Paisajística Nor Yauyos Cochas, en Huancaya, Perú', autor: 'Belgarc', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=194490397', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Bosque de Piedras (Huayllay). 7', autor: 'Jomel Contreras Espinoza', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=123970999', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Tarmaperu1', autor: 'Ottocarotto', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/w/index.php?curid=5536694', urlLicencia: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  { obra: 'CATARATA BALLOZ', autor: 'Perez ñaupa evelyn', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=73911716', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Villa Rica, Peru - panoramio (3)', autor: 'Heiner Amado Cadillo', licencia: 'CC BY-SA 3.0', url: 'https://commons.wikimedia.org/w/index.php?curid=60536010', urlLicencia: 'https://creativecommons.org/licenses/by-sa/3.0/' },
  { obra: 'Vista de Oxapampa desde el Mirador de Chontabamba', autor: 'Ted Harry Tueros Zevallos', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=49434749', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Oasis de Huacachina, Ica, Perú, 2015-07-29, DD 18', autor: 'Diego Delso', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=42789811', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
  { obra: 'Pedro Veli Alfaro burilando en Cochas Chico', autor: 'Ximena Prialé Córdova', licencia: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/w/index.php?curid=188382385', urlLicencia: 'https://creativecommons.org/licenses/by-sa/4.0/' },
];

const DEPARTAMENTOS = ['Amazonas', 'Áncash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao', 'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque', 'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín', 'Tacna', 'Tumbes', 'Ucayali'];

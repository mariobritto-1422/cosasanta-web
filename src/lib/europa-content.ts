// Textos de la portada de /europa (castellano de España, trato de "tú").
// Están separados de la página para poder reutilizarlos en otras secciones.

export const EUROPA_META = {
  title: "cosasanta Europa — Automatización e IA para pymes",
  description:
    "Diagnóstico de automatización e IA y servicios para pymes en España: asistente de WhatsApp, contenido de marca y seguridad básica.",
  url: "https://cosasanta.com/europa",
};

export const EUROPA_NAV = [
  { href: "#diagnostico", label: "Diagnóstico" },
  { href: "#servicios", label: "Servicios" },
  { href: "#contacto", label: "Contacto" },
];

export const CAMBIAR_REGION = { href: "/portal", label: "Cambiar de región" };

export const CTA_CONVERSACION = { href: "#contacto", label: "Reservar mi primera conversación" };

export const EUROPA_HERO = {
  titulo: "Antes de dar el salto, conviene mirar dónde vas a aterrizar.",
  subtitulo: "Tecnología e inteligencia artificial para pymes de España, a tu ritmo y por etapas.",
};

export const EUROPA_DIAGNOSTICO = {
  titulo: "Diagnóstico de automatización e IA",
  intro:
    "Incorporar inteligencia artificial y automatización en tu empresa es un salto tecnológico. Y toda tecnología produce impactos, sobre todo dos: un proceso de implementación y una serie de cambios en cómo se trabaja, en las tareas y en las personas. Ahí es donde se ganan o se pierden la mayoría de los proyectos. Por eso empezamos mirando, no vendiendo.",
  paso1: {
    titulo: "Paso 1 · Primera conversación (gratuita)",
    texto:
      "Una videollamada de 60 minutos para entender tu empresa y señalarte lo más importante. Sales con un resumen breve: dos o tres puntos de dolor, una mejora rápida recomendada y una idea clara de qué conviene profundizar. Sin compromiso y sin que tengas que compartir datos de tu empresa.",
  },
  paso2: {
    titulo: "Paso 2 · Diagnóstico completo",
    intro: "Si quieres ir más a fondo, trabajamos en tres bloques:",
    bloques: [
      {
        titulo: "Cómo funciona hoy tu empresa:",
        texto:
          "tus áreas, tu modelo de negocio, las tareas que se repiten y cómo se recogen y se guardan tus datos.",
      },
      {
        titulo: "Dónde duele y cuánto cuesta:",
        texto:
          "los puntos de dolor, con un análisis cuantitativo y cualitativo de tu empresa y de cada área que elijas.",
      },
      {
        titulo: "Qué cambiar, en qué orden y qué implica:",
        texto:
          "el impacto de cada cambio, las medidas de seguridad y de protección de datos, y las prioridades.",
      },
    ],
    cierre:
      "Te llevas un informe claro, una hoja de ruta ordenada por prioridades y una primera mejora que puedes aplicar ya.",
  },
  precio: {
    titulo: "Precio de lanzamiento, plazas limitadas.",
    texto:
      "Estamos abriendo cosasanta en Europa y trabajamos con 4 empresas al mes para dedicarle a cada una el tiempo que merece. El diagnóstico completo tiene precio de lanzamiento para las primeras empresas, y su importe se descuenta de la implementación si decides continuar en los 60 días siguientes.",
  },
  cierre:
    "No es una auditoría para encontrar fallos. Es un mapa para que decidas con criterio, a tu ritmo y por etapas.",
};

export type EstadoServicio = "Diseñado" | "En desarrollo" | "En piloto" | "Disponible";

export interface ServicioEuropa {
  nombre: string;
  estado: EstadoServicio;
  titular: string;
  frase: string;
  pie?: string;
  href: string; // ficha del servicio
}

export const EUROPA_SERVICIOS = {
  titulo: "Lo que estamos construyendo",
  subtitulo: "Cuatro servicios para pymes de España, cada uno con su estado real.",
  tarjetas: [
    {
      nombre: "Hostelería y comercio",
      href: "/europa/hosteleria",
      estado: "Diseñado",
      titular: "Un asistente de WhatsApp para tu bar, restaurante o tienda.",
      frase:
        "Atiende consultas y solicitudes de reserva mientras tú trabajas, y te prepara borradores para tus redes.",
      pie: "Buscamos primer negocio piloto.",
    },
    {
      nombre: "Inmobiliaria",
      href: "/europa/inmobiliaria",
      estado: "Diseñado",
      titular: "Un asistente de WhatsApp para tu agencia inmobiliaria.",
      frase:
        "Responde a los interesados, ordena los contactos y te prepara las descripciones de los anuncios.",
      pie: "Buscamos primer negocio piloto.",
    },
    {
      nombre: "Contenido y merchandising",
      href: "/europa/contenido-merchandising",
      estado: "En desarrollo",
      titular: "Tu marca, tus publicaciones y, por ahora, tus camisetas.",
      frase:
        "Definimos tu identidad de marca, preparamos tus publicaciones y, si quieres, producimos prendas con ella.",
    },
    {
      nombre: "Ciberseguridad y cumplimiento",
      href: "/europa/ciberseguridad",
      estado: "En desarrollo",
      titular: "Seguridad básica y orden en el cumplimiento, sin complicarte.",
      frase:
        "Implementamos contigo las medidas básicas de seguridad y te ayudamos a preparar la documentación de IA y protección de datos.",
    },
  ] as ServicioEuropa[],
  leyenda:
    "Estados: Diseñado · En desarrollo · En piloto · Disponible. Ninguna tarjeta aparece más avanzada de lo que está.",
  datos:
    "Seguridad y protección de datos desde el diseño: en cada servicio, tú eres el responsable de tus datos y nosotros el encargado, con contrato de encargado de tratamiento.",
};

export const EUROPA_EMAIL = "cosasantaonline@gmail.com";
export const EUROPA_EMAIL_ASUNTO = "Primera conversación — diagnóstico de automatización e IA";

// Enlace mailto a cosasanta con el asunto indicado.
export function mailtoEuropa(asunto: string): string {
  return `mailto:${EUROPA_EMAIL}?subject=${encodeURIComponent(asunto)}`;
}

// Número de WhatsApp de /europa (solo se muestra con SHOW_WHATSAPP en true).
// Provisional: cambiarlo por el número español cuando esté disponible.
export const EUROPA_WHATSAPP = "5492945415186";

export const EUROPA_CONTACTO = {
  titulo: "¿Hablamos?",
  texto: "Escríbenos y reservamos tu primera conversación.",
  botonCorreo: "Escribir un correo",
  botonWhatsapp: "Escribir por WhatsApp",
};

export const EUROPA_PIE = "© 2026 cosasanta";

// --- Fichas de servicio (/europa/[ficha]) ---
// Texto literal. **texto** se muestra en negrita y *texto* en cursiva.

export const FICHA_ETIQUETAS = {
  aplica: "Aplica a: España",
  paraQuienEs: "Para quién es",
  paraQuienNoEs: "Para quién no es",
  queHace: "Qué hace",
  queNoHace: "Qué no hace",
  comoFunciona: "Cómo funciona",
  queAportar: "Qué necesitas aportar",
  unDia: "Un día con el servicio",
  ejemplo: "Ejemplo ficticio",
  sinEsto: "Qué haces hoy sin esto",
  datos: "Datos y seguridad",
  consultar: "Consultar",
  volver: "← Volver a Europa",
};

export interface FichaEuropa {
  slug: string;
  tarjeta: string; // nombre de la tarjeta en /europa (asunto del correo)
  estado: string;
  titulo: string; // H1
  entradilla: string;
  paraQuienEs: string;
  paraQuienNoEs: string;
  queHace: string[];
  queNoHace: string;
  comoFunciona: [string, string, string];
  queAportar: string;
  unDia: string;
  sinEsto: string;
  datos: string[]; // un solo elemento se muestra como párrafo
}

export const EUROPA_FICHAS: FichaEuropa[] = [
  {
    slug: "hosteleria",
    tarjeta: "Hostelería y comercio",
    estado: "Diseñado — buscamos primer negocio piloto",
    titulo: "Un asistente de WhatsApp para tu bar, restaurante o tienda",
    entradilla:
      "Atiende por WhatsApp las consultas y solicitudes de reserva de tus clientes mientras tú trabajas, y te prepara borradores de contenido para tus redes.",
    paraQuienEs:
      "Bares, restaurantes y comercios pequeños de España que ya reciben consultas por WhatsApp y no llegan a contestarlas todas ni a publicar con regularidad.",
    paraQuienNoEs:
      "Si necesitas reservas confirmadas automáticamente, conexión con sistemas como TheFork o CoverManager, cobro de depósitos o gestión de varios locales, esto todavía no lo hace.",
    queHace: [
      "Responde preguntas frecuentes sobre tu negocio: horarios, carta, ubicación, grupos, mascotas. Solo habla de tu negocio.",
      "Recoge solicitudes de reserva (nombre, personas, fecha, hora). Cada una queda como solicitud pendiente de confirmación: el asistente nunca promete una mesa; la confirmas tú.",
      "Te avisa cuando una consulta necesita a una persona.",
      "Prepara borradores de publicaciones para tus redes. Nada se publica sin tu aprobación.",
    ],
    queNoHace:
      "No gestiona reseñas, no se conecta a sistemas de reservas de terceros y no cobra.",
    comoFunciona: [
      "Nos cuentas cómo es tu negocio: horarios, carta, preguntas habituales y el tono (tú o usted).",
      "Te guiamos para conectar un número de WhatsApp Business al asistente.",
      "Recibes un aviso por WhatsApp con cada solicitud y cada borrador, y decides tú.",
    ],
    queAportar:
      "Un número de WhatsApp Business dedicado al asistente, tus horarios, carta y respuestas habituales, y unos minutos al día para confirmar reservas y aprobar publicaciones.",
    unDia:
      "En el bar «La Esquina», un sábado a las 22:40 alguien pregunta si hay terraza y mesa para cuatro al día siguiente. El asistente se presenta como asistente virtual del bar, responde sobre la terraza y anota la solicitud. A la dueña le llega el aviso por WhatsApp y la confirma por la mañana. El martes recibe el borrador de una publicación con el menú del día y lo aprueba.",
    sinEsto:
      "Contestar a mano entre servicios, apuntar reservas en una libreta y publicar en redes cuando hay un hueco.",
    datos: [
      "Está diseñado para que el asistente se identifique como asistente virtual desde el primer mensaje y para etiquetar como generado con IA el contenido que se publique.",
      "Tratamos nombre, teléfono, mensajes y datos de reserva. Tú eres el responsable del tratamiento y nosotros el encargado, con contrato de encargado de tratamiento.",
      "Intervienen proveedores de IA (Anthropic para el texto, fal.ai para las imágenes) y Meta como canal de WhatsApp.",
    ],
  },
  {
    slug: "inmobiliaria",
    tarjeta: "Inmobiliaria",
    estado: "Diseñado — buscamos primer negocio piloto",
    titulo: "Un asistente de WhatsApp para tu agencia inmobiliaria",
    entradilla:
      "Responde a quienes preguntan por tus propiedades, recoge lo que necesitas saber de cada interesado y te prepara las descripciones de los anuncios.",
    paraQuienEs:
      "Agencias inmobiliarias y gestoras de propiedades pequeñas y medianas de España que reciben muchas consultas por WhatsApp y pierden tiempo repitiendo las mismas respuestas.",
    paraQuienNoEs:
      "Si necesitas publicar automáticamente en portales como Idealista o Fotocasa, gestionar las incidencias de tus inquilinos o contar con un CRM integrado, esto todavía no lo hace. Tampoco analiza oportunidades de inversión: no es una herramienta para inversores.",
    queHace: [
      "Responde sobre las propiedades que hayas cargado: precio, disponibilidad y requisitos.",
      "Hace a cada interesado unas preguntas sencillas (presupuesto, plazo, zona) para que sepas quién merece tu llamada primero.",
      "Recoge solicitudes de visita para que las confirmes tú.",
      "Trata de usted a los interesados y se presenta como asistente virtual de tu agencia.",
      "Cuando entra una propiedad nueva, prepara un borrador de descripción para el anuncio y otro de texto breve para redes. Nada se publica sin tu aprobación.",
    ],
    queNoHace:
      "No publica en portales, no gestiona incidencias de inquilinos, no valora inmuebles ni analiza inversiones, y no confirma visitas por sí solo.",
    comoFunciona: [
      "Cargas tus propiedades con datos estructurados: precio, zona, características y requisitos.",
      "Te guiamos para conectar un número de WhatsApp Business al asistente.",
      "Revisas los contactos ya clasificados, decides las visitas y apruebas los borradores.",
    ],
    queAportar:
      "Un número de WhatsApp Business dedicado al asistente, los datos de tus propiedades, tus criterios para clasificar a los interesados y tiempo para atender los contactos.",
    unDia:
      "Un domingo a las 21:15, alguien pregunta por un piso de dos habitaciones de una agencia de barrio. El asistente responde con los datos cargados, pregunta presupuesto y fecha de entrada, y anota una solicitud de visita para el martes. El lunes, la agente ve el contacto ya clasificado y confirma la visita. Esa misma mañana carga un piso nuevo y recibe los borradores del anuncio y del texto para redes.",
    sinEsto:
      "Contestar a mano los mismos mensajes, apuntar interesados en una hoja de cálculo o en una libreta y escribir cada descripción desde cero.",
    datos: [
      "Está diseñado para que el asistente se identifique como asistente virtual desde el primer mensaje y para etiquetar como generado con IA el contenido que se publique.",
      "Tratamos nombre, teléfono, mensajes y preferencias de búsqueda. Tú eres el responsable del tratamiento y nosotros el encargado, con contrato de encargado de tratamiento.",
      "Interviene un proveedor de IA (Anthropic, para el texto) y Meta como canal de WhatsApp.",
    ],
  },
  {
    slug: "contenido-merchandising",
    tarjeta: "Contenido y merchandising",
    estado: "En desarrollo (parte digital) · Diseñado (merchandising)",
    titulo: "Tu marca, tus publicaciones y, por ahora, tus camisetas",
    entradilla:
      "Definimos contigo la identidad de tu marca, te preparamos publicaciones coherentes con ella y, si quieres, producimos prendas con esa misma identidad.",
    paraQuienEs:
      "Pymes que abren un negocio o renuevan su imagen y quieren una identidad clara, contenido para sus redes y prendas con su marca, sin coordinar a tres proveedores distintos.",
    paraQuienNoEs:
      "Si necesitas un logotipo o un manual de marca completo, grandes tiradas con stock propio o merchandising que no sea indumentaria (tazas, cartelería), por ahora esto no lo hace.",
    queHace: [
      "Parte de un cuestionario sobre tu negocio y propone una identidad de marca: colores y tono de voz. La revisas y la apruebas tú.",
      "Prepara una primera tanda de publicaciones (texto e idea de imagen) acordes con esa identidad. Nada se publica sin tu aprobación.",
      "Está diseñado para seguir generando publicaciones cada mes, con un límite.",
      "Merchandising: pedidos de camisetas personalizadas con tu marca. **Por ahora, indumentaria.** Nosotros gestionamos el pedido con un taller de producción en la zona de Madrid.",
    ],
    queNoHace:
      "No crea un logotipo ni un manual de marca completo, no gestiona stock propio y no ofrece todavía otros productos que no sean indumentaria. Los plazos, mínimos y envíos de las prendas se confirman al consultar.",
    comoFunciona: [
      "Respondes un cuestionario sobre tu negocio.",
      "Revisas y apruebas tu identidad de marca.",
      "Recibes tus primeras publicaciones para aprobar y, si quieres, encargas prendas con tu marca.",
    ],
    queAportar:
      "Las respuestas del cuestionario, unos minutos para revisar y aprobar, y, para las prendas, tu diseño o logotipo si ya lo tienes, tallas y cantidades, y una dirección de entrega.",
    unDia:
      "Una tienda de bicicletas que reabre responde el cuestionario un lunes. El martes aprueba sus colores y su tono de voz. El jueves recibe tres borradores para anunciar la reapertura y elige uno. Una semana después encarga veinte camisetas para su equipo con el logotipo de la tienda.",
    sinEsto:
      "Publicar cuando hay un hueco, sin una línea de marca fija, y pedir las prendas a un proveedor distinto cada vez.",
    datos: [
      "Está diseñado para etiquetar como generado con IA el contenido que se publique.",
      "Tratamos datos de tu negocio y de contacto; para las prendas, también nombre y dirección de entrega. Tú eres el responsable del tratamiento y nosotros el encargado, con contrato de encargado de tratamiento.",
      "Para los pedidos de prendas compartimos con el taller de producción solo los datos necesarios para fabricar y entregar el pedido.",
      "Intervienen proveedores de IA (Anthropic para el texto, fal.ai para las imágenes cuando se activen).",
    ],
  },
  {
    slug: "ciberseguridad",
    tarjeta: "Ciberseguridad y cumplimiento",
    estado: "Kit Básico en desarrollo · Cumplimiento «llave en mano» diseñado",
    titulo: "Seguridad básica y orden en el cumplimiento, sin complicarte",
    entradilla:
      "Dos servicios para que tu pequeña empresa trabaje con más tranquilidad con las herramientas digitales y la IA que ya usa.",
    paraQuienEs:
      "Pymes y autónomos con equipos Windows que quieren ordenar lo básico de seguridad y no saben por dónde empezar.",
    paraQuienNoEs:
      "Si necesitas seguridad gestionada las 24 horas, auditorías avanzadas o asesoría legal, no es esto.",
    queHace: [
      "*Kit Básico de seguridad:* implementamos y configuramos contigo la verificación en dos pasos, un gestor de contraseñas, el antivirus del sistema, copias de seguridad, una red WiFi separada para invitados, una formación breve contra el phishing y un documento de respuesta ante incidentes.",
      "*Cumplimiento «llave en mano»:* te ayudamos a preparar avisos de transparencia para tus chatbots, el etiquetado del contenido generado con IA y borradores de documentos de protección de datos, para que los revise tu asesor.",
    ],
    queNoHace:
      "No garantiza que no vayas a sufrir un ataque: ofrecemos la implementación y la configuración de las medidas, no un resultado. **El cumplimiento no es asesoría legal ni garantiza que cumplas la normativa.** Consulta con tu asesor o abogado.",
    comoFunciona: [
      "Revisamos contigo qué cuentas, equipos y herramientas usas.",
      "Implementamos las medidas del kit de forma acompañada.",
      "Te dejamos la formación breve y el documento de respuesta ante incidentes.",
    ],
    queAportar:
      "Acceso a tus equipos y cuentas durante la sesión y un responsable que pueda tomar decisiones.",
    unDia:
      "En una pequeña gestoría, una empleada recibe un correo que imita a su banco. Recuerda la formación, no abre el enlace y avisa. El responsable sigue el documento de respuesta ante incidentes y cambia las contraseñas con su gestor.",
    sinEsto:
      "Lo habitual: la misma contraseña en varias cuentas, sin copias de seguridad fiables, una sola red WiFi para todo y sin un protocolo para cuando algo falla.",
    datos: [
      "Las configuraciones se hacen contigo y las contraseñas las guardas tú en tu gestor, sin que nosotros las conozcamos. Si tratamos datos personales en el servicio, lo hacemos como encargados de tratamiento, con contrato.",
    ],
  },
];

export function fichaEuropa(slug: string): FichaEuropa | undefined {
  return EUROPA_FICHAS.find((f) => f.slug === slug);
}

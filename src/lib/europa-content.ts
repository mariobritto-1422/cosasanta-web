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
}

export const EUROPA_SERVICIOS = {
  titulo: "Lo que estamos construyendo",
  subtitulo: "Cuatro servicios para pymes de España, cada uno con su estado real.",
  tarjetas: [
    {
      nombre: "Hostelería y comercio",
      estado: "Diseñado",
      titular: "Un asistente de WhatsApp para tu bar, restaurante o tienda.",
      frase:
        "Atiende consultas y solicitudes de reserva mientras tú trabajas, y te prepara borradores para tus redes.",
      pie: "Buscamos primer negocio piloto.",
    },
    {
      nombre: "Inmobiliaria",
      estado: "Diseñado",
      titular: "Un asistente de WhatsApp para tu agencia inmobiliaria.",
      frase:
        "Responde a los interesados, ordena los contactos y te prepara las descripciones de los anuncios.",
      pie: "Buscamos primer negocio piloto.",
    },
    {
      nombre: "Contenido y merchandising",
      estado: "En desarrollo",
      titular: "Tu marca, tus publicaciones y, por ahora, tus camisetas.",
      frase:
        "Definimos tu identidad de marca, preparamos tus publicaciones y, si quieres, producimos prendas con ella.",
    },
    {
      nombre: "Ciberseguridad y cumplimiento",
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

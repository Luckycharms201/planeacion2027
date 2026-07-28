/**
 * ÚNICA FUENTE DE VERDAD de la presentación.
 *
 * Estructura: presentación → grupos (radios del hub) → slides.
 * Cada slide tiene un `type` que el <Stage> mapea a un componente.
 * Los contenidos visuales (fotos/videos) usan `placeholders` numerados
 * que se reemplazarán más adelante.
 *
 * El orden de `groups` (y de `slides` dentro de cada grupo) define la
 * secuencia global 1 → N que recorren las flechas ← →.
 */

export const META = {
  // `title` es la etiqueta de la barra superior en las slides bookend
  // (portada y cierre); `subtitle`, el kicker de la portada.
  title: "Ciclo 2025/26",
  subtitle: "Planeación 2027",
  logo: "/brand/logo-rac-blanco.png",
};

/* ---------------- Journey LDG (manejado como slides separadas) ----------------
 * El recorrido se compone de slides reales en la secuencia: una slide de
 * "línea del tiempo" (roadmap) que resalta el punto en turno, seguida de las
 * slides-popup de ese punto. Así la navegación es la lineal de siempre.
 */
const JOURNEY_POINTS = [
  { title: "Convocatoria / Nominación", sub: "Se abre la convocatoria y la comunidad nomina a sus candidatos." },
  { title: "Validación de Perfil", sub: "Se revisa el perfil de los nominados que cumplen requisitos." },
  { title: "Sesión Informativa", sub: "Los seleccionados conocen el alcance del programa." },
  { title: "Carta de Compromiso", sub: "Firman su compromiso como Líderes de Generación." },
  { title: "Ceremonia de Bienvenida", sub: "Evento donde se nombra a los nuevos líderes de generación." },
  { title: "Eventos de PST", sub: "Participan en los eventos Por Siempre Tec." },
  { title: "Seguimiento", sub: "Reuniones anuales de líderes de generación." },
];

const JOURNEY_RESULTS = [
  { period: "Ago–Dic 2024", lideres: 29, participacion: 17 },
  { period: "Feb–Jun 2025", lideres: 90, participacion: 33 },
  { period: "Ago–Dic 2025", lideres: 52, participacion: 42 },
];

const JOURNEY_PST = {
  heading: "¿Cómo colabora EXATEC y LDG en los eventos de Por Siempre Tec?",
  events: [
    {
      name: "Kickoff",
      logo: { top: "KICKOFF" },
      items: [
        { who: "EXATEC", what: "Lanzamiento de convocatoria y nominación a Líderes de Generación" },
      ],
    },
    {
      name: "Patada del Éxito",
      logo: { top: "PATADA DEL ÉXITO" },
      items: [
        { who: "LDG", what: "Entrega de fotografías de Líderes de Generación a Directores de Carrera" },
      ],
    },
    {
      name: "Ceremonia de la Luz",
      logo: { top: "CEREMONIA DE LA LUZ" },
      items: [
        { who: "LDG", what: "Depósito de cartas en la cápsula del tiempo" },
        { who: "EXATEC", what: "Discurso del mundo EXATEC por Karla López + video reflexivo sobre la importancia de la comunidad" },
      ],
    },
  ],
};

const JOURNEY_KICKER = "El camino del Líder de Generación";
// slide de línea del tiempo resaltando el punto `i`
const journeyRoadmap = (i) => ({
  id: `ldg-roadmap-${i + 1}`,
  type: "journey",
  kicker: JOURNEY_KICKER,
  title: "Journey LDG",
  points: JOURNEY_POINTS,
  results: JOURNEY_RESULTS,
  highlight: i,
});
const journeyPopup = (id, fields) => ({ id, type: "journeyPopup", ...fields });

export const GROUPS = [
  {
    id: "regreso",
    name: "Regreso a Casa",
    short: "RAC",
    // posición orbital en el hub (se afina en Checkpoint 2)
    hub: { angle: -90 },
    slides: [
      {
        id: "rac-portada",
        type: "cover",
        title: "Regreso a Casa",
        kicker: "Rediseño de Experiencia · Monterrey",
      },
      {
        id: "rac-tours",
        type: "tours",
        title: "Tours",
        kicker: "Regreso a Casa",
        sections: [
          {
            heading: "Identidad",
            body: "Se renovó la identidad visual de los tours para alinearla con la imagen del evento y conectar mejor con los recuerdos de los egresados.",
            keywords: ["identidad visual", "recuerdos de los egresados"],
          },
          {
            heading: "Nueva logística",
            body: "Se rediseñó la logística mediante rutas optimizadas, horarios estratégicos para la fotografía en el mural y la asignación de embajadores afines a la carrera de los egresados.",
            keywords: ["rutas optimizadas", "embajadores afines"],
          },
        ],
        placeholders: [
          {
            n: 1,
            kind: "image",
            note: "Tour — identidad",
            src: "/media/RAC3540-09.webp",
            alt: "Tour de identidad · Regreso a Casa",
          },
          {
            n: 2,
            kind: "image",
            note: "Tour — logística",
            src: "/media/logistica_tour.webp",
            alt: "Nueva logística de tours · Regreso a Casa",
          },
        ],
      },
      {
        id: "rac-identidad",
        type: "identidad",
        title: "Identidad del Evento",
        kicker: "Regreso a Casa",
        sections: [
          {
            heading: "Vestimenta",
            sub: "Un código visual único",
            body: "Se diseñaron elementos de ambientación y decoración que transformaron los espacios en algo más memorable e inmersivo.",
          },
          {
            heading: "Photo Opportunities",
            sub: "Momentos para compartir",
            body: "Se incorporaron espacios fotográficos estratégicos para generar recuerdos memorables y fomentar la interacción de los egresados.",
          },
          {
            heading: "Estolas",
            sub: "Símbolo de pertenencia",
            body: "A partir del 40 aniversario se les entregan estolas conmemorativas como símbolo de orgullo y reconocimiento. Cada aniversario tiene un color asignado.",
          },
        ],
        placeholders: [
          {
            n: 1,
            kind: "image",
            note: "Vestimenta",
            src: "/media/vestimenta_rac.webp",
            alt: "Vestimenta oficial · Regreso a Casa",
          },
          {
            n: 2,
            kind: "image",
            note: "Photo opportunity",
            src: "/media/photo_ops.webp",
            alt: "Photo ops · Regreso a Casa",
          },
          {
            n: 3,
            kind: "image",
            note: "Diseño de estolas",
            src: "/media/estola_diseno.webp",
            alt: "Diseño de estolas conmemorativas",
          },
        ],
      },
      {
        id: "rac-registro",
        type: "registro",
        title: "Sistema de Registro y Logística",
        kicker: "Regreso a Casa",
        // se presenta como un flujo de 3 pasos
        sections: [
          {
            heading: "Registro",
            step: "01",
            body: "Se implementó un stand de registro alineado con la identidad del evento para el escaneo de códigos QR, permitiendo identificar rápidamente a cada egresado. Además, se estableció una distribución estratégica de filas para agilizar el acceso al evento.",
          },
          {
            heading: "Acomodo de mesas",
            step: "02",
            body: "Se implementó una selección anticipada de mesas para facilitar el reencuentro entre generaciones. El día del evento hay un acompañamiento a la mesa para una llegada más ágil.",
          },
          {
            heading: "Gafetes",
            step: "03",
            body: "Se personalizaron los gafetes por aniversario con identificación por color, nombre del egresado, asignación de mesa y tour, además de un código QR por la parte de atrás con acceso a información relevante del evento.",
          },
        ],
        placeholders: [
          {
            n: 1,
            kind: "image",
            note: "Registro",
            src: "/media/registro.webp",
            alt: "Módulos de registro · Regreso a Casa",
          },
          {
            n: 2,
            kind: "image",
            note: "Acomodo de mesas",
            src: "/media/mesas.webp",
            alt: "Acomodo de mesas · cena de gala",
          },
          {
            n: 3,
            kind: "image",
            note: "Gafetes",
            src: "/media/gafetes.webp",
            alt: "Gafetes y listones · Regreso a Casa",
          },
        ],
      },
      {
        id: "rac-gafetes",
        type: "gafetes",
        title: "Gafetes",
        kicker: "Registro · Regreso a Casa",
        // emparejados por color: frente (nombre + rol) y reverso (QR)
        badges: [
          { label: "55 Aniversario", front: "/media/gafete-azul-frente.webp", back: "/media/gafete-azul-reverso.webp" },
          { label: "Líder de Generación", front: "/media/gafete-teal-frente.webp", back: "/media/gafete-teal-reverso.webp" },
          { label: "Staff", front: "/media/gafete-rosa-frente.webp", back: "/media/gafete-rosa-reverso.webp" },
          { label: "Acompañante", front: "/media/gafete-gris-frente.webp", back: "/media/gafete-gris-reverso.webp" },
        ],
      },
      {
        id: "rac-gafetes-qr",
        type: "embed",
        title: "Del gafete a tu celular",
        kicker: "Gafetes · Regreso a Casa",
        lead: "El QR al reverso del gafete abre la experiencia digital del evento.",
        body: "Una página con todos los enlaces clave en la mano del asistente.",
        urlLabel: "raclinks.pages.dev",
        url: "https://raclinks.pages.dev/",
        qr: "/media/qr_links.png",
      },
      {
        id: "rac-nps",
        type: "nps",
        title: "NPS · Regreso a Casa",
        kicker: "Satisfacción de la comunidad",
        // Comparativo año vs año: el promedio saltó de 44.7 a 64.8 (+20.1 pts).
        // Cada año se mide por segmento de generación (RAC).
        years: [
          {
            year: "2024",
            average: 44.7,
            segments: [
              { label: "RAC 5–15", value: 42 },
              { label: "RAC 20–35", value: 63 },
              { label: "RAC 40+", value: 29 },
            ],
          },
          {
            year: "2025",
            average: 64.8,
            segments: [
              { label: "RAC 5–15", value: 43 },
              { label: "RAC 20", value: 70 },
              { label: "RAC 25–30", value: 82 },
              { label: "RAC 35–40", value: 64 },
            ],
          },
        ],
        comments: [
          "Me encantó el reencuentro con mis compañeros y el tour por las nuevas instalaciones. Orgullosa de ser EXATEC.",
          "Me encantó cada detalle, desde la recepción, mensajes, cena de gala, desayuno, recorridos… pero especialmente la evolución del Tec en estos 40 años.",
          "Me gustó todo, especialmente que hayan mejorado la logística de la cena, con mesas asignadas. También que los mensajes fueran en el Luis Elizondo, breves, con apoyo audiovisual y muy poderosos. Me siento orgullosa del Tec y de mi generación.",
          "Impresionado con cómo ha cambiado el campus. La clase del recuerdo (Ing. José Antonio Fernández) estuvo de maravilla, aparte de que me causó un poco de nostalgia acordarme que alguna vez fue mi profesor.",
        ],
      },
      {
        id: "rac-retos",
        type: "retos",
        title: "Lowlights",
        kicker: "Regreso a Casa",
        items: [
          {
            lead: "Convocatoria y asistencia al evento",
            body: "Requiere una estrategia de difusión multicanal (WhatsApp, LinkedIn, correo, radio, redes sociales y pauta digital) para impulsar la participación.",
          },
          {
            lead: "Alta inversión y carga operativa",
            body: "Gran demanda de inversión y horas de trabajo para la planeación y ejecución del evento.",
          },
          {
            lead: "Gestión simultánea de eventos",
            body: "4 eventos de Regreso a Casa en 1 semestre, más eventos y actividades EXATEC adicionales.",
          },
        ],
      },
    ],
  },
  {
    id: "agrupaciones",
    name: "Agrupaciones",
    short: "AGR",
    hub: { angle: 150 },
    slides: [
      {
        id: "agr-portada",
        type: "cover",
        title: "Agrupaciones",
        kicker: "Nuevos eventos con causa por agrupaciones · Monterrey",
        logo: "/brand/logo-exatec-blanco.webp",
        logoAlt: "EXATEC",
      },
      {
        id: "agr-talleres",
        type: "talleres",
        title: "Talleres",
        kicker: "En colaboración con Educación Continua",
        stats: [
          { value: 3, label: "Talleres impartidos" },
          { value: 177, label: "Asistentes" },
          { value: 163990, prefix: "$", label: "Recaudado" },
          { value: 100, suffix: "%", label: "Asistencia" },
        ],
        placeholders: [
          { n: 1, kind: "image", note: "Taller", src: "/media/taller_1.webp", alt: "Taller · Educación Continua" },
          { n: 2, kind: "image", note: "Taller", src: "/media/taller_2.webp", alt: "Taller · Educación Continua" },
        ],
      },
      {
        id: "agr-torneos",
        type: "torneos",
        title: "Torneos",
        kicker: "Comunidad en movimiento",
        disciplines: ["Tochito", "Padel", "Golf"],
        tournaments: [
          {
            name: "Tochito",
            raised: 186200,
            photo: { n: 1, note: "Torneo de Tochito", src: "/media/tochito.webp", alt: "Torneo de Tochito" },
            stats: [
              { value: 56, label: "Equipos inscritos" },
              { value: 670, label: "Niños participando" },
              { value: 76, label: "Papás EXATEC" },
            ],
          },
        ],
      },
      {
        id: "agr-monto",
        type: "monto",
        title: "Generosidad - Total Recaudado por Agrupaciones",
        kicker: "Impacto de la comunidad",
        // suma exacta del desglose de abajo
        total: 373342,
        // ordenado de mayor a menor: el acento (fila 0) resalta el dominante
        breakdown: [
          { name: "Borregos Flag Cup", amount: 186200 },
          { name: "EXATEC Wealth Strategy", amount: 90000 },
          { name: "Arte, Cultura y Conexión", amount: 70000 },
          { name: "Otros", amount: 27142 },
        ],
      },
      {
        id: "agr-lowlights",
        type: "retos",
        title: "Lowlights",
        kicker: "Agrupaciones",
        items: [
          {
            lead: "Curva de aprendizaje en nuevos proyectos",
            body: "La implementación de nuevas iniciativas nos permitió identificar procesos institucionales clave, como contratación y pago de facilitadores, uso de marca y alta de proveedores.",
          },
          {
            lead: "Alta complejidad operativa",
            body: "La coordinación entre múltiples áreas y procesos evidenció la necesidad de fortalecer la planeación y estandarizar la operación.",
          },
        ],
      },
    ],
  },
  {
    id: "lideres",
    name: "Líderes de Generación",
    short: "LDG",
    hub: { angle: 30 },
    slides: [
      {
        id: "ldg-portada",
        type: "cover",
        title: "Líderes de Generación",
        kicker: "Diseño de journey · Monterrey",
        logo: "/brand/logo-ldg-blanco.webp",
        logoAlt: "Líderes de Generación",
      },
      // PUNTO 1 — sólo highlight (la línea con el nodo resaltado)
      journeyRoadmap(0),
      // PUNTO 2 — sólo highlight
      journeyRoadmap(1),
      // PUNTO 3 — sólo highlight
      journeyRoadmap(2),
      // PUNTO 4 — sólo highlight
      journeyRoadmap(3),
      // PUNTO 5 — popup (video vertical + texto)
      journeyRoadmap(4),
      journeyPopup("ldg-p5", { point: JOURNEY_POINTS[4], pointN: 5, media: "video-vertical", text: true, src: "/media/ceremonia_ldg.mp4" }),
      // PUNTO 6 — popup (colaboración EXATEC/LDG en los eventos PST)
      journeyRoadmap(5),
      journeyPopup("ldg-p6b", { media: "pst", pst: JOURNEY_PST }),
      // PUNTO 7 — popup (foto horizontal + texto)
      journeyRoadmap(6),
      journeyPopup("ldg-p7", {
        point: JOURNEY_POINTS[6],
        pointN: 7,
        media: "photo-horizontal",
        text: true,
        src: "/media/seguimiento.webp",
        agenda: [
          { time: "9:00", item: "Registro" },
          { time: "9:30", item: "Bienvenida" },
          { time: "9:45", item: "Universo y Orgullo EXATEC", by: "Zinia Padilla" },
          { time: "10:30", item: "Mesa de Trabajo" },
          { time: "11:00", item: "Break" },
          { time: "11:10", item: "Sesión de Networking y Capacitación" },
          { time: "1:10", item: "Mejores Prácticas LDG" },
          { time: "1:40", item: "Sesión Informativa Regreso a Casa 2026" },
          { time: "2:00", item: "Cierre" },
        ],
      }),
      {
        id: "ldg-lowlights",
        type: "retos",
        title: "Lowlights",
        kicker: "Líderes de Generación",
        items: [
          {
            lead: "Participación en el proceso de refrendo",
            body: "El refrendo evidenció la necesidad de fortalecer la comunicación y el seguimiento para asegurar que más Líderes de Generación completen su compromiso.",
          },
          {
            lead: "Vinculación con Directores de Carrera",
            body: "Se identificó la oportunidad de involucrar más a los Directores de Carrera, brindándoles mayor claridad sobre su papel dentro del Journey de Líderes de Generación.",
          },
          {
            lead: "Sinergia con LiFE",
            body: "La coordinación con LiFE nos dio áreas de oportunidad en comunicación y planeación, impulsando la necesidad de fortalecer el trabajo conjunto.",
          },
        ],
      },
    ],
  },
  {
    id: "aprendizajes",
    name: "Aprendizajes",
    short: "APR",
    hub: { angle: 90 },
    slides: [
      {
        id: "apr-portada",
        type: "cover",
        title: "Aprendizajes",
        kicker: "Por área · Monterrey",
        logo: "/brand/logo-exatec-blanco.webp",
        logoAlt: "EXATEC",
      },
      {
        id: "apr-rac",
        type: "aprendizajes",
        title: "Regreso a Casa",
        kicker: "Aprendizajes",
        items: [
          "Diversificar los canales de comunicación para fortalecer el alcance y la participación",
          "Anticipar el cierre de registros y la solicitud de materiales",
          "Estandarizar la identidad visual y los elementos de producción",
          "Potenciar el componente de nostalgia",
        ],
      },
      {
        id: "apr-agrupaciones",
        type: "aprendizajes",
        title: "Agrupaciones EXATEC",
        kicker: "Aprendizajes",
        items: [
          "Definir desde el inicio del ciclo una planeación, calendarización y reglas de operación.",
          "Alinear los proyectos y eventos de las agrupaciones con las prioridades estratégicas del equipo.",
          "Establecer reuniones periódicas con las presidencias",
        ],
      },
      {
        id: "apr-visitas",
        type: "aprendizajes",
        title: "Visitas EXATEC",
        kicker: "Aprendizajes",
        items: [
          "Ampliar el número de personas capacitadas para dar tours para ofrecer una mejor experiencia.",
          "Integrar puntos de contacto en cada espacio",
          "Fortalecer la preparación logística",
        ],
      },
      {
        id: "apr-ldg",
        type: "aprendizajes",
        title: "Líderes de Generación",
        kicker: "Aprendizajes",
        items: [
          "Fortalecer la colaboración con el equipo de LiFE",
          "Generar una mayor vinculación con las direcciones académicas",
          "Incorporar dentro del journey del candidato a graduar un evento insignia",
        ],
      },
      // cierre de toda la presentación: se queda como última slide del recorrido
      {
        id: "cierre-equipo",
        type: "equipo",
        title: "Equipo EXATEC Monterrey",
        logo: "/brand/logo-exatec-blanco.webp",
        photo: "/media/equipo.webp",
        photoAlt: "Equipo EXATEC Monterrey",
      },
    ],
  },
];

/**
 * Secuencia global aplanada (con numeración 1..N) para la navegación
 * lineal con flechas. Cada item conoce su grupo y su índice local.
 */
export const SEQUENCE = GROUPS.flatMap((group, groupIndex) =>
  group.slides.map((slide, slideIndex) => ({
    ...slide,
    groupId: group.id,
    groupName: group.name,
    groupIndex,
    slideIndex,
  }))
).map((item, i) => ({ ...item, n: i + 1 }));

export const TOTAL_SLIDES = SEQUENCE.length;

/** Helpers de navegación */
export const getGroup = (groupId) => GROUPS.find((g) => g.id === groupId);

export const firstSlideOfGroup = (groupId) =>
  SEQUENCE.find((s) => s.groupId === groupId);

export const slideAt = (n) => SEQUENCE[n - 1] ?? null;

/**
 * MODO LIVE — presentación en vivo.
 * Slide de título que arranca el recorrido + la secuencia completa detrás.
 * `groupIndex: -1` marca la portada (no pertenece a ningún área).
 */
export const LIVE_INTRO = {
  id: "live-intro",
  type: "liveIntro",
  // El lockup de la portada es "[logo EXATEC] Monterrey": el logo sustituye a
  // la palabra EXATEC y va alineado por línea base con el resto del título.
  logo: "/brand/logo-exatec-blanco.webp",
  logoAlt: "EXATEC",
  title: "Monterrey",
  kicker: META.subtitle,
  groupName: "Inicio",
  groupIndex: -1,
};

/**
 * Slide 2 · INDICADORES — tablero de resultados del ciclo.
 * Fuente: "Indicadores - Planeación.xlsx" (raíz del proyecto).
 * Solo se guardan las cifras crudas; los porcentajes (vs ciclo pasado y
 * vs meta) se derivan en el componente para que no haya dos verdades.
 * `meta: null` = indicador sin meta definida (NPS).
 */
export const INDICADORES = {
  id: "indicadores",
  type: "indicadores",
  kicker: "2024/25 → 2025/26",
  title: "Indicadores",
  prevLabel: "2024-25",
  currLabel: "2025-26",
  rows: [
    { name: "Voluntarios", prev: 224, curr: 380, meta: 530 },
    { name: "Registrados LDG", prev: 238, curr: 294, meta: 265 },
    { name: "LDG", prev: 466, curr: 444, meta: 530 },
    { name: "Registrados RAC", prev: 2088, curr: 1717, meta: 2550 },
    { name: "Networking", prev: 2720, curr: 3381, meta: 3340 },
    { name: "Vinculados Estratégicamente", prev: 464, curr: 690, meta: 714 },
    { name: "EXATEC Donando", prev: 1452, curr: 1483, meta: 1460 },
    { name: "NPS", prev: 56, curr: 65, meta: null },
  ],
  total: { name: "Total", prev: 7708, curr: 8454, meta: 9389 },
  /**
   * Segundo total, calculado restando del anterior las filas listadas en
   * `exclude` (por `name`). Se deriva en el componente, no se escribe a mano,
   * para que siga cuadrando si se corrige cualquier cifra de `rows`.
   */
  totalExcluding: {
    label: "Total ajustado",
    exclude: ["Vinculados Estratégicamente", "EXATEC Donando"],
  },
  groupName: "Indicadores",
  groupIndex: -1,
};

export const LIVE_SEQUENCE = [LIVE_INTRO, INDICADORES, ...SEQUENCE].map(
  (item, i) => ({
    ...item,
    liveN: i + 1,
  })
);

export const LIVE_TOTAL = LIVE_SEQUENCE.length;

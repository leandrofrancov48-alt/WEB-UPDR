export interface TourEvent {
  id: string;
  city: string;
  countryBadge: string;
  venue: string;
  dateStr: string;
  isoDate: string; // Formato YYYY-MM-DD para expiración automática
  provider?: string;
  legend: string;
  infoNote?: string;
  soldOut?: boolean;
  imageSrc?: string;
  flyerImage?: string | null;
  ticketUrl: string;
  colorBorder: string;
  glowColor: string;
  badgeBg: string;
  accentColor?: string;
}

/**
 * Retorna true si la fecha del evento (en zona horaria de Argentina) aún no ha finalizado.
 * Un evento con isoDate "2026-10-31" permanece visible durante todo el 31 de octubre
 * y expira a las 23:59:59 de ese día en Argentina (o al comenzar el 1 de noviembre).
 */
export function isEventUpcoming(isoDate?: string): boolean {
  if (!isoDate) return true;
  try {
    const tzString = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
    const nowInArg = new Date(tzString);

    const [year, month, day] = isoDate.split("-").map(Number);
    if (!year || !month || !day) return true;

    // El evento finaliza a las 23:59:59 del día indicado en hora argentina
    const eventEnd = new Date(year, month - 1, day, 23, 59, 59, 999);

    return nowInArg.getTime() <= eventEnd.getTime();
  } catch (e) {
    console.error("Error evaluando isEventUpcoming:", e);
    return true;
  }
}

export const ALL_TOUR_EVENTS: TourEvent[] = [
  {
    id: "rosario",
    city: "ROSARIO",
    countryBadge: "🇦🇷 ROSARIO",
    venue: "Metropolitano Rosario",
    dateStr: "31 DE OCTUBRE 2026",
    isoDate: "2026-10-31",
    provider: "Turbo Entrada",
    legend: "ENTRADAS EN TURBO ENTRADA",
    infoNote: "Entradas en Turbo Entrada",
    soldOut: false,
    imageSrc: "/flyers/rosario.png",
    flyerImage: "/flyers/rosario.png",
    ticketUrl: "https://www.turboentrada.com/landing/un-poco-de-ruido?idEspectaculoCartel=17259&cHashValidacion=705fa88aa2bea8d5c9a2b4e9018ab8c5b0e7329c",
    colorBorder: "border-amber-500/40 hover:border-amber-400",
    glowColor: "from-amber-500/15 via-orange-500/5 to-transparent",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    accentColor: "from-amber-500/20 via-orange-500/5 to-transparent",
  },
  {
    id: "montevideo",
    city: "MONTEVIDEO",
    countryBadge: "🇺🇾 URUGUAY",
    venue: "Rural del Prado",
    dateStr: "7 DE NOVIEMBRE 2026",
    isoDate: "2026-11-07",
    provider: "RedTickets",
    legend: "ENTRADAS EN REDTICKETS",
    infoNote: "Entradas en RedTickets",
    soldOut: false,
    imageSrc: "/flyers/montevideo.png",
    flyerImage: "/flyers/montevideo.png",
    ticketUrl: "https://redtickets.uy/evento/UN-POCO-DE-RUIDO--PRADO/31887/",
    colorBorder: "border-cyan-500/40 hover:border-cyan-400",
    glowColor: "from-cyan-500/15 via-blue-500/5 to-transparent",
    badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
    accentColor: "from-cyan-500/20 via-blue-500/5 to-transparent",
  },
  {
    id: "laplata",
    city: "LA PLATA",
    countryBadge: "🇦🇷 LA PLATA",
    venue: "Hipódromo de La Plata",
    dateStr: "28 DE NOVIEMBRE 2026",
    isoDate: "2026-11-28",
    provider: "Livepass",
    legend: "ENTRADAS EN LIVEPASS (4 cuotas sin interés)",
    infoNote: "4 cuotas sin interés Banco Provincia",
    soldOut: false,
    imageSrc: "/flyers/laplata.png",
    flyerImage: "/flyers/laplata.png",
    ticketUrl: "https://livepass.com.ar/events/un-poco-de-ruido-en-el-hipodromo-de-la-plata",
    colorBorder: "border-emerald-500/40 hover:border-emerald-400",
    glowColor: "from-emerald-500/15 via-teal-500/5 to-transparent",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    accentColor: "from-emerald-500/20 via-teal-500/5 to-transparent",
  },
  {
    id: "velez",
    city: "Buenos Aires",
    countryBadge: "🇦🇷 CABA",
    venue: "Estadio José Amalfitani (Vélez)",
    dateStr: "26 DE SEPTIEMBRE 2026",
    isoDate: "2026-09-26",
    provider: "AllAccess",
    legend: "Preventa & Venta General",
    infoNote: "Preventa & Venta General",
    soldOut: false,
    imageSrc: "/flyers/velez.png",
    flyerImage: null,
    ticketUrl: "https://www.allaccess.com.ar/event/un-poco-de-ruido",
    colorBorder: "border-purple-500/40 hover:border-purple-400",
    glowColor: "from-purple-500/15 via-indigo-500/5 to-transparent",
    badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
    accentColor: "from-purple-500/20 via-indigo-500/5 to-transparent",
  },
];

/**
 * Obtener únicamente los eventos y shows que todavía no pasaron
 */
export function getUpcomingTourEvents(): TourEvent[] {
  return ALL_TOUR_EVENTS.filter((event) => isEventUpcoming(event.isoDate));
}


import { Venue } from './types';
import { VENUES } from './venues';

export interface BandOption {
  id: string;
  name: string;
  logo: string;
  zone?: string;
  category: string;
  actionLabel: string;
  requiredOvr: number; // OVR de referencia
  baseSuccessRate: number;
  bonusTalent: number;
  bonusCharisma: number;
  description: string;
  award?: string;
  positiveText: string;
  negativeText: string;
  negativeTalentDelta?: number;
  negativeCharismaDelta?: number;
  negativeMoneyDelta?: number;
}

export interface InPlaceDilemma {
  id: string;
  title: string;
  description: string;
  age: number;
  options: {
    label: string;
    sublabel: string;
    icon: string;
    badge?: string;
    requiredOvr?: number; // OVR exigido para el dilema
    baseSuccessRate: number;
    positive: {
      text: string;
      talentDelta: number;
      charismaDelta: number;
      staminaDelta: number;
      moneyDelta: number;
      award?: string;
      isScam?: boolean;
      isVocalDamage?: boolean;
      isPoliceBust?: boolean;
      isLawsuitLoss?: boolean;
    };
    negative: {
      text: string;
      talentDelta: number;
      charismaDelta: number;
      staminaDelta: number;
      moneyDelta: number;
      award?: string;
      isScam?: boolean;
      isVocalDamage?: boolean;
      isPoliceBust?: boolean;
      isLawsuitLoss?: boolean;
    };
  }[];
}

export const AGE_STEPS = [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38];

// Cálculo realista y dinámico de probabilidad de éxito según OVR del Jugador vs Exigido
export function calculateDynamicSuccessRate(playerOvr: number, requiredOvr: number = 50, baseRate: number = 65): number {
  const ovrDiff = playerOvr - requiredOvr;
  let rate = baseRate;
  
  if (ovrDiff >= 0) {
    // Bonificación progresiva: +1.2% por cada punto de OVR por encima del exigido
    rate = baseRate + (ovrDiff * 1.2);
  } else {
    // Penalización si estás por debajo del OVR exigido: -3.5% por punto
    rate = baseRate - (Math.abs(ovrDiff) * 3.5);
  }

  // Techo dinámico: El 95% de éxito se reserva únicamente si el jugador tiene 95+ OVR
  const maxCap = playerOvr >= 95 ? 95 : Math.min(88, 70 + Math.floor((playerOvr - 50) * 0.4));
  
  return Math.min(maxCap, Math.max(10, Math.round(rate)));
}

// ================= MASTER POOL DE BANDAS Y CONVOCATORIAS (FIGURITAS UPDR + TOURS GLOBALES) =================
export const MASTER_BANDS_POOL: BandOption[] = [
  // --- TIER BRONCE / COMÚN (OVR 40 - 58) ---
  // --- TIER ARTISTAS EMERGENTES UPDR (OVR 40 - 45 / EDAD 16) ---
  // --- TIER ARTISTAS EMERGENTES REALES UPDR (OVR 40 - 45 / EDAD 16) ---
  {
    id: 'suena_mi_cumbia_smc',
    name: 'Suena mi Cumbia SMC',
    logo: '🎤',
    category: '⭐ ARTISTA EMERGENTE UPDR (Top #1 • 1912 Likes)',
    actionLabel: 'Iniciar carrera en',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 4,
    bonusCharisma: 3,
    description: 'Banda de cumbia totalmente en vivo debutada en 2019 desde Salto, la más votada de la plataforma UPDR (1912 likes).',
    positiveText: '¡GRAN DEBUT CON SUENA MI CUMBIA SMC! La pista completa bailando cumbia en vivo.',
    negativeText: '¡Sin fallos! Tu debut fue impecable.',
  },
  {
    id: 'corazon_herido',
    name: 'CORAZÓN HERIDO 💔',
    logo: '💔',
    category: '⭐ ARTISTA EMERGENTE UPDR (Top #2 • 1365 Likes)',
    actionLabel: 'Debut profesional con',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Homenaje vivo al legado eterno de Gilda y la cumbia romántica desde Berazategui, Varela y El Pato (1365 likes).',
    positiveText: '¡EMOCIÓN Y RITMO EN EL ESCENARIO! El público cantó con el alma cada estribillo romántico.',
    negativeText: '¡Sin fallos! Presentación estelar de apertura.',
  },
  {
    id: 'cumbia_lokilla',
    name: 'Cumbia Lokilla',
    logo: '🤪',
    category: '⭐ ARTISTA EMERGENTE UPDR (Top #3 • 1274 Likes)',
    actionLabel: 'Sumarte al ritmo de',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Cumbia base romántica en la voz de David (El lokillo), ex animador de Agrupación Marilyn y Jackita desde Berazategui (1274 likes).',
    positiveText: '¡FIESTA Y BASE ROMÁNTICA! Ovación del público bailable en todo el circuito.',
    negativeText: '¡Sin fallos! Arranque bien arriba.',
  },
  {
    id: 'contratiempos_cumbia',
    name: 'Contratiempos',
    logo: '🥁',
    category: '⭐ ARTISTA EMERGENTE UPDR (455 Likes)',
    actionLabel: 'Meter repique con',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 4,
    bonusCharisma: 3,
    description: 'Banda de cumbia fiestera y retro de la ciudad de Rojas, Buenos Aires (455 likes).',
    positiveText: '¡RETRO Y FIESTA TOTAL! Todos zapateando al ritmo fiestero de Rojas.',
    negativeText: '¡Sin fallos! Ritmo impecable.',
  },
  {
    id: 'jenni_cumbia_santafesina',
    name: 'JENNI',
    logo: '✨',
    category: '⭐ ARTISTA EMERGENTE UPDR (355 Likes)',
    actionLabel: 'Hacer sonar la voz con',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 4,
    bonusCharisma: 3,
    description: 'Cumbia santafesina encabezada por Jenni en Capitán Sarmiento, provincia de Buenos Aires (355 likes).',
    positiveText: '¡SANTAFESINA CON ALMA! Los punteos y la voz encendieron a toda la audiencia.',
    negativeText: '¡Sin fallos! Excelente recibimiento de la gente.',
  },
  {
    id: 'los_del_cerro_papa',
    name: 'Los del Cerro papá!',
    logo: '🏔️',
    category: '⭐ ARTISTA EMERGENTE UPDR (319 Likes)',
    actionLabel: 'Girar por boliches con',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Grupo con estilo de cumbia santafesina y temas propios desde Victoria (319 likes).',
    positiveText: '¡FIESTA DE VICTORIA! Cumbia picante que hizo saltar a toda la bailanta.',
    negativeText: '¡Sin fallos! Show impecable de inicio a fin.',
  },
  {
    id: 'vcosmico_cumbia',
    name: 'VCosmico 👁️',
    logo: '👁️',
    category: '⭐ ARTISTA EMERGENTE UPDR (308 Likes)',
    actionLabel: 'Sumarte al viaje tropical de',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 4,
    bonusCharisma: 3,
    description: 'Cumbia base, villera, RKT y cuarteto desde Florida, Uruguay (308 likes).',
    positiveText: '¡EXPLOSIÓN CÓSMICA EN LA PISTA! Mezcla potente de estilos que enloqueció a la gente.',
    negativeText: '¡Sin fallos! Presentación de lujo.',
  },
  {
    id: 'bui3_cumbieros',
    name: 'Bui-3 cumbieros',
    logo: '⌨️',
    category: '⭐ ARTISTA EMERGENTE UPDR (308 Likes)',
    actionLabel: 'Hacer sonar los teclados en',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 4,
    bonusCharisma: 3,
    description: 'Iván Nocciolino al frente con teclados y voz desde Lipno (308 likes).',
    positiveText: '¡VIRTUSISMO DE TECLADO! Los acordes sabrosos levantaron a todo el club.',
    negativeText: '¡Sin fallos! Gran zapada inicial.',
  },
  {
    id: 'oveja_rkt',
    name: 'oveja rkt',
    logo: '🐑',
    category: '⭐ ARTISTA EMERGENTE UPDR (256 Likes)',
    actionLabel: 'Encender el ritmo RKT con',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Cumbia RKT y fiesta bailable desde Rosario (256 likes).',
    positiveText: '¡DESCONTROL EN ROSARIO! La pista explotó con la cumbia RKT y el ritmo nuevo.',
    negativeText: '¡Sin fallos! La fiesta no paró.',
  },
  {
    id: 'lo_pariente_cumbia',
    name: 'Lo´Pariente',
    logo: '🍻',
    category: '⭐ ARTISTA EMERGENTE UPDR (254 Likes)',
    actionLabel: 'Formar parte del proyecto',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 4,
    bonusCharisma: 3,
    description: 'Cumbia santafesina y cuarteto sabroso nacido en Gran Rosario (254 likes).',
    positiveText: '¡SABOR ROSARINO! Acordeón y cuarteto bien bailado por toda la familia cumbiera.',
    negativeText: '¡Sin fallos! Show redondito.',
  },
  {
    id: 'perrita_malvada_cumbia',
    name: 'PERRITA MALVADA',
    logo: '🐕',
    category: '⭐ ARTISTA EMERGENTE UPDR (251 Likes)',
    actionLabel: 'Hacer bailar a todos con',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Banda nueva con estilo bailable base villera desde Santos Lugares (251 likes).',
    positiveText: '¡RITMO DE SANTOS LUGARES! Base villera potente que prendió fuego la noche.',
    negativeText: '¡Sin fallos! Debut con la pista llena.',
  },
  {
    id: 'choko_be_cumbia',
    name: 'Choko Be',
    logo: '🎹',
    category: '⭐ ARTISTA EMERGENTE UPDR (184 Likes)',
    actionLabel: 'Tocar desde el Fin del Mundo con',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 4,
    bonusCharisma: 3,
    description: 'Tecladista y músico criollo desde Tierra del Fuego (184 likes).',
    positiveText: '¡CUMBIA DEL FIN DEL MUNDO! Talento fueguino que conquistó los corazones.',
    negativeText: '¡Sin fallos! Apertura con ovación.',
  },
  {
    id: 'bailanta_el_templo',
    name: 'La Tropi Band del Templo',
    logo: '🌴',
    category: '🥉 TIER COMÚN UPDR',
    actionLabel: 'Fichar como músico en',
    requiredOvr: 52,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 3,
    description: 'Giras maratónicas por boliches y bailantas de provincia los fines de semana.',
    positiveText: '¡Fin de semana inolvidable! 5 boliches repletos a pura cumbia.',
    negativeText: '¡Se rompió el colectivo en la ruta y llegaron con lo justo al último show!',
  },
  {
    id: 'grupo_karicia',
    name: 'Grupo Karicia',
    logo: '🌹',
    category: '🥉 BANDA CLÁSICA CONOCIDA',
    actionLabel: 'Sumarte al ritmo de',
    requiredOvr: 50,
    baseSuccessRate: 100,
    award: 'Ritmo de Karicia 🌹',
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Te llaman para integrarte a Grupo Karicia cantando "Coqueta" en bailantas históricas.',
    positiveText: '¡ÉXITO TOTAL EN LA BAILANTA! El público cantó enganchados clásicos durante 2 horas.',
    negativeText: '¡Un acople en los parlantes principales demoró la apertura!',
  },
  {
    id: 'grupo_red',
    name: 'Grupo Red',
    logo: '🔴',
    category: '🥉 BANDA CLÁSICA CONOCIDA',
    actionLabel: 'Girar por el país con',
    requiredOvr: 52,
    baseSuccessRate: 100,
    award: 'Amor de Juventud 🔴',
    bonusTalent: 4,
    bonusCharisma: 4,
    description: 'Convocatoria oficial para la gira nacional de Grupo Red cantando "Amor de Juventud".',
    positiveText: '¡DELIRIO TROPICAL! Miles de personas coreando los clásicos infaltables.',
    negativeText: '¡Llegaron con lo justo por embotellamiento en la autopista!',
  },
  {
    id: 'supermerk2',
    name: 'Supermerk2',
    logo: '🔥',
    category: '🥉 BANDA CONOCIDA UPDR',
    actionLabel: 'Encender la pista con',
    requiredOvr: 54,
    baseSuccessRate: 100,
    award: 'Que Calor Cumbiero 🔥',
    bonusTalent: 4,
    bonusCharisma: 4,
    description: 'Te buscan para meter ritmo en vivo con Supermerk2 haciendo explotar "Qué Calor".',
    positiveText: '¡EXPLOSIÓN EN LA PISTA! La bailanta completa saltando de principio a fin.',
    negativeText: '¡Se abolló un güiro en el traslado pero el show no paró!',
  },
  {
    id: 'tambo_tambo_convocatoria',
    name: 'Tambó Tambó',
    logo: '🔔',
    category: '🥈 BANDA CONOCIDA CONSAGRADA',
    actionLabel: 'Sumarte a los shows de',
    requiredOvr: 56,
    baseSuccessRate: 100,
    award: 'El Campanero de Oro 🔔',
    bonusTalent: 4,
    bonusCharisma: 5,
    description: 'Te llega la convocatoria para tocar "El Campanero" en la orquesta estable de Tambó Tambó.',
    positiveText: '¡OVACIÓN MONUMENTAL! El público cantó a todo pulmón en teatros y boliches repletos.',
    negativeText: '¡Falló el micrófono secundario durante el estribillo!',
  },
  {
    id: 'la_repandilla',
    name: 'La Repandilla',
    logo: '🎤',
    category: '🥈 BANDA CONOCIDA CONSAGRADA',
    actionLabel: 'Salir de gira con',
    requiredOvr: 58,
    baseSuccessRate: 100,
    award: 'La Repandilla de Fiesta 🎤',
    bonusTalent: 4,
    bonusCharisma: 5,
    description: 'Oscar Belondi te llama para sumarte a la gira maratónica de La Repandilla.',
    positiveText: '¡FIESTA INAGOTABLE! 6 boliches en una sola noche cantando sin parar.',
    negativeText: '¡Se atrasó la combi pero la banda llegó a romper el escenario!',
  },
  {
    id: 'mala_fama',
    name: 'Mala Fama',
    logo: '🍾',
    category: '🥈 BANDA CONOCIDA CONSAGRADA',
    actionLabel: 'Hacer Japish con',
    requiredOvr: 60,
    baseSuccessRate: 100,
    award: 'Japish Mala Fama 🍾',
    bonusTalent: 4,
    bonusCharisma: 6,
    description: 'Hernán Coronel te convoca en persona para girar con Mala Fama haciendo temblar cada escenario.',
    positiveText: '¡JAPISH TOTAL! El show se hizo viral y la multitud ovacionó el carisma en escena.',
    negativeText: '¡Hernán tiró la vicera al público y la gente casi tira las vallas de emoción!',
  },
  {
    id: 'nestor_en_bloque',
    name: 'Néstor en Bloque',
    logo: '🎵',
    category: '🥈 BANDA CONOCIDA CONSAGRADA',
    actionLabel: 'Encabezar fechas con',
    requiredOvr: 62,
    baseSuccessRate: 100,
    award: 'Una Calle Nos Separa 🎵',
    bonusTalent: 4,
    bonusCharisma: 6,
    description: 'Néstor te llama para tocar los teclados y coros en su gira nacional solista.',
    positiveText: '¡EMOCIÓN MULTITUDINARIA! Estadios y bailantas cantando "Una Calle Nos Separa".',
    negativeText: '¡Problemas de monitores de oído pero lo sacaste a puro oído criollo!',
  },
  {
    id: 'yerba_brava',
    name: 'Yerba Brava',
    logo: '⚽',
    category: '🥈 BANDA CONOCIDA CONSAGRADA',
    actionLabel: 'Tocar la Cumbia de los Trapos con',
    requiredOvr: 64,
    baseSuccessRate: 100,
    award: 'La Cumbia de los Trapos ⚽',
    bonusTalent: 5,
    bonusCharisma: 5,
    description: 'Convocatoria estelar para la gira sudamericana de Yerba Brava.',
    positiveText: '¡HIMNO POPULAR! El estadio entero cantando con banderas flameando en las tribunas.',
    negativeText: '¡Sin fallos! Noche histórica de fútbol y cumbia.',
  },
  {
    id: 'los_del_fuego',
    name: 'Los del Fuego',
    logo: '🔥',
    category: '🥈 BANDA CONOCIDA CONSAGRADA',
    actionLabel: 'Sumarte a la mística de',
    requiredOvr: 66,
    baseSuccessRate: 100,
    award: 'Jurabas Tú de Oro 🔥',
    bonusTalent: 5,
    bonusCharisma: 6,
    description: 'Te integran a la orquesta consagrada de Los del Fuego haciendo sonar la guitarra santafesina única.',
    positiveText: '¡LÁGRIMAS Y FIESTA! "Jurabas Tú" cantado a cappella por 15.000 personas.',
    negativeText: '¡Se cortó una cuerda de la guitarra a mitad de solo pero la cambiaste al instante!',
  },
  {
    id: 'rafaga_pucheta',
    name: 'Ráfaga',
    logo: '⚡',
    category: '🥇 BANDA INTERNACIONAL',
    actionLabel: 'Girar por América y Europa con',
    requiredOvr: 70,
    baseSuccessRate: 100,
    award: 'Gira Ráfaga Mentirosa ⚡',
    bonusTalent: 5,
    bonusCharisma: 6,
    description: 'Ariel Pucheta te convoca a los trajes de gala y giras por todo el mundo con Ráfaga.',
    positiveText: '¡ELEGANCIA Y RITMO GLOBAL! Shows agotados en Argentina, Chile, España y EE.UU.',
    negativeText: '¡Demora en la aduana de Madrid con el equipaje de instrumentos!',
  },

  // --- TIER CUMBIERIZED / GUESTS (OVR 59 - 71) ---
  {
    id: 'gira_provincial_norte',
    name: 'Gira Grandes Festivales del Norte',
    logo: '🪗',
    category: '🥈 TIER CUMBIERIZED UPDR',
    actionLabel: 'Encabezar la gira por',
    requiredOvr: 60,
    baseSuccessRate: 100,
    award: 'Giro del Norte 🪗',
    bonusTalent: 3,
    bonusCharisma: 3,
    description: 'Festivales populares multitudinarios en Salta, Jujuy, Tucumán y Santiago.',
    positiveText: '¡OVACIÓN EN EL NORTE! 20.000 personas bailando bajo las estrellas.',
    negativeText: '¡Tormenta eléctrica en el festival obligó a cancelar el show a mitad de fecha!',
  },
  {
    id: 'sesion_sin_miedo',
    name: 'Sesión de Sin Miedo en Vivo',
    logo: '🔥',
    category: '🥈 TIER CUMBIERIZED UPDR',
    actionLabel: 'Grabar zapada en',
    requiredOvr: 62,
    baseSuccessRate: 100,
    award: 'Zapada Viral Sin Miedo 🔥',
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Sesión en vivo a pura improvisación con millones de reproducciones.',
    positiveText: '¡ZAPADA VIRAL! Tu solo de instrumento explotó en TikTok y se hizo tendencia nacional.',
    negativeText: '¡Problemas de acople en la mezcla arruinaron el enganchado principal!',
  },
  {
    id: 'crossover_mono_kapanga',
    name: 'Crossover con Mono Kapanga',
    logo: '🎸',
    category: '🥈 TIER CUMBIERIZED UPDR',
    actionLabel: 'Mezclar rock y cumbia con',
    requiredOvr: 64,
    baseSuccessRate: 100,
    award: 'Fiesta Kapanguera 🎸',
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'El Mono Kapanga te invita a armar una versión cumbiera de sus mayores éxitos.',
    positiveText: '¡EXPLOSIÓN FESTIVOLERA! El público saltó y bailó sin parar en el estadio.',
    negativeText: '¡Hubo demoras en la prueba de sonido pero el show salió adelante!',
  },
  {
    id: 'chaco_palavecino_norte',
    name: 'El Chaqueño Palavecino & Orquesta',
    logo: '🎻',
    category: '🥈 TIER CUMBIERIZED UPDR',
    actionLabel: 'Sumarte a la fiesta del',
    requiredOvr: 66,
    baseSuccessRate: 100,
    award: 'Tradición Criolla 🎻',
    bonusTalent: 4,
    bonusCharisma: 4,
    description: 'El Chaqueño te busca para fusionar folclore con bombo y cumbia en grandes escenarios.',
    positiveText: '¡OVACIÓN EN EL ESCENARIO ATAHUALPA! El anfiteatro de pie ante la fusión criolla.',
    negativeText: '¡Problemas de afinación por el clima frío durante la noche!',
  },
  {
    id: 'feat_maria_becerra',
    name: 'Feat Cumbierizado con María Becerra',
    logo: '🎤',
    category: '🥈 TIER CUMBIERIZED UPDR',
    actionLabel: 'Lanzar colaboración estelar con',
    requiredOvr: 68,
    baseSuccessRate: 100,
    award: 'Hitazo Cumbierizado 🎤',
    bonusTalent: 4,
    bonusCharisma: 5,
    description: 'La Nena de Argentina te convoca para el sencillo cumbiero del verano.',
    positiveText: '¡NÚMERO #1 EN SPOTIFY Y APPLE MUSIC! Sonando en toda América Latina.',
    negativeText: '¡Demoras de edición en el videoclip retrasaron el estreno oficial!',
  },
  {
    id: 'fiesta_nacional_del_sol',
    name: 'Fiesta Nacional del Sol',
    logo: '🍇',
    category: '🥈 FESTIVALES NACIONALES',
    actionLabel: 'Encabezar el festival de',
    requiredOvr: 72,
    baseSuccessRate: 100,
    award: 'Sol de Cuyo 🍇',
    bonusTalent: 4,
    bonusCharisma: 4,
    description: 'El evento festivalero más imponente de la provincia de San Juan ante 50.000 cuyanos.',
    positiveText: '¡NOCHE INOLVIDABLE EN SAN JUAN! La multitud ovacionó cada estribillo.',
    negativeText: '¡Corte de luz parcial en el predio retrasó el inicio 30 minutos!',
  },

  // --- TIER ORO / GOLD (OVR 73 - 83) - FIGURITAS ORO DE UPDR & TOURS INTERNACIONALES ---
  {
    id: 'la_base_gonzalito',
    name: 'La Base',
    logo: '🎧',
    category: '🥇 TIER ORO UPDR',
    actionLabel: 'Fichar con Gonzalito en',
    requiredOvr: 73,
    baseSuccessRate: 100,
    award: 'La Base Bailable 🎧',
    bonusTalent: 4,
    bonusCharisma: 4,
    description: 'Gonzalito te convoca para girar con La Base haciendo estallar los boliches a pura cumbia villera.',
    positiveText: '¡EXPLOSIÓN EN LA PISTA! Los enganchados de La Base hicieron retumbar el boliche.',
    negativeText: '¡Corte de luz a mitad de fecha dejó a la multitud a oscuras 20 minutos!',
  },
  {
    id: 'champions_liga_hernan',
    name: 'Hernán y La Champions Liga',
    logo: '🏆',
    category: '🥇 TIER ORO UPDR',
    actionLabel: 'Poner ritmo romántico en',
    requiredOvr: 75,
    baseSuccessRate: 100,
    award: 'La Champions Liga Romántica 🏆',
    bonusTalent: 4,
    bonusCharisma: 5,
    description: 'Hernán te invita a integrar La Champions Liga para sonar en radios, boliches y teatros.',
    positiveText: '¡CORO MULTITUDINARIO! El estadio cantó "Dime si eres feliz" al unísono.',
    negativeText: '¡La lluvia torrencial complicó el sonido de la consola!',
  },
  {
    id: 'el_polaco_banda',
    name: 'El Polaco',
    logo: '🔥',
    category: '🥇 TIER ORO UPDR',
    actionLabel: 'Agitar la gira con',
    requiredOvr: 76,
    baseSuccessRate: 100,
    award: 'Gira Nacional con El Polaco 🔥',
    bonusTalent: 4,
    bonusCharisma: 5,
    description: 'El Polaco te llama en persona para sumarte a sus giras por boliches y teatros de todo el país.',
    positiveText: '¡FIESTA TOTAL! El Polaco te presentó en el escenario ante la ovación de la gente.',
    negativeText: '¡El micro de gira se quedó sin batería en medio de la autopista!',
  },
  {
    id: 'gira_uruguay_chile',
    name: 'Gira Uruguay & Chile',
    logo: '🇺🇾🇨🇱',
    category: '🥇 TOUR INTERNACIONAL',
    actionLabel: 'Encabezar la gira trasandina en',
    requiredOvr: 77,
    baseSuccessRate: 100,
    award: 'Conquista Trasandina 🇺🇾🇨🇱',
    bonusTalent: 4,
    bonusCharisma: 5,
    description: 'Lleno total en el Antel Arena de Montevideo y el Teatro Caupolicán de Santiago.',
    positiveText: '¡APOTEOSIS EN MONTEVIDEO Y SANTIAGO! Banderas y coros multitudinarios.',
    negativeText: '¡Retrasos en el paso fronterizo andino por nevada intensa!',
  },
  {
    id: 'fiesta_confluencia_neuquen',
    name: 'Fiesta de la Confluencia',
    logo: '🚜',
    category: '🥇 FESTIVALES NACIONALES',
    actionLabel: 'Hacer vibrar la Confluencia en',
    requiredOvr: 79,
    baseSuccessRate: 100,
    award: 'Estrella de la Confluencia 🚜',
    bonusTalent: 4,
    bonusCharisma: 6,
    description: '100.000 personas bailando cumbia a orillas del río Limay en la Patagonia.',
    positiveText: '¡RECORD HISTÓRICO DE ASISTENCIA! 100.000 personas bailando bajo las estrellas.',
    negativeText: '¡Viento patagónico levantó tierra durante la prueba de sonido!',
  },
  {
    id: 'tambo_tambo_diego',
    name: 'Tambó Tambó',
    logo: '🥁',
    category: '🥇 TIER ORO UPDR',
    actionLabel: 'Tocar los clásicos con',
    requiredOvr: 79,
    baseSuccessRate: 100,
    award: 'Clásicos de Tambó Tambó 🥁',
    bonusTalent: 4,
    bonusCharisma: 5,
    description: 'Diego Mujica te llama para meter el ritmo irresistible de "El Culpable de Este Amor".',
    positiveText: '¡TEMPLO RETUMBANDO! Tambó Tambó colmó la bailanta con ovación estelar.',
    negativeText: '¡Problemas en la consola de monitores de escenario!',
  },
  {
    id: 'rafaga_ariel_pucheta',
    name: 'Ráfaga',
    logo: '💨',
    category: '🥇 TIER ORO UPDR',
    actionLabel: 'Girar por el mundo con',
    requiredOvr: 80,
    baseSuccessRate: 100,
    award: 'Gira Mundial con Ráfaga 💨',
    bonusTalent: 4,
    bonusCharisma: 6,
    description: 'Ariel Pucheta y Ráfaga te convocan para sus giras por Europa y América Latina con trajes brillantes.',
    positiveText: '¡SOLD OUT INTERNACIONAL! Ráfaga hizo bailar a miles en España, Chile y Perú.',
    negativeText: '¡Demoras en el equipaje de instrumentos en el aeropuerto internacional!',
  },
  {
    id: 'grupo_cali_zanco',
    name: 'Grupo Cali',
    logo: '🪗',
    category: '🥇 TIER ORO UPDR',
    actionLabel: 'Fichar con Darío Zanco en',
    requiredOvr: 81,
    baseSuccessRate: 100,
    award: 'Grupo Cali Estelar 🪗',
    bonusTalent: 5,
    bonusCharisma: 5,
    description: 'Darío Zanco te busca para el sonido estelar santafesino con trompetas y guitarras virtuosas.',
    positiveText: '¡MAESTRÍA MUSICAL! La crítica elogió los arreglos y solos de la banda.',
    negativeText: '¡Problemas de acústica en el anfiteatro perjudicaron el sonido!',
  },
  {
    id: 'gira_sonidera_mexico',
    name: 'Gira México Sonidero',
    logo: '🇲🇽',
    category: '🥇 TOUR INTERNACIONAL',
    actionLabel: 'Conquistar el público sonidero en',
    requiredOvr: 81,
    baseSuccessRate: 100,
    award: 'Rey Sonidero en México 🇲🇽',
    bonusTalent: 5,
    bonusCharisma: 6,
    description: 'Presentaciones consecutivas en la Arena Monterrey y salones de baile de México.',
    positiveText: '¡DELIRIO MEXICANO! El público bailó cumbia sonidera con tu estilo argentino.',
    negativeText: '¡Complicaciones de visado para 2 músicos de la banda!',
  },
  {
    id: 'eurotour_espana_italia',
    name: 'EuroTour Cumbiero',
    logo: '🌍',
    category: '🥇 TOUR EUROPA',
    actionLabel: '👑 Encabezar el EuroTour por',
    requiredOvr: 82,
    baseSuccessRate: 100,
    award: 'EuroTour Cumbiero de Oro 🌍',
    bonusTalent: 5,
    bonusCharisma: 7,
    description: 'Gira histórica por La Riviera (Madrid), Razzmatazz (Barcelona) y Alcatraz (Milán) a sala llena.',
    positiveText: '¡ÉXITO TOTAL EN EUROPA! Banderas argentinas y coros emocionantes en Madrid, Barcelona y Milán.',
    negativeText: '¡Vuelo demorado por huelga aeronáutica en Roma!',
  },
  {
    id: 'la_nueva_luna_cardozo',
    name: 'La Nueva Luna',
    logo: '🌙',
    category: '🥇 TIER ORO UPDR',
    actionLabel: 'Liderar los armónicos en',
    requiredOvr: 82,
    baseSuccessRate: 100,
    award: 'La Nueva Luna Inconfundible 🌙',
    bonusTalent: 5,
    bonusCharisma: 6,
    description: 'Te convocan para sumarte al proyecto estelar de La Nueva Luna con el sonido inconfundible de la guitarra.',
    positiveText: '¡LEYENDA VIVA! El estadio entero cantando "Choque de Cometas" con lágrimas en los ojos.',
    negativeText: '¡La sala quedó chica y hubo empujones afuera!',
  },

  // --- TIER LEYENDA (OVR 84+) - FIGURITAS LEYENDA MÍTICAS DE UPDR & VIÑA DEL MAR ---
  {
    id: 'flor_de_piedra_lescano',
    name: 'Flor de Piedra',
    logo: '⚡',
    category: '👑 TIER LEYENDA UPDR',
    actionLabel: 'Encabezar el show con',
    requiredOvr: 84,
    baseSuccessRate: 100,
    award: 'Banda Mítica Flor de Piedra ⚡',
    bonusTalent: 5,
    bonusCharisma: 6,
    description: 'Dany Lescano te convoca para liderar el regreso histórico del sonido pionero de la cumbia villera.',
    positiveText: '¡HISTÓRICO! Dany Lescano y la banda hicieron explotar la noche con clásicos inmortales.',
    negativeText: '¡Se desbordó la capacidad del estadio y tuvo que intervenir la seguridad!',
  },
  {
    id: 'amar_azul_miguel',
    name: 'Amar Azul',
    logo: '🌊',
    category: '👑 TIER LEYENDA UPDR',
    actionLabel: 'Girar por Sudamérica con',
    requiredOvr: 84,
    baseSuccessRate: 100,
    award: 'Gira Sudamericana Amar Azul 🌊',
    bonusTalent: 5,
    bonusCharisma: 6,
    description: 'Miguel D’Anibale te llama para la gira internacional con Amar Azul cantando "El Polvito del Amor".',
    positiveText: '¡DELIRIO TOTAL EN CHILE Y ARGENTINA! Cientos de miles cantando a todo pulmón.',
    negativeText: '¡Corte de energía en el estadio chileno demoró la apertura!',
  },
  {
    id: 'festival_vina_del_mar',
    name: 'Festival Internacional de Viña del Mar',
    logo: '🇨🇱',
    category: '👑 FESTIVAL LEYENDA GLOBAL',
    actionLabel: 'Domar al Monstruo en',
    requiredOvr: 85,
    baseSuccessRate: 100,
    award: 'Gaviota de Oro en Viña del Mar 🏆',
    bonusTalent: 5,
    bonusCharisma: 7,
    description: 'Enfrentar al temible "Monstruo" de la Quinta Vergara en el festival televisado más importante de América.',
    positiveText: '¡GAVIOTA DE PLATA Y DE ORO! La Quinta Vergara completa bailó y exigió la antorcha de oro.',
    negativeText: '¡El silbido del público al inicio puso a prueba tus nervios!',
  },
  {
    id: 'los_palmeras_cacho_deicas',
    name: 'Los Palmeras',
    logo: '🌴',
    category: '👑 TIER LEYENDA UPDR',
    actionLabel: '👑 Fichar en',
    requiredOvr: 85,
    baseSuccessRate: 100,
    award: 'Sumado a Los Palmeras 👑',
    bonusTalent: 5,
    bonusCharisma: 7,
    description: 'Cacho Deicas te convoca en persona para sumarte a la orquesta estelar de Los Palmeras en su gira de estadios.',
    positiveText: '¡APOTEOSIS TOTAL! Cacho Deicas te abrazó en el escenario cantando "El Parrandero" ante 80.000 almas.',
    negativeText: '¡Lluvia torrencial obligó a reprogramar la fecha del estadio para el domingo!',
  },
  {
    id: 'antonio_rios_maestro',
    name: 'Antonio Ríos',
    logo: '🎙️',
    category: '👑 TIER LEYENDA UPDR',
    actionLabel: 'Acompañar en vivo a',
    requiredOvr: 85,
    baseSuccessRate: 100,
    award: 'Banda de El Maestro Antonio Ríos 🎙️',
    bonusTalent: 5,
    bonusCharisma: 7,
    description: 'Antonio Ríos te busca para sumarte como virtuoso de su banda estable en giras por América y Europa.',
    positiveText: '¡EL MAESTRO TE CONAGRÓ! Ovación de pie cantando "Nunca me Faltes" en teatros internacionales.',
    negativeText: '¡Cancelación de vuelo a Madrid demoró la primera fecha de la gira europea!',
  },
  {
    id: 'mario_pereyra_orquesta',
    name: 'Mario Pereyra Y Su Orquesta',
    logo: '🪗',
    category: '👑 TIER LEYENDA UPDR',
    actionLabel: 'Hacer vibrar la noche con',
    requiredOvr: 85,
    baseSuccessRate: 100,
    award: 'El Máximo Mario Pereyra 🪗',
    bonusTalent: 5,
    bonusCharisma: 7,
    description: 'El Máximo Mario Pereyra te invita a liderar el acordeón y ritmo en la cumbia santafesina estelar.',
    positiveText: '¡DELIRIO SANTAFESINO! Mario Pereyra te cedió el micrófono y el solo principal ante la multitud.',
    negativeText: '¡Fallas en la consola de retorno en el predio ferial!',
  },
  {
    id: 'la_mona_jimenez_cuarteto',
    name: 'La Mona Jiménez',
    logo: '👑',
    category: '👑 TIER LEYENDA UPDR',
    actionLabel: 'Sumarte al Baile de',
    requiredOvr: 86,
    baseSuccessRate: 100,
    award: 'El Baile de La Mona Jiménez 🎹',
    bonusTalent: 5,
    bonusCharisma: 7,
    description: 'La Mona Jiménez te llama en persona para hacer retumbar el Forja y el Súper Deportivo a puro cuarteto.',
    positiveText: '¡EL REY DE CÓRDOBA TE BENDIJO! La Mona te hizo cantar a su lado con 50.000 cordobeses enloquecidos.',
    negativeText: '¡Corte de sonido a las 5 AM provocó estruendo de la multitud en Forja!',
  }
];

// Obtener bandas filtradas RIGUROSAMENTE según la media OVR del jugador y Tiers del Álbum UPDR
export function getBandsForAgeAndOvr(
  age: number, 
  playerOvr: number, 
  playerRole?: string,
  currentBandName?: string,
  seasonsInCurrentBand: number = 1,
  hasPermanentVocalDamage: boolean = false,
  dissolvedBands: string[] = [],
  playerSubgenre?: string
): BandOption[] {
  if (age === 16) {
    // 3 Bandas iniciales a los 16 años (Elegidas aleatoriamente del Top de Artistas Emergentes UPDR)
    const emergingPool = MASTER_BANDS_POOL.filter(b => b.category.includes('EMERGENTE') || b.requiredOvr <= 45);
    const shuffled = [...emergingPool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }

  // Filtro de exclusión para bandas disueltas previamente o la banda actual para convocatorias externas
  const isAvailable = (b: BandOption) => {
    if (dissolvedBands.includes(b.id) || dissolvedBands.includes(b.name)) return false;
    if (currentBandName && b.name === currentBandName) return false;
    return true;
  };

  // OPCIÓN 3 SIEMPRE PRESENTE: Quedarte en tu banda actual o Asumir como Líder/Dueño si llevás 4+ temporadas
  let stayOption: BandOption | null = null;
  if (currentBandName) {
    if (seasonsInCurrentBand >= 4) {
      stayOption = {
        id: 'liderar_banda_propia',
        name: hasPermanentVocalDamage ? `Dirigir la Orquesta de ${currentBandName}` : `Liderar y Ser Dueño de ${currentBandName}`,
        logo: '👑',
        category: '⭐ LIDERAZGO & PROPIEDAD',
        actionLabel: 'Asumir el mando de',
        requiredOvr: Math.max(45, playerOvr - 5),
        baseSuccessRate: 100,
        bonusTalent: 4,
        bonusCharisma: 5,
        description: hasPermanentVocalDamage 
          ? `Llevás ${seasonsInCurrentBand} temporadas en ${currentBandName}. Tras tu lesión vocal, asumís la dirección musical de la orquesta desde el instrumento.`
          : `Llevás ${seasonsInCurrentBand} temporadas consecutivas en ${currentBandName}. Asumís la voz líder y la propiedad legal de la banda.`,
        positiveText: `¡AHORA SOS EL DIRECTOR Y DUEÑO ABSOLUTO DE ${currentBandName}! La marca es tuya.`,
        negativeText: '¡Asumiste la conducción de la banda con total éxito!',
        award: `Director y Dueño de ${currentBandName} 👑`
      };
    } else {
      stayOption = {
        id: 'quedarte_en_banda',
        name: `Quedarte en ${currentBandName}`,
        logo: '📌',
        category: '📌 CONTINUIDAD DE PROYECTO',
        actionLabel: 'Mantenerte firme en',
        requiredOvr: Math.max(40, playerOvr - 10),
        baseSuccessRate: 100,
        bonusTalent: 3,
        bonusCharisma: 3,
        description: `Renovar contrato y seguir afianzando el grupo en ${currentBandName} (${seasonsInCurrentBand}ª temporada juntos).`,
        positiveText: `¡CONTINUIDAD EN ${currentBandName}! Seguís consolidando el sonido con la banda.`,
        negativeText: '¡Renovaste contrato sin inconvenientes!'
      };
    }
  }

  // FILTRADO SEGÚN TIER DE FIGURITAS DE UPDR Y MEDIA OVR DEL JUGADOR A LOS 20, 24, 28, 32, 36 AÑOS:
  let candidates: BandOption[] = [];

  if (playerOvr >= 84) {
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr >= 84 && isAvailable(b));
  } else if (playerOvr >= 72) {
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr >= 72 && b.requiredOvr <= 83 && isAvailable(b));
  } else if (playerOvr >= 60) {
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr >= 60 && b.requiredOvr <= 71 && isAvailable(b));
  } else if (playerOvr >= 50) {
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr >= 50 && b.requiredOvr <= 59 && isAvailable(b));
  } else {
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr <= 49 && isAvailable(b));
  }

  if (candidates.length < 2) {
    candidates = MASTER_BANDS_POOL.filter(b => isAvailable(b));
  }

  // Ordenar candidatos dando prioridad a la afinidad del subgénero elegido por el jugador
  const sortedCandidates = [...candidates].sort((a, b) => {
    let scoreA = Math.random();
    let scoreB = Math.random();
    if (playerSubgenre && a.category.toLowerCase().includes(playerSubgenre.toLowerCase())) scoreA += 0.4;
    if (playerSubgenre && b.category.toLowerCase().includes(playerSubgenre.toLowerCase())) scoreB += 0.4;
    return scoreB - scoreA;
  });

  const selectedConvocations = sortedCandidates.slice(0, 2);

  if (stayOption) {
    return [...selectedConvocations, stayOption];
  }

  return selectedConvocations;
}

// ================= MÁXIMO POOL DE DILEMAS VARIADOS Y EVENTOS VIRALES (40+ ESCENARIOS) =================
export const DILEMMAS_POOL: Record<number, InPlaceDilemma[]> = {
  18: [
    {
      id: 'primer_contrato_18',
      title: 'El primer contrato: ¿Productor de traje o Independiente?',
      description: 'Un productor de la noche con traje brillante te ofrece plata rápida y ponerte a sonar en la radio si firmas la letra chica por 5 años.',
      age: 18,
      options: [
        {
          label: 'Firmar con el Productor de Traje',
          sublabel: 'Riesgo alto de estafa por fama rápida',
          icon: '💼',
          badge: 'Alto Riesgo',
          requiredOvr: 50,
          baseSuccessRate: 35,
          positive: {
            text: '¡El productor cumple! Tus temas suenan en varias radios zonales.',
            talentDelta: 1,
            charismaDelta: 3,
            staminaDelta: 0,
            moneyDelta: 200000,
            award: 'Sonando en la Radio 📻'
          },
          negative: {
            text: '¡ESTAFA #1! El tipo te roba el 80% de los shows y los derechos de tus canciones. Quedás con deudas y frustración.',
            talentDelta: -4,
            charismaDelta: -3,
            staminaDelta: -5,
            moneyDelta: -150000,
            isScam: true
          }
        },
        {
          label: 'Seguir 100% Independiente a Pulmón',
          sublabel: 'Camino difícil pero sos dueño de tu música',
          icon: '🎧',
          badge: 'Humildad',
          requiredOvr: 45,
          baseSuccessRate: 80,
          positive: {
            text: 'Subís tu enganchado casero a YouTube y la gente del barrio lo comparte de boca en boca.',
            talentDelta: 2,
            charismaDelta: 2,
            staminaDelta: 3,
            moneyDelta: 100000,
            award: 'Demo Callejero Viral 🔥'
          },
          negative: {
            text: 'El demo suena con fritura y las radios te rebotan. Toca seguir ensayando en el garage.',
            talentDelta: 0,
            charismaDelta: -1,
            staminaDelta: 1,
            moneyDelta: 15000
          }
        }
      ]
    },
    {
      id: 'camioneta_rota_ruta_18',
      title: '🚐 Se rompió la Combi de Gira camino al Baile',
      description: 'Quedan varados en la banquina de la ruta a las 2 AM con los instrumentos cargados.',
      age: 18,
      options: [
        {
          label: 'Pagar Grúa Privada con tus Ahorros',
          sublabel: 'Llegar a tiempo al show pero quedar en cero peses',
          icon: '🛠️',
          badge: 'Responsabilidad',
          requiredOvr: 45,
          baseSuccessRate: 85,
          positive: {
            text: '¡Llegaron justo a tiempo! El boliche repleto ovacionó el compromiso de la banda.',
            talentDelta: 1,
            charismaDelta: 4,
            staminaDelta: -1,
            moneyDelta: 120000,
            award: 'Puntualidad de Fierro 🛠️'
          },
          negative: {
            text: 'La grúa demoró 3 horas y llegaron cuando la bailanta ya había cerrado.',
            talentDelta: 0,
            charismaDelta: -2,
            staminaDelta: -3,
            moneyDelta: -80000
          }
        },
        {
          label: 'Pedir Flete Fiado a un Amigo del Barrio',
          sublabel: 'Cargar los timbales en la caja de una camioneta vieja',
          icon: '🛻',
          badge: 'Rebusque Criollo',
          requiredOvr: 42,
          baseSuccessRate: 75,
          positive: {
            text: '¡Llegaron cantando arriba de la caja de la camioneta! Anecdota legendaria del barrio.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: 1,
            moneyDelta: 150000,
            award: 'Mística Callejera 🛻'
          },
          negative: {
            text: 'Se cayó un platillo en la ruta y se abolló.',
            talentDelta: -1,
            charismaDelta: 0,
            staminaDelta: -2,
            moneyDelta: -30000
          }
        }
      ]
    },
    {
      id: 'invitacion_fiesta_egresados_18',
      title: '🎓 Te invitan a tocar en la Fiesta de Egresados de un Colegio',
      description: 'El centro de estudiantes de un colegio privado te ofrece buena plata para tocar en el salón de fiestas. Pero esa misma noche hay una bailanta popular gratis en tu barrio.',
      age: 18,
      options: [
        {
          label: 'Aceptar el Show Privado en el Colegio',
          sublabel: 'Cobrar bien pero alejarte de tu público natural',
          icon: '🎓',
          badge: 'Show Privado',
          requiredOvr: 44,
          baseSuccessRate: 85,
          positive: {
            text: '¡Los pibes del colegio bailaron toda la noche y te pagaron el doble! Conseguiste contactos para más eventos.',
            talentDelta: 1,
            charismaDelta: 3,
            staminaDelta: -1,
            moneyDelta: 250000,
            award: 'Rey de las Fiestas Privadas 🎓'
          },
          negative: {
            text: 'Los chicos querían reggaetón y no pegaste una con el repertorio tropical.',
            talentDelta: 0,
            charismaDelta: -2,
            staminaDelta: -1,
            moneyDelta: 50000
          }
        },
        {
          label: 'Ir a la Bailanta Popular del Barrio',
          sublabel: 'Tocar gratis pero hacerte conocer en tu zona',
          icon: '🌴',
          badge: 'Raíces Barriales',
          requiredOvr: 40,
          baseSuccessRate: 90,
          positive: {
            text: '¡Se corrió la bola en todo el barrio! Ahora te paran por la calle para saludarte.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: 2,
            moneyDelta: 80000,
            award: 'Ídolo del Barrio 🌴'
          },
          negative: {
            text: 'Llovió fuerte y solo vinieron 30 personas. Pero las que estaban te aplaudieron de pie.',
            talentDelta: 1,
            charismaDelta: 1,
            staminaDelta: 0,
            moneyDelta: 20000
          }
        }
      ]
    },
    {
      id: 'banda_rival_roba_musico_18',
      title: '😤 Una Banda Rival quiere Robar a tu Timbalero',
      description: 'La banda que toca después de ustedes en el circuito le ofreció el doble de plata a tu compañero más talentoso para que se pase.',
      age: 18,
      options: [
        {
          label: 'Hablar con el Pibe y Ofrecerle un Porcentaje Mayor',
          sublabel: 'Retenerlo cediendo parte de tus ingresos',
          icon: '🤝',
          badge: 'Negociación',
          requiredOvr: 44,
          baseSuccessRate: 75,
          positive: {
            text: '¡Se quedó! Le diste un 15% más y el grupo se fortaleció con la lealtad.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: 1,
            moneyDelta: -40000
          },
          negative: {
            text: 'Se fue igual. Tuviste que buscar reemplazo de urgencia para el sábado.',
            talentDelta: -1,
            charismaDelta: -2,
            staminaDelta: -2,
            moneyDelta: -20000
          }
        },
        {
          label: 'Dejarlo ir y Buscar un Reemplazo del Barrio',
          sublabel: 'No rebajarte y confiar en los pibes de la zona',
          icon: '💪',
          badge: 'Orgullo',
          requiredOvr: 42,
          baseSuccessRate: 80,
          positive: {
            text: '¡Encontraste un pibe del barrio que toca el doble de bien! La banda sonó mejor que nunca.',
            talentDelta: 3,
            charismaDelta: 2,
            staminaDelta: 1,
            moneyDelta: 60000,
            award: 'Renovación Exitosa 💪'
          },
          negative: {
            text: 'El reemplazante no estuvo a la altura y la banda perdió un par de fechas.',
            talentDelta: -1,
            charismaDelta: -1,
            staminaDelta: -1,
            moneyDelta: -30000
          }
        }
      ]
    },
    {
      id: 'radio_local_pide_exclusiva_18',
      title: '📻 Una Radio Zonal te Pide un Tema en Exclusiva',
      description: 'El director de una FM barrial quiere que le des tu mejor tema para que suene solo en su radio por 3 meses antes de subirlo a YouTube.',
      age: 18,
      options: [
        {
          label: 'Darle la Exclusiva a la Radio',
          sublabel: 'Ganar difusión local pero resignar el alcance digital',
          icon: '📻',
          badge: 'Difusión Zonal',
          requiredOvr: 42,
          baseSuccessRate: 80,
          positive: {
            text: '¡El tema sonó 20 veces por día! Todos en la zona tararean tu canción.',
            talentDelta: 1,
            charismaDelta: 4,
            staminaDelta: 1,
            moneyDelta: 180000,
            award: 'Sonando en FM Zonal 📻'
          },
          negative: {
            text: 'La radio solo lo pasó 2 veces y después lo sacaron de rotación.',
            talentDelta: 0,
            charismaDelta: -1,
            staminaDelta: 0,
            moneyDelta: 30000
          }
        },
        {
          label: 'Subirlo Directo a YouTube y Redes',
          sublabel: 'Apostar al alcance masivo de internet',
          icon: '📱',
          badge: 'Estrategia Digital',
          requiredOvr: 43,
          baseSuccessRate: 70,
          positive: {
            text: '¡5.000 vistas en la primera semana! Para un pibe del barrio es un golazo.',
            talentDelta: 2,
            charismaDelta: 2,
            staminaDelta: 1,
            moneyDelta: 120000,
            award: 'Debut Digital Viral 📱'
          },
          negative: {
            text: 'El video se perdió entre millones de contenidos y casi nadie lo vio.',
            talentDelta: 0,
            charismaDelta: 0,
            staminaDelta: 0,
            moneyDelta: 10000
          }
        }
      ]
    }
  ],
  22: [
    {
      id: 'jugador_futbol_viral',
      title: '⚽ ¡Un Jugador de la Selección subió tu tema a sus Redes!',
      description: 'Un crack de la Selección Argentina subió un video en la concentración bailando tu tema antes de un partido crucial.',
      age: 22,
      options: [
        {
          label: 'Aprovechar la ola y lanzar el videoclip oficial YA',
          sublabel: 'Invertir ahorros para potenciar el pico de tendencia',
          icon: '🚀',
          badge: 'Viral Mundial',
          requiredOvr: 55,
          baseSuccessRate: 85,
          positive: {
            text: '¡NÚMERO #1 EN TENDENCIAS DE YOUTUBE! El video revienta las redes y tu media OVR se dispara.',
            talentDelta: 3,
            charismaDelta: 6,
            staminaDelta: 0,
            moneyDelta: 1200000,
            award: '#1 En Tendencias YouTube 🚀'
          },
          negative: {
            text: 'El servidor de distribución se cayó por saturación y perdiste el pico de reproducciones.',
            talentDelta: 0,
            charismaDelta: -1,
            staminaDelta: -1,
            moneyDelta: -100000
          }
        },
        {
          label: 'Hacer Vivo Acústico en Programa de Radio Zonal',
          sublabel: 'Dar una entrevista íntima y tocar temas a capela',
          icon: '📻',
          badge: 'Difusión Zonal',
          requiredOvr: 50,
          baseSuccessRate: 85,
          positive: {
            text: '¡GRAN ENTREVISTA! Los oyentes llamaron a la radio pidiendo que pasen tu tema todo el día.',
            talentDelta: 2,
            charismaDelta: 4,
            staminaDelta: 1,
            moneyDelta: 300000,
            award: 'Radio Acústico Zonal 📻'
          },
          negative: {
            text: 'Corte de luz en la emisora durante la emisión en directo.',
            talentDelta: 0,
            charismaDelta: -1,
            staminaDelta: 0,
            moneyDelta: 50000
          }
        }
      ]
    },
    {
      id: 'remix_urban_rkt_22',
      title: '🎛️ Productor Urbano te ofrece hacer un Remix RKT',
      description: 'Un famoso DJ del momento te propone remezclar tu tema tropical con ritmos urbanos para boliches.',
      age: 22,
      options: [
        {
          label: 'Lanzar el Remix RKT para Boliches',
          sublabel: 'Ganar público joven y sonar en todos los boliches',
          icon: '🔥',
          badge: 'Fiesta Bailable',
          requiredOvr: 54,
          baseSuccessRate: 80,
          positive: {
            text: '¡HIT EN TODOS LOS BOLICHES! El tema suena desde las 3 AM a pura fiesta.',
            talentDelta: 2,
            charismaDelta: 5,
            staminaDelta: 1,
            moneyDelta: 750000,
            award: 'Remix Bailable del Año 🎛️'
          },
          negative: {
            text: 'La mezcla de sonido quedó saturada y a los fans tradicionales no les gustó.',
            talentDelta: -1,
            charismaDelta: -2,
            staminaDelta: 0,
            moneyDelta: -50000
          }
        },
        {
          label: 'Mantenerte Fiel al Estilo Tropical Tradicional',
          sublabel: 'Consolidar tu público de peñas y bailantas',
          icon: '🪗',
          badge: 'Tradición',
          requiredOvr: 52,
          baseSuccessRate: 85,
          positive: {
            text: '¡RESPETO DE LOS PIONEROS! Los referentes de la cumbia valoraron tu lealtad al ritmo original.',
            talentDelta: 3,
            charismaDelta: 3,
            staminaDelta: 2,
            moneyDelta: 400000,
            award: 'Guardián del Ritmo 🪗'
          },
          negative: {
            text: 'Los boliches de moda prefirieron poner temas de la competencia.',
            talentDelta: 0,
            charismaDelta: -1,
            staminaDelta: 0,
            moneyDelta: 100000
          }
        }
      ]
    },
    {
      id: 'gira_primavera_rosario_22',
      title: '🌸 Festival de la Primavera en Rosario',
      description: 'Te invitan a cerrar el escenario principal en el Parque España ante 40.000 jóvenes.',
      age: 22,
      options: [
        {
          label: 'Aceptar ser la Banda Cierre del Festival',
          sublabel: 'Hacer estallar a miles de jóvenes junto al río',
          icon: '🌊',
          badge: 'Festival Multitudinario',
          requiredOvr: 56,
          baseSuccessRate: 85,
          positive: {
            text: '¡OVACIÓN EN ROSARIO! La multitud bailó bajo la luna junto al Paraná.',
            talentDelta: 3,
            charismaDelta: 4,
            staminaDelta: 2,
            moneyDelta: 600000,
            award: 'Estrella de la Primavera 🌸'
          },
          negative: {
            text: 'Fallas técnicas en los micrófonos de escenario demoraron la presentación.',
            talentDelta: 0,
            charismaDelta: -2,
            staminaDelta: -1,
            moneyDelta: -30000
          }
        },
        {
          label: 'Hacer Gira Maratónica por Boliches de la Costa',
          sublabel: 'Tocar en 6 boliches diferentes en una sola noche',
          icon: '🌴',
          badge: 'Maratón Cumbiero',
          requiredOvr: 53,
          baseSuccessRate: 80,
          positive: {
            text: '¡RECAUDACIÓN RÉCORD! Corriste de boliche en boliche y cobraste todo en efectivo.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: -3,
            moneyDelta: 900000,
            award: 'Maratón de Noche 🌴'
          },
          negative: {
            text: 'Quedaron varados en la ruta por pinchadura de goma y rebotaron en 2 boliches.',
            talentDelta: -1,
            charismaDelta: -2,
            staminaDelta: -4,
            moneyDelta: -150000
          }
        }
      ]
    }
  ],
  26: [
    {
      id: 'video_desafinada_viral_vs_fonoaudiologo',
      title: '📱 Video Viral Desafinando vs. Fonoaudiólogo',
      description: 'Se viralizó en TikTok y Twitter/X un recorte tuyo desafinando feo o metiendo un gallo en vivo. ¿Te enganchás a responder el bardo en redes o vas a entrenar urgente con un Fonoaudiólogo?',
      age: 26,
      options: [
        {
          label: 'Engancharte al Bardo en Twitter/X y responder con memes',
          sublabel: 'Aprovechar la polémica para sumar seguidores',
          icon: '🔥',
          badge: 'Quilombo Viral',
          requiredOvr: 55,
          baseSuccessRate: 40,
          positive: {
            text: '¡Manejaste la polémica con humor brillante! Te invitan a streamings y ganas miles de seguidores por tu buena onda.',
            talentDelta: 0,
            charismaDelta: 4,
            staminaDelta: -2,
            moneyDelta: 500000,
            award: 'Rey del Bardo Viral 🔥'
          },
          negative: {
            text: '¡CANCELACIÓN EN REDES! El recorte se convirtió en meme nacional, te hicieron canciones de burla y bajó tu imagen pública.',
            talentDelta: -3,
            charismaDelta: -5,
            staminaDelta: -4,
            moneyDelta: -300000
          }
        },
        {
          label: 'Ignorar el bardo e ir a entrenar con un Fonoaudiólogo',
          sublabel: 'Pulir tu afinación y perfeccionar tu técnica vocal',
          icon: '🫁',
          badge: 'Profesionalismo',
          requiredOvr: 58,
          baseSuccessRate: 90,
          positive: {
            text: '¡AVANCE ESPECTACULAR! El fonoaudiólogo corrigió tu técnica, afinás como los dioses y dejaste callados a todos los haters.',
            talentDelta: 4,
            charismaDelta: 2,
            staminaDelta: 5,
            moneyDelta: 400000,
            award: 'Técnica Vocal e Instrumental Impecable 💎'
          },
          negative: {
            text: 'Las clases costaron bastante dinero y el video siguió circulando un par de semanas.',
            talentDelta: 1,
            charismaDelta: -1,
            staminaDelta: 2,
            moneyDelta: 150000
          }
        }
      ]
    },
    {
      id: 'gira_europa_espana_26',
      title: '✈️ Propuesta de Gira por España (Madrid & Barcelona)',
      description: 'Un organizador de eventos en Europa te propone viajar 3 semanas para tocar en salas de Madrid, Barcelona y Valencia.',
      age: 26,
      options: [
        {
          label: 'Cruzar el Atlántico y Hacer la Gira Europea',
          sublabel: 'Conquistar al público emigrante en España',
          icon: '🇪🇸',
          badge: 'Tour Internacional',
          requiredOvr: 68,
          baseSuccessRate: 80,
          positive: {
            text: '¡LLENO TOTAL EN MADRID Y BARCELONA! Los argentinos residiendo en Europa cantaron con lágrimas de emoción.',
            talentDelta: 3,
            charismaDelta: 6,
            staminaDelta: -2,
            moneyDelta: 2500000,
            award: 'Conquista de España 🇪🇸'
          },
          negative: {
            text: 'El costo de pasajes y viáticos comió gran parte de las ganancias.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: -3,
            moneyDelta: 400000
          }
        },
        {
          label: 'Hacer Temporada de Verano en la Costa Atlántica',
          sublabel: 'Tocar todos los días en Mar del Plata, Pinamar y Villa Gesell',
          icon: '🌊',
          badge: 'Temporada de Verano',
          requiredOvr: 62,
          baseSuccessRate: 85,
          positive: {
            text: '¡TEMPORADA RÉCORD! Hiciste bailar a miles de turistas durante todo el verano.',
            talentDelta: 2,
            charismaDelta: 4,
            staminaDelta: 1,
            moneyDelta: 1800000,
            award: 'Rey de la Costa Atlántica 🌊'
          },
          negative: {
            text: 'Lluvias continuas en enero arruinaron varias fechas al aire libre.',
            talentDelta: 0,
            charismaDelta: 0,
            staminaDelta: -1,
            moneyDelta: 600000
          }
        }
      ]
    },
    {
      id: 'robo_instrumentos_camioneta_26',
      title: '🚌 Robo de la Camioneta de Gira con todos los Instrumentos',
      description: 'A la salida de un boliche en La Plata, rompen la cerradura del micro de gira y se llevan las consolas, timbales y teclados.',
      age: 26,
      options: [
        {
          label: 'Hacer una Rifa Solidaria con los Fans y Colecta',
          sublabel: 'Pedir apoyo a tu comunidad cumbiera en Instagram',
          icon: '🤝',
          badge: 'Unión Cumbiera',
          requiredOvr: 60,
          baseSuccessRate: 85,
          positive: {
            text: '¡SOLIDARIDAD POPULAR! Los fans juntaron la plata en 48 horas y compraste equipos de mejor calidad.',
            talentDelta: 1,
            charismaDelta: 5,
            staminaDelta: 2,
            moneyDelta: 800000,
            award: 'Pueblo Cumbiero Unido ❤️'
          },
          negative: {
            text: 'Se recaudó solo una parte y tuvieron que alquilar consolas viejas.',
            talentDelta: 0,
            charismaDelta: 1,
            staminaDelta: -2,
            moneyDelta: 100000
          }
        },
        {
          label: 'Pedir Préstamo de Urgencia a la Discográfica',
          sublabel: 'Firmar adelanto de regalías para comprar equipos importados',
          icon: '💳',
          badge: 'Adelanto Financiero',
          requiredOvr: 64,
          baseSuccessRate: 75,
          positive: {
            text: 'Compraste un sonido de última generación que hace temblar cada boliche.',
            talentDelta: 3,
            charismaDelta: 2,
            staminaDelta: 1,
            moneyDelta: -300000,
            award: 'Sonido Alta Gama 🎛️'
          },
          negative: {
            text: 'Los intereses de la discográfica te ahogaron financieramente por varios meses.',
            talentDelta: 0,
            charismaDelta: -1,
            staminaDelta: -3,
            moneyDelta: -600000
          }
        }
      ]
    },
    {
      id: 'romance_mediatico_botinera_26',
      title: '📸 Tapa de Revista de Chismes por Romance Medíatico',
      description: 'Te fotografían a la salida de una fiesta con una famosa figura del espectáculo. La prensa rosa quiere entrevistarte.',
      age: 26,
      options: [
        {
          label: 'Irme de Gira por Canales de Televisión y Chismes',
          sublabel: 'Aprovechar la fama de la farándula para ganar carisma',
          icon: '📸',
          badge: 'Repercusión Mediática',
          requiredOvr: 62,
          baseSuccessRate: 60,
          positive: {
            text: '¡EXPLOSIÓN EN LA TV! Te convertís en la figura tropical del momento y tus shows se agotan.',
            talentDelta: 0,
            charismaDelta: 6,
            staminaDelta: -1,
            moneyDelta: 900000,
            award: 'Estrella de la Farándula 🌟'
          },
          negative: {
            text: 'El chisme se convirtió en escándalo vergonzoso y te desorientó de los ensayos.',
            talentDelta: -2,
            charismaDelta: -3,
            staminaDelta: -3,
            moneyDelta: -100000
          }
        },
        {
          label: 'Rechazar la Prensa e Ignorar el Rumor',
          sublabel: 'Enfocarte 100% en componer nuevos temas en el estudio',
          icon: '🎧',
          badge: 'Concentración Musicial',
          requiredOvr: 60,
          baseSuccessRate: 90,
          positive: {
            text: 'El rumor pasó rápido y lanzaste un enganchado que fue furor de reproducciones.',
            talentDelta: 4,
            charismaDelta: 2,
            staminaDelta: 3,
            moneyDelta: 500000,
            award: 'Enfoque Profesional 🎧'
          },
          negative: {
            text: 'Perdiste la oportunidad de salir en canales de televisión abierta.',
            talentDelta: 1,
            charismaDelta: -1,
            staminaDelta: 1,
            moneyDelta: 100000
          }
        }
      ]
    }
  ],
  30: [
    {
      id: 'demanda_plagio_o_disco',
      title: 'Demanda por Plagio de tu Mayor Hit',
      description: 'Una discográfica internacional te intima legalmente asegurando que el estribillo de tu hit más escuchado fue plagiado.',
      age: 30,
      options: [
        {
          label: 'Ir a Juicio y Pelear por la Autoría',
          sublabel: 'Arriesgar una fortuna en abogados y derechos',
          icon: '⚖️',
          badge: 'Batalla Legal',
          requiredOvr: 70,
          baseSuccessRate: 40,
          positive: {
            text: '¡GANASTE EL JUICIO! El juez dictamina que la canción es 100% tuya y te indemnizan por daños.',
            talentDelta: 3,
            charismaDelta: 3,
            staminaDelta: 0,
            moneyDelta: 3500000,
            award: 'Justicia Cumbiera ⚖️'
          },
          negative: {
            text: '¡ESTAFA JUDICIAL Y EMBARGO! Los abogados de la discográfica te aplastan. Te embargan las regalías de tus temas y perdés los derechos.',
            talentDelta: -6,
            charismaDelta: -5,
            staminaDelta: -6,
            moneyDelta: -3000000,
            isScam: true,
            isLawsuitLoss: true
          }
        },
        {
          label: 'Pagar un Acuerdo Extrajudicial y Sacar Nuevo Álbum',
          sublabel: 'Cerrar el conflicto rápido y componer temas nuevos',
          icon: '🎼',
          badge: 'Paz Mental',
          requiredOvr: 68,
          baseSuccessRate: 85,
          positive: {
            text: 'Superás el mal trago componiendo un disco de autor brillante que gana el Premio Gardel.',
            talentDelta: 3,
            charismaDelta: 3,
            staminaDelta: 1,
            moneyDelta: -600000,
            award: 'Premio Gardel Mejor Álbum 🏆'
          },
          negative: {
            text: 'El acuerdo te costó caro y el nuevo álbum vendió moderado.',
            talentDelta: 1,
            charismaDelta: 0,
            staminaDelta: -1,
            moneyDelta: -1200000
          }
        }
      ]
    },
    {
      id: 'show_privado_punta_este_30',
      title: '💎 Show Privado para Empresario en Punta del Este',
      description: 'Un magnate te ofrece u$s 80.000 por tocar un recital exclusivo de 1 hora en una mansión de Punta del Este la misma noche de un show popular reservado.',
      age: 30,
      options: [
        {
          label: 'Aceptar el Show Privado Millonario en Punta del Este',
          sublabel: 'Cobrar en dólares en efectivo y reprogramar la fecha popular',
          icon: '💵',
          badge: 'Dólares en Efectivo',
          requiredOvr: 76,
          baseSuccessRate: 80,
          positive: {
            text: '¡RECAUDACIÓN EN DÓLARES! Cobraste la cifra más alta de tu carrera y reprogramaste el show sin problemas.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: 1,
            moneyDelta: 8000000,
            award: 'Cachet VIP Internacional 💎'
          },
          negative: {
            text: 'La prensa te criticó duro por haber dejado plantado al público popular esa noche.',
            talentDelta: 0,
            charismaDelta: -4,
            staminaDelta: -1,
            moneyDelta: 5000000
          }
        },
        {
          label: 'Cumplir con el Show Popular Vendido en la Bailanta',
          sublabel: 'Rechazar los dólares y priorizar la palabra dada a tu público',
          icon: '❤️',
          badge: 'Fidelidad Popular',
          requiredOvr: 72,
          baseSuccessRate: 95,
          positive: {
            text: '¡RESPETO ABSOLUTO! La bailanta colmada te ovacionó cuando supieron que rechazaste una fortuna por cantar para ellos.',
            talentDelta: 3,
            charismaDelta: 6,
            staminaDelta: 2,
            moneyDelta: 2000000,
            award: 'Ídolo del Pueblo ❤️'
          },
          negative: {
            text: 'El show salió bárbaro pero dejaste ir una fortuna en dólares.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: 0,
            moneyDelta: 1000000
          }
        }
      ]
    },
    {
      id: 'biopic_serie_documental_30',
      title: '📺 Propuesta de Serie Documental de tu Vida en Streaming',
      description: 'Una importante plataforma de streaming te propone producir una biopic de 6 capítulos contando la historia de tu carrera.',
      age: 30,
      options: [
        {
          label: 'Aceptar la Biopic y Abrir las Puertas de tu Historia',
          sublabel: 'Cobrar derechos de autor multimillonarios y fama global',
          icon: '🎬',
          badge: 'Estrella de Streaming',
          requiredOvr: 74,
          baseSuccessRate: 85,
          positive: {
            text: '¡SERIE ÉXITO EN TODA HISPANOAMÉRICA! Millones de personas conocen tus orígenes y tus temas se vuelven virales de nuevo.',
            talentDelta: 2,
            charismaDelta: 6,
            staminaDelta: 1,
            moneyDelta: 4500000,
            award: 'Biopic Récord de Vistas 🎬'
          },
          negative: {
            text: 'El guion dramatizó demasiado los conflictos de tu vida privada y generó roces con amigos del barrio.',
            talentDelta: 0,
            charismaDelta: -2,
            staminaDelta: -2,
            moneyDelta: 1500000
          }
        },
        {
          label: 'Rechazar la Serie para Proteger tu Intimidad',
          sublabel: 'Rechazar la oferta y enfocar el presupuesto en hacer un Estadio Gran Rex',
          icon: '👑',
          badge: 'Integridad',
          requiredOvr: 72,
          baseSuccessRate: 90,
          positive: {
            text: '¡GRAN REX SOLD OUT! Demostraste que tu música habla por sí sola sin necesidad de chismes televisivos.',
            talentDelta: 4,
            charismaDelta: 3,
            staminaDelta: 3,
            moneyDelta: 2000000,
            award: 'Consagración Escénica 👑'
          },
          negative: {
            text: 'Perdiste la suma millonaria que ofrecía la plataforma de streaming.',
            talentDelta: 1,
            charismaDelta: 0,
            staminaDelta: 1,
            moneyDelta: 500000
          }
        }
      ]
    },
    {
      id: 'updr_zapada_evento_exclusivo',
      title: '🎙️ Invitación Especial a la Zapada en Vivo de Un Poco de Ruido',
      description: 'Pinky y el equipo de UPDR te invitan en persona a sentarte a la mesa en el streaming de cumbia más visto del país.',
      age: 30,
      options: [
        {
          label: 'Romperla en la Zapada En Vivo con Enganchados Históricos',
          sublabel: 'Tocar solos improvisados y cantar tus mejores éxitos ante 300.000 espectadores',
          icon: '🎙️',
          badge: 'Consagración Streaming',
          requiredOvr: 78,
          baseSuccessRate: 85,
          positive: {
            text: '¡PICO DE VISITAS HISTÓRICO! Pinky y toda la mesa te aplaudieron de pie. El clip acumuló 2 millones de vistas en 24 horas.',
            talentDelta: 3,
            charismaDelta: 5,
            staminaDelta: 2,
            moneyDelta: 3000000,
            award: 'Invitado Consagrado en UPDR 🎙️'
          },
          negative: {
            text: 'Entraste un segundo cruzado en el repique pero lo sacaste adelante con pura simpatía.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: 1,
            moneyDelta: 1000000
          }
        },
        {
          label: 'Dar una Entrevista Íntima y Repasar tu Historia',
          sublabel: 'Contar tus orígenes humildes y reflexionar sobre tus 15 años de carrera',
          icon: '🛋️',
          badge: 'Corazón UPDR',
          requiredOvr: 70,
          baseSuccessRate: 95,
          positive: {
            text: '¡EMOCIÓN EN EL PISO! Tus palabras conmovieron al público hasta las lágrimas. Tendencia absoluta en redes.',
            talentDelta: 1,
            charismaDelta: 5,
            staminaDelta: 1,
            moneyDelta: 1500000,
            award: 'Corazón UPDR 🎙️'
          },
          negative: {
            text: 'La emoción te cortó la voz al recordar tus primeros bailes de barrio.',
            talentDelta: 0,
            charismaDelta: 3,
            staminaDelta: 0,
            moneyDelta: 500000
          }
        }
      ]
    }
  ],
  34: [
    {
      id: 'nodulos_garganta_o_reposo',
      title: 'Nódulos en las Cuerdas Vocales: ¿Infiltrarse o Parar?',
      description: 'El médico te diagnostica nódulos severos por cantar 8 boliches por fin de semana. Tenés la gira de invierno ya vendida.',
      age: 34,
      options: [
        {
          label: 'Infiltrarse la Garganta y Cantar Toda la Gira',
          sublabel: 'Cobrar millones pero arriesgar tu voz para siempre',
          icon: '💉',
          badge: 'Riesgo Extremo',
          requiredOvr: 80,
          baseSuccessRate: 20,
          positive: {
            text: 'Milagrosamente la voz aguantó y cobraste una recaudación récord de la gira.',
            talentDelta: 1,
            charismaDelta: 3,
            staminaDelta: -5,
            moneyDelta: 5000000,
            award: 'Mártir del Escenario ⚡'
          },
          negative: {
            text: '¡ROTURA DE CUERDAS VOCALES! En el tercer show te quedás mudo en el escenario. Operación de urgencia y pérdida permanente de registro vocal.',
            talentDelta: -8,
            charismaDelta: -6,
            staminaDelta: -12,
            moneyDelta: -2500000,
            isVocalDamage: true
          }
        },
        {
          label: 'Suspender la Gira y Hacer 4 Meses de Reposo Médico',
          sublabel: 'Perder dinero de shows pero salvar tu salud',
          icon: '🏥',
          badge: 'Cuidado Médico',
          requiredOvr: 72,
          baseSuccessRate: 90,
          positive: {
            text: 'Tus cuerdas vocales cicatrizan a la perfección. Volvés renovado y con la voz recuperada.',
            talentDelta: 2,
            charismaDelta: 1,
            staminaDelta: 6,
            moneyDelta: -800000,
            award: 'Voz Resucitada 🕊️'
          },
          negative: {
            text: 'Los productores te cobraron multas por suspender fechas, pero salvaste tu carrera.',
            talentDelta: 0,
            charismaDelta: -2,
            staminaDelta: 3,
            moneyDelta: -1500000
          }
        }
      ]
    },
    {
      id: 'bebida_marca_propia_34',
      title: '🍹 Lanzamiento de tu Propia Marca de Fernet / Aperitivo',
      description: 'Una importante destilería nacional te ofrece asociarte para crear un aperitivo cumbiero con tu firma en la etiqueta.',
      age: 34,
      options: [
        {
          label: 'Lanzar el Fernet Cumbiero Marca Propia',
          sublabel: 'Inundar los boliches y recitales con tu bebida oficial',
          icon: '🍸',
          badge: 'Imperio Comercial',
          requiredOvr: 78,
          baseSuccessRate: 85,
          positive: {
            text: '¡RECAUDACIÓN MULTIMILLONARIA! El aperitivo se agota en todos los supermercados y boliches del país.',
            talentDelta: 1,
            charismaDelta: 5,
            staminaDelta: 0,
            moneyDelta: 6000000,
            award: 'Magnate de la Noche 🍸'
          },
          negative: {
            text: 'Hubo problemas de embotellado y faltó stock en las principales provincias.',
            talentDelta: 0,
            charismaDelta: 0,
            staminaDelta: -1,
            moneyDelta: 1000000
          }
        },
        {
          label: 'Crear una Fundación Solidaria de Música para Chicos del Barrio',
          sublabel: 'Comprar instrumentos y dar clases gratuitas en tu zona de origen',
          icon: '❤️',
          badge: 'Corazón Solidario',
          requiredOvr: 75,
          baseSuccessRate: 95,
          positive: {
            text: '¡AMOR ETERNO DEL PUEBLO! Inaugurás el centro cultural cumbiero y formás a la nueva generación de músicos.',
            talentDelta: 3,
            charismaDelta: 6,
            staminaDelta: 4,
            moneyDelta: -1000000,
            award: 'Héroe del Barrio ❤️'
          },
          negative: {
            text: 'Mantener la fundación requiere inversión constante de tu bolsillo, pero la recompensa espiritual es enorme.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: 2,
            moneyDelta: -2000000
          }
        }
      ]
    },
    {
      id: 'reality_show_tropical_34',
      title: '📺 Te Ofrecen Ser Jurado de un Reality Show Tropical',
      description: 'Un canal de TV abierta quiere que seas jurado del nuevo reality "Cantando Cumbia". Grabás 3 meses seguidos de lunes a viernes en Capital.',
      age: 34,
      options: [
        {
          label: 'Aceptar el Reality y Mudarte a Capital 3 Meses',
          sublabel: 'Cobrar una fortuna pero parar las giras completamente',
          icon: '📺',
          badge: 'Estrella de TV',
          requiredOvr: 78,
          baseSuccessRate: 80,
          positive: {
            text: '¡RATING RÉCORD! Te convertiste en la figura más querida del programa y todos quieren sacarse fotos con vos.',
            talentDelta: 1,
            charismaDelta: 6,
            staminaDelta: -3,
            moneyDelta: 5000000,
            award: 'Jurado Estrella de TV 📺'
          },
          negative: {
            text: 'El programa no levantó rating y te criticaron por dejar las giras para hacer televisión.',
            talentDelta: -1,
            charismaDelta: -3,
            staminaDelta: -2,
            moneyDelta: 1500000
          }
        },
        {
          label: 'Rechazar la TV y Hacer Gira por las 23 Provincias',
          sublabel: 'Priorizar la música en vivo y el contacto directo con tu gente',
          icon: '🇦🇷',
          badge: 'Gira Federal',
          requiredOvr: 76,
          baseSuccessRate: 90,
          positive: {
            text: '¡GIRA HISTÓRICA! Hiciste sold-out en 23 provincias y marcaste un récord de recaudación en vivo.',
            talentDelta: 3,
            charismaDelta: 4,
            staminaDelta: -2,
            moneyDelta: 4000000,
            award: 'Gira Federal Histórica 🇦🇷'
          },
          negative: {
            text: 'Algunas provincias no vendieron bien y el desgaste físico fue brutal.',
            talentDelta: 1,
            charismaDelta: 1,
            staminaDelta: -4,
            moneyDelta: 1200000
          }
        }
      ]
    },
    {
      id: 'sponsor_marca_ropa_34',
      title: '👟 Propuesta de Sponsor con Marca de Ropa Deportiva',
      description: 'Una marca internacional de zapatillas quiere que seas su embajador oficial en Argentina para una colección "Street Cumbia".',
      age: 34,
      options: [
        {
          label: 'Firmar el Contrato de Embajador por 2 Años',
          sublabel: 'Cobrar en dólares pero usar solo su ropa en todos los shows',
          icon: '👟',
          badge: 'Sponsor Internacional',
          requiredOvr: 80,
          baseSuccessRate: 85,
          positive: {
            text: '¡VENTA MASIVA! La colección se agotó en 48 horas y tu cara aparece en carteles de todo el país.',
            talentDelta: 0,
            charismaDelta: 5,
            staminaDelta: 1,
            moneyDelta: 7000000,
            award: 'Embajador Internacional 👟'
          },
          negative: {
            text: 'La marca cambió de estrategia y bajó la campaña a los 3 meses. Plata corta.',
            talentDelta: 0,
            charismaDelta: -1,
            staminaDelta: 0,
            moneyDelta: 1500000
          }
        },
        {
          label: 'Sacar tu Propia Línea de Ropa Cumbiera',
          sublabel: 'Invertir tus ahorros en diseñar y producir tu marca propia',
          icon: '🧢',
          badge: 'Emprendedor',
          requiredOvr: 76,
          baseSuccessRate: 65,
          positive: {
            text: '¡TU MARCA EXPLOTÓ! Las gorras y remeras se venden en todos los boliches del país.',
            talentDelta: 1,
            charismaDelta: 4,
            staminaDelta: 0,
            moneyDelta: 4000000,
            award: 'Imperio Textil Cumbiero 🧢'
          },
          negative: {
            text: 'La producción se demoró y el stock no llegó a tiempo para la temporada de verano.',
            talentDelta: 0,
            charismaDelta: -2,
            staminaDelta: -1,
            moneyDelta: -1500000
          }
        }
      ]
    }
  ],
  38: [
    {
      id: 'el_concierto_despedida',
      title: '🏆 El Concierto de Despedida: ¿Estadio Histórico o Bailantas de Pueblo?',
      description: 'Llegaste a los 38 años. Es momento de coronar tu historia en la música popular argentina.',
      age: 38,
      options: [
        {
          label: 'Mega Concierto de Despedida en Estadio',
          sublabel: 'Con orquesta, invitados históricos y transmisión global',
          icon: '👑',
          badge: 'Gloria Eterna',
          requiredOvr: 85,
          baseSuccessRate: 80,
          positive: {
            text: '¡APOTEOSIS HISTÓRICA! 80.000 personas cantando con lágrimas en los ojos. Sos una LEYENDA VIVIENTE de la música argentina.',
            talentDelta: 3,
            charismaDelta: 5,
            staminaDelta: 2,
            moneyDelta: 10000000,
            award: 'Leyenda Popular Eterna 👑'
          },
          negative: {
            text: 'Llovió a cántaros pero la gente no se movió de la tribuna. Un cierre inolvidable.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: -2,
            moneyDelta: 5000000
          }
        },
        {
          label: 'Gira Íntima de Despedida por las Bailantas de Barrio',
          sublabel: 'Volver a los clubes populares donde naciste',
          icon: '🌴',
          badge: 'Amor Popular',
          requiredOvr: 70,
          baseSuccessRate: 95,
          positive: {
            text: 'El pueblo de la bailanta te despide con abrazos y banderas. Te convertís en el ídolo más querido de la gente.',
            talentDelta: 2,
            charismaDelta: 4,
            staminaDelta: 3,
            moneyDelta: 4000000,
            award: 'Hijo Pródigo de la Bailanta ❤️'
          },
          negative: {
            text: 'Desbordaron los boliches de gente que quería saludarte una última vez.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: 0,
            moneyDelta: 2500000
          }
        }
      ]
    },
    {
      id: 'homenaje_premios_gardel_38',
      title: '🥇 Homenaje a la Trayectoria en los Premios Gardel',
      description: 'La industria de la música argentina te otorga el Premio Gardel a la Trayectoria Popular.',
      age: 38,
      options: [
        {
          label: 'Dar Discurso de Leyenda Viva y Tocar en Vivo',
          sublabel: 'Agradecer a tus fans y hacer cantar a todos los referentes presentes',
          icon: '🏆',
          badge: 'Inmortalidad',
          requiredOvr: 80,
          baseSuccessRate: 90,
          positive: {
            text: '¡OVACIÓN DE PIE DE TODA LA INDUSTRIA MUSICAL! Músicos de todos los géneros te abrazan con reverencia.',
            talentDelta: 3,
            charismaDelta: 6,
            staminaDelta: 3,
            moneyDelta: 3000000,
            award: 'Premio Gardel a la Trayectoria 🏆'
          },
          negative: {
            text: 'La emoción te hizo nudo en la garganta al hablar de tus orígenes.',
            talentDelta: 1,
            charismaDelta: 4,
            staminaDelta: 1,
            moneyDelta: 1000000
          }
        },
        {
          label: 'Armar Gran Enganchado Final Sorpresa con Artistas Emergentes',
          sublabel: 'Invitar a los jóvenes talentos de la cumbia actual al escenario',
          icon: '🌟',
          badge: 'Legado Musical',
          requiredOvr: 75,
          baseSuccessRate: 95,
          positive: {
            text: '¡EL PASO DE ANTORCHA! Demostraste humildad dorada abriendo camino a las nuevas generaciones.',
            talentDelta: 4,
            charismaDelta: 5,
            staminaDelta: 4,
            moneyDelta: 2500000,
            award: 'Padrino de la Cumbia 🌟'
          },
          negative: {
            text: 'El enganchado se extendió más de la cuenta pero la fiesta fue inagotable.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: 1,
            moneyDelta: 1500000
          }
        }
      ]
    },
    {
      id: 'libro_autobiografia_38',
      title: '📖 Editorial te Propone Escribir tu Autobiografía',
      description: 'Una editorial reconocida quiere publicar tu historia: "Del Barrio al Estadio". Tenés que abrir tu vida entera al público.',
      age: 38,
      options: [
        {
          label: 'Escribir el Libro y Contar Todo sin Filtro',
          sublabel: 'Revelar los momentos más oscuros y gloriosos de tu carrera',
          icon: '📖',
          badge: 'Legado Literario',
          requiredOvr: 78,
          baseSuccessRate: 85,
          positive: {
            text: '¡BEST-SELLER NACIONAL! Tu libro se agotó en 2 semanas y ya hay ofertas para traducirlo al portugués y español internacional.',
            talentDelta: 2,
            charismaDelta: 5,
            staminaDelta: 1,
            moneyDelta: 3500000,
            award: 'Autor Best-Seller 📖'
          },
          negative: {
            text: 'Algunas revelaciones del libro generaron polémica con ex-compañeros de banda.',
            talentDelta: 0,
            charismaDelta: -2,
            staminaDelta: -1,
            moneyDelta: 800000
          }
        },
        {
          label: 'Producir un Documental Musical en su Lugar',
          sublabel: 'Contar tu historia pero dejando que la música hable por vos',
          icon: '🎬',
          badge: 'Documental Musical',
          requiredOvr: 76,
          baseSuccessRate: 90,
          positive: {
            text: '¡DOCUMENTAL PREMIADO! Ganó el premio al mejor documental musical en un festival de cine nacional.',
            talentDelta: 3,
            charismaDelta: 4,
            staminaDelta: 2,
            moneyDelta: 2500000,
            award: 'Documental Premiado 🎬'
          },
          negative: {
            text: 'El documental tuvo poca difusión y se vio más por YouTube que en las salas.',
            talentDelta: 1,
            charismaDelta: 1,
            staminaDelta: 0,
            moneyDelta: 600000
          }
        }
      ]
    },
    {
      id: 'gira_despedida_latam_38',
      title: '✈️ Gira de Despedida por Toda Latinoamérica',
      description: 'Un promotor internacional te arma una gira final por 8 países: Bolivia, Perú, Chile, Colombia, Paraguay, Uruguay, México y España.',
      age: 38,
      options: [
        {
          label: 'Hacer la Gran Gira Latina de Despedida',
          sublabel: 'Recorrer el continente tocando para las colonias argentinas y público local',
          icon: '🌎',
          badge: 'Despedida Continental',
          requiredOvr: 82,
          baseSuccessRate: 80,
          positive: {
            text: '¡SOLD-OUT EN 8 PAÍSES! Lloraste en el escenario de Lima con 40.000 personas cantando en español.',
            talentDelta: 3,
            charismaDelta: 6,
            staminaDelta: -3,
            moneyDelta: 8000000,
            award: 'Leyenda Latinoamericana 🌎'
          },
          negative: {
            text: 'El desgaste físico fue enorme y tuviste que cancelar 2 fechas por agotamiento.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: -5,
            moneyDelta: 3000000
          }
        },
        {
          label: 'Hacer 3 Noches Históricas en el Luna Park como Cierre',
          sublabel: 'Concentrar toda la emoción en 3 noches mágicas en Buenos Aires',
          icon: '🏛️',
          badge: 'Cierre Histórico',
          requiredOvr: 80,
          baseSuccessRate: 90,
          positive: {
            text: '¡3 LUNA PARK SOLD-OUT! Cada noche con invitados diferentes. La gente cantó hasta quedar ronca.',
            talentDelta: 4,
            charismaDelta: 5,
            staminaDelta: 2,
            moneyDelta: 5000000,
            award: 'Triple Luna Park Histórico 🏛️'
          },
          negative: {
            text: 'La tercera noche llovió torrencialmente pero los fans no se movieron de la fila.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: 0,
            moneyDelta: 2500000
          }
        }
      ]
    }
  ]
};

export function getRandomBandsForAge(age: number, count = 2): BandOption[] {
  const pool = MASTER_BANDS_POOL;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export const NON_OWNER_DISOLUTION_DILEMMA = (age: number): InPlaceDilemma => ({
  id: `robo_hit_disolucion_banda_${age}`,
  title: '💔 LE ROBARON EL HIT A TU BANDA & SE DISOLVIÓ EL GRUPO',
  description: 'Un sello discográfico abusivo le patentó el hit principal al dueño de la banda en la que tocás. Ante las deudas y la bronca, la banda se rompió por completo y te quedaste sin grupo.',
  age,
  options: [
    {
      label: 'Fichar como Sesionista de Emergencia y Buscar Otra Banda',
      sublabel: 'Reubicarte rápido en el circuito bailable como músico libre',
      icon: '🧳',
      badge: 'Buscar Nueva Banda',
      requiredOvr: 45,
      baseSuccessRate: 90,
      positive: {
        text: '¡NUEVO RUMBO! Te convocaron de urgencia para reemplazar a un músico y salvaste la temporada en una nueva banda.',
        talentDelta: 2,
        charismaDelta: 2,
        staminaDelta: 1,
        moneyDelta: 500000,
        award: 'Músico Resiliente 🧳'
      },
      negative: {
        text: 'Tuviste que tocar gratis en un par de fechas hasta acomodarte en un nuevo grupo.',
        talentDelta: 0,
        charismaDelta: -1,
        staminaDelta: -1,
        moneyDelta: 100000
      }
    },
    {
      label: 'Aprovechar la Disolución para Lanzar tu Propio Proyecto como Líder',
      sublabel: 'Independizarte, convocar a tus compañeros y pasar a ser el dueño del nuevo grupo',
      icon: '👑',
      badge: 'Independencia',
      requiredOvr: 56,
      baseSuccessRate: 65,
      positive: {
        text: '¡NACE TU PROPIA BANDA! Te llevaste a la base rítmica y arrancaste tu carrera como dueño y líder.',
        talentDelta: 4,
        charismaDelta: 6,
        staminaDelta: 2,
        moneyDelta: 2000000,
        award: 'Fundador Indiferente 👑'
      },
      negative: {
        text: 'El arranque del proyecto propio fue difícil y costó conseguir fechas en boliches.',
        talentDelta: 1,
        charismaDelta: 1,
        staminaDelta: -2,
        moneyDelta: -500000
      }
    }
  ]
});

export function getRandomDilemmaForAge(
  age: number, 
  hasActiveLoan?: boolean, 
  isBandOwner: boolean = false,
  usedDilemmaIds: string[] = []
): InPlaceDilemma {
  if (hasActiveLoan) {
    return {
      id: `cobro_deuda_prestamista_${age}`,
      title: '💸 EL COBRO DEL PRESTAMISTA DE LA NOCHE',
      description: 'Tras la estafa y los problemas financieros pasados, el prestamista nocturno vino al camarín a exigir el cobro inmediato de la deuda ($2.500.000) con intereses.',
      age,
      options: [
        {
          label: 'Pagar la Deuda de $2.500.000 con lo Recaudado',
          sublabel: 'Saldar cuentas, quedar limpio y librarte del prestamista para siempre',
          icon: '💵',
          badge: 'Cancelar Deuda',
          requiredOvr: 50,
          baseSuccessRate: 95,
          positive: {
            text: '¡DEUDA CANCELADA! Pagaste al contado y te liberaste de apretes y problemas legales.',
            talentDelta: 1,
            charismaDelta: 2,
            staminaDelta: 1,
            moneyDelta: -2500000,
            award: 'Libre de Deudas 🕊️'
          },
          negative: {
            text: 'Tuviste que entregar las luces y parlantes propios para cubrir los intereses.',
            talentDelta: -1,
            charismaDelta: -2,
            staminaDelta: 0,
            moneyDelta: -3000000
          }
        },
        {
          label: 'Enfrentar al Prestamista y Negarte a Pagar Usura',
          sublabel: 'Arriesgarte a un embargo judicial o aprete violento en la puerta del boliche',
          icon: '⚖️',
          badge: 'Riesgo Extremo',
          requiredOvr: 70,
          baseSuccessRate: 40,
          positive: {
            text: '¡SE RETIRARON SIN UN MANGO! Tu firmeza y la gente del boliche los hicieron recular.',
            talentDelta: 2,
            charismaDelta: 4,
            staminaDelta: 1,
            moneyDelta: 0,
            award: 'Carácter Indomable 🛡️'
          },
          negative: {
            text: '¡EMBARGO JUDICIAL & BANCARROTA! El juez te congeló los bienes por pagarés firmados y secuestraron los instrumentos.',
            talentDelta: -5,
            charismaDelta: -5,
            staminaDelta: -5,
            moneyDelta: -4000000,
            isLawsuitLoss: true,
            isScam: true
          }
        }
      ]
    };
  }

  // Evento situacional raro (8% de probabilidad, máximo 1 vez por carrera): Disolución de banda por robo de hit al dueño
  const hasHadDissolution = usedDilemmaIds.some(id => id.startsWith('robo_hit_disolucion_banda_'));
  if (!isBandOwner && !hasHadDissolution && age >= 22 && age <= 34 && Math.random() < 0.08) {
    return NON_OWNER_DISOLUTION_DILEMMA(age);
  }

  let pool = DILEMMAS_POOL[age] || DILEMMAS_POOL[18];
  
  // Si NO sos el dueño de la banda, filtramos robos de derechos / hits directos
  if (!isBandOwner) {
    const nonTheft = pool.filter(d => 
      !d.title.toLowerCase().includes('derechos') && 
      !d.title.toLowerCase().includes('robo de hit') && 
      !d.description.toLowerCase().includes('marca') &&
      !d.options.some(o => o.positive.isScam || o.negative.isScam)
    );
    if (nonTheft.length > 0) pool = nonTheft;
  }

  // FILTRO ANTI-REPETICIÓN: Excluir dilemas que ya hayan salido en la partida actual
  let unplayedPool = pool.filter(d => !usedDilemmaIds.includes(d.id));
  if (unplayedPool.length === 0) {
    unplayedPool = pool;
  }

  const random = unplayedPool[Math.floor(Math.random() * unplayedPool.length)];
  return random;
}

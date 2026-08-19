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
export function calculateDynamicSuccessRate(playerOvr: number, requiredOvr: number = 50, baseRate: number = 75): number {
  const ovrDiff = playerOvr - requiredOvr;
  if (ovrDiff >= 0) {
    const bonus = ovrDiff * 2;
    return Math.min(95, Math.max(10, baseRate + bonus));
  } else {
    const penalty = Math.abs(ovrDiff) * 5;
    return Math.max(5, baseRate - penalty);
  }
}

// ================= MASTER POOL DE BANDAS Y CONVOCATORIAS (FIGURITAS UPDR) =================
export const MASTER_BANDS_POOL: BandOption[] = [
  // --- TIER BRONCE / COMÚN (OVR 40 - 58) ---
  {
    id: 'los_pibes_del_barrio',
    name: 'Los Pibes del Barrio',
    logo: '🔥',
    category: '🥉 TIER COMÚN UPDR',
    actionLabel: 'Iniciar carrera en',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 3,
    description: 'Banda inicial de amigos. Ensayos en el garage y primeros bailes en sociedades de fomento.',
    positiveText: '¡Gran debut en la sociedad de fomento! Todos bailaron y aplaudieron tu ritmo.',
    negativeText: '¡Sin fallos! Tu debut fue impecable.',
  },
  {
    id: 'la_sonora_popular',
    name: 'La Sonora Popular',
    logo: '🪗',
    category: '🥉 TIER COMÚN UPDR',
    actionLabel: 'Debut profesional con',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 4,
    bonusCharisma: 2,
    description: 'Ritmo norteño contagioso para peñas, fiestas patronales y bautismos.',
    positiveText: '¡La peña completa aplaudió tu ritmo y profesionalismo desde el primer minuto!',
    negativeText: '¡Sin fallos! Tu debut fue un éxito rotundo.',
  },
  {
    id: 'ritmo_y_cuarteto',
    name: 'Furia de Cuarteto',
    logo: '🎹',
    category: '🥉 TIER COMÚN UPDR',
    actionLabel: 'Sumarte a la fiesta de',
    requiredOvr: 40,
    baseSuccessRate: 100,
    bonusTalent: 2,
    bonusCharisma: 4,
    description: 'Tutti, piano y alegría cordobesa en clubes de barrio.',
    positiveText: '¡El club explotó de baile y energía! Te afianzaste como músico clave.',
    negativeText: '¡Sin fallos! Gran arranque festivo.',
  },
  {
    id: 'guaracha_santiaguena',
    name: 'Los Guaracheros del Norte',
    logo: '💃',
    category: '🥉 TIER COMÚN UPDR',
    actionLabel: 'Meter repique en',
    requiredOvr: 50,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Velocidad, repique y baile popular en festivales masivos.',
    positiveText: '¡El estadio del festival bailó guaracha sin parar durante 2 horas!',
    negativeText: '¡Desafortunado fallo en el sonido de la consola durante el tema principal!',
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
    id: 'cumbia_del_conurbano',
    name: 'Los Reyes de la Bailanta',
    logo: '🎤',
    category: '🥉 TIER COMÚN UPDR',
    actionLabel: 'Copar el escenario de',
    requiredOvr: 55,
    baseSuccessRate: 100,
    bonusTalent: 3,
    bonusCharisma: 4,
    description: 'Recorrida por boliches emblemáticos del Conurbano Bonaerense.',
    positiveText: '¡La pista colmada cantando cada estribillo a todo pulmón!',
    negativeText: '¡Sin fallos! Gran noche tropical.',
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

  // --- TIER ORO / GOLD (OVR 72 - 83) - FIGURITAS ORO DE UPDR ---
  {
    id: 'la_base_gonzalito',
    name: 'La Base (Gonzalito)',
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
    name: 'El Polaco & Su Banda',
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
    id: 'tambo_tambo_diego',
    name: 'Tambó Tambó (Diego Mujica)',
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
    name: 'Ráfaga (Ariel Pucheta)',
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
    name: 'Grupo Cali (Darío Zanco)',
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
    id: 'la_nueva_luna_cardozo',
    name: 'La Nueva Luna (Dani Cardozo)',
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

  // --- TIER LEYENDA (OVR 84+) - FIGURITAS LEYENDA MÍTICAS DE UPDR ---
  {
    id: 'flor_de_piedra_lescano',
    name: 'Flor de Piedra (Dany Lescano)',
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
    name: 'Amar Azul (Miguel D’Anibale)',
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
    id: 'los_palmeras_cacho_deicas',
    name: 'Los Palmeras (Cacho Deicas)',
    logo: '🌴',
    category: '👑 TIER LEYENDA UPDR',
    actionLabel: '👑 Fichar con Cacho Deicas en',
    requiredOvr: 85,
    baseSuccessRate: 100,
    award: 'Sumado a Los Palmeras con Cacho Deicas 👑',
    bonusTalent: 5,
    bonusCharisma: 7,
    description: 'Cacho Deicas te convoca en persona para sumarte a la orquesta estelar de Los Palmeras en su gira de estadios.',
    positiveText: '¡APOTEOSIS TOTAL! Cacho Deicas te abrazó en el escenario cantando "El Parrandero" ante 80.000 almas.',
    negativeText: '¡Lluvia torrencial obligó a reprogramar la fecha del estadio para el domingo!',
  },
  {
    id: 'antonio_rios_maestro',
    name: 'Antonio Ríos (El Maestro)',
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
  },
  {
    id: 'updr_zapada_especial',
    name: 'UN POCO DE RUIDO: Zapada Estelar',
    logo: '🎙️',
    category: '👑 TIER LEYENDA UPDR',
    actionLabel: 'Romperla en el vivo de',
    requiredOvr: 84,
    baseSuccessRate: 100,
    award: 'Invitado Consagrado en UPDR 🎙️',
    bonusTalent: 5,
    bonusCharisma: 7,
    description: 'Zapada estelar consagratoria en vivo en el piso de UPDR ante cientos de miles de espectadores en YouTube y Twitch.',
    positiveText: '¡PICO DE VISITAS HISTÓRICO! Pinky y los pibes te aplaudieron de pie ante 250.000 espectadores. Consagración absoluta.',
    negativeText: '¡Entraste a tiempo a destiempo en el enganchado y tuviste que repetir la toma!',
  }
];

// Obtener bandas filtradas RIGUROSAMENTE según la media OVR del jugador y Tiers del Álbum UPDR
export function getBandsForAgeAndOvr(
  age: number, 
  playerOvr: number, 
  playerRole?: string,
  currentBandName?: string
): BandOption[] {
  if (age === 16) {
    // 3 Bandas iniciales a los 16 años (Tier Común)
    return MASTER_BANDS_POOL.filter(b => b.requiredOvr === 40);
  }

  if (age === 20) {
    const defaultOption: BandOption = {
      id: 'escalar_a_cantante',
      name: currentBandName ? `Liderar ${currentBandName}` : 'Ser Cantante Líder',
      logo: '🎤',
      category: 'Voz & Liderazgo',
      actionLabel: 'Escalar y pasar a ser',
      requiredOvr: 45,
      baseSuccessRate: 100,
      bonusTalent: 4,
      bonusCharisma: 6,
      description: 'Dar el salto al micrófono principal y asumir la voz líder de la banda.',
      positiveText: '¡SALTÁS AL MICRÓFONO! El público te abraza como el nuevo cantante líder consagrado.',
      negativeText: '¡Sin fallos! Asumiste el liderazgo con total éxito.',
      award: 'Voz Líder de la Banda 🎤'
    };

    const midBands = MASTER_BANDS_POOL.filter(b => b.requiredOvr >= 48 && b.requiredOvr <= 55);
    const shuffledMid = [...midBands].sort(() => 0.5 - Math.random());
    return [defaultOption, ...shuffledMid.slice(0, 2)];
  }

  // FILTRADO SEGÚN TIER DE FIGURITAS DE UPDR Y MEDIA OVR DEL JUGADOR:
  let candidates: BandOption[] = [];

  if (playerOvr >= 84) {
    // 👑 TIER LEYENDA (Los Palmeras / Cacho Deicas, La Mona, Dany Lescano, Amar Azul, Antonio Ríos, Mario Pereyra)
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr >= 84);
  } else if (playerOvr >= 72) {
    // 🥇 TIER ORO (La Nueva Luna, Grupo Cali, Ráfaga, Tambó Tambó, El Polaco, La Champions Liga, La Base)
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr >= 72 && b.requiredOvr <= 83);
  } else if (playerOvr >= 60) {
    // 🥈 TIER CUMBIERIZED (María Becerra, Chaqueño Palavecino, Mono Kapanga, Sin Miedo, Festivales)
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr >= 60 && b.requiredOvr <= 71);
  } else {
    // 🥉 TIER COMÚN (Los Pibes del Barrio, Tropi Band, Guaracheros del Norte, Reyes de la Bailanta)
    candidates = MASTER_BANDS_POOL.filter(b => b.requiredOvr <= 58);
  }

  if (candidates.length >= 2) {
    const shuffled = [...candidates].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 2);
  }

  // Fallback cercano
  const closeBands = MASTER_BANDS_POOL.filter(b => b.requiredOvr <= playerOvr + 5 && b.requiredOvr >= playerOvr - 15);
  const shuffledFallback = [...closeBands].sort(() => 0.5 - Math.random());
  return shuffledFallback.slice(0, 2);
}

// ================= GRAN POOL DE DILEMAS VARIADOS Y EVENTOS VIRALES =================
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
    }
  ]
};

export function getRandomBandsForAge(age: number, count = 2): BandOption[] {
  const pool = MASTER_BANDS_POOL;
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getRandomDilemmaForAge(age: number): InPlaceDilemma {
  const pool = DILEMMAS_POOL[age] || DILEMMAS_POOL[18];
  const random = pool[Math.floor(Math.random() * pool.length)];
  return random;
}

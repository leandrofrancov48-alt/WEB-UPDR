import { Venue } from './types';
import { VENUES } from './venues';

export interface BandOption {
  id: string;
  name: string;
  logo: string;
  zone?: string;
  category: string;
  actionLabel: string;
  requiredOvr: number; // OVR mínimo exigido para tener buenas chances de llenar
  baseSuccessRate: number; // Probabilidad base si cumplís el OVR
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
    // Si superás el OVR exigido: +2% por cada punto de OVR extra (máximo 95%)
    const bonus = ovrDiff * 2;
    return Math.min(95, Math.max(10, baseRate + bonus));
  } else {
    // Si estás por debajo del OVR exigido: -5% severo por cada punto faltante (mínimo 5% de milagro)
    const penalty = Math.abs(ovrDiff) * 5;
    return Math.max(5, baseRate - penalty);
  }
}

// ================= GRAN POOL DE BANDAS Y PROYECTOS ADAPTADOS AL OVR =================
export const STAGE_BANDS_POOL: Record<number, BandOption[]> = {
  24: [
    {
      id: 'sesion_sin_miedo',
      name: 'Sesión de Sin Miedo en Vivo',
      logo: '🔥',
      category: 'Streaming & Redes',
      actionLabel: 'Grabar zapada en',
      requiredOvr: 62,
      baseSuccessRate: 85,
      award: 'Zapada Viral Sin Miedo 🔥',
      bonusTalent: 3,
      bonusCharisma: 4,
      description: 'Sesión en vivo a pura improvisación con millones de reproducciones.',
      positiveText: '¡ZAPADA VIRAL! Tu solo de instrumento explotó en TikTok y se hizo tendencia nacional.',
      negativeText: '¡Problemas de acople en la mezcla arruinaron el enganchado principal!',
      negativeTalentDelta: -1,
      negativeCharismaDelta: -2,
      negativeMoneyDelta: -50000
    },
    {
      id: 'gira_provincial_norte',
      name: 'Gira Grandes Festivales del Norte',
      logo: '🪗',
      category: 'Cumbia Norteña & Guaracha',
      actionLabel: 'Encabezar la gira por',
      requiredOvr: 60,
      baseSuccessRate: 80,
      award: 'Giro del Norte 🪗',
      bonusTalent: 3,
      bonusCharisma: 3,
      description: 'Festivales populares multitudinarios en Salta, Jujuy, Tucumán y Santiago.',
      positiveText: '¡OVACIÓN EN EL NORTE! 20.000 personas bailando bajo las estrellas.',
      negativeText: '¡Tormenta eléctrica en el festival obligó a cancelar el show a mitad de fecha!',
      negativeTalentDelta: -1,
      negativeCharismaDelta: -1,
      negativeMoneyDelta: -80000
    },
    {
      id: 'cuarteto_cordobes_arena',
      name: 'Super Deportivo Córdoba',
      logo: '🎹',
      category: 'Cuarteto',
      actionLabel: 'Hacer vibrar el',
      requiredOvr: 65,
      baseSuccessRate: 80,
      award: 'Fiesta Cordobesa 🎹',
      bonusTalent: 3,
      bonusCharisma: 5,
      description: 'El templo del cuarteto cordobés hasta las 6 AM.',
      positiveText: '¡EXPLOSIÓN EN CÓRDOBA! La pista colmada cantando cada estribillo hasta el amanecer.',
      negativeText: '¡Corte de sonido a las 4 AM generó silbidos del público!',
      negativeTalentDelta: -2,
      negativeCharismaDelta: -2,
      negativeMoneyDelta: -100000
    }
  ],
  28: [
    {
      id: 'updr_zapada_especial',
      name: 'UN POCO DE RUIDO: Zapada Especial',
      logo: '🎙️',
      category: 'Streaming Histórico',
      actionLabel: 'Romperla en la zapada de',
      requiredOvr: 70,
      baseSuccessRate: 85,
      award: 'Invitado de Honor en UPDR 🎙️',
      bonusTalent: 4,
      bonusCharisma: 5,
      description: 'Zapada estelar en vivo en el piso de UPDR ante cientos de miles de espectadores.',
      positiveText: '¡PICO DE VISITAS EN VIVO! Pinky y los pibes te aplaudieron de pie. Histórico.',
      negativeText: '¡Entraste a tiempo a destiempo en el enganchado y te comiste gastadas en el chat!',
      negativeTalentDelta: -2,
      negativeCharismaDelta: -2,
      negativeMoneyDelta: -100000
    },
    {
      id: 'gran_rex_orquesta',
      name: 'Teatro Gran Rex',
      logo: '👑',
      category: 'Teatros Históricos',
      actionLabel: 'Copar el escenario del',
      requiredOvr: 74,
      baseSuccessRate: 75,
      award: 'Teatro Gran Rex Histórico 👑',
      bonusTalent: 4,
      bonusCharisma: 5,
      description: '3.200 butacas llenas, prensa nacional y luces teatrales.',
      positiveText: '¡NOCHE INOLVIDABLE EN CALLE CORRIENTES! Butacas colmadas y ovación de pie.',
      negativeText: '¡Las entradas se vendieron lentas y la sala quedó a medio llenar!',
      negativeTalentDelta: -2,
      negativeCharismaDelta: -3,
      negativeMoneyDelta: -800000
    },
    {
      id: 'luna_park_legends',
      name: 'Luna Park Imperial',
      logo: '🥊',
      category: 'Templo de la Cumbia',
      actionLabel: 'Hacer historia en el',
      requiredOvr: 78,
      baseSuccessRate: 70,
      award: 'Mítico Luna Park Sold Out 🥊',
      bonusTalent: 4,
      bonusCharisma: 5,
      description: 'El mítico Luna Park con noches consecutivas a sala llena.',
      positiveText: '¡TEMPLO CONQUISTADO! El Luna Park vibró con cada estribillo. Nivel consagración.',
      negativeText: '¡La prensa te criticó duramente asegurando que el show estuvo desorganizado!',
      negativeTalentDelta: -3,
      negativeCharismaDelta: -4,
      negativeMoneyDelta: -1200000
    }
  ],
  32: [
    {
      id: 'feat_internacional_mexico',
      name: 'Feat Internacional con Artista de México',
      logo: '🇲🇽',
      category: 'Colaboración Internacional',
      actionLabel: 'Lanzar el sencillo estelar',
      requiredOvr: 80,
      baseSuccessRate: 80,
      award: 'Colaboración Internacional de Oro 🇲🇽',
      bonusTalent: 4,
      bonusCharisma: 6,
      description: 'Grabación de videoclip de alto presupuesto en Monterrey y CDMX.',
      positiveText: '¡HITAZO INTERNACIONAL! Tu tema suena en todo México, Colombia y Estados Unidos.',
      negativeText: '¡Problemas de derechos contractuales trabaron el lanzamiento en plataformas!',
      negativeTalentDelta: -2,
      negativeCharismaDelta: -3,
      negativeMoneyDelta: -1000000
    },
    {
      id: 'movistar_arena_tour',
      name: 'Movistar Arena World Tour',
      logo: '⭐',
      category: 'Arena Sold Out',
      actionLabel: '¡SOLD OUT TOTAL EN!',
      requiredOvr: 82,
      baseSuccessRate: 70,
      award: 'Movistar Arena Sold Out Total ⭐',
      bonusTalent: 4,
      bonusCharisma: 6,
      description: '15.000 personas por noche, pantallas 4K y sonido internacional.',
      positiveText: '¡APOTEOSIS EN VILLA CRESPO! 15.000 almas cantando al unísono con puesta en escena internacional.',
      negativeText: '¡NO SE LLENÓ EL ARENA! Se vendió solo el 60% y la productora sufrió un déficit gigante.',
      negativeTalentDelta: -3,
      negativeCharismaDelta: -5,
      negativeMoneyDelta: -2500000
    }
  ],
  36: [
    {
      id: 'estadio_river_plate',
      name: 'Estadio River Plate (Monumental)',
      logo: '🏟️',
      category: '👑 EL MUNDIAL DE LA CUMBIA',
      actionLabel: '👑 ¡LLENAR EL MONUMENTAL DE!',
      requiredOvr: 88,
      baseSuccessRate: 65,
      award: 'Placa de Honor: Estadio Monumental Histórico 👑',
      bonusTalent: 5,
      bonusCharisma: 7,
      description: '85.000 personas. El logro máximo de la música popular argentina.',
      positiveText: '¡LEYENDA ETERNA EN RIVER! 85.000 almas colmando el Monumental. Hiciste la historia viva de la cumbia.',
      negativeText: '¡NO SE PUDO LLENAR EL MONUMENTAL! Lluvia torrencial y tribunas a medio llenar. Pérdida millonaria y sin récord.',
      negativeTalentDelta: -4,
      negativeCharismaDelta: -6,
      negativeMoneyDelta: -5000000
    },
    {
      id: 'estadio_velez',
      name: 'Estadio Vélez Sarsfield',
      logo: '🏛️',
      category: 'Estadio Histórico',
      actionLabel: '🔥 ¡HACER EXPLOTAR EL ESTADIO DE!',
      requiredOvr: 84,
      baseSuccessRate: 70,
      award: 'Estadio Vélez Sarsfield Sold Out 🏛️',
      bonusTalent: 4,
      bonusCharisma: 6,
      description: '45.000 almas bailando bajo las estrellas de Liniers.',
      positiveText: '¡EXPLOSIÓN EN VÉLEZ! 45.000 personas bailando sin parar toda la noche.',
      negativeText: '¡Corte masivo de generadores de energía y el show terminó abruptamente a la hora de empezar!',
      negativeTalentDelta: -3,
      negativeCharismaDelta: -4,
      negativeMoneyDelta: -3000000
    }
  ]
};

// Obtener bandas filtradas dinámicamente según la edad y el OVR actual del jugador
export function getBandsForAgeAndOvr(
  age: number, 
  playerOvr: number, 
  playerRole?: string,
  currentBandName?: string
): BandOption[] {
  if (age === 16) {
    // 3 Bandas iniciales a los 16 años - 100% Éxito Seguro
    return [
      {
        id: 'los_pibes_del_barrio',
        name: 'Los Pibes del Barrio',
        logo: '🔥',
        category: 'Cumbia Base',
        actionLabel: 'Iniciar carrera en',
        requiredOvr: 40,
        baseSuccessRate: 100,
        bonusTalent: 3,
        bonusCharisma: 3,
        description: 'Banda inicial de amigos. Ensayos en el garage y primeros bailes populares.',
        positiveText: '¡Gran debut en la sociedad de fomento! Todos bailaron y aplaudieron tu instrumento.',
        negativeText: '¡Sin fallos! Tu debut fue impecable.',
      },
      {
        id: 'la_sonora_popular',
        name: 'La Sonora Popular',
        logo: '🪗',
        category: 'Cumbia Norteña',
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
        category: 'Cuarteto',
        actionLabel: 'Sumarte a la fiesta de',
        requiredOvr: 40,
        baseSuccessRate: 100,
        bonusTalent: 2,
        bonusCharisma: 4,
        description: 'Tutti, piano y alegría cordobesa en clubes de barrio.',
        positiveText: '¡El club explotó de baile y energía! Te afianzaste como músico clave.',
        negativeText: '¡Sin fallos! Gran arranque festivo.',
      }
    ];
  }

  if (age === 20) {
    return [
      {
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
      },
      {
        id: 'bailanta_el_templo',
        name: 'La Tropi Band del Templo',
        logo: '🌴',
        category: 'Bailanta de Renombre',
        actionLabel: 'Fichar como músico en',
        requiredOvr: 52,
        baseSuccessRate: 85,
        bonusTalent: 3,
        bonusCharisma: 3,
        description: 'Giras maratónicas por boliches de provincia los fines de semana.',
        positiveText: '¡Fin de semana inolvidable! 5 boliches repletos a pura cumbia.',
        negativeText: '¡Se rompió el colectivo en la ruta y llegaron con lo justo al último show!',
        negativeTalentDelta: -1,
        negativeCharismaDelta: -1,
        negativeMoneyDelta: -30000
      },
      {
        id: 'guaracha_santiaguena',
        name: 'Los Guaracheros del Norte',
        logo: '💃',
        category: 'Guaracha',
        actionLabel: 'Meter repique en',
        requiredOvr: 50,
        baseSuccessRate: 85,
        bonusTalent: 3,
        bonusCharisma: 4,
        description: 'Velocidad, repique y baile popular en festivales masivos.',
        positiveText: '¡El estadio del festival bailó guaracha sin parar durante 2 horas!',
        negativeText: '¡Desafortunado fallo en el sonido de la consola durante el tema principal!',
        negativeTalentDelta: -1,
        negativeCharismaDelta: -2,
        negativeMoneyDelta: -20000
      }
    ];
  }

  // Filtrado inteligente por OVR para 24+ años
  const pool = STAGE_BANDS_POOL[age] || STAGE_BANDS_POOL[24];

  if (playerOvr < 75) {
    // Si la media es baja/moderada: NO dar opciones de estadios gigantes que salgan mal. Dar shows acordes.
    const moderate = pool.filter(b => b.requiredOvr <= playerOvr + 10 || b.requiredOvr < 78);
    if (moderate.length >= 2) return moderate.slice(0, 2);
  }

  return pool.slice(0, 2);
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
          label: 'Sesión Acústica en Vivo en UN POCO DE RUIDO',
          sublabel: 'Dejar el alma en el streaming ante 200.000 personas',
          icon: '🎙️',
          badge: 'Hito Histórico',
          requiredOvr: 58,
          baseSuccessRate: 75,
          positive: {
            text: '¡HISTÓRICO! Pinky y los pibes te aplauden de pie. El video rompe récords de visitas en YouTube.',
            talentDelta: 3,
            charismaDelta: 5,
            staminaDelta: 2,
            moneyDelta: 800000,
            award: 'Sesión Épica UPDR 🌟'
          },
          negative: {
            text: 'Los nervios te jugaron en contra y las críticas en el chat de YouTube fueron frías.',
            talentDelta: -1,
            charismaDelta: -2,
            staminaDelta: 0,
            moneyDelta: -100000
          }
        }
      ]
    }
  ],
  26: [
    {
      id: 'bardo_redes_vs_fonoaudiologo',
      title: '📱 Polémica en Redes Sociales vs. Profesionalismo Vocal',
      description: 'Se arma un bardo viral en Twitter/X por unas declaraciones tuyas. Podés engancharte en el quilombo mediático o ir a entrenar con fonoaudiólogo.',
      age: 26,
      options: [
        {
          label: 'Meterte de lleno al Bardo en Twitter/X',
          sublabel: 'Ganar repercusión mediática pero arriesgar imagen',
          icon: '🔥',
          badge: 'Quilombo Viral',
          requiredOvr: 55,
          baseSuccessRate: 40,
          positive: {
            text: '¡Ganaste el bardo! Te invitan a varios programas de streaming y aumentan tus seguidores.',
            talentDelta: 0,
            charismaDelta: 4,
            staminaDelta: -2,
            moneyDelta: 500000,
            award: 'Rey de las Redes 🔥'
          },
          negative: {
            text: '¡CANCELACIÓN EN REDES! Te hacen memes despectivos, perdiste sponsors y tu nivel de bardo afectó tu imagen.',
            talentDelta: -3,
            charismaDelta: -5,
            staminaDelta: -4,
            moneyDelta: -300000
          }
        },
        {
          label: 'Ignorar las redes y entrenar con Fonoaudiólogo',
          sublabel: 'Priorizar tu salud vocal y virtuosismo',
          icon: '🫁',
          badge: 'Profesionalismo',
          requiredOvr: 58,
          baseSuccessRate: 90,
          positive: {
            text: 'Tu técnica vocal e instrumental da un salto descomunal. Ejecutás con potencia pura.',
            talentDelta: 4,
            charismaDelta: 2,
            staminaDelta: 5,
            moneyDelta: 400000,
            award: 'Técnica Vocal Suprema 💎'
          },
          negative: {
            text: 'El bardo se disipó solo y tu voz quedó impecable.',
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
  const pool = STAGE_BANDS_POOL[age] || STAGE_BANDS_POOL[24];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getRandomDilemmaForAge(age: number): InPlaceDilemma {
  const pool = DILEMMAS_POOL[age] || DILEMMAS_POOL[18];
  const random = pool[Math.floor(Math.random() * pool.length)];
  return random;
}

import { Venue } from './types';
import { VENUES } from './venues';

export interface BandOption {
  id: string;
  name: string;
  logo: string;
  zone: string;
  category: string;
  actionLabel: string;
  minTalent: number;
  minCharisma: number;
  bonusTalent: number;
  bonusCharisma: number;
  description: string;
  successRate: number; // Probabilidad de éxito / llenar el templo
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
    successRate: number;
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

// ================= GRAN POOL DE BANDAS Y PROYECTOS CON CHANCE DE FALLAR =================
export const STAGE_BANDS_POOL: Record<number, BandOption[]> = {
  16: [
    {
      id: 'los_pibes_esquina',
      name: 'Los Pibes de la Esquina',
      logo: '🔥',
      zone: 'Zona Sur',
      category: 'Cumbia Villera',
      actionLabel: 'Tocar en el garage con',
      minTalent: 40,
      minCharisma: 30,
      bonusTalent: 2,
      bonusCharisma: 2,
      description: 'Banda de garage del barrio. Sonido crudo, timbales caseros y aguante.',
      successRate: 85,
      positiveText: '¡El garage explotó de amigos del barrio! Los vecinos bailan en la vereda.',
      negativeText: '¡Cae la policía a cortar el cable de la zapatilla por ruidos molestos!',
      negativeTalentDelta: 0,
      negativeCharismaDelta: -1,
      negativeMoneyDelta: -10000
    },
    {
      id: 'grupo_ilusion',
      name: 'Grupo Ilusión',
      logo: '❤️',
      zone: 'Zona Oeste',
      category: 'Cumbia Romántica',
      actionLabel: 'Sumarse como músico a',
      minTalent: 45,
      minCharisma: 35,
      bonusTalent: 2,
      bonusCharisma: 1,
      description: 'Melodías pegadizas y teclado dulce para cumpleaños de 15 y casamientos.',
      successRate: 90,
      positiveText: '¡Emoción total en el vals y la tanda de cumbia! Te felicitan los anfitriones.',
      negativeText: '¡El tío borracho de la cumpleañera tiró cerveza arriba del teclado!',
      negativeTalentDelta: -1,
      negativeCharismaDelta: -1,
      negativeMoneyDelta: -20000
    },
    {
      id: 'los_reyes_compas',
      name: 'Los Reyes del Compás',
      logo: '🎺',
      zone: 'Santa Fe',
      category: 'Cumbia Santafesina',
      actionLabel: 'Meter magia con',
      minTalent: 48,
      minCharisma: 30,
      bonusTalent: 3,
      bonusCharisma: 1,
      description: 'Virtuosismo con acordeón, guitarra y vientos. Exigencia técnica alta.',
      successRate: 80,
      positiveText: '¡El solo de guitarra y vientos dejó a todos mudos de admiración!',
      negativeText: '¡Pifiaste la escala de acordeón en el solo principal y te miraron feo!',
      negativeTalentDelta: -1,
      negativeCharismaDelta: -2,
      negativeMoneyDelta: 0
    },
    {
      id: 'rkt_casero',
      name: 'Estudio Casero RKT',
      logo: '🎧',
      zone: 'Conurbano',
      category: 'Cumbia RKT & Turreo',
      actionLabel: 'Grabar tus primeras pistas con',
      minTalent: 42,
      minCharisma: 38,
      bonusTalent: 1,
      bonusCharisma: 3,
      description: 'Armar tus temas en la compu de tu pieza con micrófono y bases bajadas de YouTube.',
      successRate: 75,
      positiveText: '¡Tu enganchado casero pasa de celular en celular por Bluetooth!',
      negativeText: '¡Se cortó la luz antes de guardar el proyecto y perdiste la mezcla!',
      negativeTalentDelta: 0,
      negativeCharismaDelta: -1,
      negativeMoneyDelta: -15000
    }
  ],
  20: [
    {
      id: 'tropitango_orquesta',
      name: 'La Tropi Band',
      logo: '🌴',
      zone: 'Pacheco',
      category: 'Bailanta Clásica',
      actionLabel: 'Romper la noche en',
      minTalent: 50,
      minCharisma: 48,
      bonusTalent: 2,
      bonusCharisma: 3,
      description: 'Banda residente en Tropitango. Pistas llenas todos los sábados.',
      successRate: 80,
      award: 'Templo de Pacheco 🌴',
      positiveText: '¡HISTÓRICO EN TROPITANGO! Pista colmada, humo, luces y el aplauso de 3.000 personas.',
      negativeText: '¡Se armó una trifulca en la barra, volaron botellas y clausuraron el show!',
      negativeTalentDelta: -2,
      negativeCharismaDelta: -3,
      negativeMoneyDelta: -150000
    },
    {
      id: 'jesse_james_crew',
      name: 'Furia Matancera',
      logo: '🤠',
      zone: 'Isidro Casanova',
      category: 'Cumbia y RKT',
      actionLabel: 'Tocar a las 4 AM en',
      minTalent: 52,
      minCharisma: 50,
      bonusTalent: 2,
      bonusCharisma: 3,
      description: 'Show de trasnoche en Jesse James con humo, luces y miles de fans.',
      successRate: 80,
      award: 'Furia de Casanova 🤠',
      positiveText: '¡EXPLOTÓ CASANOVA! El público coreó cada tema de principio a fin a las 4 AM.',
      negativeText: '¡La banda anterior no se quería bajar del escenario y solo pudiste tocar 10 minutos!',
      negativeTalentDelta: -1,
      negativeCharismaDelta: -2,
      negativeMoneyDelta: -100000
    },
    {
      id: 'tornado_power',
      name: 'Tornado Cumbiero',
      logo: '🌪️',
      zone: 'José C. Paz',
      category: 'Cumbia Callejera',
      actionLabel: 'Hacer bailar a',
      minTalent: 50,
      minCharisma: 48,
      bonusTalent: 2,
      bonusCharisma: 2,
      description: 'El público más eufórico del conurbano cantando todos tus temas.',
      successRate: 85,
      award: 'Tornado de José C. Paz 🌪️',
      positiveText: '¡EL PÚBLICO MÁS AGUERRIDO! Una fiesta popular impresionante a pura cumbia.',
      negativeText: '¡Fallas en la consola de sonido dejaron sin retornos a la banda!',
      negativeTalentDelta: -1,
      negativeCharismaDelta: -1,
      negativeMoneyDelta: -50000
    }
  ],
  24: [
    {
      id: 'pasion_records',
      name: 'Pasión Tropical All-Stars',
      logo: '📺',
      zone: 'Nacional',
      category: 'Televisión & Giras',
      actionLabel: 'Firmar contrato con',
      minTalent: 58,
      minCharisma: 56,
      bonusTalent: 3,
      bonusCharisma: 4,
      description: 'Aparición fija en TV los sábados y giras por todo el interior.',
      successRate: 75,
      award: 'Consagración en Pasión de Sábado 📺',
      positiveText: '¡PICO DE RATING HISTÓRICO! Te ven en todo el país y los teléfonos no paran de sonar.',
      negativeText: '¡El sonidista de la TV te cortó el micrófono en vivo por problemas de tiempo!',
      negativeTalentDelta: -2,
      negativeCharismaDelta: -3,
      negativeMoneyDelta: -200000
    },
    {
      id: 'sello_indie_cumbia',
      name: 'La Sonora Continental',
      logo: '💿',
      zone: 'CABA & GBA',
      category: 'Cumbia Fusión',
      actionLabel: 'Sacar disco con',
      minTalent: 60,
      minCharisma: 55,
      bonusTalent: 3,
      bonusCharisma: 3,
      description: 'Sonido moderno en Spotify con oyentes en toda Latinoamérica.',
      successRate: 80,
      award: 'Disco de Plata Digital 💿',
      positiveText: '¡Millones de streams en Spotify y oyentes en México, Chile y Uruguay!',
      negativeText: '¡El sello no puso presupuesto en difusión y el disco pasó desapercibido!',
      negativeTalentDelta: -1,
      negativeCharismaDelta: -2,
      negativeMoneyDelta: -300000
    }
  ],
  28: [
    {
      id: 'gran_rex_orquesta',
      name: 'Orquesta Gran Rex',
      logo: '👑',
      zone: 'Calle Corrientes',
      category: 'Teatros Históricos',
      actionLabel: 'Copar el escenario del',
      minTalent: 68,
      minCharisma: 66,
      bonusTalent: 3,
      bonusCharisma: 4,
      description: 'Telón de terciopelo, 3.200 butacas llenas y prensa nacional.',
      successRate: 75,
      award: 'Teatro Gran Rex Histórico 👑',
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
      zone: 'Puerto Madero',
      category: 'Templo de la Cumbia',
      actionLabel: 'Hacer historia en el',
      minTalent: 72,
      minCharisma: 70,
      bonusTalent: 3,
      bonusCharisma: 4,
      description: 'El mítico Luna Park con noches consecutivas a sala llena.',
      successRate: 75,
      award: 'Mítico Luna Park Sold Out 🥊',
      positiveText: '¡TEMPLO CONQUISTADO! El Luna Park vibró con cada estribillo. Nivel consagración.',
      negativeText: '¡La prensa te criticó duramente asegurando que el show estuvo desorganizado!',
      negativeTalentDelta: -3,
      negativeCharismaDelta: -4,
      negativeMoneyDelta: -1200000
    }
  ],
  32: [
    {
      id: 'movistar_arena_tour',
      name: 'Movistar Arena World Tour',
      logo: '⭐',
      zone: 'Villa Crespo',
      category: 'Arena Sold Out',
      actionLabel: '¡SOLD OUT TOTAL EN!',
      minTalent: 78,
      minCharisma: 76,
      bonusTalent: 3,
      bonusCharisma: 5,
      description: '15.000 personas por noche, pantallas 4K y sonido internacional.',
      successRate: 70,
      award: 'Movistar Arena Sold Out Total ⭐',
      positiveText: '¡APOTEOSIS EN VILLA CRESPO! 15.000 almas cantando al unísono con puesta en escena internacional.',
      negativeText: '¡NO SE LLENÓ EL ARENA! Se vendió solo el 60% y la productora sufrió un déficit gigante.',
      negativeTalentDelta: -3,
      negativeCharismaDelta: -5,
      negativeMoneyDelta: -2500000
    },
    {
      id: 'gira_latam',
      name: 'Gira México & Estados Unidos',
      logo: '✈️',
      zone: 'Internacional',
      category: 'Gira Extranjera',
      actionLabel: 'Despegar en gira con',
      minTalent: 76,
      minCharisma: 74,
      bonusTalent: 3,
      bonusCharisma: 4,
      description: 'Festivales gigantes en Monterrey, CDMX, Miami y Santiago de Chile.',
      successRate: 75,
      award: 'Gira Internacional de Oro ✈️',
      positiveText: '¡Gira triunfal en el exterior! Te aclaman como embajador de la cumbia argentina.',
      negativeText: '¡Problemas de visas de la banda dejaron varados a 4 músicos en el aeropuerto!',
      negativeTalentDelta: -2,
      negativeCharismaDelta: -3,
      negativeMoneyDelta: -1800000
    }
  ],
  36: [
    {
      id: 'estadio_river_plate',
      name: 'Estadio River Plate (Monumental)',
      logo: '🏟️',
      zone: 'Núñez',
      category: '👑 EL MUNDIAL DE LA CUMBIA',
      actionLabel: '👑 ¡LLENAR EL MONUMENTAL DE!',
      minTalent: 85,
      minCharisma: 84,
      bonusTalent: 4,
      bonusCharisma: 6,
      description: '85.000 personas. El logro máximo de la música popular argentina.',
      successRate: 65, // Desafío supremo
      award: 'Placa de Honor: Estadio Monumental Histórico 👑',
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
      zone: 'Liniers',
      category: 'Estadio Histórico',
      actionLabel: '🔥 ¡HACER EXPLOTAR EL ESTADIO DE!',
      minTalent: 82,
      minCharisma: 80,
      bonusTalent: 3,
      bonusCharisma: 5,
      description: '45.000 almas bailando bajo las estrellas de Liniers.',
      successRate: 70,
      award: 'Estadio Vélez Sarsfield Sold Out 🏛️',
      positiveText: '¡EXPLOSIÓN EN VÉLEZ! 45.000 personas bailando sin parar toda la noche.',
      negativeText: '¡Corte masivo de generadores de energía y el show terminó abruptamente a la hora de empezar!',
      negativeTalentDelta: -3,
      negativeCharismaDelta: -4,
      negativeMoneyDelta: -3000000
    }
  ]
};

// ================= GRAN POOL DE DILEMAS VARIADOS =================
export const DILEMMAS_POOL: Record<number, InPlaceDilemma[]> = {
  18: [
    {
      id: 'primer_contrato_18',
      title: 'El primer contrato: ¿Productor turbio o Independiente?',
      description: 'Un productor de la noche con traje brillante te ofrece plata rápida y ponerte a sonar en la radio si firmas la letra chica por 5 años.',
      age: 18,
      options: [
        {
          label: 'Firmar con el Productor de Traje',
          sublabel: 'Riesgo alto de estafa por fama rápida',
          icon: '💼',
          badge: 'Alto Riesgo',
          successRate: 35,
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
          successRate: 80,
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
      id: 'la_noche_o_updr',
      title: 'La tentación de la noche vs. El profesionalismo',
      description: 'Tenés dos caminos este fin de semana: irte de after y caravana 4 días seguidos con la noche o preparar una session acústica en vivo en UN POCO DE RUIDO.',
      age: 22,
      options: [
        {
          label: 'Caravana de 4 días de Joda y After',
          sublabel: 'Descontrol con amigos y botellas caras',
          icon: '🍾',
          badge: 'Peligro Nocturno',
          successRate: 25,
          positive: {
            text: 'Sos el rey de la fiesta, conocés gente influyente y salís en historias virales.',
            talentDelta: -1,
            charismaDelta: 4,
            staminaDelta: -4,
            moneyDelta: -150000,
            award: 'Rey de la Joda 🍾'
          },
          negative: {
            text: '¡DESASTRE TOTAL! Llegás afónico y 3 horas tarde al show de Tropitango. El público te silba y te bajan del escenario a botellazos.',
            talentDelta: -6,
            charismaDelta: -5,
            staminaDelta: -8,
            moneyDelta: -400000,
            isVocalDamage: true
          }
        },
        {
          label: 'Sesión Acústica en Vivo en UN POCO DE RUIDO',
          sublabel: 'Dejar el alma en el streaming ante 200.000 personas',
          icon: '🎙️',
          badge: 'Hito Histórico',
          successRate: 70, // Riesgo de que no se viralice
          positive: {
            text: '¡HISTÓRICO! Pinky y los pibes te aplauden de pie. El video rompe récords de visitas en YouTube.',
            talentDelta: 3,
            charismaDelta: 5,
            staminaDelta: 2,
            moneyDelta: 800000,
            award: 'Sesión Épica UPDR 🌟'
          },
          negative: {
            text: '¡LA SESIÓN NO SE VIRALIZÓ! Los nervios te jugaron en contra, desafinaste en el enganchado clave y las críticas en el chat de YouTube fueron lapidarias. No ganás el logro.',
            talentDelta: -2,
            charismaDelta: -3,
            staminaDelta: 0,
            moneyDelta: -150000
          }
        }
      ]
    }
  ],
  26: [
    {
      id: 'cumpleanos_barra_o_fonoaudiologo',
      title: 'El show privado de madrugada vs. Cuidado de la salud',
      description: 'El capo de la barra de un club grande te ofrece un bolso con fajos de billetes por tocar a las 5:30 AM en una quinta clandestina en Ezeiza.',
      age: 26,
      options: [
        {
          label: 'Aceptar el Bolso con Plata e Ir a Tocar',
          sublabel: 'Mucho dinero en mano pero altísimo riesgo',
          icon: '💰',
          badge: 'Zona Roja',
          successRate: 40,
          positive: {
            text: '¡La fiesta no tuvo problemas! Te pagaron en dólares en mano y te ganaste el respeto de la tribuna.',
            talentDelta: 1,
            charismaDelta: 3,
            staminaDelta: 2,
            moneyDelta: 2000000,
            award: 'Respeto de la Tribuna ⚽'
          },
          negative: {
            text: '¡ALLANAMIENTO Y SECUESTRO DE EQUIPOS! Cae la policía. Te secuestran la camioneta con todos los instrumentos y te estafan con la fianza.',
            talentDelta: -5,
            charismaDelta: -4,
            staminaDelta: -6,
            moneyDelta: -1500000,
            isScam: true,
            isPoliceBust: true
          }
        },
        {
          label: 'Rechazar la oferta y contratar fonoaudiólogo/técnica',
          sublabel: 'Priorizar tu salud vocal y profesionalismo',
          icon: '🫁',
          badge: 'Profesionalismo',
          successRate: 90,
          positive: {
            text: 'Tu técnica vocal da un salto descomunal. Cantás sin forzar la garganta y con potencia pura.',
            talentDelta: 3,
            charismaDelta: 2,
            staminaDelta: 5,
            moneyDelta: 400000,
            award: 'Técnica Vocal Suprema 💎'
          },
          negative: {
            text: 'La barra te miró con recelo por no ir, pero tu garganta quedó impecable.',
            talentDelta: 1,
            charismaDelta: -2,
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
          successRate: 40,
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
          successRate: 85,
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
          successRate: 20,
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
          successRate: 90,
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
      title: '🏆 El Concierto de Despedida: ¿Monumental o Bailantas?',
      description: 'Llegaste a los 38 años. Es momento de coronar tu historia en la música tropical argentina.',
      age: 38,
      options: [
        {
          label: 'Mega Concierto de Despedida en Estadio',
          sublabel: 'Con orquesta, invitados históricos y transmisión global',
          icon: '👑',
          badge: 'Gloria Eterna',
          successRate: 80,
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
          sublabel: 'Volver a Pacheco, Casanova y el club donde naciste',
          icon: '🌴',
          badge: 'Amor Popular',
          successRate: 95,
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

// ================= FUNCIONES DE SELECCIÓN =================
export function getRandomBandsForAge(age: number, count = 2): BandOption[] {
  const pool = STAGE_BANDS_POOL[age] || STAGE_BANDS_POOL[16];
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export function getRandomDilemmaForAge(age: number): InPlaceDilemma {
  const pool = DILEMMAS_POOL[age] || DILEMMAS_POOL[18];
  const random = pool[Math.floor(Math.random() * pool.length)];
  return random;
}

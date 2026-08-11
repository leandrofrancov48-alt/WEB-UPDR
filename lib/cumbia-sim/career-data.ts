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

// ================= GRAN POOL DE BANDAS Y PROYECTOS POR EDAD =================
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
      bonusTalent: 1,
      bonusCharisma: 2,
      description: 'Banda de garage del barrio. Sonido crudo, timbales caseros y aguante.'
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
      description: 'Melodías pegadizas y teclado dulce para cumpleaños de 15 y casamientos.'
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
      bonusTalent: 2,
      bonusCharisma: 1,
      description: 'Virtuosismo con acordeón, guitarra y vientos. Exigencia técnica alta.'
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
      description: 'Armar tus temas en la compu de tu pieza con micrófono y bases bajadas de YouTube.'
    },
    {
      id: 'sonora_country',
      name: 'La Sonora Cheta',
      logo: '✨',
      zone: 'Zona Norte',
      category: 'Cumbia Pop',
      actionLabel: 'Tocar en eventos privados con',
      minTalent: 44,
      minCharisma: 40,
      bonusTalent: 1,
      bonusCharisma: 2,
      description: 'Covers en fiestas privadas de countries y bares de moda de San Isidro.'
    },
    {
      id: 'cuarteto_primos',
      name: 'El Tunga Tunga de los Primos',
      logo: '🎹',
      zone: 'Córdoba & GBA',
      category: 'Cuarteto de Barrio',
      actionLabel: 'Meter teclado en el grupo de',
      minTalent: 46,
      minCharisma: 32,
      bonusTalent: 2,
      bonusCharisma: 2,
      description: 'Piano saltarín y ritmo cordobés para hacer bailar a toda la cuadra.'
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
      bonusCharisma: 2,
      description: 'Banda residente en Tropitango. Pistas llenas todos los sábados.'
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
      bonusTalent: 1,
      bonusCharisma: 3,
      description: 'Show de trasnoche en Jesse James con humo, luces y miles de fans.'
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
      description: 'El público más eufórico del conurbano cantando todos tus temas.'
    },
    {
      id: 'sonora_litoral',
      name: 'Los Príncipes del Litoral',
      logo: '🌊',
      zone: 'Rosario & Santa Fe',
      category: 'Cumbia con Guitarra',
      actionLabel: 'Salir de gira con',
      minTalent: 54,
      minCharisma: 46,
      bonusTalent: 3,
      bonusCharisma: 1,
      description: 'Gira por peñas y clubes de Santa Fe, Paraná y Rosario a pura guitarra criolla.'
    },
    {
      id: 'combo_oeste',
      name: 'Combo Sabrosura del Oeste',
      logo: '🕺',
      zone: 'Morón & San Justo',
      category: 'Boliches del Conurbano',
      actionLabel: 'Meter maratón de boliches con',
      minTalent: 51,
      minCharisma: 49,
      bonusTalent: 2,
      bonusCharisma: 2,
      description: '4 boliches por noche los viernes y sábados sin parar de tocar.'
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
      bonusTalent: 2,
      bonusCharisma: 3,
      description: 'Aparición fija en TV los sábados y giras por todo el interior.'
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
      bonusCharisma: 2,
      description: 'Sonido moderno en Spotify con oyentes en toda Latinoamérica.'
    },
    {
      id: 'orquesta_baile_salon',
      name: 'Orquesta Imperial de Salón',
      logo: '🎩',
      zone: 'Teatros Provinciales',
      category: 'Cumbia de Gala',
      actionLabel: 'Subirse a los teatros con',
      minTalent: 62,
      minCharisma: 54,
      bonusTalent: 3,
      bonusCharisma: 2,
      description: 'Trajes impecables, metales de lujo y auditorios con acústica perfecta.'
    },
    {
      id: 'turreo_movement',
      name: 'Turreo Hitmakers',
      logo: '🚀',
      zone: 'Streaming & Redes',
      category: 'RKT Viral',
      actionLabel: 'Reventar las plataformas con',
      minTalent: 56,
      minCharisma: 62,
      bonusTalent: 1,
      bonusCharisma: 4,
      description: 'Videos en tendencias de YouTube, millones de reproducciones en TikTok.'
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
      bonusTalent: 2,
      bonusCharisma: 3,
      description: 'Telón de terciopelo, 3.200 butacas llenas y prensa nacional.'
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
      description: 'El mítico Luna Park con noches consecutivas a sala llena.'
    },
    {
      id: 'teatro_colonial',
      name: 'Colonial de Avellaneda',
      logo: '🎭',
      zone: 'Zona Sur',
      category: 'Teatro Popular',
      actionLabel: 'Llenar las noches del',
      minTalent: 67,
      minCharisma: 65,
      bonusTalent: 2,
      bonusCharisma: 3,
      description: 'El teatro más legendario del conurbano con la hinchada copando las plateas.'
    },
    {
      id: 'superdomo_federal',
      name: 'Superdomo Federal',
      logo: '🏟️',
      zone: 'Córdoba & NOA',
      category: 'Arenas del Interior',
      actionLabel: 'Reventar el domo con',
      minTalent: 70,
      minCharisma: 68,
      bonusTalent: 3,
      bonusCharisma: 3,
      description: '10.000 personas en festivales masivos de Córdoba y el norte argentino.'
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
      bonusCharisma: 4,
      description: '15.000 personas por noche, pantallas 4K y sonido internacional.'
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
      bonusTalent: 2,
      bonusCharisma: 3,
      description: 'Festivales gigantes en Monterrey, CDMX, Miami y Santiago de Chile.'
    },
    {
      id: 'festival_patria_tropical',
      name: 'Patria Tropical Fest',
      logo: '🎪',
      zone: 'Nacional',
      category: 'Megafestival Headliner',
      actionLabel: 'Cerrar el festival de',
      minTalent: 77,
      minCharisma: 77,
      bonusTalent: 3,
      bonusCharisma: 4,
      description: 'Cierre estelar ante 30.000 personas como número uno de la noche.'
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
      bonusTalent: 3,
      bonusCharisma: 5,
      description: '85.000 personas. El logro máximo de la música popular argentina.'
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
      bonusTalent: 2,
      bonusCharisma: 4,
      description: '45.000 almas bailando bajo las estrellas de Liniers.'
    },
    {
      id: 'estadio_kempes',
      name: 'Estadio Mario Kempes',
      logo: '⚡',
      zone: 'Córdoba',
      category: 'Estadio Provincial',
      actionLabel: '💥 COPAR EL ESTADIO DE',
      minTalent: 83,
      minCharisma: 81,
      bonusTalent: 2,
      bonusCharisma: 4,
      description: '50.000 personas en la fiesta tropical más grande del interior.'
    }
  ]
};

// ================= GRAN POOL DE DILEMAS VARIADOS POR EDAD =================
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
    },
    {
      id: 'viralidad_redes_18',
      title: 'La era digital: ¿Pagar campaña con influencers o sonar en el baile?',
      description: 'Una agencia de marketing te pide $100.000 para viralizar tu tema con tiktokers famosos. O podés ir a repartir pendrives a los DJs de los boliches.',
      age: 18,
      options: [
        {
          label: 'Pagar la Campaña de TikTok e Influencers',
          sublabel: 'Apostar a la viralidad de las redes sociales',
          icon: '📱',
          badge: 'Mundo Digital',
          successRate: 50,
          positive: {
            text: '¡El trend se vuelve viral! Tu estribillo lo baila todo el país.',
            talentDelta: 0,
            charismaDelta: 4,
            staminaDelta: 0,
            moneyDelta: 300000,
            award: 'Trend Viral en Redes 📱'
          },
          negative: {
            text: '¡Campaña fantasma! La agencia era trucha, compraron bots y no te escuchó nadie real.',
            talentDelta: -2,
            charismaDelta: -2,
            staminaDelta: 0,
            moneyDelta: -100000,
            isScam: true
          }
        },
        {
          label: 'Llevarle el Pendrive a los DJs de la Bailanta',
          sublabel: 'Convencer al DJ a mano limpia y birra de por medio',
          icon: '🎛️',
          badge: 'Calle Pura',
          successRate: 85,
          positive: {
            text: 'El DJ engancha tu tema a las 3:30 AM y la pista se viene abajo bailando.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: 2,
            moneyDelta: 80000,
            award: 'Aprobado por los DJs 🎛️'
          },
          negative: {
            text: 'El DJ guardó el pendrive en la mochila y se olvidó de ponerlo.',
            talentDelta: 1,
            charismaDelta: 0,
            staminaDelta: 0,
            moneyDelta: 20000
          }
        }
      ]
    },
    {
      id: 'musico_fantasma_18',
      title: 'La propuesta indecente: ¿Músico sesionista fantasma?',
      description: 'Una banda famosa te ofrece buena plata para que grabes todos los teclados y coros de su nuevo disco, pero sin poner tu nombre en los créditos.',
      age: 18,
      options: [
        {
          label: 'Aceptar el Trabajo de Músico Fantasma',
          sublabel: 'Cobrar plata segura pero resignar el crédito',
          icon: '👻',
          badge: 'Plata en Mano',
          successRate: 90,
          positive: {
            text: 'Cobrás la plata en el acto y ganás muchísima experiencia en un estudio profesional.',
            talentDelta: 3,
            charismaDelta: 0,
            staminaDelta: 1,
            moneyDelta: 300000
          },
          negative: {
            text: 'El disco fue un exitazo pero nadie sabe que las canciones las tocaste vos.',
            talentDelta: 2,
            charismaDelta: -2,
            staminaDelta: 0,
            moneyDelta: 100000
          }
        },
        {
          label: 'Rechazar y sacar tu propio tema con tu nombre',
          sublabel: 'Mantener tu orgullo e identidad artística',
          icon: '⭐',
          badge: 'Orgullo Propio',
          successRate: 65,
          positive: {
            text: 'Tu nombre empieza a sonar en el circuito con respeto de los pibes del barrio.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: 2,
            moneyDelta: 120000,
            award: 'Identidad Imparable ⭐'
          },
          negative: {
            text: 'Lanzaste el tema pero sin presupuesto costó mucho que se difunda.',
            talentDelta: 1,
            charismaDelta: 0,
            staminaDelta: 1,
            moneyDelta: 30000
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
          successRate: 85,
          positive: {
            text: '¡HISTÓRICO! Pinky y los pibes te aplauden de pie. El video rompe récords de visitas en YouTube.',
            talentDelta: 3,
            charismaDelta: 5,
            staminaDelta: 2,
            moneyDelta: 800000,
            award: 'Sesión Épica UPDR 🌟'
          },
          negative: {
            text: 'Te temblaron las manos en el primer tema por los nervios, pero remontaste al final.',
            talentDelta: 1,
            charismaDelta: 1,
            staminaDelta: 0,
            moneyDelta: 250000
          }
        }
      ]
    },
    {
      id: 'beef_rivalidad_22',
      title: 'Tiradera y Beef Cumbiero: ¿Contestar la provocación?',
      description: 'El cantante de una banda rival te dedicó un tema en vivo bardeándote y diciendo que no sabés cantar.',
      age: 22,
      options: [
        {
          label: 'Contestarle con una Tiradera en Vivo',
          sublabel: 'Armar bardo para que exploten las redes',
          icon: '🥊',
          badge: 'Guerra de Bandas',
          successRate: 50,
          positive: {
            text: '¡Tu respuesta fue letal! Rimas afiladas que se vuelven el tema más coreado del mes.',
            talentDelta: 2,
            charismaDelta: 4,
            staminaDelta: -1,
            moneyDelta: 400000,
            award: 'Ganador del Beef Cumbiero 🥊'
          },
          negative: {
            text: 'Se armó una pelea a las piñas en el estacionamiento del boliche entre las dos bandas. Clausura y multa.',
            talentDelta: -4,
            charismaDelta: -3,
            staminaDelta: -5,
            moneyDelta: -350000,
            isPoliceBust: true
          }
        },
        {
          label: 'Ignorar el Bardo y Enfocarte en Componer',
          sublabel: 'Que hable la música en el escenario',
          icon: '🎵',
          badge: 'Madurez',
          successRate: 85,
          positive: {
            text: 'Sacas una cumbia romántica hermosa que supera ampliamente en reproducciones a la otra banda.',
            talentDelta: 3,
            charismaDelta: 3,
            staminaDelta: 2,
            moneyDelta: 500000,
            award: 'Clase Magistral 🎵'
          },
          negative: {
            text: 'Los fans te cargaron un par de semanas en Twitter, pero el tema siguió sonando.',
            talentDelta: 1,
            charismaDelta: -1,
            staminaDelta: 1,
            moneyDelta: 150000
          }
        }
      ]
    },
    {
      id: 'traffic_rota_22',
      title: 'La Traffic rota en la Ruta 2 volviendo de la Costa',
      description: 'A las 4 AM en plena ruta de invierno revienta el radiador de la camioneta. Tienen show en San Justo a las 7 AM.',
      age: 22,
      options: [
        {
          label: 'Pagar un Remis Flete de Urgencia',
          sublabel: 'Gastar casi todo el caché para no cancelar la fecha',
          icon: '🚐',
          badge: 'Profesional',
          successRate: 75,
          positive: {
            text: 'Llegan con lo justo a las 6:50 AM, suben transpirados y la gente los ovaciona por cumplir.',
            talentDelta: 2,
            charismaDelta: 4,
            staminaDelta: -2,
            moneyDelta: 200000,
            award: 'Aguante Cumbiero en Ruta 🚐'
          },
          negative: {
            text: 'El remis se pinchó también y llegaron cuando el boliche ya estaba prendiendo las luces. Multa por faltar.',
            talentDelta: -3,
            charismaDelta: -3,
            staminaDelta: -4,
            moneyDelta: -300000
          }
        },
        {
          label: 'Cancelar la Fecha y Esperar al Auxilio Mecánico',
          sublabel: 'Dormir en la banquina y evitar el estrés',
          icon: '🛑',
          badge: 'Precaución',
          successRate: 90,
          positive: {
            text: 'Llega el auxilio, vuelven sanos y salvos a sus casas con los instrumentos intactos.',
            talentDelta: 0,
            charismaDelta: -1,
            staminaDelta: 2,
            moneyDelta: -50000
          },
          negative: {
            text: 'El dueño del boliche se enfureció y no te contrató nunca más en esa zona.',
            talentDelta: -1,
            charismaDelta: -2,
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
    },
    {
      id: 'cambio_estilo_rkt_26',
      title: '¿Subirse a la moda del RKT o mantener la Cumbia Tradicional?',
      description: 'El productor de moda te propone dejar los instrumentos en vivo y cantar sobre pistas grabadas de RKT para ganar millones.',
      age: 26,
      options: [
        {
          label: 'Subirse de lleno a la Ola del RKT / Turreo',
          sublabel: 'Sonido comercial para festivales masivos',
          icon: '🚀',
          badge: 'Moda Comercial',
          successRate: 60,
          positive: {
            text: '¡Hitazo del verano! Tu tema suena en todos los autos y balnearios de la Costa.',
            talentDelta: 1,
            charismaDelta: 5,
            staminaDelta: 0,
            moneyDelta: 2500000,
            award: 'Hit del Verano 🚀'
          },
          negative: {
            text: 'Los fanáticos de la primera hora te acusan de vendido y los shows de boliches tradicionales caen.',
            talentDelta: -3,
            charismaDelta: -3,
            staminaDelta: 0,
            moneyDelta: -500000
          }
        },
        {
          label: 'Mantener la Banda con Músicos en Vivo',
          sublabel: 'Defender el teclado, el bajo y los timbales reales',
          icon: '🎸',
          badge: 'Autenticidad',
          successRate: 85,
          positive: {
            text: 'El público ovaciona la potencia de la banda en vivo. Te convertís en un referente respetado.',
            talentDelta: 4,
            charismaDelta: 3,
            staminaDelta: 3,
            moneyDelta: 1000000,
            award: 'Puro Músico en Vivo 🎸'
          },
          negative: {
            text: 'Cuesta más pagarle a 8 músicos en la gira, pero el show suena con alma.',
            talentDelta: 2,
            charismaDelta: 0,
            staminaDelta: 1,
            moneyDelta: 300000
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
    },
    {
      id: 'feat_internacional_30',
      title: 'El Gran Feat: ¿Reggaetonero internacional o Prócer de la Cumbia?',
      description: 'Tenés presupuesto para una sola colaboración estelar: un cantante de Puerto Rico de moda o el mayor prócer de la historia de la cumbia argentina.',
      age: 30,
      options: [
        {
          label: 'Colaboración Internacional de Reggaeton',
          sublabel: 'Entrar a sonar en México, Colombia y España',
          icon: '🌎',
          badge: 'Proyección Global',
          successRate: 55,
          positive: {
            text: '¡Explotó en Spotify Global! El tema entra a los 50 más escuchados del mundo.',
            talentDelta: 2,
            charismaDelta: 5,
            staminaDelta: 0,
            moneyDelta: 4000000,
            award: 'Top Global Spotify 🌎'
          },
          negative: {
            text: 'El boricua cobró en dólares y ni siquiera promocionó la canción en sus historias de Instagram.',
            talentDelta: -2,
            charismaDelta: -2,
            staminaDelta: 0,
            moneyDelta: -2000000,
            isScam: true
          }
        },
        {
          label: 'Homenaje y Feat con una Leyenda Viva de la Cumbia',
          sublabel: 'Juntar dos generaciones de oro de la música popular',
          icon: '👑',
          badge: 'Cultura Nacional',
          successRate: 90,
          positive: {
            text: '¡Emoción total! Un clásico instantáneo que suena en todos los asados del país.',
            talentDelta: 4,
            charismaDelta: 4,
            staminaDelta: 2,
            moneyDelta: 2000000,
            award: 'Homenaje a los Próceres 👑'
          },
          negative: {
            text: 'El maestro llegó tarde a la grabación pero la toma final quedó con buena vibra.',
            talentDelta: 2,
            charismaDelta: 1,
            staminaDelta: 0,
            moneyDelta: 800000
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
    },
    {
      id: 'concierto_gratis_barrio_34',
      title: 'El show del agradecimiento: ¿Gratis en tu barrio o show corporativo?',
      description: 'Una empresa multinacional te ofrece $8.000.000 por tocar en su fiesta privada. La misma fecha los vecinos de tu barrio natal te invitan a tocar gratis en la plaza.',
      age: 34,
      options: [
        {
          label: 'Tocar Gratis en la Plaza de tu Barrio Natal',
          sublabel: 'Devolverle el amor a la gente donde naciste',
          icon: '❤️',
          badge: 'Amor al Barrio',
          successRate: 95,
          positive: {
            text: '¡Más de 40.000 personas en la plaza! Emoción pura, banderas con tu cara y consagración como prócer barrial.',
            talentDelta: 2,
            charismaDelta: 6,
            staminaDelta: 3,
            moneyDelta: 0,
            award: 'Prócer del Barrio ❤️'
          },
          negative: {
            text: 'Se desbordó la plaza y la policía cortó el show a la mitad, pero el cariño fue eterno.',
            talentDelta: 1,
            charismaDelta: 3,
            staminaDelta: 0,
            moneyDelta: 0
          }
        },
        {
          label: 'Aceptar los $8 Millones del Show Corporativo',
          sublabel: 'Plata grande para asegurar el futuro financiero',
          icon: '💵',
          badge: 'Negocios',
          successRate: 80,
          positive: {
            text: 'Show tranquilo, catering de lujo y 8 millones directo a tu cuenta bancaria.',
            talentDelta: 0,
            charismaDelta: 0,
            staminaDelta: 1,
            moneyDelta: 8000000
          },
          negative: {
            text: 'El público de traje ni bailó y te sentiste vacío arriba del escenario.',
            talentDelta: -1,
            charismaDelta: -2,
            staminaDelta: 0,
            moneyDelta: 5000000
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
    },
    {
      id: 'unplugged_definitivo_38',
      title: '🏆 El Disco Acústico Definitivo con todos los Colegas',
      description: 'Reunir a los 20 mejores cantantes y músicos de la historia de la cumbia para una sesión grabada en vivo irrepetible.',
      age: 38,
      options: [
        {
          label: 'Grabar la Mega Sesión Histórica con los Colegas',
          sublabel: 'El mayor documento musical de la cumbia argentina',
          icon: '🎙️',
          badge: 'Obra Maestra',
          successRate: 90,
          positive: {
            text: '¡OBRA CUMBRE! El álbum gana todos los premios y queda para siempre en la historia de la cultura argentina.',
            talentDelta: 4,
            charismaDelta: 5,
            staminaDelta: 2,
            moneyDelta: 8000000,
            award: 'Obra Cumbre de la Cumbia 🏆'
          },
          negative: {
            text: 'Fue difícil coordinar a tantos artistas, pero el resultado final fue conmovedor.',
            talentDelta: 2,
            charismaDelta: 3,
            staminaDelta: 0,
            moneyDelta: 4000000
          }
        },
        {
          label: 'Retirarse de los Escenarios y Convertirse en Productor de Pibes',
          sublabel: 'Descubrir y apadrinar a las nuevas promesas del barrio',
          icon: '🌱',
          badge: 'Maestro y Mentor',
          successRate: 95,
          positive: {
            text: 'Tus bandas apadrinadas la rompen en todo el país. Te convertís en el "Don" respetado de la movida tropical.',
            talentDelta: 3,
            charismaDelta: 4,
            staminaDelta: 4,
            moneyDelta: 6000000,
            award: 'Padrino de la Cumbia 🌱'
          },
          negative: {
            text: 'Los nuevos artistas a veces son rebeldes, pero tu legado sigue vivo en sus canciones.',
            talentDelta: 2,
            charismaDelta: 2,
            staminaDelta: 2,
            moneyDelta: 3000000
          }
        }
      ]
    }
  ]
};

// ================= FUNCIONES DE SELECCIÓN ALEATORIA POR PARTIDA =================
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

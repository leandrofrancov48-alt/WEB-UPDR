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
    };
    negative: {
      text: string;
      talentDelta: number;
      charismaDelta: number;
      staminaDelta: number;
      moneyDelta: number;
      award?: string;
    };
  }[];
}

export const AGE_STEPS = [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38];

// Opciones de bandas / proyectos por etapa (Balanceado: incrementos moderados +1 a +3)
export const STAGE_BANDS: Record<number, BandOption[]> = {
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
      description: 'Banda de garage del barrio. Sonido crudo y aguante asegurado.'
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
      description: 'Melodías pegadizas y teclado dulce para cumpleaños y casamientos.'
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
      description: 'Virtuosismo con guitarra y vientos. Exigencia técnica alta.'
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
      minTalent: 52,
      minCharisma: 50,
      bonusTalent: 2,
      bonusCharisma: 3,
      description: 'Banda residente en Tropitango. Pistas llenas todos los sábados.'
    },
    {
      id: 'jesse_james_crew',
      name: 'Furia Matancera',
      logo: '🤠',
      zone: 'Isidro Casanova',
      category: 'Cumbia y RKT',
      actionLabel: 'Tocar a las 4 AM en',
      minTalent: 54,
      minCharisma: 52,
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
      minTalent: 52,
      minCharisma: 50,
      bonusTalent: 2,
      bonusCharisma: 2,
      description: 'El público más eufórico del conurbano cantando todos tus temas.'
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
      minTalent: 60,
      minCharisma: 60,
      bonusTalent: 2,
      bonusCharisma: 4,
      description: 'Aparición fija en TV los sábados y giras por todo el interior.'
    },
    {
      id: 'sello_indie_cumbia',
      name: 'La Sonora Continental',
      logo: '💿',
      zone: 'CABA & GBA',
      category: 'Cumbia Fusión',
      actionLabel: 'Sacar disco con',
      minTalent: 64,
      minCharisma: 58,
      bonusTalent: 3,
      bonusCharisma: 2,
      description: 'Sonido moderno en Spotify con oyentes en toda Latinoamérica.'
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
      minTalent: 70,
      minCharisma: 70,
      bonusTalent: 3,
      bonusCharisma: 4,
      description: 'Telón de terciopelo, 3.200 butacas llenas y prensa nacional.'
    },
    {
      id: 'luna_park_legends',
      name: 'Luna Park Imperial',
      logo: '🥊',
      zone: 'Puerto Madero',
      category: 'Templo de la Cumbia',
      actionLabel: 'Hacer historia en el',
      minTalent: 75,
      minCharisma: 74,
      bonusTalent: 3,
      bonusCharisma: 5,
      description: 'El mítico Luna Park con noches consecutivas a sala llena.'
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
      minTalent: 82,
      minCharisma: 80,
      bonusTalent: 3,
      bonusCharisma: 5,
      description: '15.000 personas por noche, pantallas 4K y sonido internacional.'
    },
    {
      id: 'gira_latam',
      name: 'Gira México & Estados Unidos',
      logo: '✈️',
      zone: 'Internacional',
      category: 'Gira Extranjera',
      actionLabel: 'Despegar en gira con',
      minTalent: 80,
      minCharisma: 78,
      bonusTalent: 2,
      bonusCharisma: 4,
      description: 'Festivales gigantes en Monterrey, CDMX, Miami y Santiago de Chile.'
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
      minTalent: 88,
      minCharisma: 86,
      bonusTalent: 3,
      bonusCharisma: 6,
      description: '85.000 personas. El logro máximo de la música argentina.'
    },
    {
      id: 'estadio_velez',
      name: 'Estadio Vélez Sarsfield',
      logo: '🏛️',
      zone: 'Liniers',
      category: 'Estadio Histórico',
      actionLabel: '🔥 ¡HACER EXPLOTAR EL ESTADIO DE!',
      minTalent: 85,
      minCharisma: 84,
      bonusTalent: 2,
      bonusCharisma: 5,
      description: '45.000 almas bailando bajo las estrellas de Liniers.'
    }
  ]
};

// Dilemas de Carrera por Edad (18, 22, 26, 30, 34, 38) con Riesgo Real y Consecuencias Negativas Duras
export const IN_PLACE_DILEMMAS: Record<number, InPlaceDilemma> = {
  18: {
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
        successRate: 40,
        positive: {
          text: '¡El productor cumple! Tus temas suenan en varias radios zonales.',
          talentDelta: 1,
          charismaDelta: 4,
          staminaDelta: 0,
          moneyDelta: 250000,
          award: 'Sonando en la Radio 📻'
        },
        negative: {
          text: '¡ESTAFA TOTAL! El tipo te roba el 80% de los shows y los derechos de tus canciones. Quedás atado y endeudado.',
          talentDelta: -4,
          charismaDelta: -3,
          staminaDelta: -5,
          moneyDelta: -150000
        }
      },
      {
        label: 'Seguir 100% Independiente a Pulmón',
        sublabel: 'Camino difícil pero sos dueño de tu música',
        icon: '🎧',
        badge: 'Humildad',
        successRate: 85,
        positive: {
          text: 'Subís tu enganchado casero a YouTube y la gente del barrio lo comparte de boca en boca.',
          talentDelta: 3,
          charismaDelta: 2,
          staminaDelta: 4,
          moneyDelta: 150000,
          award: 'Demo Callejero Viral 🔥'
        },
        negative: {
          text: 'El demo suena con fritura y las radios te rebotan. Toca seguir ensayando en el garage.',
          talentDelta: 1,
          charismaDelta: -1,
          staminaDelta: 1,
          moneyDelta: 25000
        }
      }
    ]
  },
  22: {
    id: 'la_noche_o_updr',
    title: 'La tentación de la noche vs. El profesionalismo',
    description: 'Tenés dos caminos este fin de semana: irte de after y caravana 4 días seguidos con la farándula o preparar una session acústica en vivo en UN POCO DE RUIDO.',
    age: 22,
    options: [
      {
        label: 'Caravana de 4 días de Joda y After',
        sublabel: 'Descontrol con amigos y botellas caras',
        icon: '🍾',
        badge: 'Peligro Nocturno',
        successRate: 30,
        positive: {
          text: 'Sos el rey de la fiesta, conocés gente influyente y salís en historias virales.',
          talentDelta: -1,
          charismaDelta: 5,
          staminaDelta: -4,
          moneyDelta: -200000,
          award: 'Rey de la Joda 🍾'
        },
        negative: {
          text: '¡DESASTRE TOTAL! Llegás afónico y 3 horas tarde al show de Tropitango. El público te silba y te bajan del escenario a botellazos.',
          talentDelta: -6,
          charismaDelta: -6,
          staminaDelta: -10,
          moneyDelta: -500000
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
          talentDelta: 4,
          charismaDelta: 6,
          staminaDelta: 2,
          moneyDelta: 1200000,
          award: 'Sesión Épica UPDR 🌟'
        },
        negative: {
          text: 'Te temblaron las manos en el primer tema por los nervios, pero remontaste al final.',
          talentDelta: 1,
          charismaDelta: 1,
          staminaDelta: 0,
          moneyDelta: 400000
        }
      }
    ]
  },
  26: {
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
        successRate: 45,
        positive: {
          text: '¡La fiesta no tuvo problemas! Te pagaron en dólares en mano y te ganaste el respeto de la tribuna.',
          talentDelta: 1,
          charismaDelta: 4,
          staminaDelta: 3,
          moneyDelta: 3000000,
          award: 'Respeto de la Tribuna ⚽'
        },
        negative: {
          text: '¡ALLANAMIENTO POLICIAL! Cae la policía por ruidos y bardo. Te secuestran la camioneta con todos los instrumentos y salís escrachado en TV.',
          talentDelta: -5,
          charismaDelta: -5,
          staminaDelta: -8,
          moneyDelta: -1800000
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
          talentDelta: 4,
          charismaDelta: 2,
          staminaDelta: 6,
          moneyDelta: 600000,
          award: 'Técnica Vocal Suprema 💎'
        },
        negative: {
          text: 'La barra te miró con recelo por no ir, pero tu garganta quedó impecable.',
          talentDelta: 2,
          charismaDelta: -2,
          staminaDelta: 3,
          moneyDelta: 300000
        }
      }
    ]
  },
  30: {
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
        successRate: 45,
        positive: {
          text: '¡GANASTE EL JUICIO! El juez dictamina que la canción es 100% tuya y te indemnizan por daños.',
          talentDelta: 4,
          charismaDelta: 4,
          staminaDelta: 0,
          moneyDelta: 5000000,
          award: 'Justicia Cumbiera ⚖️'
        },
        negative: {
          text: '¡PERDISTE EL JUICIO! Los abogados de la discográfica te aplastan. Te embargan las regalías de tus temas y perdés la autoría.',
          talentDelta: -7,
          charismaDelta: -6,
          staminaDelta: -8,
          moneyDelta: -4000000
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
          talentDelta: 4,
          charismaDelta: 4,
          staminaDelta: 2,
          moneyDelta: -1000000,
          award: 'Premio Gardel Mejor Álbum 🏆'
        },
        negative: {
          text: 'El acuerdo te costó caro y el nuevo álbum vendió moderado.',
          talentDelta: 1,
          charismaDelta: 0,
          staminaDelta: -2,
          moneyDelta: -2000000
        }
      }
    ]
  },
  34: {
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
        successRate: 25,
        positive: {
          text: 'Milagrosamente la voz aguantó y cobraste una recaudación récord de la gira.',
          talentDelta: 1,
          charismaDelta: 4,
          staminaDelta: -6,
          moneyDelta: 8000000,
          award: 'Mártir del Escenario ⚡'
        },
        negative: {
          text: '¡ROTURA DE CUERDAS VOCALES! En el tercer show te quedás mudo en el escenario. Operación de urgencia y pérdida permanente de rango vocal.',
          talentDelta: -8,
          charismaDelta: -7,
          staminaDelta: -15,
          moneyDelta: -3500000
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
          charismaDelta: 2,
          staminaDelta: 8,
          moneyDelta: -1000000,
          award: 'Voz Resucitada 🕊️'
        },
        negative: {
          text: 'Los productores te cobraron multas por suspender fechas, pero salvaste tu carrera.',
          talentDelta: 0,
          charismaDelta: -2,
          staminaDelta: 4,
          moneyDelta: -2000000
        }
      }
    ]
  },
  38: {
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
        successRate: 85,
        positive: {
          text: '¡APOTEOSIS HISTÓRICA! 80.000 personas cantando con lágrimas en los ojos. Sos una LEYENDA VIVIENTE de la música argentina.',
          talentDelta: 4,
          charismaDelta: 6,
          staminaDelta: 2,
          moneyDelta: 15000000,
          award: 'Leyenda Popular Eterna 👑'
        },
        negative: {
          text: 'Llovió a cántaros pero la gente no se movió de la tribuna. Un cierre inolvidable.',
          talentDelta: 2,
          charismaDelta: 3,
          staminaDelta: -2,
          moneyDelta: 8000000
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
          charismaDelta: 5,
          staminaDelta: 4,
          moneyDelta: 6000000,
          award: 'Hijo Pródigo de la Bailanta ❤️'
        },
        negative: {
          text: 'Desbordaron los boliches de gente que quería saludarte una última vez.',
          talentDelta: 1,
          charismaDelta: 3,
          staminaDelta: 0,
          moneyDelta: 4000000
        }
      }
    ]
  }
};

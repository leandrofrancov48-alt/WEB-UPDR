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

// Opciones de bandas / proyectos por etapa
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
      bonusTalent: 3,
      bonusCharisma: 6,
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
      bonusTalent: 6,
      bonusCharisma: 4,
      description: 'Melodías pegadizas y teclado dulce para cumpleaños y casamientos.'
    },
    {
      id: 'los_reyes_compas',
      name: 'Los Reyes del Compás',
      logo: '🎺',
      zone: 'Santa Fe',
      category: 'Cumbia Santafesina',
      actionLabel: 'Meter magia con',
      minTalent: 50,
      minCharisma: 30,
      bonusTalent: 8,
      bonusCharisma: 2,
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
      minTalent: 58,
      minCharisma: 55,
      bonusTalent: 5,
      bonusCharisma: 10,
      description: 'Banda residente en Tropitango. Pistas llenas todos los sábados.'
    },
    {
      id: 'jesse_james_crew',
      name: 'Furia Matancera',
      logo: '🤠',
      zone: 'Isidro Casanova',
      category: 'Cumbia y RKT',
      actionLabel: 'Tocar a las 4 AM en',
      minTalent: 62,
      minCharisma: 60,
      bonusTalent: 4,
      bonusCharisma: 12,
      description: 'Show de trasnoche en Jesse James con humo, luces y miles de fans.'
    },
    {
      id: 'tornado_power',
      name: 'Tornado Cumbiero',
      logo: '🌪️',
      zone: 'José C. Paz',
      category: 'Cumbia Callejera',
      actionLabel: 'Hacer bailar a',
      minTalent: 60,
      minCharisma: 58,
      bonusTalent: 6,
      bonusCharisma: 8,
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
      minTalent: 68,
      minCharisma: 68,
      bonusTalent: 8,
      bonusCharisma: 14,
      description: 'Aparición fija en TV y giras por todo el interior del país.'
    },
    {
      id: 'sello_indie_cumbia',
      name: 'La Sonora Continental',
      logo: '💿',
      zone: 'CABA & GBA',
      category: 'Cumbia Fusión',
      actionLabel: 'Sacar disco con',
      minTalent: 72,
      minCharisma: 65,
      bonusTalent: 10,
      bonusCharisma: 8,
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
      minTalent: 78,
      minCharisma: 76,
      bonusTalent: 10,
      bonusCharisma: 18,
      description: 'Telón de terciopelo, 3.200 butacas llenas y prensa nacional.'
    },
    {
      id: 'luna_park_legends',
      name: 'Luna Park Imperial',
      logo: '🥊',
      zone: 'Puerto Madero',
      category: 'Templo del Boxeo & Cumbia',
      actionLabel: 'Hacer historia en el',
      minTalent: 82,
      minCharisma: 80,
      bonusTalent: 12,
      bonusCharisma: 20,
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
      minTalent: 88,
      minCharisma: 86,
      bonusTalent: 14,
      bonusCharisma: 25,
      description: '15.000 personas por noche, pantallas 4K y sonido internacional.'
    },
    {
      id: 'gira_latam',
      name: 'Gira México & Estados Unidos',
      logo: '✈️',
      zone: 'Internacional',
      category: 'Gira Extranjera',
      actionLabel: 'Despegar en gira con',
      minTalent: 86,
      minCharisma: 84,
      bonusTalent: 12,
      bonusCharisma: 22,
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
      minTalent: 92,
      minCharisma: 90,
      bonusTalent: 15,
      bonusCharisma: 30,
      description: '85.000 personas. El logro máximo de la música argentina.'
    },
    {
      id: 'estadio_velez',
      name: 'Estadio Vélez Sarsfield',
      logo: '🏛️',
      zone: 'Liniers',
      category: 'Estadio Histórico',
      actionLabel: '🔥 ¡HACER EXPLOTAR EL ESTADIO DE!',
      minTalent: 90,
      minCharisma: 88,
      bonusTalent: 12,
      bonusCharisma: 25,
      description: '45.000 almas bailando bajo las estrellas de Liniers.'
    }
  ]
};

// Dilemas en las edades intermedias (18, 22, 26, 30, 34, 38)
export const IN_PLACE_DILEMMAS: Record<number, InPlaceDilemma> = {
  18: {
    id: 'primer_contrato_18',
    title: 'El primer contrato discográfico',
    description: 'Un productor de la noche te pone un fajo de billetes y las llaves de un auto usado si firmas por 5 años.',
    age: 18,
    options: [
      {
        label: 'Firmar con el Productor',
        sublabel: 'Fama rápida en radios y boliches',
        icon: '💼',
        badge: 'Riesgo / Fama',
        successRate: 75,
        positive: {
          text: '¡Sonás en todos los boliches! La gente te reconoce en el tren.',
          talentDelta: 2,
          charismaDelta: 10,
          staminaDelta: 0,
          moneyDelta: 500000,
          award: 'Sonando en la Radio 📻'
        },
        negative: {
          text: 'El contrato era leonino y se quedó con tus regalías de autor.',
          talentDelta: -2,
          charismaDelta: 4,
          staminaDelta: -5,
          moneyDelta: -100000
        }
      },
      {
        label: 'Seguir 100% Independiente',
        sublabel: 'Dueño de tus canciones en YouTube',
        icon: '🎧',
        badge: 'Indie / Respeto',
        successRate: 85,
        positive: {
          text: 'Subís tu enganchado a YouTube y explota de visitas orgánicas.',
          talentDelta: 6,
          charismaDelta: 6,
          staminaDelta: 5,
          moneyDelta: 800000,
          award: 'Hit Viral Orgánico 🔥'
        },
        negative: {
          text: 'El productor te bajó de un par de festivales por despecho.',
          talentDelta: 2,
          charismaDelta: -3,
          staminaDelta: 0,
          moneyDelta: 100000
        }
      }
    ]
  },
  22: {
    id: 'sesion_un_poco_de_ruido',
    title: '🔥 Invitación a UN POCO DE RUIDO',
    description: 'Pinky y los chicos te invitan a meter una session histórica en vivo en su streaming.',
    age: 22,
    options: [
      {
        label: 'Preparar un Set Épico Inédito',
        sublabel: 'Dejar el alma en vivo ante 200.000 personas',
        icon: '🎙️',
        badge: 'Hito Histórico',
        successRate: 85,
        positive: {
          text: '¡HISTÓRICO! El video supera el millón de views en 24 horas.',
          talentDelta: 8,
          charismaDelta: 15,
          staminaDelta: 5,
          moneyDelta: 2000000,
          award: 'Sesión Épica UPDR 🌟'
        },
        negative: {
          text: 'Te pusiste algo nervioso pero la buena onda del streaming te salvó.',
          talentDelta: 3,
          charismaDelta: 6,
          staminaDelta: 0,
          moneyDelta: 800000
        }
      },
      {
        label: 'Hacer una versión pop acústica',
        sublabel: 'Buscar llegar a un público más amplio',
        icon: '✨',
        badge: 'Pop Fusión',
        successRate: 65,
        positive: {
          text: 'La versión se hizo tendencia en TikTok e Instagram Reels.',
          talentDelta: 4,
          charismaDelta: 12,
          staminaDelta: 0,
          moneyDelta: 1500000,
          award: 'Viral de TikTok ✨'
        },
        negative: {
          text: 'Tus fans cumbieros te criticaron por ablandar el sonido.',
          talentDelta: 0,
          charismaDelta: 2,
          staminaDelta: -2,
          moneyDelta: 500000
        }
      }
    ]
  },
  26: {
    id: 'cumpleanos_barra_o_descanso',
    title: 'El show privado de madrugada',
    description: 'El referente de la hinchada de un club grande te ofrece un fajo de dólares por tocar a las 5 AM en su quinta.',
    age: 26,
    options: [
      {
        label: 'Ir a cantar con la hinchada',
        sublabel: 'Aguante total y dólares en mano',
        icon: '🍻',
        badge: 'La Noche',
        successRate: 70,
        positive: {
          text: '¡Fiesta descomunal! Te ovacionaron y te regalaron camisetas.',
          talentDelta: 2,
          charismaDelta: 12,
          staminaDelta: 8,
          moneyDelta: 4000000,
          award: 'Respeto de la Tribuna ⚽'
        },
        negative: {
          text: 'Llegó la policía por ruidos molestos y saliste en Crónica TV.',
          talentDelta: -2,
          charismaDelta: 4,
          staminaDelta: -8,
          moneyDelta: 1500000
        }
      },
      {
        label: 'Descansar para el teatro del domingo',
        sublabel: 'Cuidar la voz y el profesionalismo',
        icon: '🛏️',
        badge: 'Disciplina',
        successRate: 90,
        positive: {
          text: 'Tu voz estuvo impecable en el teatro y la crítica te aplaudió.',
          talentDelta: 8,
          charismaDelta: 6,
          staminaDelta: 10,
          moneyDelta: 2000000,
          award: 'Voz Impecable 💎'
        },
        negative: {
          text: 'La barra te miró de costado por un tiempo.',
          talentDelta: 4,
          charismaDelta: -2,
          staminaDelta: 5,
          moneyDelta: 1000000
        }
      }
    ]
  },
  30: {
    id: 'feat_internacional',
    title: 'Colaboración Internacional',
    description: 'Un artista gigante de México o Colombia quiere grabar un tema con vos para sonar en todo el continente.',
    age: 30,
    options: [
      {
        label: 'Grabar el Remix Cumbiero',
        sublabel: 'Fusionar cumbia argentina con sonido latino',
        icon: '🌎',
        badge: 'Global Hit',
        successRate: 80,
        positive: {
          text: '¡Top 10 en 5 países! Gira confirmada por Latinoamérica.',
          talentDelta: 10,
          charismaDelta: 20,
          staminaDelta: 5,
          moneyDelta: 10000000,
          award: 'Disco de Platino Latinoamericano 💿'
        },
        negative: {
          text: 'El tema anduvo bien pero el sello se quedó con parte de las regalías.',
          talentDelta: 4,
          charismaDelta: 8,
          staminaDelta: 0,
          moneyDelta: 3000000
        }
      },
      {
        label: 'Sacar tu propio Álbum Solista',
        sublabel: 'Un disco de autor 100% fiel a tus raíces',
        icon: '🎼',
        badge: 'Obra Maestra',
        successRate: 85,
        positive: {
          text: 'Ganás el Premio Gardel a Mejor Álbum Tropical del Año.',
          talentDelta: 14,
          charismaDelta: 12,
          staminaDelta: 5,
          moneyDelta: 6000000,
          award: 'Premio Gardel Mejor Álbum 🏆'
        },
        negative: {
          text: 'El disco fue aclamado por músicos pero vendió moderado.',
          talentDelta: 8,
          charismaDelta: 4,
          staminaDelta: 0,
          moneyDelta: 2000000
        }
      }
    ]
  },
  34: {
    id: 'mega_festival_cierre',
    title: 'El Cierre del Festival Nacional',
    description: 'Te ofrecen ser el show principal de cierre en el festival más grande de música popular ante 100.000 personas.',
    age: 34,
    options: [
      {
        label: 'Montar un Show con Orquesta de 20 Músicos',
        sublabel: 'La puesta en escena más imponente de tu vida',
        icon: '🎻',
        badge: 'Superproducción',
        successRate: 85,
        positive: {
          text: '¡Ovación histórica de 100.000 personas de pie llorando de emoción!',
          talentDelta: 12,
          charismaDelta: 25,
          staminaDelta: 5,
          moneyDelta: 15000000,
          award: 'Consagración Nacional Suprema 👑'
        },
        negative: {
          text: 'Hubo problemas técnicos menores pero tu carisma salvó la noche.',
          talentDelta: 5,
          charismaDelta: 12,
          staminaDelta: -2,
          moneyDelta: 7000000
        }
      },
      {
        label: 'Hacer el show clásico de boliche',
        sublabel: 'Sin vueltas, pura cumbia bailable al palo',
        icon: '⚡',
        badge: 'Fuerza Pura',
        successRate: 90,
        positive: {
          text: 'Una fiesta imparable. Todo el predio saltando sin respiro.',
          talentDelta: 6,
          charismaDelta: 18,
          staminaDelta: 8,
          moneyDelta: 12000000,
          award: 'El Rey de la Fiesta 🎉'
        },
        negative: {
          text: 'El show fue efectivo pero la prensa esperaba más innovación.',
          talentDelta: 2,
          charismaDelta: 8,
          staminaDelta: 0,
          moneyDelta: 5000000
        }
      }
    ]
  },
  38: {
    id: 'el_concierto_despedida',
    title: '🏆 El Concierto de Despedida / Consagración',
    description: 'Llegaste a los 38 años con una carrera legendaria. ¿Cómo cerrás este ciclo inolvidable?',
    age: 38,
    options: [
      {
        label: 'Gran Concierto Transmitido en Vivo Global',
        sublabel: 'Con invitados históricos y los pibes de UPDR',
        icon: '👑',
        badge: 'Leyenda Eterna',
        successRate: 95,
        positive: {
          text: '¡Sos oficialmente una LEYENDA VIVIENTE de la Cumbia Argentina!',
          talentDelta: 10,
          charismaDelta: 30,
          staminaDelta: 5,
          moneyDelta: 25000000,
          award: 'Placa de Oro: Leyenda Popular Argentina 🏆'
        },
        negative: {
          text: 'Un cierre sumamente emotivo con lágrimas y abrazos.',
          talentDelta: 5,
          charismaDelta: 15,
          staminaDelta: 0,
          moneyDelta: 12000000
        }
      },
      {
        label: 'Gira Íntima por las Bailantas que te vieron nacer',
        sublabel: 'Volver a Pacheco, Casanova y el barrio de origen',
        icon: '🌴',
        badge: 'Amor Popular',
        successRate: 95,
        positive: {
          text: 'El pueblo te abraza como el ídolo más humilde y querido de la historia.',
          talentDelta: 8,
          charismaDelta: 28,
          staminaDelta: 8,
          moneyDelta: 15000000,
          award: 'Hijo Pródigo del Barrio ❤️'
        },
        negative: {
          text: 'La gente desbordó los boliches para darte las gracias.',
          talentDelta: 4,
          charismaDelta: 18,
          staminaDelta: 0,
          moneyDelta: 8000000
        }
      }
    ]
  }
};

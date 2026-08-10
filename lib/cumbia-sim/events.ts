import { CareerEvent } from './types';

export const CAREER_EVENTS: CareerEvent[] = [
  // ================= 1. INICIOS (16-20 AÑOS) =================
  {
    id: 'primer_instrumento',
    title: 'El dilema del instrumento soñado',
    description: 'Viste un teclado Roland XP-10 / Timbal LP usado impecable en Marketplace. No tenés la plata pero tu tía te ofrece prestarte sus ahorros.',
    category: 'BANDA',
    maxAge: 20,
    options: [
      {
        label: 'Aceptar el préstamo familiar y comprar la nave',
        description: 'Mejora enorme de sonido pero arrancás endeudado hasta el cuello.',
        successRate: 75,
        positiveOutcome: {
          description: '¡El sonido es demoledor! Los arreglos suenan profesionales (+6 Talento, +10 Carisma).',
          talentChange: 6,
          charismaChange: 10,
          moneyChange: -150000
        },
        negativeOutcome: {
          description: 'El instrumento tenía una placa quemada. Tuviste que gastar el doble en arreglarlo (-$300.000, -5 Disciplina).',
          talentChange: 2,
          moneyChange: -300000,
          disciplineChange: -5
        }
      },
      {
        label: 'Seguir con el instrumento prestado y ahorrar tocando',
        description: 'Cero deudas, pero el sonido sigue siendo humilde.',
        successRate: 90,
        positiveOutcome: {
          description: 'La humildad paga. Desarrollás una técnica tremenda sacándole sonido a lo que sea (+4 Talento, +5 Disciplina).',
          talentChange: 4,
          disciplineChange: 5
        },
        negativeOutcome: {
          description: 'En pleno cumpleaños de 15 se le cortó el cable y pasaron vergüenza (-5 Carisma).',
          charismaChange: -5
        }
      }
    ]
  },
  {
    id: 'el_casting_bailantero',
    title: 'Casting de emergencia para una banda famosa',
    description: 'El tecladista/timbalero de una banda muy conocida se bajó a último momento. Te invitan a probarte en una bailanta de Lanús.',
    category: 'BANDA',
    maxAge: 22,
    options: [
      {
        label: 'Ir a tirar toda la magia y ganarse el puesto',
        description: 'Arriesgás los nervios frente al líder de la banda.',
        successRate: 65,
        positiveOutcome: {
          description: '¡La rompiste toda! Quedaste fijo y te pagan $500.000 por fin de semana (+8 Carisma, +5 Talento).',
          charismaChange: 8,
          talentChange: 5,
          moneyChange: 500000
        },
        negativeOutcome: {
          description: 'Te ganó la timidez y pifiaste el cambio de tono. Te fuiste caminando con la cabeza gacha (-4 Carisma, +3 Aguante).',
          charismaChange: -4,
          staminaChange: 3
        }
      },
      {
        label: 'Rechazar la oferta y priorizar tu propia banda de amigos',
        description: 'Cero plata rápida, pero mantendrás tu propio proyecto.',
        successRate: 85,
        positiveOutcome: {
          description: 'La unión del grupo se hizo indestructible (+8 Aguante, +6 Disciplina).',
          staminaChange: 8,
          disciplineChange: 6
        },
        negativeOutcome: {
          description: 'Tus amigos no ensayan nunca y te arrepentís de no haber ido (-3 Disciplina).',
          disciplineChange: -3
        }
      }
    ]
  },
  {
    id: 'contrato_productor_leonino',
    title: 'La oferta del productor de la noche',
    description: 'Un productor histórico de la movida tropical te ofrece meterte a sonar en la radio y televisión a cambio de firmar por el 70% de tus regalías y shows por 5 años.',
    category: 'DISCOGRAFICA',
    options: [
      {
        label: 'Firmar el contrato para explotar en los medios',
        description: 'Fama meteórica asegurada pero poca plata en el bolsillo.',
        successRate: 80,
        positiveOutcome: {
          description: '¡Sonás en todas las radios y boliches! La gente te pide fotos en la calle (+15 Carisma, +10 Bardo, -$100.000).',
          charismaChange: 15,
          bardoChange: 10
        },
        negativeOutcome: {
          description: 'El productor se quedó con toda la plata de las fechas y te dejó con dos mangos (-$400.000, +15 Bardo).',
          moneyChange: -400000,
          bardoChange: 15
        }
      },
      {
        label: 'Romper el contrato y seguir 100% independiente',
        description: 'Camino más largo pero sos el dueño absoluto de tu música.',
        successRate: 70,
        positiveOutcome: {
          description: 'Subís tus temas a YouTube/Spotify y se hacen virales orgánicamente (+8 Talento, +10 Disciplina, +$800.000).',
          talentChange: 8,
          disciplineChange: 10,
          moneyChange: 800000
        },
        negativeOutcome: {
          description: 'El productor te bajó de varios festivales por represalia (-6 Carisma, +5 Aguante).',
          charismaChange: -6,
          staminaChange: 5
        }
      }
    ]
  },
  {
    id: 'traffic_pinchada_camino_negro',
    title: 'La Traffic sin frenos en la Autopista',
    description: 'Son las 3:15 AM de un sábado. Tenés que tocar a las 3:45 AM en Jesse James y la Traffic frena de golpe echando humo por el radiador.',
    category: 'NOCHE',
    options: [
      {
        label: 'Empujar la camioneta, atar con alambre y llegar como sea',
        description: 'Pura mística de barrio para no dejar a la gente plantada.',
        successRate: 70,
        positiveOutcome: {
          description: '¡Llegaron 3:43 AM transpirados! El boliche se cayó abajo con el show (+10 Aguante, +8 Carisma).',
          staminaChange: 10,
          charismaChange: 8,
          moneyChange: 300000
        },
        negativeOutcome: {
          description: 'El motor reventó. Llegaron tarde, el dueño no les pagó y tuvieron que volver en remís (-$250.000, -5 Stamina).',
          moneyChange: -250000,
          staminaChange: -5
        }
      },
      {
        label: 'Suspender la fecha para cuidar los instrumentos y la salud',
        description: 'Priorizás la seguridad antes que el show.',
        successRate: 85,
        positiveOutcome: {
          description: 'Evitaron un accidente grave y descansaron (+6 Disciplina).',
          disciplineChange: 6
        },
        negativeOutcome: {
          description: 'Los fanáticos te prendieron fuego en Twitter y te tildaron de pecho frío (-8 Carisma, +10 Bardo).',
          charismaChange: -8,
          bardoChange: 10
        }
      }
    ]
  },

  // ================= 2. CONSOLIDACIÓN (21-28 AÑOS) =================
  {
    id: 'invitacion_un_poco_de_ruido',
    title: '¡Sesión en vivo en UN POCO DE RUIDO! 🔥',
    description: 'Pinky y el equipo de Un Poco de Ruido te mandan un DM para invitarte a tirar un set acústico en vivo con ellos.',
    category: 'UN_POCO_DE_RUIDO',
    minAge: 20,
    options: [
      {
        label: 'Aceptar y preparar un enganchado histórico inédito',
        description: 'Dejar el alma en el vivo frente a cientos de miles de espectadores.',
        successRate: 85,
        positiveOutcome: {
          description: '¡HISTÓRICO! El video pasa el millón de reproducciones en 48hs. Sos tendencia nacional (+20 Carisma, +12 Talento, +$1.500.000).',
          charismaChange: 20,
          talentChange: 12,
          moneyChange: 1500000
        },
        negativeOutcome: {
          description: 'Te pusiste nervioso y te olvidaste la letra de un estribillo, pero la buena onda del streaming te salvó (+6 Carisma).',
          charismaChange: 6,
          talentChange: 2
        }
      },
      {
        label: 'Pedir cobrar un cachet alto antes de ir',
        description: 'Intentar negociar comercialmente la participación.',
        successRate: 40,
        positiveOutcome: {
          description: 'Aceptaron tus condiciones y cobraste muy bien (+5 Carisma, +$1.000.000).',
          charismaChange: 5,
          moneyChange: 1000000
        },
        negativeOutcome: {
          description: 'Te cancelaron la invitación por agrandado y los fans se enteraron (-12 Carisma, +15 Bardo).',
          charismaChange: -12,
          bardoChange: 15
        }
      }
    ]
  },
  {
    id: 'cumpleanos_jefe_hinchada',
    title: 'El cumpleaños privado del Capo de la Barra',
    description: 'Te contactan para tocar en una quinta en Ezeiza para el referente de la hinchada de un club grande. Te ofrecen un fajo enorme de dólares.',
    category: 'NOCHE',
    options: [
      {
        label: 'Ir a tocar con la mejor onda y cantar con la hinchada',
        description: 'Mucha plata en mano y el respeto de la tribuna.',
        successRate: 70,
        positiveOutcome: {
          description: '¡Fiesta inolvidable! Te regalaron una camiseta histórica y te pagaron en mano (+10 Aguante, +$2.500.000, +8 Bardo).',
          staminaChange: 10,
          moneyChange: 2500000,
          bardoChange: 8
        },
        negativeOutcome: {
          description: 'Cayó la policía por ruidos molestos y saliste en el noticiero (+20 Bardo, -6 Disciplina).',
          bardoChange: 20,
          disciplineChange: -6
        }
      },
      {
        label: 'Agradecer y excusarte diciendo que tenés show comprometido',
        description: 'Evitarte líos y mantener un perfil profesional limpio.',
        successRate: 80,
        positiveOutcome: {
          description: 'Respetaron tu profesionalismo y te cuidaste la imagen (+8 Disciplina).',
          disciplineChange: 8
        },
        negativeOutcome: {
          description: 'Te amenazaron con no dejarte tocar en su zona por un año (-6 Carisma).',
          charismaChange: -6
        }
      }
    ]
  },
  {
    id: 'el_hit_del_verano_tiktok',
    title: 'La melodía pegadiza en TikTok',
    description: 'Grabaste un estribillo pegadizo con el celular en el colectivo y se volvió viral. Una discográfica quiere sacarlo ya.',
    category: 'DISCOGRAFICA',
    options: [
      {
        label: 'Lanzar el tema con un videoclip bien cumbiero en el barrio',
        description: 'Fiel a las raíces y al sonido auténtico.',
        successRate: 80,
        positiveOutcome: {
          description: '¡TEMA DEL VERANO! Suena en todos los autos, playas y boliches del país (+18 Carisma, +$3.000.000).',
          charismaChange: 18,
          moneyChange: 3000000
        },
        negativeOutcome: {
          description: 'El tema pegó pero los números de streaming no rindieron lo esperado (+8 Carisma, +$500.000).',
          charismaChange: 8,
          moneyChange: 500000
        }
      },
      {
        label: 'Hacer una versión comercial con reggaetón y autotune',
        description: 'Buscar el salto internacional y el mercado masivo.',
        successRate: 60,
        positiveOutcome: {
          description: 'Entraste al Top 50 Global de Spotify (+25 Carisma, +$6.000.000, +10 Bardo).',
          charismaChange: 25,
          moneyChange: 6000000,
          bardoChange: 10
        },
        negativeOutcome: {
          description: 'Tus fanáticos originales te trataron de vendido y el tema sonó artificial (-10 Talento, +15 Bardo).',
          talentChange: -10,
          bardoChange: 15
        }
      }
    ]
  },
  {
    id: 'escandalo_farandula_tv',
    title: 'Cámaras de Intrusos a la salida del boliche',
    description: 'Te vinculan sentimentalmente con una figura mediática y los programas de chimentos te buscan para hacer móvil en vivo.',
    category: 'FARANDULA',
    options: [
      {
        label: 'Dar la cara, tirar frases con chispa y copar el rating',
        description: 'Aprovechar la exposición al máximo.',
        successRate: 65,
        positiveOutcome: {
          description: 'Tus frases se hicieron memes y subiste 300.000 seguidores en una tarde (+14 Carisma, +18 Bardo).',
          charismaChange: 14,
          bardoChange: 18
        },
        negativeOutcome: {
          description: 'Dijiste una barbaridad en vivo y te cancelaron por dos semanas (-8 Carisma, +25 Bardo).',
          charismaChange: -8,
          bardoChange: 25
        }
      },
      {
        label: 'Esquivar a los cronistas y decir "solo hablo de música"',
        description: 'Cero circo mediático, 100% respeto artístico.',
        successRate: 85,
        positiveOutcome: {
          description: 'Los críticos de música elogian tu seriedad y madurez (+8 Talento, +10 Disciplina).',
          talentChange: 8,
          disciplineChange: 10
        },
        negativeOutcome: {
          description: 'En el programa te defenestraron por "aburrido y agrandado" (-4 Carisma).',
          charismaChange: -4
        }
      }
    ]
  },

  // ================= 3. CONSAGRACIÓN & ESTADIOS (29-38 AÑOS) =================
  {
    id: 'el_gran_rex_o_bailantas',
    title: '¿Teatro Gran Rex o Maratón de 6 Boliches?',
    description: 'Para el fin de semana largo tenés la opción de meter tu primer Gran Rex en Calle Corrientes o hacer 6 bailantas en la misma noche cobrando todo en efectivo.',
    category: 'BANDA',
    minAge: 26,
    options: [
      {
        label: 'Apostar todo al Teatro Gran Rex',
        description: 'Prestigio supremo, luces teatrales y prensa nacional.',
        successRate: 75,
        positiveOutcome: {
          description: '¡SOLD OUT! Dos funciones agotadas, telón dorado y ovación de pie (+20 Carisma, +10 Talento, +$5.000.000).',
          charismaChange: 20,
          talentChange: 10,
          moneyChange: 5000000
        },
        negativeOutcome: {
          description: 'Quedaron butacas vacías por mala publicidad y saliste empatado de costos (+5 Talento, -$1.000.000).',
          talentChange: 5,
          moneyChange: -1000000
        }
      },
      {
        label: 'Gira furiosa de 6 boliches de Zona Sur y Oeste',
        description: 'Caja rápida garantizada y calor de la bailanta popular.',
        successRate: 80,
        positiveOutcome: {
          description: 'Recaudación récord en efectivo, la gente enloquecida en cada pista (+12 Aguante, +$4.000.000, -5 Stamina).',
          staminaChange: 7,
          moneyChange: 4000000
        },
        negativeOutcome: {
          description: 'Quedaste sin voz en el cuarto boliche por el humo y el frío (-8 Stamina, -4 Talento).',
          staminaChange: -8,
          talentChange: -4
        }
      }
    ]
  },
  {
    id: 'la_gloria_del_movistar_arena',
    title: 'La gran cita en el Movistar Arena',
    description: 'Tu carrera está en la cima. Tu manager te propone hacer un Movistar Arena con invitados históricos de la movida tropical.',
    category: 'BANDA',
    minAge: 28,
    options: [
      {
        label: 'Montar un mega show con orquesta de 15 músicos e invitados',
        description: 'La producción más ambiciosa de tu vida.',
        successRate: 80,
        positiveOutcome: {
          description: '¡HISTÓRICO! 15.000 personas cantando a los gritos con lágrimas en los ojos (+25 Carisma, +15 Talento, +$12.000.000).',
          charismaChange: 25,
          talentChange: 15,
          moneyChange: 12000000
        },
        negativeOutcome: {
          description: 'La orquesta tuvo fallas de sonido al inicio, pero tu carisma remontó la noche (+10 Carisma, +$4.000.000).',
          charismaChange: 10,
          moneyChange: 4000000
        }
      },
      {
        label: 'Hacerlo en formato tradicional para ganar más dinero',
        description: 'Menos costo de producción, máxima ganancia.',
        successRate: 75,
        positiveOutcome: {
          description: 'Un show clásico efectivo y una fortuna en la cuenta bancaria (+10 Carisma, +$10.000.000).',
          charismaChange: 10,
          moneyChange: 10000000
        },
        negativeOutcome: {
          description: 'La prensa criticó la falta de producción visual (-5 Carisma, +$6.000.000).',
          charismaChange: -5,
          moneyChange: 6000000
        }
      }
    ]
  },
  {
    id: 'el_mundial_estadio_river',
    title: '👑 EL MUNDIAL DE LA CUMBIA: Estadio River Plate',
    description: 'El logro supremo con el que sueña todo músico argentino: llenar el Estadio Monumental de River Plate con 85.000 almas.',
    category: 'BANDA',
    minAge: 30,
    options: [
      {
        label: '¡Anunciar el Estadio River Plate y entrar en la eternidad!',
        description: 'El hito máximo de tu carrera artística.',
        successRate: 75,
        positiveOutcome: {
          description: '¡CONAGRACIÓN ETERNA! 85.000 personas, fuegos artificiales, transmisión global. Sos una LEYENDA VIVIENTE (+35 Carisma, +20 Talento, +$30.000.000).',
          charismaChange: 35,
          talentChange: 20,
          moneyChange: 30000000
        },
        negativeOutcome: {
          description: 'Llovió torrencialmente pero tocaron 3 horas bajo el agua. Épico e inolvidable (+20 Carisma, +$15.000.000).',
          charismaChange: 20,
          moneyChange: 15000000
        }
      },
      {
        label: 'Ir a lo seguro: Hacer 4 noches en el Luna Park',
        description: 'Menos riesgo climático y 4 funciones repletas.',
        successRate: 90,
        positiveOutcome: {
          description: '4 Luna Park al hilo llenos hasta el techo (+18 Carisma, +$18.000.000).',
          charismaChange: 18,
          moneyChange: 18000000
        },
        negativeOutcome: {
          description: 'El desgaste físico de 4 noches seguidas te pasó factura (-6 Stamina, +$10.000.000).',
          staminaChange: -6,
          moneyChange: 10000000
        }
      }
    ]
  }
];

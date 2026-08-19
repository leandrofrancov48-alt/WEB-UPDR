import { Venue } from './types';

export const VENUES: Venue[] = [
  // 1. Barrio / Ascenso
  {
    id: 'plaza_barrio',
    name: 'Placita del Barrio y Cumpleaños de 15',
    category: 'BARRIO',
    capacity: 150,
    description: 'Sonido prestado, parlantes atados con alambre y fernet en jarra plástica.',
    minTalentRequired: 40,
    minCharismaRequired: 30,
    icon: '⛺',
    location: 'Conurbano / Interior'
  },
  {
    id: 'sociedad_fomento',
    name: 'Sociedad de Fomento & Club Social',
    category: 'BARRIO',
    capacity: 500,
    description: 'Gimnasio con piso de parquet, luces giratorias y los vecinos copando la pista.',
    minTalentRequired: 50,
    minCharismaRequired: 45,
    icon: '🎪',
    location: 'Gran Buenos Aires'
  },

  // 2. Circuito de Bailantas
  {
    id: 'tropitango',
    name: 'El Tropitango Bailable',
    category: 'BAILANTA',
    capacity: 3500,
    description: 'La Catedral de la Cumbia en Pacheco. Acá te consagrás o te bajan del escenario.',
    minTalentRequired: 62,
    minCharismaRequired: 58,
    icon: '🌴',
    location: 'General Pacheco, Tigre'
  },
  {
    id: 'jesse_james',
    name: 'Jesse James Bailable',
    category: 'BAILANTA',
    capacity: 4500,
    description: 'El coloso de Isidro Casanova. Múltiples pistas, show a las 4:30 AM con humo y luces láser.',
    minTalentRequired: 66,
    minCharismaRequired: 64,
    icon: '🤠',
    location: 'Isidro Casanova, La Matanza'
  },
  {
    id: 'tornado',
    name: 'Tornado Bailable',
    category: 'BAILANTA',
    capacity: 4000,
    description: 'El clásico de José C. Paz. Público eufórico que canta todos los enganchados de memoria.',
    minTalentRequired: 68,
    minCharismaRequired: 67,
    icon: '🌪️',
    location: 'José C. Paz'
  },

  // 3. Teatros y Templos Históricos
  {
    id: 'teatro_colonial',
    name: 'Teatro Colonial de Avellaneda',
    category: 'TEATRO',
    capacity: 2000,
    description: 'Elegancia, acústica de lujo y butacas llenas para escuchar los mejores solos.',
    minTalentRequired: 74,
    minCharismaRequired: 72,
    icon: '🎭',
    location: 'Avellaneda'
  },
  {
    id: 'gran_rex',
    name: 'Teatro Gran Rex',
    category: 'TEATRO',
    capacity: 3200,
    description: 'Calle Corrientes al palo. Telón de terciopelo, escenografía de primer nivel y prensa nacional.',
    minTalentRequired: 80,
    minCharismaRequired: 78,
    icon: '👑',
    location: 'Calle Corrientes, CABA'
  },
  {
    id: 'luna_park',
    name: 'Estadio Luna Park',
    category: 'TEATRO',
    capacity: 9000,
    description: 'El Palacio de los Deportes. Rodrigo metió 13 noches históricas; hoy te toca a vos.',
    minTalentRequired: 85,
    minCharismaRequired: 83,
    icon: '🥊',
    location: 'Puerto Madero, CABA'
  },

  // 4. Arenas & Giras Internacionales (Europa & América)
  {
    id: 'sala_razzmatazz_barcelona',
    name: 'Sala Razzmatazz (Barcelona, España)',
    category: 'INTERNACIONAL',
    capacity: 2500,
    description: 'Banderas argentinas, colectividad cumbiera en Europa y fiesta hasta el amanecer.',
    minTalentRequired: 82,
    minCharismaRequired: 80,
    icon: '🇪🇸',
    location: 'Barcelona, España'
  },
  {
    id: 'sala_la_riviera_madrid',
    name: 'La Riviera (Madrid, España)',
    category: 'INTERNACIONAL',
    capacity: 2500,
    description: 'Junto al río Manzanares. Lleno total cantando enganchados tropicales en la capital española.',
    minTalentRequired: 82,
    minCharismaRequired: 80,
    icon: '🇪🇸',
    location: 'Madrid, España'
  },
  {
    id: 'alcatraz_milano',
    name: 'Alcatraz Milano (Milán, Italia)',
    category: 'INTERNACIONAL',
    capacity: 3000,
    description: 'Noche tropical en el templo nocturno de Milán con compatriotas de toda Italia.',
    minTalentRequired: 84,
    minCharismaRequired: 82,
    icon: '🇮🇹',
    location: 'Milán, Italia'
  },
  {
    id: 'arena_monterrey_mexico',
    name: 'Arena Monterrey (México)',
    category: 'INTERNACIONAL',
    capacity: 17500,
    description: 'La capital mexicana de la cumbia sonidera y colombiana rindiendo culto a tu ritmo.',
    minTalentRequired: 88,
    minCharismaRequired: 86,
    icon: '🇲🇽',
    location: 'Monterrey, México'
  },

  // 5. Arenas Nacionales & Estadios
  {
    id: 'movistar_arena',
    name: 'Movistar Arena (Sold Out)',
    category: 'ARENA',
    capacity: 15000,
    description: 'El templo moderno de Villa Crespo. Pantallas LED gigantes, visuales 4K y 15.000 personas cantando a coro.',
    minTalentRequired: 90,
    minCharismaRequired: 88,
    icon: '⭐',
    location: 'Villa Crespo, CABA'
  },
  {
    id: 'estadio_velez',
    name: 'Estadio José Amalfitani (Vélez)',
    category: 'ESTADIO',
    capacity: 45000,
    description: 'El estadio de Liniers explotado. Una marea humana de 45.000 almas bailando sin parar.',
    minTalentRequired: 94,
    minCharismaRequired: 92,
    icon: '🏟️',
    location: 'Liniers, CABA'
  },
  {
    id: 'estadio_river',
    name: 'Estadio Monumental (River Plate)',
    category: 'ESTADIO',
    capacity: 85000,
    description: 'EL MUNDIAL DE LA CUMBIA. 85.000 personas, fuegos artificiales y tu nombre grabado para siempre en la historia de la música argentina.',
    minTalentRequired: 97,
    minCharismaRequired: 96,
    icon: '🏆',
    location: 'Núñez, CABA'
  }
];

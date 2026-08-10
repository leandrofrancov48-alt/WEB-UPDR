import { CumbiaPlayer, LegacyTier, SeasonHistory, Venue } from './types';
import { VENUES } from './venues';

const SONG_TITLES = [
  'Enganchado Tropical de Medianoche',
  'La Cerveza y Tu Recuerdo',
  'Tirando Pasitos en el Barrio',
  'Cumbia de la Buena (Session en Vivo)',
  'Llorando en la Bailanta',
  'El Ritmo de la Noche',
  'Te Fuiste con Otro (Remix)',
  'A puro Güiro y Timbal',
  'Amor de Boliche',
  'Viernes de Gira con los Pibes',
  'Un Beso y una Cerveza',
  'La Reina de la Pista',
  'Te Extraño en Silencio',
  'Solos en el Gran Rex (Acústico)',
  'El Himno del Monumental'
];

export function getEligibleVenue(talent: number, charisma: number): Venue {
  const sorted = [...VENUES].reverse();
  for (const v of sorted) {
    if (talent >= v.minTalentRequired && charisma >= v.minCharismaRequired) {
      return v;
    }
  }
  return VENUES[0];
}

export function simulateSeason(
  player: CumbiaPlayer,
  age: number,
  year: number
): SeasonHistory {
  const venue = getEligibleVenue(player.attributes.talent, player.attributes.charisma);
  
  // Shows calculados según categoría
  let baseShows = 25;
  if (venue.category === 'BARRIO') baseShows = 15 + Math.floor(Math.random() * 10);
  if (venue.category === 'BAILANTA') baseShows = 45 + Math.floor(Math.random() * 25);
  if (venue.category === 'TEATRO') baseShows = 30 + Math.floor(Math.random() * 15);
  if (venue.category === 'ARENA') baseShows = 20 + Math.floor(Math.random() * 10);
  if (venue.category === 'ESTADIO') baseShows = 12 + Math.floor(Math.random() * 6);

  // Recaudación por temporada
  const multiplier = (player.attributes.talent * 0.4 + player.attributes.charisma * 0.6);
  const moneyEarned = Math.round((venue.capacity * baseShows * (multiplier * 4.5)) / 100) * 100;

  // Oyentes mensuales estimados
  const listenersMonthly = Math.round(
    (player.attributes.charisma * 25000 + player.attributes.talent * 15000) * (venue.category === 'ESTADIO' ? 3.5 : venue.category === 'ARENA' ? 2 : 1)
  );

  // Premios y condecoraciones
  const awardsWon: string[] = [];
  if (player.attributes.charisma >= 75 && player.attributes.talent >= 70) {
    awardsWon.push('Disco de Oro 💿');
  }
  if (player.attributes.charisma >= 85 && player.attributes.talent >= 80) {
    awardsWon.push('Premio Gardel a Mejor Álbum Tropical 🏆');
  }
  if (venue.category === 'ARENA' || venue.category === 'ESTADIO') {
    awardsWon.push('Tendencia Global #1 en YouTube 🌟');
  }
  if (venue.id === 'estadio_river') {
    awardsWon.push('Placa de Honor: Estadio Monumental Histórico 👑');
  }

  const songIndex = Math.min(SONG_TITLES.length - 1, Math.floor((age - 16) / 2) + Math.floor(Math.random() * 2));
  const hitSongTitle = SONG_TITLES[songIndex] || 'Enganchados Clásicos';

  return {
    age,
    year,
    bandName: `${player.nickname || player.name} y Su Banda`,
    role: player.role,
    venueConquered: venue,
    showsPlayed: baseShows,
    moneyEarned,
    hitSongTitle,
    listenersMonthly,
    awardsWon,
    ovrEnd: Math.round((player.attributes.talent * 0.5) + (player.attributes.charisma * 0.5)),
    highlightText: `Conquistó el escenario de ${venue.name} con un promedio de ${listenersMonthly.toLocaleString('es-AR')} oyentes mensuales.`
  };
}

export function calculateLegacyTier(
  player: CumbiaPlayer,
  history: SeasonHistory[]
): { tier: LegacyTier; title: string; description: string; badge: string } {
  const maxVenue = history.reduce((prev, curr) => {
    return curr.venueConquered.capacity > prev.capacity ? curr.venueConquered : prev;
  }, history[0]?.venueConquered || VENUES[0]);

  const hasRiver = history.some(h => h.venueConquered.id === 'estadio_river');
  const hasArena = history.some(h => h.venueConquered.id === 'movistar_arena' || h.venueConquered.id === 'estadio_velez');
  const hasRexOrLuna = history.some(h => h.venueConquered.id === 'gran_rex' || h.venueConquered.id === 'luna_park');

  if (hasRiver && player.attributes.charisma >= 85 && player.attributes.talent >= 80) {
    return {
      tier: 'DIOS_DE_LA_CUMBIA',
      title: '👑 DIOS DE LA CUMBIA (Nivel Rodrigo / Pablo Lescano / Gilda)',
      description: 'Llenaste el Estadio River Plate, tu música suena en todas las generaciones y tu nombre quedó tallado en el Olimpo de la música popular argentina.',
      badge: '👑 LEYENDA ETERNA'
    };
  }

  if ((hasArena || hasRexOrLuna) && player.attributes.talent >= 75) {
    return {
      tier: 'IDOLO_POPULAR',
      title: '🌟 ÍDOLO POPULAR NACIONAL',
      description: 'Metiste estadios y teatros históricos repletos. Sos una voz reconocida en todo el país y tus temas son himnos de cada fin de semana.',
      badge: '🌟 ÍDOLO NACIONAL'
    };
  }

  if (player.attributes.bardo >= 65 && player.attributes.discipline <= 40) {
    return {
      tier: 'REY_DE_LA_NOCHE',
      title: '🍾 REY DE LA NOCHE & FARÁNDULA',
      description: 'Mucho carisma, noches interminables y tapas de revistas. Tu talento era descomunal pero las fiestas te ganaron la pulseada.',
      badge: '🍾 REY DE LA NOCHE'
    };
  }

  if (player.attributes.talent >= 75 && player.attributes.charisma < 60) {
    return {
      tier: 'REFERENTE_DE_CULTO',
      title: '💎 REFERENTE DE CULTO UNDERGROUND',
      description: 'Un músico de músicos. Tus arreglos y solos son admirados por todos los colegas, aunque preferiste mantener un perfil bajo y fiel a tus raíces.',
      badge: '💎 MÚSICO DE CULTO'
    };
  }

  if (maxVenue.category === 'BAILANTA') {
    return {
      tier: 'CLASICO_DEL_TROPITANGO',
      title: '🌴 CLÁSICO DE LA BAILANTA',
      description: 'Rey absoluto de las pistas de Pacheco, Casanova y José C. Paz. Tu nombre es sinónimo de sábado a la madrugada y alegría popular.',
      badge: '🌴 CLÁSICO TROPICAL'
    };
  }

  return {
    tier: 'PROMESA_FRUSTRADA',
    title: '🎸 LA VOZ DEL BARRIO',
    description: 'Dejaste recuerdos imborrables en los cumpleaños y plazas del barrio. Faltó el golpe de suerte final, pero nadie te quita lo bailado.',
    badge: '🎸 CLÁSICO DE BARRIO'
  };
}

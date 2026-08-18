export type MusicalRole = 
  | 'TIMBALETERO' 
  | 'GUITARRISTA' 
  | 'VIENTOS' 
  | 'ACORDEON' 
  | 'GUIRO' 
  | 'OCTAPAD' 
  | 'CONGUERO' 
  | 'COROS_ANIMADOR' 
  | 'CANTANTE';

export type CumbiaSubgenre = 
  | 'CUMBIA_BASE'
  | 'CUMBIA_NORTENA'
  | 'CUARTETO'
  | 'GUARACHA';

export type OriginProvince = 
  | 'BSAS_ZONA_SUR'
  | 'BSAS_ZONA_OESTE'
  | 'BSAS_ZONA_NORTE'
  | 'BSAS_LA_PLATA'
  | 'BSAS_COSTA_ATLANTICA'
  | 'BSAS_INTERIOR'
  | 'BUENOS_AIRES'
  | 'CORDOBA'
  | 'SANTA_FE'
  | 'TUCUMAN'
  | 'SALTA'
  | 'JUJUY'
  | 'ENTRE_RIOS'
  | 'CORRIENTES'
  | 'SANTIAGO_DEL_ESTERO'
  | 'MENDOZA'
  | 'CHACO'
  | 'MISIONES'
  | 'SAN_LUIS'
  | 'SAN_JUAN'
  | 'LA_RIOJA'
  | 'CATAMARCA'
  | 'FORMOSA'
  | 'NEUQUEN'
  | 'RIO_NEGRO'
  | 'CHUBUT'
  | 'SANTA_CRUZ'
  | 'TIERRA_DEL_FUEGO'
  | 'LA_PAMPA';

export type OriginZone = OriginProvince;

export interface PlayerAttributes {
  talent: number;       // OVR / Virtuosismo musical (0-99)
  charisma: number;     // Fama y llegada a la gente (0-99)
  stamina: number;      // Aguante / Energía en shows maratónicos (0-99)
  discipline: number;   // Profesionalismo y cuidado personal (0-99)
  bardo: number;        // Nivel de escándalo mediático y quilombos (0-100)
  money: number;        // Dinero acumulado ($ ARS)
}

export interface CumbiaPlayer {
  id: string;
  name: string;
  nickname: string;
  role: MusicalRole;
  subgenre: CumbiaSubgenre;
  originProvince: OriginProvince;
  origin?: OriginProvince;
  avatarUrl: string;
  avatarSeed?: string;
  attributes: PlayerAttributes;
}

export interface Venue {
  id: string;
  name: string;
  category: 'BARRIO' | 'BAILANTA' | 'TEATRO' | 'ARENA' | 'ESTADIO';
  capacity: number;
  description: string;
  minTalentRequired: number;
  minCharismaRequired: number;
  icon: string;
  location: string;
}

export interface LegacyTier {
  tier?: string;
  title: string;
  badge: string;
  description: string;
}

export interface SeasonHistory {
  age: number;
  year: number;
  bandName: string;
  role: MusicalRole;
  venueConquered: Venue;
  showsPlayed: number;
  moneyEarned: number;
  hitSongTitle: string;
  listenersMonthly: number;
  awardsWon: string[];
  ovrEnd: number;
  highlightText: string;
}

export interface Outcome {
  description: string;
  talentChange?: number;
  charismaChange?: number;
  staminaChange?: number;
  disciplineChange?: number;
  bardoChange?: number;
  moneyChange?: number;
  specialBadge?: string;
  triggerEventId?: string;
  isScam?: boolean;
  isVocalDamage?: boolean;
}

export interface DilemmaOption {
  label: string;
  description: string;
  successRate: number; // 0-100%
  positiveOutcome: Outcome;
  negativeOutcome: Outcome;
}

export interface CareerEvent {
  id: string;
  title: string;
  description: string;
  category?: string;
  minAge?: number;
  maxAge?: number;
  minOvrRequired?: number;
  dilemma?: DilemmaOption[];
  options?: DilemmaOption[];
}

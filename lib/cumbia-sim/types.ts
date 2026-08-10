export type MusicalRole = 'CANTANTE' | 'TECLADISTA' | 'TIMBALERO' | 'BAJISTA' | 'VIENTOS';

export type CumbiaSubgenre = 
  | 'CUMBIA_VILLERA'
  | 'CUMBIA_SANTAFESINA'
  | 'CUMBIA_ROMANTICA'
  | 'CUMBIA_RKT'
  | 'CUMBIA_POP'
  | 'CUARTETO';

export type OriginZone = 
  | 'ZONA_SUR'
  | 'ZONA_OESTE'
  | 'ZONA_NORTE'
  | 'SANTA_FE'
  | 'CORDOBA'
  | 'INTERIOR';

export interface PlayerAttributes {
  talent: number;       // OVR / Virtuosismo musical (0-99)
  charisma: number;     // Fama y llegada a la gente (0-99)
  stamina: number;      // Aguante / Energía en shows maratónicos (0-99)
  discipline: number;   // Profesionalismo y cuidado personal (0-99)
  bardo: number;        // Nivel de escándalo mediático y quilombos (0-100)
  money: number;        // Dinero acumulado ($ ARS)
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
  category: 'NOCHE' | 'DISCOGRAFICA' | 'BANDA' | 'FARANDULA' | 'UN_POCO_DE_RUIDO';
  minAge?: number;
  maxAge?: number;
  roleSpecific?: MusicalRole[];
  options: DilemmaOption[];
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

export interface CumbiaPlayer {
  name: string;
  nickname: string;
  role: MusicalRole;
  subgenre: CumbiaSubgenre;
  origin: OriginZone;
  avatarSeed: string;
  attributes: PlayerAttributes;
}

export type LegacyTier = 
  | 'DIOS_DE_LA_CUMBIA'      // Tier Rodrigo / Pablo Lescano / Gilda / Leo Mattioli
  | 'IDOLO_POPULAR'          // Consagrado en todo el país, llenó Luna Park o Movistar Arena
  | 'CLASICO_DEL_TROPITANGO' // Rey indiscutido del circuito de boliches
  | 'REFERENTE_DE_CULTO'     // Muy respetado por músicos pero perfil under
  | 'REY_DE_LA_NOCHE'        // Más famoso por las fiestas y el bardo que por la música
  | 'PANELISTA_DE_TV'        // Terminó en la farándula opinando en programas de chimentos
  | 'PROMESA_FRUSTRADA';     // Pintaba para crack pero se quedó en la placita

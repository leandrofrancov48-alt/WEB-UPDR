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
  | 'DIOS_DE_LA_CUMBIA'        // Llenó River / Movistar Arena y sobrevivió a todo
  | 'IDOLO_POPULAR'            // Consagrado a nivel nacional, llenó Gran Rex / Luna Park
  | 'CLASICO_DEL_TROPITANGO'   // Rey del circuito de bailantas del conurbano
  | 'REFERENTE_DE_CULTO'       // Muy respetado técnicamente pero perfil bajo
  | 'EL_REMISERO_DEL_BARRIO'   // Retirado prematuro por estafas / frustración económica
  | 'EL_PANELISTA_MEDIATICO'   // Dejó la música por escándalos y bardo en TV
  | 'GARGANTA_ROTA'            // Retirado por daño permanente en cuerdas vocales
  | 'REY_DE_LA_NOCHE'          // Más fiesta que música, carrera en declive
  | 'PROMESA_FRUSTRADA';       // No pasó de los cumpleaños de 15 del barrio

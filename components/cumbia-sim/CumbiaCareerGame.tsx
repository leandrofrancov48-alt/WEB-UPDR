"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AGE_STEPS, 
  BandOption, 
  InPlaceDilemma,
  getBandsForAgeAndOvr,
  getRandomDilemmaForAge,
  calculateDynamicSuccessRate
} from '@/lib/cumbia-sim/career-data';
import { CumbiaPlayer, MusicalRole, CumbiaSubgenre, OriginProvince } from '@/lib/cumbia-sim/types';
import { CharacterCreator } from '@/components/cumbia-sim/CharacterCreator';
import { CareerEndCard } from '@/components/cumbia-sim/CareerEndCard';
import { ArrowLeft, Trophy, Crown, Sparkles, RefreshCw, Disc, Check, Mic, AlertOctagon, AlertTriangle, Flame, ThumbsUp, ThumbsDown, Skull, ShieldAlert, Play, CheckCircle2, ArrowRight, Trash2 } from 'lucide-react';

// Librería de iconos hiper-específicos
import { 
  GiCrown, 
  GiMicrophone, 
  GiPalmTree, 
  GiBoxingGlove, 
  GiTv, 
  GiStarMedal, 
  GiTrophyCup, 
  GiSoccerField, 
  GiPayMoney, 
  GiHandcuffs, 
  GiGavel, 
  GiBandageRoll, 
  GiPartyPopper
} from 'react-icons/gi';
import { 
  FaPlane, 
  FaMasksTheater, 
  FaTriangleExclamation,
  FaSkullCrossbones
} from 'react-icons/fa6';

interface CareerStepRecord {
  age: number;
  bandName: string;
  bandLogo: string;
  ovr: number;
  shows: number;
  hits: number;
  feats: number;
  award?: string;
  isCurrent?: boolean;
  statusNote?: string;
  isNegativeStrike?: boolean;
}

const LOCAL_STORAGE_KEY = 'cumbia_career_save_v1';

export function getRoleBadgeLabel(r?: MusicalRole): string {
  if (!r) return '';
  switch (r) {
    case 'TIMBALETERO': return '🪘 TIMBALETERO';
    case 'GUITARRISTA': return '🎸 GUITARRISTA';
    case 'VIENTOS': return '🎺 VIENTOS';
    case 'ACORDEON': return '🪗 ACORDEÓN';
    case 'GUIRO': return '🪇 GÜIRO';
    case 'OCTAPAD': return '🎛️ OCTAPAD';
    case 'CONGUERO': return '🥁 CONGUERO';
    case 'COROS_ANIMADOR': return '🎙️ COROS & ANIMACIÓN';
    case 'CANTANTE': return '🎤 VOZ LÍDER';
    default: return r;
  }
}

export function getPlayerRolesDisplay(player: CumbiaPlayer): string {
  const role1 = getRoleBadgeLabel(player.role);
  const role2 = player.secondaryRole && player.secondaryRole !== player.role 
    ? getRoleBadgeLabel(player.secondaryRole) 
    : '';
  
  if (role2) {
    return `${role1} + ${role2}`;
  }
  return role1;
}

export function isSoloistFrontmanBand(band: BandOption): boolean {
  const name = (band.name || '').toLowerCase();
  const id = (band.id || '').toLowerCase();
  return (
    id.includes('mona_jimenez') || name.includes('mona') ||
    id.includes('cacho_deicas') || name.includes('cacho deicas') || name.includes('palmeras') ||
    id.includes('antonio_rios') || name.includes('antonio ríos') || name.includes('antonio rios') ||
    id.includes('mario_pereyra') || name.includes('mario pereyra') ||
    id.includes('dany_lescano') || name.includes('dany lescano') ||
    id.includes('amar_azul') || name.includes('miguel d') || name.includes('amar azul') ||
    id.includes('el_polaco') || name.includes('el polaco') ||
    id.includes('mala_fama') || name.includes('hernán coronel') || name.includes('mala fama') ||
    id.includes('la_repandilla') || name.includes('oscar belondi') || name.includes('la repandilla') ||
    id.includes('nestor_en_bloque') || name.includes('néstor') || name.includes('nestor') ||
    id.includes('palavecino') || name.includes('chaqueño') ||
    id.includes('cardozo') || name.includes('dani cardozo') ||
    id.includes('gonzalito') || name.includes('gonzalito') ||
    id.includes('pucheta') || name.includes('ariel pucheta') ||
    id.includes('becerra') || name.includes('maría becerra') || name.includes('maria becerra') ||
    id.includes('kapanga') || name.includes('mono kapanga')
  );
}

export function formatRoleAction(role: MusicalRole, isSoloist: boolean): { label: string; shortName: string; instrumentName: string } {
  switch (role) {
    case 'TIMBALETERO':
      return { label: 'Tocar los Timbales 🪘', shortName: 'Timbales 🪘', instrumentName: 'los Timbales' };
    case 'GUITARRISTA':
      return { label: 'Tocar la Guitarra 🎸', shortName: 'Guitarra 🎸', instrumentName: 'la Guitarra' };
    case 'VIENTOS':
      return { label: 'Tocar los Vientos 🎺', shortName: 'Vientos 🎺', instrumentName: 'los Vientos' };
    case 'ACORDEON':
      return { label: 'Tocar el Acordeón 🪗', shortName: 'Acordeón 🪗', instrumentName: 'el Acordeón' };
    case 'GUIRO':
      return { label: 'Tocar el Güiro 🪇', shortName: 'Güiro 🪇', instrumentName: 'el Güiro' };
    case 'OCTAPAD':
      return { label: 'Tocar el Octapad 🎛️', shortName: 'Octapad 🎛️', instrumentName: 'el Octapad' };
    case 'CONGUERO':
      return { label: 'Tocar las Congas 🥁', shortName: 'Congas 🥁', instrumentName: 'las Congas' };
    case 'COROS_ANIMADOR':
      return { label: 'Coros y Animación 🎙️', shortName: 'Coros 🎙️', instrumentName: 'Coros y Animación' };
    case 'CANTANTE':
      if (isSoloist) {
        return { label: 'Coros & Segunda Voz 🎙️', shortName: 'Segunda Voz 🎙️', instrumentName: 'Coros y Segunda Voz' };
      }
      return { label: 'Cantar como Voz Líder 🎤', shortName: 'Voz Líder 🎤', instrumentName: 'la Voz Líder' };
    default:
      return { label: role, shortName: role, instrumentName: role };
  }
}

export function getBandCallText(band: BandOption, player: CumbiaPlayer): { roleLabel: string; actionLabel: string; description: string } {
  const isSoloist = isSoloistFrontmanBand(band);
  const primaryRole = player.role;
  const secondaryRole = player.secondaryRole && player.secondaryRole !== player.role ? player.secondaryRole : undefined;

  const roleText = formatRoleAction(primaryRole, isSoloist);
  const secondaryText = secondaryRole ? formatRoleAction(secondaryRole, isSoloist) : null;

  let combinedRoleLabel = roleText.label;
  if (secondaryText && secondaryText.label !== roleText.label) {
    combinedRoleLabel = `${roleText.label} + ${secondaryText.shortName}`;
  }

  let description = band.description;

  if (isSoloist) {
    if (primaryRole === 'CANTANTE') {
      description = `${band.name} lidera la voz solista principal. Te convocan para hacer coros y segunda voz${secondaryText ? ` y tocar ${secondaryText.instrumentName}` : ''} en sus giras masivas.`;
    } else {
      description = `${band.name} te llama en persona para sumarte a su orquesta y lucirte tocando ${roleText.instrumentName}${secondaryText ? ` y ${secondaryText.instrumentName}` : ''}.`;
    }
  } else {
    if (primaryRole === 'CANTANTE') {
      description = `Te convocan en ${band.name} para subirte al micrófono principal como Cantante Líder${secondaryText ? ` y tocar ${secondaryText.instrumentName}` : ''}.`;
    } else {
      description = `Te convocan en ${band.name} para integrarte al grupo tocando ${roleText.instrumentName}${secondaryText ? ` y ${secondaryText.instrumentName}` : ''}.`;
    }
  }

  return {
    roleLabel: combinedRoleLabel,
    actionLabel: '📞 ROL CONVOCADO EN ESTA BANDA',
    description
  };
}

export function calculateRealisticHits(age: number, ovr: number, isSuccess: boolean): number {
  if (!isSuccess) return 0;

  if (age <= 18) {
    // A los 16-18 años: Temas de inicio en el barrio. 25% de prob de 1 hit, 0 casi siempre.
    return Math.random() < 0.25 ? 1 : 0;
  }
  if (age <= 22) {
    // A los 20-22 años: 1 hit posible (45% prob de 1 hit, 10% prob de 2 hits).
    const rand = Math.random();
    if (rand < 0.45) return 1;
    if (rand < 0.55) return 2;
    return 0;
  }
  if (age <= 30) {
    // A los 24-30 años (Pico de Carrera): 1 a 2 hits por temporada si sale bien.
    const rand = Math.random();
    if (rand < 0.50) return 2;
    if (rand < 0.85) return 1;
    return 3;
  }
  // A los 32-38 años (Consagrado/Veterano): 1 o 2 hits.
  return Math.random() < 0.65 ? 1 : 2;
}

export function calculateRealisticFeats(age: number, isSuccess: boolean): number {
  if (!isSuccess || age < 20) return 0;
  if (age <= 24) return Math.random() < 0.35 ? 1 : 0;
  return Math.floor(Math.random() * 2) + 1; // 1 o 2 feats
}

export function CumbiaCareerGame() {
  const [gameState, setGameState] = useState<'CREATION' | 'PLAYING' | 'ENDED'>('CREATION');
  const [player, setPlayer] = useState<CumbiaPlayer | null>(null);
  
  // Paso actual de edad (index en AGE_STEPS: 0 es 16, 1 es 18, etc.)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [currentBand, setCurrentBand] = useState<BandOption | null>(null);
  const [timeline, setTimeline] = useState<CareerStepRecord[]>([]);
  const [awardsWon, setAwardsWon] = useState<string[]>([]);

  // Opciones dinámicas para la ronda actual
  const [availableBands, setAvailableBands] = useState<BandOption[]>([]);
  const [currentDilemma, setCurrentDilemma] = useState<InPlaceDilemma | null>(null);
  const [hasActiveLoan, setHasActiveLoan] = useState<boolean>(false);
  const [seasonsInCurrentBand, setSeasonsInCurrentBand] = useState<number>(1);
  const [isBandOwner, setIsBandOwner] = useState<boolean>(false);

  // Guardado existente disponible
  const [savedCareer, setSavedCareer] = useState<any | null>(null);

  // Estados para la Ruleta de Iluminación Alternante (solo en Dilemas Nocturnos)
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinningOptionIndex, setSpinningOptionIndex] = useState<number | null>(null);
  const [activeRouletteSide, setActiveRouletteSide] = useState<'POSITIVE' | 'NEGATIVE' | null>(null);
  const [spinPhase, setSpinPhase] = useState<'IDLE' | 'SPINNING' | 'RESOLVED'>('IDLE');
  const [spinOutcomeSuccess, setSpinOutcomeSuccess] = useState<boolean | null>(null);
  const [spinOutcomeText, setSpinOutcomeText] = useState<string | null>(null);

  // Estado para el Pop-up de Trofeo Conquistado
  const [celebrationAward, setCelebrationAward] = useState<{
    title: string;
    subtitle: string;
    awardType: string;
  } | null>(null);

  // Estado para el Pop-up de Catástrofe / Estafa
  const [tragedyPopup, setTragedyPopup] = useState<{
    title: string;
    subtitle: string;
    tragedyType: string;
    badge: string;
    ovrDelta: number;
    moneyDelta: number;
  } | null>(null);
  
  // Contadores de incidentes para retiro prematuro
  const [scamCount, setScamCount] = useState<number>(0);
  const [vocalDamageCount, setVocalDamageCount] = useState<number>(0);
  const [earlyRetireReason, setEarlyRetireReason] = useState<string | null>(null);
  const [earlyRetireMessage, setEarlyRetireMessage] = useState<string | null>(null);

  // Totales acumulados
  const [totalShows, setTotalShows] = useState(0);
  const [totalHits, setTotalHits] = useState(0);
  const [totalFeats, setTotalFeats] = useState(0);
  const [careerValue, setCareerValue] = useState(50000); // $50K base

  const currentAge = AGE_STEPS[currentStepIndex] || 38;
  const isBandChoiceYear = currentAge % 4 === 0; // 16, 20, 24, 28, 32, 36
  const currentOvr = player ? Math.round((player.attributes.talent + player.attributes.charisma) / 2) : 50;

  // Chequear auto-guardado en LocalStorage al iniciar
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.player && parsed.timeline) {
          setSavedCareer(parsed);
        }
      }
    } catch (e) {
      console.error('Error al cargar guardado:', e);
    }
  }, []);

  // Auto-guardado en LocalStorage cada vez que avanza el juego
  useEffect(() => {
    if (gameState === 'PLAYING' && player && timeline.length > 0) {
      try {
        const dataToSave = {
          player,
          currentStepIndex,
          currentBand,
          timeline,
          awardsWon,
          totalShows,
          totalHits,
          totalFeats,
          careerValue,
          scamCount,
          vocalDamageCount
        };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(dataToSave));
      } catch (e) {
        console.error('Error al auto-guardar:', e);
      }
    }
  }, [gameState, player, currentStepIndex, timeline, currentBand, awardsWon, totalShows, totalHits, totalFeats, careerValue, scamCount, vocalDamageCount]);

  // Actualizar opciones dinámicas aleatorias cuando cambia la edad
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    setIsSpinning(false);
    setSpinningOptionIndex(null);
    setActiveRouletteSide(null);
    setSpinPhase('IDLE');
    setSpinOutcomeSuccess(null);
    setSpinOutcomeText(null);

    if (isBandChoiceYear) {
      setAvailableBands(getBandsForAgeAndOvr(currentAge, currentOvr, player?.role, currentBand?.name, seasonsInCurrentBand));
      setCurrentDilemma(null);
    } else {
      setAvailableBands([]);
      setCurrentDilemma(getRandomDilemmaForAge(currentAge, hasActiveLoan, isBandOwner));
    }
  }, [currentStepIndex, gameState, currentAge, isBandChoiceYear, currentOvr, player?.role, currentBand?.name, seasonsInCurrentBand, hasActiveLoan, isBandOwner]);

  // 1. Iniciar Partida Nueva
  const handleStartCareer = (newPlayer: CumbiaPlayer) => {
    setPlayer(newPlayer);
    setCurrentStepIndex(0);
    setCurrentBand(null);
    setTimeline([]);
    setAwardsWon([]);
    setTotalShows(0);
    setTotalHits(0);
    setTotalFeats(0);
    setCareerValue(50000);
    setScamCount(0);
    setVocalDamageCount(0);
    setEarlyRetireReason(null);
    setEarlyRetireMessage(null);
    setCelebrationAward(null);
    setTragedyPopup(null);
    setActiveRouletteSide(null);
    setIsSpinning(false);
    setSpinningOptionIndex(null);
    
    // A los 16 años: 3 opciones iniciales de banda (decisión directa de trayectoria)
    setAvailableBands(getBandsForAgeAndOvr(16, 50, newPlayer.role));
    setCurrentDilemma(null);

    setGameState('PLAYING');
  };

  // 1b. Cargar Partida Guardada
  const handleResumeCareer = () => {
    if (!savedCareer) return;

    setPlayer(savedCareer.player);
    setCurrentStepIndex(savedCareer.currentStepIndex);
    setCurrentBand(savedCareer.currentBand);
    setTimeline(savedCareer.timeline);
    setAwardsWon(savedCareer.awardsWon || []);
    setTotalShows(savedCareer.totalShows || 0);
    setTotalHits(savedCareer.totalHits || 0);
    setTotalFeats(savedCareer.totalFeats || 0);
    setCareerValue(savedCareer.careerValue || 50000);
    setScamCount(savedCareer.scamCount || 0);
    setVocalDamageCount(savedCareer.vocalDamageCount || 0);
    setIsSpinning(false);
    setSpinningOptionIndex(null);

    setGameState('PLAYING');
  };

  // 1c. Borrar Partida Guardada
  const handleDeleteSave = () => {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      setSavedCareer(null);
    } catch (e) {
      console.error('Error al borrar la partida:', e);
    }
  };

  // 2. Elegir Banda / Proyecto (DECISIÓN DIRECTA + PROBABILIDAD INTERNA OCULTA DE PERFORMANCE)
  const handleSelectBand = (band: BandOption) => {
    if (!player) return;

    setIsSpinning(false);
    setSpinningOptionIndex(null);
    // Actualización de temporadas en la banda y status de liderazgo / dueño
    if (currentBand && (band.name === currentBand.name || band.id === 'quedarte_en_banda' || band.id === 'liderar_banda_propia')) {
      setSeasonsInCurrentBand(prev => prev + 1);
      if (band.id === 'liderar_banda_propia' || band.id === 'escalar_a_cantante') {
        setIsBandOwner(true);
      }
    } else {
      setSeasonsInCurrentBand(1);
      setIsBandOwner(false);
    }

    // Si elige escalar a cantante a los 20 años: actualizar rol del jugador
    if (band.id === 'escalar_a_cantante') {
      setPlayer(prev => prev ? { ...prev, role: 'CANTANTE', secondaryRole: prev.role } : null);
      setIsBandOwner(true);
    }

    // CÁLCULO DE PROBABILIDAD INTERNA OCULTA DE PERFORMANCES Y SHOWS SEGÚN OVR
    const internalSuccessRate = band.baseSuccessRate === 100 
      ? 100 
      : calculateDynamicSuccessRate(currentOvr, band.requiredOvr, 75);
    
    const internalRoll = Math.random() * 100;
    const isInternalSuccess = internalRoll <= internalSuccessRate;

    // Métricas calculadas según la performance interna de la temporada
    const shows = isInternalSuccess 
      ? (25 + Math.floor(Math.random() * 25) + (band.requiredOvr > 70 ? 15 : 0))
      : Math.max(8, Math.floor((15 + Math.random() * 10) * 0.6));

    const hits = calculateRealisticHits(currentAge, currentOvr, isInternalSuccess);
    const feats = calculateRealisticFeats(currentAge, isInternalSuccess);
    
    const valueInc = isInternalSuccess 
      ? (shows * 9000) + (hits * 120000)
      : Math.max(0, (shows * 4000) + (band.negativeMoneyDelta || 0));

    // SOFT-CAP ALTO OVR (>80): Llegar a 90-100 OVR es muy difícil y requiere mucha suerte
    let bonusTalent = band.bonusTalent;
    let bonusCharisma = band.bonusCharisma;
    if (currentOvr >= 80 && isInternalSuccess) {
      bonusTalent = Math.floor(bonusTalent * 0.3);
      bonusCharisma = Math.floor(bonusCharisma * 0.3);
      if (band.requiredOvr >= 84 && Math.random() < 0.20) {
        bonusTalent += 2;
        bonusCharisma += 2;
      }
    }

    const updatedTalent = isInternalSuccess
      ? Math.max(1, Math.min(99, player.attributes.talent + bonusTalent))
      : Math.max(1, Math.min(99, player.attributes.talent + (band.negativeTalentDelta || -1)));

    const updatedCharisma = isInternalSuccess
      ? Math.max(1, Math.min(99, player.attributes.charisma + bonusCharisma))
      : Math.max(1, Math.min(99, player.attributes.charisma + (band.negativeCharismaDelta || -2)));

    const updatedMoney = Math.max(0, player.attributes.money + valueInc);
    const newOvr = Math.round((updatedTalent + updatedCharisma) / 2);

    const awardEarned = isInternalSuccess ? (band.award || (band.requiredOvr >= 85 ? 'Estadio Histórico 👑' : undefined)) : undefined;

    const record: CareerStepRecord = {
      age: currentAge,
      bandName: band.name,
      bandLogo: band.logo,
      ovr: newOvr,
      shows,
      hits,
      feats,
      award: awardEarned,
      statusNote: isInternalSuccess ? band.positiveText : band.negativeText,
      isNegativeStrike: !isInternalSuccess
    };

    setPlayer(prev => prev ? {
      ...prev,
      attributes: {
        ...prev.attributes,
        talent: updatedTalent,
        charisma: updatedCharisma,
        money: updatedMoney
      }
    } : null);

    setTimeline(prev => [...prev, record]);
    setTotalShows(prev => prev + shows);
    setTotalHits(prev => prev + hits);
    setTotalFeats(prev => prev + feats);
    setCareerValue(prev => prev + valueInc);

    const hasAward = awardEarned && !awardsWon.includes(awardEarned);

    if (hasAward) {
      setAwardsWon(prev => [...prev, awardEarned!]);
      
      let awardType = 'DEFAULT';
      if (band.id === 'estadio_river_plate') awardType = 'RIVER_MONUMENTAL';
      else if (band.id === 'estadio_velez') awardType = 'VELEZ';
      else if (band.id === 'movistar_arena_tour') awardType = 'MOVISTAR_ARENA';
      else if (band.id === 'gran_rex_orquesta') awardType = 'GRAN_REX';
      else if (band.id === 'luna_park_legends') awardType = 'LUNA_PARK';
      else if (band.id === 'sesion_sin_miedo' || band.id === 'updr_zapada_especial') awardType = 'UPDR_SESSION';

      setCelebrationAward({
        title: awardEarned!,
        subtitle: band.positiveText,
        awardType
      });
      // No avanzamos el paso aquí: avanzará limpiamente cuando el usuario cierre el cartel en handleCloseModal()
    } else {
      if (currentStepIndex + 1 >= AGE_STEPS.length) {
        setGameState('ENDED');
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      } else {
        setCurrentStepIndex(prev => prev + 1);
      }
    }
  };

  // 3. Elegir Dilema de Carrera (RULETA CON PROBABILIDAD DE RIESGO DE EVENTO)
  const handleSelectDilemmaOption = (option: InPlaceDilemma['options'][0], optionIndex: number) => {
    if (!player || !currentBand || isSpinning) return;

    setIsSpinning(true);
    setSpinningOptionIndex(optionIndex);
    setSpinPhase('SPINNING');

    const effectiveSuccessRate = calculateDynamicSuccessRate(currentOvr, option.requiredOvr || 55, option.baseSuccessRate);
    const roll = Math.random() * 100;
    const isSuccess = roll <= effectiveSuccessRate;
    const result = isSuccess ? option.positive : option.negative;

    let currentSide: 'POSITIVE' | 'NEGATIVE' = 'POSITIVE';
    setActiveRouletteSide(currentSide);

    const intervalId = setInterval(() => {
      currentSide = currentSide === 'POSITIVE' ? 'NEGATIVE' : 'POSITIVE';
      setActiveRouletteSide(currentSide);
    }, 140);

    // 1. La ruleta gira durante 1.3 segundos (1300ms) alternando verde/rojo con buen suspenso
    setTimeout(() => {
      clearInterval(intervalId);
      setActiveRouletteSide(isSuccess ? 'POSITIVE' : 'NEGATIVE');
      setSpinPhase('RESOLVED');
      setSpinOutcomeSuccess(isSuccess);
      setSpinOutcomeText(result.text);

      let newScamCount = scamCount;
      let newVocalDamageCount = vocalDamageCount;

      if (!isSuccess) {
        if (result.isScam || result.isLawsuitLoss) {
          newScamCount += 1;
          setHasActiveLoan(true);
        }
        if (result.isVocalDamage) newVocalDamageCount += 1;
        setScamCount(newScamCount);
        setVocalDamageCount(newVocalDamageCount);
      } else {
        if (currentDilemma?.id.startsWith('cobro_deuda_prestamista_')) {
          setHasActiveLoan(false);
        }
      }

      if (currentDilemma?.id.startsWith('robo_hit_disolucion_banda_')) {
        setSeasonsInCurrentBand(1);
        if (optionIndex === 1 && isSuccess) {
          setIsBandOwner(true);
        } else {
          setIsBandOwner(false);
        }
      }

      let talentDelta = result.talentDelta;
      let charismaDelta = result.charismaDelta;

      if (currentOvr >= 80 && isSuccess) {
        talentDelta = Math.max(0, Math.floor(talentDelta * 0.3));
        charismaDelta = Math.max(0, Math.floor(charismaDelta * 0.3));
        const reqOvr = option.requiredOvr || 70;
        if (reqOvr >= 75 && Math.random() < 0.18) {
          talentDelta += 2;
          charismaDelta += 2;
        }
      }

      const updatedTalent = Math.max(1, Math.min(99, player.attributes.talent + talentDelta));
      const updatedCharisma = Math.max(1, Math.min(99, player.attributes.charisma + charismaDelta));
      const updatedStamina = Math.max(1, Math.min(99, player.attributes.stamina + result.staminaDelta));
      const updatedMoney = Math.max(0, player.attributes.money + result.moneyDelta);

      const shows = 25 + Math.floor(Math.random() * 15);
      const hits = calculateRealisticHits(currentAge, Math.round((updatedTalent + updatedCharisma) / 2), isSuccess);
      const feats = calculateRealisticFeats(currentAge, isSuccess);
      const valueInc = (shows * 10000) + (hits * 120000) + Math.max(0, result.moneyDelta);

      const newOvr = Math.round((updatedTalent + updatedCharisma) / 2);

      const record: CareerStepRecord = {
        age: currentAge,
        bandName: currentBand.name,
        bandLogo: currentBand.logo,
        ovr: newOvr,
        shows,
        hits,
        feats,
        award: result.award,
        statusNote: result.text,
        isNegativeStrike: !isSuccess && (result.talentDelta < 0 || result.moneyDelta < 0)
      };

      setPlayer({
        ...player,
        attributes: {
          ...player.attributes,
          talent: updatedTalent,
          charisma: updatedCharisma,
          stamina: updatedStamina,
          money: updatedMoney
        }
      });

      setTimeline(prev => [...prev, record]);
      setTotalShows(prev => prev + shows);
      setTotalHits(prev => prev + hits);
      setTotalFeats(prev => prev + feats);
      setCareerValue(prev => Math.max(0, prev + valueInc));

      const hasAwardModal = isSuccess && result.award && !awardsWon.includes(result.award);
      const hasTragedyModal = !isSuccess && (result.isScam || result.isVocalDamage || result.isPoliceBust || result.isLawsuitLoss || result.talentDelta <= -4);

      // 2. Mostrar la tarjeta de resultado durante 300ms antes del popup o avance
      setTimeout(() => {
        if (hasAwardModal) {
          setAwardsWon(prev => [...prev, result.award!]);
          
          let awardType = 'DEFAULT';
          if (result.award!.includes('UPDR') || result.award!.includes('Zapada')) awardType = 'UPDR_SESSION';
          else if (result.award!.includes('Gardel')) awardType = 'GARDEL_AWARD';
          else if (result.award!.includes('Tendencias')) awardType = 'RADIO';
          else if (result.award!.includes('Técnica')) awardType = 'VOCAL_MASTERY';
          else if (result.award!.includes('Leyenda')) awardType = 'LEGEND';

          setCelebrationAward({
            title: result.award!,
            subtitle: result.text,
            awardType
          });
        } else if (hasTragedyModal) {
          let tragedyType = 'DEFAULT';
          let tragedyTitle = 'GOLPE DURÍSIMO A TU CARRERA';

          if (result.isScam) {
            tragedyType = 'SCAM';
            tragedyTitle = 'ESTAFA & ROBO DE DERECHOS';
          } else if (result.isVocalDamage) {
            tragedyType = 'VOCAL_DAMAGE';
            tragedyTitle = 'ROTURA DE CUERDAS VOCALES';
          } else if (result.isPoliceBust) {
            tragedyType = 'POLICE_BUST';
            tragedyTitle = 'ALLANAMIENTO Y SECUESTRO';
          } else if (result.isLawsuitLoss) {
            tragedyType = 'LAWSUIT_LOSS';
            tragedyTitle = 'EMBARGO JUDICIAL TOTAL';
          }

          setTragedyPopup({
            title: tragedyTitle,
            subtitle: result.text,
            tragedyType,
            badge: `🚨 CATÁSTROFE A LOS ${currentAge} AÑOS`,
            ovrDelta: result.talentDelta + result.charismaDelta,
            moneyDelta: result.moneyDelta
          });
        } else {
          // Si no hay modal especial, avanzar de año
          if (newScamCount >= 2) {
            setEarlyRetireReason('SCAM_BURNOUT');
            setEarlyRetireMessage('🚫 Fuiste estafado por segunda vez consecutiva. Sin plata y con deudas, colgaste los instrumentos.');
            setGameState('ENDED');
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return;
          }

          if (newVocalDamageCount >= 1 && newOvr < 44) {
            setEarlyRetireReason('VOCAL_DAMAGE');
            setEarlyRetireMessage('🚫 Rotura severa de cuerdas vocales. El médico te prohibió terminantemente cantar.');
            setGameState('ENDED');
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return;
          }

          if (newOvr < 36) {
            setEarlyRetireReason('BANKRUPTCY');
            setEarlyRetireMessage('🚫 Tu nivel cayó por los suelos y nadie va a tus shows. Tuviste que volver a trabajar a la fábrica.');
            setGameState('ENDED');
            localStorage.removeItem(LOCAL_STORAGE_KEY);
            return;
          }

          if (currentStepIndex + 1 >= AGE_STEPS.length) {
            setGameState('ENDED');
            localStorage.removeItem(LOCAL_STORAGE_KEY);
          } else {
            setCurrentStepIndex(prev => prev + 1);
          }
        }
      }, 300);

    }, 1300);
  };

  const handleCloseModal = () => {
    setCelebrationAward(null);
    setTragedyPopup(null);
    setIsSpinning(false);
    setSpinningOptionIndex(null);

    // Al cerrar el cartel de celebración o tragedia, recién ahí avanzamos al siguiente año de carrera
    if (currentStepIndex + 1 >= AGE_STEPS.length) {
      setGameState('ENDED');
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } else {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleRestart = () => {
    handleDeleteSave();
    setGameState('CREATION');
    setPlayer(null);
    setCurrentStepIndex(0);
    setCurrentBand(null);
    setTimeline([]);
    setAwardsWon([]);
    setScamCount(0);
    setVocalDamageCount(0);
    setEarlyRetireReason(null);
    setEarlyRetireMessage(null);
    setIsSpinning(false);
    setSpinningOptionIndex(null);
    setActiveRouletteSide(null);
    setSpinPhase('IDLE');
    setCelebrationAward(null);
    setTragedyPopup(null);
  };

  // Renderizador de Iconos
  const renderCelebrationIcon = (type: string) => {
    switch (type) {
      case 'RIVER_MONUMENTAL':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-red-600 via-white to-red-600 flex items-center justify-center shadow-2xl shadow-red-500/50 border-4 border-amber-400 animate-bounce">
            <GiCrown className="w-16 h-16 md:w-20 md:h-20 text-amber-400 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'VELEZ':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-blue-700 via-blue-500 to-white flex items-center justify-center shadow-2xl shadow-blue-500/50 border-4 border-white animate-bounce">
            <GiSoccerField className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'UPDR_SESSION':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-purple-500/50 border-4 border-amber-300 animate-bounce">
            <GiMicrophone className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'BAILANTA':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-500 flex items-center justify-center shadow-2xl shadow-emerald-500/50 border-4 border-emerald-300 animate-bounce">
            <GiPalmTree className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'LUNA_PARK':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-amber-600 via-orange-500 to-yellow-400 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-4 border-amber-200 animate-bounce">
            <GiBoxingGlove className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'GRAN_REX':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-purple-800 via-indigo-600 to-amber-400 flex items-center justify-center shadow-2xl shadow-purple-500/50 border-4 border-amber-300 animate-bounce">
            <FaMasksTheater className="w-16 h-16 md:w-20 md:h-20 text-amber-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'MOVISTAR_ARENA':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-blue-600 via-cyan-400 to-amber-300 flex items-center justify-center shadow-2xl shadow-cyan-500/50 border-4 border-amber-300 animate-bounce">
            <GiStarMedal className="w-16 h-16 md:w-20 md:h-20 text-amber-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'GARDEL_AWARD':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-300 to-amber-600 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-4 border-amber-100 animate-bounce">
            <GiTrophyCup className="w-16 h-16 md:w-20 md:h-20 text-black drop-shadow-[0_4px_10px_rgba(0,0,0,0.4)]" />
          </div>
        );
      default:
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-4 border-white/20 animate-bounce">
            <GiPartyPopper className="w-16 h-16 md:w-20 md:h-20 text-black drop-shadow-md" />
          </div>
        );
    }
  };

  const renderTragedyIcon = (type: string) => {
    switch (type) {
      case 'SCAM':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-red-800 via-rose-600 to-red-950 flex items-center justify-center shadow-2xl shadow-red-600/60 border-4 border-red-400 animate-pulse">
            <GiPayMoney className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'VOCAL_DAMAGE':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-rose-900 via-red-700 to-zinc-900 flex items-center justify-center shadow-2xl shadow-red-600/60 border-4 border-rose-400 animate-pulse">
            <GiBandageRoll className="w-16 h-16 md:w-20 md:h-20 text-rose-200 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'POLICE_BUST':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-blue-900 via-red-700 to-blue-950 flex items-center justify-center shadow-2xl shadow-red-600/60 border-4 border-blue-400 animate-pulse">
            <GiHandcuffs className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'LAWSUIT_LOSS':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-zinc-800 via-red-800 to-zinc-950 flex items-center justify-center shadow-2xl shadow-red-600/60 border-4 border-zinc-400 animate-pulse">
            <GiGavel className="w-16 h-16 md:w-20 md:h-20 text-red-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      case 'STADIUM_FAIL':
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-slate-900 via-red-800 to-zinc-950 flex items-center justify-center shadow-2xl shadow-red-600/60 border-4 border-red-500 animate-pulse">
            <FaSkullCrossbones className="w-16 h-16 md:w-20 md:h-20 text-red-300 drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
          </div>
        );
      default:
        return (
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-red-700 to-red-950 flex items-center justify-center shadow-2xl shadow-red-600/60 border-4 border-white/20 animate-pulse">
            <FaTriangleExclamation className="w-16 h-16 md:w-20 md:h-20 text-white drop-shadow-md" />
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-[#0e1015] text-white p-4 md:p-8 font-sans relative overflow-x-hidden flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* MODAL DE TROFEO / CELEBRACIÓN */}
      {celebrationAward && (
        <div 
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn cursor-pointer"
        >
          <div className="relative bg-gradient-to-b from-[#1c2230] via-[#121620] to-black border-2 border-amber-400 rounded-3xl p-8 md:p-12 text-center max-w-lg w-full shadow-[0_0_80px_rgba(245,158,11,0.4)] space-y-6 animate-scaleUp">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative flex justify-center">
              {renderCelebrationIcon(celebrationAward.awardType)}
              <Sparkles className="absolute top-0 right-1/4 w-8 h-8 text-amber-300 animate-spin" />
              <Sparkles className="absolute bottom-2 left-1/4 w-6 h-6 text-amber-200 animate-ping" />
            </div>

            <div className="space-y-2 relative z-10">
              <span className="text-xs font-black tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full inline-block">
                🏆 ¡LOGRO / TEMPLO CONQUISTADO!
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-yellow text-white tracking-wide uppercase drop-shadow-md">
                {celebrationAward.title}
              </h2>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-sm mx-auto font-medium">
                {celebrationAward.subtitle}
              </p>
            </div>

            <div className="pt-2 text-[11px] text-white/40 font-mono">
              (Hacé click para continuar)
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE TRAGEDIA / ESTAFA */}
      {tragedyPopup && (
        <div 
          onClick={handleCloseModal}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fadeIn cursor-pointer"
        >
          <div className="relative bg-gradient-to-b from-[#2a0f12] via-[#1a080a] to-black border-2 border-red-500 rounded-3xl p-8 md:p-12 text-center max-w-lg w-full shadow-[0_0_80px_rgba(239,68,68,0.5)] space-y-6 animate-shake">
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-red-500/20 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative flex justify-center">
              {renderTragedyIcon(tragedyPopup.tragedyType)}
              <Skull className="absolute top-0 right-1/4 w-8 h-8 text-red-300 animate-bounce" />
              <ShieldAlert className="absolute bottom-2 left-1/4 w-6 h-6 text-red-200 animate-ping" />
            </div>

            <div className="space-y-2 relative z-10">
              <span className="text-xs font-black tracking-widest uppercase text-red-300 bg-red-500/20 border border-red-500/40 px-4 py-1.5 rounded-full inline-block">
                {tragedyPopup.badge}
              </span>
              <h2 className="text-2xl md:text-3xl font-black font-yellow text-red-400 tracking-wide uppercase drop-shadow-md">
                {tragedyPopup.title}
              </h2>
              <p className="text-xs md:text-sm text-red-200/90 leading-relaxed max-w-sm mx-auto font-medium">
                {tragedyPopup.subtitle}
              </p>

              <div className="flex items-center justify-center gap-3 pt-3">
                {tragedyPopup.ovrDelta !== 0 && (
                  <span className="text-xs font-mono font-bold bg-red-500/30 text-red-300 border border-red-500/50 px-3 py-1 rounded-xl">
                    {tragedyPopup.ovrDelta > 0 ? `+${tragedyPopup.ovrDelta}` : tragedyPopup.ovrDelta} OVR
                  </span>
                )}
                {tragedyPopup.moneyDelta !== 0 && (
                  <span className="text-xs font-mono font-bold bg-red-500/30 text-red-300 border border-red-500/50 px-3 py-1 rounded-xl">
                    {tragedyPopup.moneyDelta > 0 ? `+$${(tragedyPopup.moneyDelta / 1000).toFixed(0)}K` : `-$${(Math.abs(tragedyPopup.moneyDelta) / 1000).toFixed(0)}K`}
                  </span>
                )}
              </div>
            </div>

            <div className="pt-2 text-[11px] text-white/40 font-mono">
              (Hacé click para continuar)
            </div>
          </div>
        </div>
      )}

      {/* Barra Superior */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:text-amber-400 hover:border-amber-400/40 transition-colors backdrop-blur-md shadow-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Inicio
          </Link>

          {gameState === 'PLAYING' && (
            <button
              type="button"
              onClick={handleRestart}
              className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/10 px-3.5 py-2 text-xs font-bold text-red-300 hover:bg-red-500/30 hover:border-red-400 transition-colors backdrop-blur-md shadow-md cursor-pointer"
              title="Borrar partida actual y reiniciar"
            >
              <Trash2 className="w-3.5 h-3.5" /> Reiniciar Carrera
            </button>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
          <span className="text-xs font-mono font-bold text-white/60 uppercase tracking-widest">
            SIMULADOR DE CARRERA • CUMBIA UPDR
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto w-full flex-1">
        {/* VISTA 1: CREACIÓN DE PERSONAJE */}
        {gameState === 'CREATION' && (
          <div className="space-y-6">
            {savedCareer && (
              <div className="max-w-xl mx-auto bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-2 border-amber-400/60 rounded-3xl p-6 shadow-xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400">
                    💾 PARTIDA GUARDADA DETECTADA
                  </span>
                  <h4 className="text-lg font-bold text-white">
                    {savedCareer.player?.name} ({savedCareer.player?.nickname || 'Banda del Barrio'})
                  </h4>
                  <p className="text-xs text-white/60 font-mono">
                    • Edad {AGE_STEPS[savedCareer.currentStepIndex] || 16} Años • OVR {Math.round((savedCareer.player?.attributes.talent + savedCareer.player?.attributes.charisma) / 2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleDeleteSave}
                    title="Borrar esta partida guardada"
                    className="bg-red-500/20 hover:bg-red-500/40 text-red-300 border border-red-500/40 font-bold px-3.5 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 cursor-pointer text-xs"
                  >
                    <Trash2 className="w-4 h-4" /> Borrar
                  </button>

                  <button
                    type="button"
                    onClick={handleResumeCareer}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-black px-5 py-3 rounded-2xl transition-all shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
                  >
                    <Play className="w-4 h-4 fill-black" /> CONTINUAR
                  </button>
                </div>
              </div>
            )}

            <CharacterCreator onStartCareer={handleStartCareer} />
          </div>
        )}

        {/* VISTA 2: JUEGO EN CURSO (ESTILO COPERO 2 COLUMNAS) */}
        {gameState === 'PLAYING' && player && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* COLUMNA IZQUIERDA (JUGADOR Y DECISIONES - MÁS ANCHA) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Tarjeta de Perfil del Músico */}
              <div className="bg-[#141821] border border-amber-500/35 rounded-3xl p-6 md:p-7 shadow-[0_0_30px_rgba(245,158,11,0.12)] relative overflow-hidden space-y-6">

                {/* Badge OVR gigante + Datos del Jugador + Banda Actual */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center shadow-xl shadow-amber-500/25 shrink-0 border-2 border-amber-400/50">
                      <span className="text-[10px] font-black uppercase tracking-widest text-black/80">OVR</span>
                      <span className="text-3xl md:text-4xl font-black font-yellow text-black leading-none">{currentOvr}</span>
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[11px] font-black bg-white/10 px-2 py-0.5 rounded text-white border border-white/15">
                          🇦🇷 {player.originProvince ? player.originProvince.replace(/_/g, ' ') : 'ARG'}
                        </span>
                        <span className="text-[11px] font-black bg-amber-500/25 text-amber-200 border border-amber-500/40 px-2 py-0.5 rounded">
                          {getPlayerRolesDisplay(player)}
                        </span>
                        <span className="text-[11px] font-black bg-purple-500/25 text-purple-200 border border-purple-500/40 px-2 py-0.5 rounded uppercase">
                          {player.subgenre ? player.subgenre.replace(/_/g, ' ') : 'CUMBIA'}
                        </span>
                      </div>

                      <div>
                        <h2 className="text-xl md:text-2xl font-black text-amber-400 tracking-tight leading-tight">
                          {player.nickname}
                        </h2>
                        <p className="text-xs text-white/50 font-mono">
                          {player.name}
                        </p>
                      </div>

                      <div className="pt-0.5">
                        <span className="text-xs font-mono font-bold bg-amber-500/15 text-amber-300 border border-amber-400/40 px-3 py-1 rounded-xl inline-flex items-center gap-1.5 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                          <span>{currentBand ? currentBand.logo : '🎤'}</span>
                          <span>BANDA ACTUAL: <strong className="text-white font-sans font-black">{currentBand ? currentBand.name : 'Independiente'}</strong></span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-between items-center sm:items-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-white/10 shrink-0">
                    <div className="text-xs text-white/50 font-bold uppercase tracking-wider">
                      EDAD <strong className="text-white text-xl ml-1 font-mono">{currentAge}</strong>
                    </div>
                    <div className="text-xs text-white/50 font-bold uppercase tracking-wider mt-1">
                      CACHET <strong className="text-emerald-400 text-lg ml-1 font-mono">${(careerValue / 1000000).toFixed(1)}M</strong>
                    </div>
                  </div>
                </div>

                {/* 3 Métricas Clave Musicales (BAILES, HITS, FEATS) */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/10 text-center font-mono">
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3">
                    <span className="text-xs text-white/50 uppercase font-bold block flex items-center justify-center gap-1.5">
                      🌴 BAILES
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block">{totalShows}</span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3">
                    <span className="text-xs text-white/50 uppercase font-bold block flex items-center justify-center gap-1.5">
                      🔥 HITS
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block">{totalHits}</span>
                  </div>
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-3">
                    <span className="text-xs text-white/50 uppercase font-bold block flex items-center justify-center gap-1.5">
                      🎙️ FEATS
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block">{totalFeats}</span>
                  </div>
                </div>

                {/* Vitrina de Trofeos / Templos */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-center gap-2 min-h-[44px]">
                  {awardsWon.length === 0 ? (
                    <span className="text-xs text-white/40 uppercase tracking-widest font-mono flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-white/30" /> VITRINA VACÍA
                    </span>
                  ) : (
                    <div className="flex flex-wrap items-center justify-center gap-2">
                      {awardsWon.map((award, i) => (
                        <span key={i} className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-[0_0_10px_rgba(245,158,11,0.15)]">
                          {award}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Área de Decisión IN-PLACE */}
              <div className="space-y-4 pt-2">
                {isBandChoiceYear ? (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white">
                        {currentAge === 16 
                          ? 'Elegí tu primera banda inicial 🎶' 
                          : currentAge === 20 
                          ? '¿Seguís o cambias de banda a los 20 años? 🎶' 
                          : '¿Dónde tocamos este año? 🎶'}
                      </h3>
                      <p className="text-sm text-white/60 mt-1">
                        {currentAge === 16 
                          ? 'Elegís tu banda de inicio. Decisión directa de carrera.' 
                          : currentAge === 20 
                          ? 'Podés escalar a CANTANTE LÍDER en tu banda actual o cambiarte a otros proyectos.' 
                          : `Decisión directa de proyecto. El rendimiento en bailes y hits dependerá internamente de tu OVR.`}
                      </p>
                    </div>

                    <div className={`grid grid-cols-1 gap-4 ${availableBands.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                      {availableBands.map((band) => {
                        const callInfo = getBandCallText(band, player);
                        return (
                          <button
                            key={band.id}
                            type="button"
                            onClick={() => handleSelectBand(band)}
                            className="bg-[#141821] hover:bg-[#1b2230] border border-amber-500/30 hover:border-amber-400 rounded-3xl p-5 text-center transition-all duration-300 flex flex-col justify-between items-center group space-y-3 min-h-[235px] shadow-[0_0_20px_rgba(245,158,11,0.08)] hover:shadow-[0_0_30px_rgba(245,158,11,0.22)] hover:scale-[1.02] active:scale-95 cursor-pointer relative overflow-hidden"
                          >
                            <div className="w-full bg-amber-500/15 border border-amber-500/30 rounded-2xl p-2.5 text-center shadow-sm">
                              <span className="text-[10px] font-black tracking-wider uppercase text-amber-300 block font-mono">
                                {callInfo.actionLabel}:
                              </span>
                              <span className="text-xs md:text-sm font-black text-white block mt-0.5 leading-snug">
                                {callInfo.roleLabel}
                              </span>
                            </div>
                            
                            <div className="space-y-1.5">
                              <span className="text-3xl block group-hover:scale-110 transition-transform">{band.logo}</span>
                              <span className="text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors block">
                                {band.name}
                              </span>
                              <p className="text-xs text-white/70 leading-relaxed px-1">
                                {callInfo.description}
                              </p>
                            </div>

                            {/* BADGE DE DECISIÓN DE TRAYECTORIA */}
                            <div className="w-full space-y-1 pt-2 border-t border-white/10 font-mono text-[11px]">
                              <div className="bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-xl py-2 px-2 font-bold flex items-center justify-center gap-1.5 shadow-sm">
                                <ArrowRight className="w-4 h-4 text-amber-400 shrink-0" />
                                <span className="uppercase text-[11px]">FICHAR EN ESTA BANDA</span>
                              </div>
                              <div className="text-[10px] text-amber-300/80 font-bold font-mono flex items-center justify-center pt-0.5 uppercase tracking-wider">
                                <span>NIVEL EXIGIDO: {band.requiredOvr} OVR</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white">
                        {currentDilemma?.title || 'Dilema de la Noche'}
                      </h3>
                      <p className="text-sm text-white/60 mt-1">
                        {currentDilemma?.description || 'Tomá una decisión que marcará el rumbo de tu carrera.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {currentDilemma?.options.map((opt, i) => {
                        const isSelected = spinningOptionIndex === i;
                        const isOther = spinningOptionIndex !== null && !isSelected;

                        const reqOvr = opt.requiredOvr || 55;
                        const dynamicRate = calculateDynamicSuccessRate(currentOvr, reqOvr, opt.baseSuccessRate);

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isSpinning}
                            onClick={() => handleSelectDilemmaOption(opt, i)}
                            className={`rounded-3xl p-6 text-center transition-all duration-300 flex flex-col justify-between items-center group space-y-4 min-h-[235px] relative overflow-hidden cursor-pointer ${
                              isSelected && spinPhase === 'RESOLVED' && spinOutcomeSuccess
                                ? 'bg-emerald-950/80 border-2 border-emerald-400 scale-[1.02] shadow-[0_0_40px_rgba(52,211,153,0.4)]'
                                : isSelected && spinPhase === 'RESOLVED' && !spinOutcomeSuccess
                                ? 'bg-red-950/80 border-2 border-red-500 scale-[1.02] shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-shake'
                                : isSelected && spinPhase === 'SPINNING'
                                ? 'bg-[#181d29] border-2 border-amber-400 scale-[1.02] shadow-[0_0_30px_rgba(245,158,11,0.4)]'
                                : isOther
                                ? 'opacity-30 pointer-events-none bg-[#141821] border border-white/10'
                                : 'bg-[#141821] hover:bg-[#1b2230] border border-amber-500/30 hover:border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.08)] hover:shadow-[0_0_30px_rgba(245,158,11,0.22)] hover:scale-[1.02] active:scale-95'
                            }`}
                          >
                            <span className="text-xs text-white/50 font-bold uppercase tracking-wider flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Decisión Cumbiera
                            </span>

                            <div className="space-y-1.5">
                              <span className="text-4xl block group-hover:scale-110 transition-transform">{opt.icon}</span>
                              <span className="text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors block">
                                {opt.label}
                              </span>
                              <p className="text-xs text-white/50 leading-relaxed px-1">
                                {opt.sublabel}
                              </p>
                            </div>

                            <div className="w-full space-y-1.5 pt-2 border-t border-white/10 font-mono text-[11px]">
                              <div className="grid grid-cols-2 gap-2">
                                <div className={`rounded-xl py-2 px-1.5 font-bold flex flex-col items-center transition-all duration-300 ${
                                  isSelected && isSpinning && activeRouletteSide === 'POSITIVE'
                                    ? 'bg-emerald-400 text-black border-2 border-white shadow-[0_0_25px_rgba(52,211,153,1)] scale-105 ring-4 ring-emerald-400/40'
                                    : isSelected && spinPhase === 'RESOLVED' && spinOutcomeSuccess
                                    ? 'bg-emerald-500 text-black border-2 border-white shadow-[0_0_30px_rgba(16,185,129,1)] scale-105 ring-4 ring-emerald-400 animate-pulse'
                                    : isSelected && (isSpinning || spinPhase === 'RESOLVED') && (activeRouletteSide === 'NEGATIVE' || !spinOutcomeSuccess)
                                    ? 'opacity-20 grayscale bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                                }`}>
                                  <span className="text-xs">🟢 {dynamicRate}%</span>
                                  <span className="text-[10px] uppercase">Sale Joya</span>
                                </div>

                                <div className={`rounded-xl py-2 px-1.5 font-bold flex flex-col items-center transition-all duration-300 ${
                                  isSelected && isSpinning && activeRouletteSide === 'NEGATIVE'
                                    ? 'bg-red-500 text-white border-2 border-white shadow-[0_0_25px_rgba(239,68,68,1)] scale-105 ring-4 ring-red-500/40'
                                    : isSelected && spinPhase === 'RESOLVED' && !spinOutcomeSuccess
                                    ? 'bg-red-600 text-white border-2 border-white shadow-[0_0_30px_rgba(239,68,68,1)] scale-105 ring-4 ring-red-500 animate-shake'
                                    : isSelected && (isSpinning || spinPhase === 'RESOLVED') && (activeRouletteSide === 'POSITIVE' || spinOutcomeSuccess)
                                    ? 'opacity-20 grayscale bg-red-500/10 border border-red-500/20 text-red-400'
                                    : 'bg-red-500/10 border border-red-500/30 text-red-400'
                                }`}>
                                  <span className="text-xs">🔴 {100 - dynamicRate}%</span>
                                  <span className="text-[10px] uppercase">Sale Mal</span>
                                </div>
                              </div>
                            </div>

                            {isSelected && spinPhase === 'RESOLVED' && (
                              <div className={`w-full p-2 rounded-xl text-xs font-bold leading-tight animate-fadeIn ${
                                spinOutcomeSuccess ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-red-500/20 text-red-200 border border-red-500/40'
                              }`}>
                                {spinOutcomeSuccess ? '🎉 ' : '💥 '} {spinOutcomeText}
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* COLUMNA DERECHA (LÍNEA DE TIEMPO COPERO) */}
            <div className="lg:col-span-5 bg-[#141821] border border-amber-500/35 rounded-3xl p-5 md:p-6 shadow-[0_0_30px_rgba(245,158,11,0.12)] space-y-4">
              
              <div className="grid grid-cols-12 text-[11px] md:text-xs font-black text-white/50 uppercase tracking-wider px-4 pb-3 border-b border-white/10 font-mono">
                <div className="col-span-2">EDAD</div>
                <div className="col-span-4">BANDA / ESCENARIO</div>
                <div className="col-span-2 text-center">OVR</div>
                <div className="col-span-2 text-center">BAILES</div>
                <div className="col-span-1 text-center">HITS</div>
                <div className="col-span-1 text-center">FEATS</div>
              </div>

              <div className="space-y-2">
                {AGE_STEPS.map((ageStep) => {
                  const record = timeline.find(r => r.age === ageStep);
                  const isCurrent = ageStep === currentAge;

                  return (
                    <div 
                      key={ageStep}
                      className={`grid grid-cols-12 items-center px-4 py-3 rounded-2xl text-sm transition-all ${
                        record?.isNegativeStrike
                          ? 'bg-red-500/15 border-2 border-red-500/40 shadow-md shadow-red-500/10'
                          : isCurrent 
                          ? 'bg-amber-500/15 border-2 border-amber-400/60 shadow-lg shadow-amber-500/10' 
                          : record 
                          ? 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06]' 
                          : 'opacity-30'
                      }`}
                    >
                      <div className="col-span-2 flex items-center gap-2">
                        <span className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-sm ${
                          record?.isNegativeStrike
                            ? 'bg-red-500 text-white font-bold'
                            : isCurrent 
                            ? 'bg-amber-500 text-black shadow-md shadow-amber-500/40' 
                            : record 
                            ? 'bg-white/15 text-white font-bold' 
                            : 'bg-white/5 text-white/40'
                        }`}>
                          {ageStep}
                        </span>
                      </div>

                      <div className="col-span-4 flex items-center gap-2.5 truncate">
                        {record ? (
                          <>
                            <span className="text-lg shrink-0">{record.bandLogo}</span>
                            <span className="font-bold text-white text-sm md:text-base truncate">{record.bandName}</span>
                            {record.award && (
                              <span className="text-sm shrink-0" title={record.award}>🏆</span>
                            )}
                          </>
                        ) : isCurrent ? (
                          <span className="text-amber-300/90 font-medium italic text-xs md:text-sm font-mono animate-pulse truncate">
                            {isBandChoiceYear ? '? Buscando banda...' : '? Dilema nocturno...'}
                          </span>
                        ) : (
                          <span className="text-white/20 font-mono text-sm">-</span>
                        )}
                      </div>

                      <div className="col-span-2 text-center">
                        {record ? (
                          <span className={`inline-block px-3 py-1 rounded-lg font-black font-mono text-sm shadow-sm ${
                            record.isNegativeStrike ? 'bg-red-500 text-white' : 'bg-amber-500 text-black'
                          }`}>
                            {record.ovr}
                          </span>
                        ) : isCurrent ? (
                          <span className="inline-block px-3 py-1 rounded-lg bg-amber-500/30 text-amber-300 font-black font-mono text-sm border border-amber-500/50">
                            {currentOvr}
                          </span>
                        ) : (
                          <span className="text-white/20 font-mono">-</span>
                        )}
                      </div>

                      <div className="col-span-2 text-center font-mono text-white font-bold text-sm md:text-base">
                        {record ? record.shows : '-'}
                      </div>
                      <div className="col-span-1 text-center font-mono text-white font-bold text-sm md:text-base">
                        {record ? record.hits : '-'}
                      </div>
                      <div className="col-span-1 text-center font-mono text-white font-bold text-sm md:text-base">
                        {record ? record.feats : '-'}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-4 border-t border-white/10 flex justify-between items-center text-xs md:text-sm text-white/50 font-mono px-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">🇦🇷</span>
                  <span className="font-bold text-white/80">Un Poco de Ruido • Sesión Histórica</span>
                </div>
                <div className="flex items-center gap-5 text-white/80 font-bold">
                  <span>🌴 {totalShows} BAILES</span>
                  <span>🔥 {totalHits} HITS</span>
                  <span>🎙️ {totalFeats} FEATS</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* VISTA 3: PANTALLA FINAL / RETIRO CON FIGURITA PERSONALIZADA */}
        {gameState === 'ENDED' && player && (
          <div className="space-y-6">
            {earlyRetireMessage && (
              <div className="max-w-3xl mx-auto bg-red-500/15 border-2 border-red-500/50 rounded-2xl p-4 text-center text-red-200 text-sm font-bold flex items-center justify-center gap-2 animate-bounce">
                <AlertOctagon className="w-5 h-5 text-red-400" />
                {earlyRetireMessage}
              </div>
            )}
            <CareerEndCard 
              player={player} 
              history={timeline.map(t => ({
                age: t.age,
                year: 2026 + (t.age - 16),
                bandName: t.bandName,
                role: player.role,
                venueConquered: {
                  id: 'stage',
                  name: t.bandName,
                  category: t.ovr >= 85 ? 'ESTADIO' : t.ovr >= 72 ? 'ARENA' : t.ovr >= 60 ? 'BAILANTA' : 'BARRIO',
                  capacity: t.ovr >= 85 ? 85000 : t.ovr >= 72 ? 15000 : 3500,
                  description: '',
                  minTalentRequired: 40,
                  minCharismaRequired: 40,
                  icon: t.bandLogo,
                  location: ''
                },
                showsPlayed: t.shows,
                moneyEarned: t.shows * 100000,
                hitSongTitle: 'Enganchados de la Noche',
                listenersMonthly: t.ovr * 15000,
                awardsWon: t.award ? [t.award] : [],
                ovrEnd: t.ovr,
                highlightText: ''
              }))} 
              earlyRetireReason={earlyRetireReason}
              onRestart={handleRestart} 
            />
          </div>
        )}
      </div>

      <footer className="text-center text-xs text-white/30 font-mono py-4 mt-8">
        Los nombres, lugares y referencias mostrados pertenecen a la cultura popular argentina y se utilizan únicamente con fines humorísticos e interactivos.
      </footer>
    </main>
  );
}

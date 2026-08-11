"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  AGE_STEPS, 
  BandOption, 
  InPlaceDilemma,
  getRandomBandsForAge,
  getRandomDilemmaForAge
} from '@/lib/cumbia-sim/career-data';
import { CumbiaPlayer, MusicalRole, CumbiaSubgenre, OriginZone } from '@/lib/cumbia-sim/types';
import { CharacterCreator } from '@/components/cumbia-sim/CharacterCreator';
import { CareerEndCard } from '@/components/cumbia-sim/CareerEndCard';
import { ArrowLeft, Trophy, Crown, Sparkles, RefreshCw, Disc, Check, Mic, AlertOctagon, AlertTriangle, Flame, ThumbsUp, ThumbsDown } from 'lucide-react';

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

  // Estados para la Ruleta de Iluminación Alternante (Verde / Rojo)
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
    icon: string;
  } | null>(null);
  
  // Contadores de incidentes para retiro prematuro realista
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

  // Actualizar opciones dinámicas aleatorias cuando cambia la edad
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    // Resetear estados de sorteo
    setIsSpinning(false);
    setSpinningOptionIndex(null);
    setActiveRouletteSide(null);
    setSpinPhase('IDLE');
    setSpinOutcomeSuccess(null);
    setSpinOutcomeText(null);

    if (isBandChoiceYear) {
      const count = currentAge === 16 || currentAge === 20 ? 3 : 2;
      setAvailableBands(getRandomBandsForAge(currentAge, count));
      setCurrentDilemma(null);
    } else {
      setAvailableBands([]);
      setCurrentDilemma(getRandomDilemmaForAge(currentAge));
    }
  }, [currentStepIndex, gameState, currentAge, isBandChoiceYear]);

  // 1. Iniciar Partida
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
    setActiveRouletteSide(null);
    
    // Set initial dynamic bands
    setAvailableBands(getRandomBandsForAge(16, 3));
    setCurrentDilemma(null);

    setGameState('PLAYING');
  };

  // 2. Elegir Banda / Proyecto con Ruleta de Luces Verde/Rojo
  const handleSelectBand = (band: BandOption, bandIndex: number) => {
    if (!player || isSpinning) return;

    setIsSpinning(true);
    setSpinningOptionIndex(bandIndex);
    setSpinPhase('SPINNING');

    const roll = Math.random() * 100;
    const isSuccess = roll <= (band.successRate || 80);

    // Animación de alternancia rápida entre Verde y Rojo (tic-tic-tic)
    let currentSide: 'POSITIVE' | 'NEGATIVE' = 'POSITIVE';
    setActiveRouletteSide(currentSide);

    const intervalId = setInterval(() => {
      currentSide = currentSide === 'POSITIVE' ? 'NEGATIVE' : 'POSITIVE';
      setActiveRouletteSide(currentSide);
    }, 90);

    // Clavarse en el resultado final (1.2s)
    setTimeout(() => {
      clearInterval(intervalId);
      setActiveRouletteSide(isSuccess ? 'POSITIVE' : 'NEGATIVE');
      setSpinPhase('RESOLVED');
      setSpinOutcomeSuccess(isSuccess);
      setSpinOutcomeText(isSuccess ? band.positiveText : band.negativeText);

      setCurrentBand(band);

      // Calcular stats de esa temporada
      const baseShows = 20 + Math.floor(Math.random() * 20) + (band.minTalent > 70 ? 15 : 0);
      const shows = isSuccess ? baseShows : Math.max(8, Math.floor(baseShows * 0.6));
      const hits = isSuccess 
        ? Math.max(0, Math.floor((player.attributes.talent * 0.10) + Math.random() * 3))
        : Math.max(0, Math.floor((player.attributes.talent * 0.05)));
      const feats = isSuccess ? Math.floor(Math.random() * 3) : 0;
      
      const valueInc = isSuccess 
        ? (shows * 8000) + (hits * 100000)
        : Math.max(0, (shows * 4000) + (band.negativeMoneyDelta || 0));

      const updatedTalent = isSuccess 
        ? Math.max(1, Math.min(99, player.attributes.talent + band.bonusTalent))
        : Math.max(1, Math.min(99, player.attributes.talent + (band.negativeTalentDelta || -1)));

      const updatedCharisma = isSuccess 
        ? Math.max(1, Math.min(99, player.attributes.charisma + band.bonusCharisma))
        : Math.max(1, Math.min(99, player.attributes.charisma + (band.negativeCharismaDelta || -1)));

      const updatedMoney = Math.max(0, player.attributes.money + valueInc);
      const newOvr = Math.round((updatedTalent + updatedCharisma) / 2);

      // Solo gana el premio / trofeo si SALE JOYA
      const awardEarned = isSuccess ? (band.award || (band.minTalent >= 85 ? 'Estadio Histórico 👑' : undefined)) : undefined;

      const record: CareerStepRecord = {
        age: currentAge,
        bandName: band.name,
        bandLogo: band.logo,
        ovr: newOvr,
        shows,
        hits,
        feats,
        award: awardEarned,
        isNegativeStrike: !isSuccess
      };

      if (awardEarned && !awardsWon.includes(awardEarned)) {
        setAwardsWon(prev => [...prev, awardEarned]);
        
        // ¡Disparar animación de trofeo copero!
        setCelebrationAward({
          title: awardEarned,
          subtitle: band.positiveText,
          icon: band.minTalent >= 85 ? '👑' : band.minTalent >= 75 ? '⭐' : '🏆'
        });
      }

      // Tiempo para leer resultado antes de avanzar
      setTimeout(() => {
        setPlayer({
          ...player,
          attributes: {
            ...player.attributes,
            talent: updatedTalent,
            charisma: updatedCharisma,
            money: updatedMoney
          }
        });

        setTimeline(prev => [...prev, record]);
        setTotalShows(prev => prev + shows);
        setTotalHits(prev => prev + hits);
        setTotalFeats(prev => prev + feats);
        setCareerValue(prev => prev + valueInc);

        // Avanzar al siguiente paso
        if (currentStepIndex + 1 >= AGE_STEPS.length) {
          setGameState('ENDED');
        } else {
          setCurrentStepIndex(prev => prev + 1);
        }
      }, awardEarned ? 2400 : 1800);

    }, 1200);
  };

  // 3. Elegir Dilema de Carrera con Ruleta de Luces Verde/Rojo
  const handleSelectDilemmaOption = (option: InPlaceDilemma['options'][0], optionIndex: number) => {
    if (!player || !currentBand || isSpinning) return;

    setIsSpinning(true);
    setSpinningOptionIndex(optionIndex);
    setSpinPhase('SPINNING');

    const roll = Math.random() * 100;
    const isSuccess = roll <= option.successRate;
    const result = isSuccess ? option.positive : option.negative;

    // Animación de alternancia rápida entre Verde y Rojo (tic-tic-tic)
    let currentSide: 'POSITIVE' | 'NEGATIVE' = 'POSITIVE';
    setActiveRouletteSide(currentSide);

    const intervalId = setInterval(() => {
      currentSide = currentSide === 'POSITIVE' ? 'NEGATIVE' : 'POSITIVE';
      setActiveRouletteSide(currentSide);
    }, 90);

    // Clavarse en el resultado final (1.2s)
    setTimeout(() => {
      clearInterval(intervalId);
      setActiveRouletteSide(isSuccess ? 'POSITIVE' : 'NEGATIVE');
      setSpinPhase('RESOLVED');
      setSpinOutcomeSuccess(isSuccess);
      setSpinOutcomeText(result.text);

      let newScamCount = scamCount;
      let newVocalDamageCount = vocalDamageCount;

      if (!isSuccess) {
        if (result.isScam) newScamCount += 1;
        if (result.isVocalDamage) newVocalDamageCount += 1;
        setScamCount(newScamCount);
        setVocalDamageCount(newVocalDamageCount);
      }

      const updatedTalent = Math.max(1, Math.min(99, player.attributes.talent + result.talentDelta));
      const updatedCharisma = Math.max(1, Math.min(99, player.attributes.charisma + result.charismaDelta));
      const updatedStamina = Math.max(1, Math.min(99, player.attributes.stamina + result.staminaDelta));
      const updatedMoney = Math.max(0, player.attributes.money + result.moneyDelta);

      const shows = 25 + Math.floor(Math.random() * 15);
      const hits = Math.max(0, Math.floor((updatedTalent * 0.12) + Math.random() * 3));
      const feats = Math.floor(Math.random() * 3);
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
        isNegativeStrike: !isSuccess && (result.talentDelta < 0 || result.moneyDelta < 0)
      };

      if (result.award && !awardsWon.includes(result.award)) {
        setAwardsWon(prev => [...prev, result.award!]);
        
        // ¡Disparar animación de trofeo copero!
        setCelebrationAward({
          title: result.award,
          subtitle: result.text,
          icon: result.award.includes('UPDR') ? '🌟' : result.award.includes('Gardel') ? '🏆' : '👑'
        });
      }

      // Tiempo para leer resultado antes de avanzar
      setTimeout(() => {
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

        // Chequeos de Retiro Prematuro
        if (newScamCount >= 2) {
          setEarlyRetireReason('SCAM_BURNOUT');
          setEarlyRetireMessage('🚫 Fuiste estafado por segunda vez consecutiva. Sin plata y con deudas, colgaste los instrumentos.');
          setGameState('ENDED');
          return;
        }

        if (newVocalDamageCount >= 1 && newOvr < 44) {
          setEarlyRetireReason('VOCAL_DAMAGE');
          setEarlyRetireMessage('🚫 Rotura severa de cuerdas vocales. El médico te prohibió terminantemente cantar.');
          setGameState('ENDED');
          return;
        }

        if (newOvr < 36) {
          setEarlyRetireReason('BANKRUPTCY');
          setEarlyRetireMessage('🚫 Tu nivel cayó por los suelos y nadie va a tus shows. Tuviste que volver a trabajar a la fábrica.');
          setGameState('ENDED');
          return;
        }

        // Avanzar al siguiente paso
        if (currentStepIndex + 1 >= AGE_STEPS.length) {
          setGameState('ENDED');
        } else {
          setCurrentStepIndex(prev => prev + 1);
        }
      }, result.award ? 2400 : 1800);

    }, 1200);
  };

  const handleRestart = () => {
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
  };

  return (
    <main className="min-h-screen bg-[#0e1015] text-white p-4 md:p-8 font-sans relative overflow-x-hidden flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      
      {/* ================= MODAL / OVERLAY DE CELEBRACIÓN DE TROFEO (ESTILO COPERO) ================= */}
      {celebrationAward && (
        <div 
          onClick={() => setCelebrationAward(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn cursor-pointer"
        >
          <div className="relative bg-gradient-to-b from-[#1c2230] via-[#121620] to-black border-2 border-amber-400 rounded-3xl p-8 md:p-12 text-center max-w-lg w-full shadow-[0_0_80px_rgba(245,158,11,0.4)] space-y-6 animate-scaleUp">
            
            {/* Resplandor dorado de fondo */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-400/20 rounded-full blur-3xl pointer-events-none"></div>

            {/* Icono de Trofeo Gigante Flotante */}
            <div className="relative flex justify-center">
              <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-2xl shadow-amber-500/50 border-4 border-white/20 animate-bounce">
                <span className="text-6xl md:text-7xl drop-shadow-lg">{celebrationAward.icon}</span>
              </div>
              <Sparkles className="absolute top-0 right-1/4 w-8 h-8 text-amber-300 animate-spin" />
              <Sparkles className="absolute bottom-2 left-1/4 w-6 h-6 text-amber-200 animate-ping" />
            </div>

            {/* Títulos del Logro */}
            <div className="space-y-2 relative z-10">
              <span className="text-xs font-black tracking-widest uppercase text-amber-400 bg-amber-400/10 border border-amber-400/30 px-4 py-1.5 rounded-full inline-block">
                🏆 ¡LOGRO / TEMPLO CONQUISTADO!
              </span>
              <h2 className="text-2xl md:text-4xl font-black font-yellow text-white tracking-wide uppercase drop-shadow-md">
                {celebrationAward.title}
              </h2>
              <p className="text-xs md:text-sm text-white/80 leading-relaxed max-w-sm mx-auto font-medium">
                {celebrationAward.subtitle}
              </p>
            </div>

            {/* Indicador de cierre */}
            <div className="pt-2 text-[11px] text-white/40 font-mono">
              (Hacé click para continuar la carrera)
            </div>
          </div>
        </div>
      )}

      {/* Barra Superior */}
      <div className="max-w-7xl mx-auto w-full flex justify-between items-center mb-6">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:text-amber-400 hover:border-amber-400/40 transition-colors backdrop-blur-md shadow-md cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </Link>
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
          <CharacterCreator onStartCareer={handleStartCareer} />
        )}

        {/* VISTA 2: JUEGO EN CURSO (ESTILO COPERO 2 COLUMNAS) */}
        {gameState === 'PLAYING' && player && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* ================= COLUMNA IZQUIERDA (JUGADOR Y DECISIÓN) ================= */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Tarjeta de Perfil del Músico (Estilo Copero Top Left) */}
              <div className="bg-[#141821] border border-white/10 rounded-3xl p-6 md:p-7 shadow-2xl relative overflow-hidden space-y-6">
                
                {/* Fila Superior: Badge OVR gigante + Datos del Jugador */}
                <div className="flex items-center gap-5">
                  {/* Badge OVR Naranja / Dorado Copero */}
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex flex-col items-center justify-center shadow-xl shadow-amber-500/25 shrink-0 border-2 border-amber-400/50">
                    <span className="text-xs font-black uppercase tracking-widest text-black/80">OVR</span>
                    <span className="text-4xl font-black font-yellow text-black leading-none">{currentOvr}</span>
                  </div>

                  {/* Info */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-black bg-white/10 px-2.5 py-1 rounded-md text-white border border-white/15">
                        🇦🇷 ARG
                      </span>
                      <span className="text-xs font-black bg-purple-500/25 text-purple-200 border border-purple-500/40 px-2.5 py-1 rounded-md">
                        {player.role === 'CANTANTE' ? '🎤 VOZ LÍDER' : player.role === 'TECLADISTA' ? '🎹 TECLADO ROLAND' : player.role === 'TIMBALERO' ? '🪘 TIMBALES LP' : player.role === 'BAJISTA' ? '🎸 BAJO CUMBIERO' : '🎺 VIENTOS TROPICALES'}
                      </span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-white truncate flex items-center gap-2">
                      <span className="text-2xl shrink-0">{currentBand ? currentBand.logo : '🎤'}</span>
                      <span className="truncate">{currentBand ? currentBand.name : 'Banda del Barrio'}</span>
                    </h2>
                  </div>

                  {/* Edad y Valor */}
                  <div className="text-right shrink-0">
                    <div className="text-xs text-white/50 font-bold uppercase tracking-wider">
                      EDAD <strong className="text-white text-xl ml-1 font-mono">{currentAge}</strong>
                    </div>
                    <div className="text-xs text-white/50 font-bold uppercase tracking-wider mt-1">
                      CACHET <strong className="text-emerald-400 text-lg ml-1 font-mono">${(careerValue / 1000000).toFixed(1)}M</strong>
                    </div>
                  </div>
                </div>

                {/* Fila Media: 3 Métricas Clave Musicales (BAILES, HITS, FEATS) */}
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
                        <span key={i} className="text-xs bg-amber-500/15 border border-amber-500/30 text-amber-300 px-3 py-1 rounded-xl font-bold flex items-center gap-1.5 shadow-sm">
                          {award}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              {/* Área de Decisión IN-PLACE (Sin Ventanas Emergentes) */}
              <div className="space-y-4 pt-2">
                {isBandChoiceYear ? (
                  /* ELECCIÓN DE BANDA / CONTRATO / ESTADIO CON LUCES VERDE/ROJO */
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-black text-white">¿Dónde tocamos este año? 🎶</h3>
                      <p className="text-sm text-white/60 mt-1">
                        Elegí la banda, la bailanta o el estadio. ¡Cuidado que los grandes templos tienen riesgo de no llenarse!
                      </p>
                    </div>

                    <div className={`grid grid-cols-1 gap-4 ${availableBands.length === 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
                      {availableBands.map((band, i) => {
                        const isSelected = spinningOptionIndex === i;
                        const isOther = spinningOptionIndex !== null && !isSelected;

                        return (
                          <button
                            key={band.id}
                            type="button"
                            disabled={isSpinning}
                            onClick={() => handleSelectBand(band, i)}
                            className={`rounded-3xl p-5 text-center transition-all duration-300 flex flex-col justify-between items-center group space-y-3 min-h-[220px] shadow-xl relative overflow-hidden cursor-pointer ${
                              isSelected && spinPhase === 'RESOLVED' && spinOutcomeSuccess
                                ? 'bg-emerald-950/80 border-2 border-emerald-400 scale-[1.02] shadow-emerald-500/40'
                                : isSelected && spinPhase === 'RESOLVED' && !spinOutcomeSuccess
                                ? 'bg-red-950/80 border-2 border-red-500 scale-[1.02] shadow-red-500/40 animate-shake'
                                : isSelected && spinPhase === 'SPINNING'
                                ? 'bg-[#181d29] border-2 border-amber-400/80 scale-[1.02]'
                                : isOther
                                ? 'opacity-30 pointer-events-none bg-[#141821] border border-white/10'
                                : 'bg-[#141821] hover:bg-[#1b2230] border border-white/15 hover:border-amber-400/60 hover:scale-[1.02] active:scale-95'
                            }`}
                          >
                            <span className="text-xs text-white/50 font-bold uppercase tracking-wider">
                              {band.actionLabel || 'Sumarse a'}
                            </span>
                            
                            <div className="space-y-1.5">
                              <span className="text-3xl block group-hover:scale-110 transition-transform">{band.logo}</span>
                              <span className="text-base md:text-lg font-bold text-white group-hover:text-amber-400 transition-colors block">
                                {band.name}
                              </span>
                              <p className="text-xs text-white/50 leading-relaxed px-1">
                                {band.description}
                              </p>
                            </div>

                            {/* RECUADROS VERDE / ROJO CON ILUMINACIÓN ALTERNANTE */}
                            <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-mono text-[11px]">
                              {/* Cuadrado Verde (Sale Joya / Sold Out) */}
                              <div className={`rounded-xl py-2 px-1.5 font-bold flex flex-col items-center transition-all duration-150 ${
                                isSelected && isSpinning && activeRouletteSide === 'POSITIVE'
                                  ? 'bg-emerald-400 text-black border-2 border-white shadow-[0_0_25px_rgba(52,211,153,1)] scale-105 ring-4 ring-emerald-400/40'
                                  : isSelected && spinPhase === 'RESOLVED' && spinOutcomeSuccess
                                  ? 'bg-emerald-500 text-black border-2 border-white shadow-[0_0_30px_rgba(16,185,129,1)] scale-105 ring-4 ring-emerald-400 animate-pulse'
                                  : isSelected && (isSpinning || spinPhase === 'RESOLVED') && (activeRouletteSide === 'NEGATIVE' || !spinOutcomeSuccess)
                                  ? 'opacity-20 grayscale bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                              }`}>
                                <span className="text-xs">🟢 {band.successRate || 80}%</span>
                                <span className="text-[10px] uppercase">Sold Out</span>
                              </div>

                              {/* Cuadrado Rojo (Sale Mal / Complicado) */}
                              <div className={`rounded-xl py-2 px-1.5 font-bold flex flex-col items-center transition-all duration-150 ${
                                isSelected && isSpinning && activeRouletteSide === 'NEGATIVE'
                                  ? 'bg-red-500 text-white border-2 border-white shadow-[0_0_25px_rgba(239,68,68,1)] scale-105 ring-4 ring-red-500/40'
                                  : isSelected && spinPhase === 'RESOLVED' && !spinOutcomeSuccess
                                  ? 'bg-red-600 text-white border-2 border-white shadow-[0_0_30px_rgba(239,68,68,1)] scale-105 ring-4 ring-red-500 animate-shake'
                                  : isSelected && (isSpinning || spinPhase === 'RESOLVED') && (activeRouletteSide === 'POSITIVE' || spinOutcomeSuccess)
                                  ? 'opacity-20 grayscale bg-red-500/10 border border-red-500/20 text-red-400'
                                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
                              }`}>
                                <span className="text-xs">🔴 {100 - (band.successRate || 80)}%</span>
                                <span className="text-[10px] uppercase">Falla</span>
                              </div>
                            </div>

                            {/* Mensaje de Resultado tras clavarse */}
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
                ) : (
                  /* DILEMA DE LA NOCHE CON LUCES VERDE/ROJO */
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

                        return (
                          <button
                            key={i}
                            type="button"
                            disabled={isSpinning}
                            onClick={() => handleSelectDilemmaOption(opt, i)}
                            className={`rounded-3xl p-6 text-center transition-all duration-300 flex flex-col justify-between items-center group space-y-4 min-h-[220px] shadow-xl relative overflow-hidden cursor-pointer ${
                              isSelected && spinPhase === 'RESOLVED' && spinOutcomeSuccess
                                ? 'bg-emerald-950/80 border-2 border-emerald-400 scale-[1.02] shadow-emerald-500/40'
                                : isSelected && spinPhase === 'RESOLVED' && !spinOutcomeSuccess
                                ? 'bg-red-950/80 border-2 border-red-500 scale-[1.02] shadow-red-500/40 animate-shake'
                                : isSelected && spinPhase === 'SPINNING'
                                ? 'bg-[#181d29] border-2 border-amber-400/80 scale-[1.02]'
                                : isOther
                                ? 'opacity-30 pointer-events-none bg-[#141821] border border-white/10'
                                : 'bg-[#141821] hover:bg-[#1b2230] border border-white/15 hover:border-amber-400/60 hover:scale-[1.02] active:scale-95'
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

                            {/* RECUADROS VERDE / ROJO CON ILUMINACIÓN ALTERNANTE */}
                            <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-white/10 font-mono text-[11px]">
                              {/* Cuadrado Verde (Sale Joya) */}
                              <div className={`rounded-xl py-2 px-1.5 font-bold flex flex-col items-center transition-all duration-150 ${
                                isSelected && isSpinning && activeRouletteSide === 'POSITIVE'
                                  ? 'bg-emerald-400 text-black border-2 border-white shadow-[0_0_25px_rgba(52,211,153,1)] scale-105 ring-4 ring-emerald-400/40'
                                  : isSelected && spinPhase === 'RESOLVED' && spinOutcomeSuccess
                                  ? 'bg-emerald-500 text-black border-2 border-white shadow-[0_0_30px_rgba(16,185,129,1)] scale-105 ring-4 ring-emerald-400 animate-pulse'
                                  : isSelected && (isSpinning || spinPhase === 'RESOLVED') && (activeRouletteSide === 'NEGATIVE' || !spinOutcomeSuccess)
                                  ? 'opacity-20 grayscale bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                                  : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                              }`}>
                                <span className="text-xs">🟢 {opt.successRate}%</span>
                                <span className="text-[10px] uppercase">Sale Joya</span>
                              </div>

                              {/* Cuadrado Rojo (Sale Mal) */}
                              <div className={`rounded-xl py-2 px-1.5 font-bold flex flex-col items-center transition-all duration-150 ${
                                isSelected && isSpinning && activeRouletteSide === 'NEGATIVE'
                                  ? 'bg-red-500 text-white border-2 border-white shadow-[0_0_25px_rgba(239,68,68,1)] scale-105 ring-4 ring-red-500/40'
                                  : isSelected && spinPhase === 'RESOLVED' && !spinOutcomeSuccess
                                  ? 'bg-red-600 text-white border-2 border-white shadow-[0_0_30px_rgba(239,68,68,1)] scale-105 ring-4 ring-red-500 animate-shake'
                                  : isSelected && (isSpinning || spinPhase === 'RESOLVED') && (activeRouletteSide === 'POSITIVE' || spinOutcomeSuccess)
                                  ? 'opacity-20 grayscale bg-red-500/10 border border-red-500/20 text-red-400'
                                  : 'bg-red-500/10 border border-red-500/30 text-red-400'
                              }`}>
                                <span className="text-xs">🔴 {100 - opt.successRate}%</span>
                                <span className="text-[10px] uppercase">Sale Mal</span>
                              </div>
                            </div>

                            {/* Mensaje de Resultado tras clavarse */}
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

            {/* ================= COLUMNA DERECHA (LÍNEA DE TIEMPO COPERO) ================= */}
            <div className="lg:col-span-7 bg-[#141821] border border-white/10 rounded-3xl p-6 md:p-7 shadow-2xl space-y-4">
              
              {/* Encabezado de la Tabla Timeline */}
              <div className="grid grid-cols-12 text-[11px] md:text-xs font-black text-white/50 uppercase tracking-wider px-4 pb-3 border-b border-white/10 font-mono">
                <div className="col-span-2">EDAD</div>
                <div className="col-span-4">BANDA / ESCENARIO</div>
                <div className="col-span-2 text-center">OVR</div>
                <div className="col-span-2 text-center">BAILES</div>
                <div className="col-span-1 text-center">HITS</div>
                <div className="col-span-1 text-center">FEATS</div>
              </div>

              {/* Filas de Edad (16 a 38) */}
              <div className="space-y-2">
                {AGE_STEPS.map((ageStep) => {
                  const record = timeline.find(r => r.age === ageStep);
                  const isCurrent = ageStep === currentAge;
                  const isFuture = ageStep > currentAge;

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
                      {/* Edad Badge */}
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

                      {/* Banda / Escenario */}
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

                      {/* OVR Pill */}
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

                      {/* Stats: BAILES (Shows), HITS (Temas), FEATS (Colaboraciones) */}
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

              {/* Barra Inferior (Resumen de Carrera UPDR) */}
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

        {/* VISTA 3: PANTALLA FINAL / RETIRO (NORMAL O PREMATURO) */}
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

      {/* Footer Disclaimer Copero */}
      <footer className="text-center text-xs text-white/30 font-mono py-4 mt-8">
        Los nombres, lugares y referencias mostrados pertenecen a la cultura popular argentina y se utilizan únicamente con fines humorísticos e interactivos.
      </footer>
    </main>
  );
}

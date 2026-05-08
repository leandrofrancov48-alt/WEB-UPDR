"use client";

import { useState, useTransition } from "react";
import { submitPrediction } from "@/lib/actions/prode";

type MatchProps = {
  match: any;
  prediction?: any;
};

export function MatchCard({ match, prediction }: MatchProps) {
  const [homeScore, setHomeScore] = useState(prediction?.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(prediction?.awayScore ?? 0);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");
  // Si ya tiene predicción guardada, arranca bloqueado
  const [isLocked, setIsLocked] = useState(!!prediction);

  const isPendingMatch = match.status === "PENDING" && new Date(match.matchDate) > new Date();
  const canEdit = isPendingMatch && !isLocked;

  const handleSave = () => {
    startTransition(async () => {
      try {
        await submitPrediction(match.id, homeScore, awayScore);
        setMessage("¡Guardado!");
        setIsLocked(true);
        setTimeout(() => setMessage(""), 2000);
      } catch (e: any) {
        setMessage(e.message || "Error");
      }
    });
  };

  const handleReset = () => {
    setIsLocked(false);
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center shadow-lg backdrop-blur-sm relative">
      <div className="text-sm text-brand-yellow mb-4 font-mono font-bold uppercase">
        {new Date(match.matchDate).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
        {match.group?.name ? ` • ${match.group.name}` : ""}
      </div>

      <div className="flex justify-between items-stretch w-full mb-6 gap-2">
        {/* Home Team & Score */}
        <div className="flex flex-col items-center flex-1 w-[45%]">
          {match.homeTeam?.flagUrl && (
             <img src={match.homeTeam.flagUrl} alt={match.homeTeam.name} className="h-12 w-auto object-contain mb-2 drop-shadow-lg" />
          )}
          <div className="h-14 flex items-start justify-center mb-2 w-full">
            <span className="font-yellow text-sm sm:text-base text-white leading-tight text-center break-words text-balance">{match.homeTeam?.name}</span>
          </div>
          <ScoreInput score={homeScore} setScore={setHomeScore} disabled={!canEdit || isPending} />
        </div>

        {/* VS */}
        <div className="flex items-end pb-8 justify-center w-[10%]">
          <span className="text-2xl text-brand-yellow font-black opacity-50">-</span>
        </div>

        {/* Away Team & Score */}
        <div className="flex flex-col items-center flex-1 w-[45%]">
          {match.awayTeam?.flagUrl && (
             <img src={match.awayTeam.flagUrl} alt={match.awayTeam.name} className="h-12 w-auto object-contain mb-2 drop-shadow-lg" />
          )}
          <div className="h-14 flex items-start justify-center mb-2 w-full">
            <span className="font-yellow text-sm sm:text-base text-white leading-tight text-center break-words text-balance">{match.awayTeam?.name}</span>
          </div>
          <ScoreInput score={awayScore} setScore={setAwayScore} disabled={!canEdit || isPending} />
        </div>
      </div>

      {isPendingMatch ? (
        isLocked ? (
          <div className="flex flex-col items-center gap-2 mt-2">
            <div className="text-green-400 text-sm font-semibold bg-green-400/10 px-4 py-2 rounded-full flex items-center gap-2">
              ✓ Pronóstico guardado: {homeScore} - {awayScore}
            </div>
            <button
              onClick={handleReset}
              className="text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer uppercase tracking-wider"
            >
              Cambiar pronóstico
            </button>
          </div>
        ) : (
          <button
            onClick={handleSave}
            disabled={isPending}
            className="bg-brand-yellow text-[#050b1a] font-yellow px-8 py-2 rounded-full hover:bg-yellow-400 transition-colors disabled:opacity-50 mt-2 shadow-[0_0_15px_rgba(255,215,0,0.3)] hover:shadow-[0_0_25px_rgba(255,215,0,0.5)] cursor-pointer"
          >
            {isPending ? "Guardando..." : "Guardar"}
          </button>
        )
      ) : (
        <div className="mt-2 text-white/50 text-sm font-semibold bg-white/10 px-4 py-2 rounded-full">
          {match.status === "FINISHED" 
            ? `Resultado Final: ${match.homeScore} - ${match.awayScore}` 
            : match.status === "LOCKED" 
              ? "Pronósticos Cerrados"
              : match.status === "IN_PROGRESS"
                ? "Partido en progreso"
                : "Tiempo expirado"
          }
        </div>
      )}

      {message && <div className="absolute bottom-2 text-brand-yellow text-sm font-semibold animate-bounce">{message}</div>}
    </div>
  );
}

function ScoreInput({ score, setScore, disabled }: { score: number, setScore: (val: number) => void, disabled: boolean }) {
  return (
    <div className="flex flex-col items-center bg-black/30 rounded-xl p-1 border border-white/5">
      <button 
        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-t-lg transition disabled:opacity-20 cursor-pointer"
        onClick={() => setScore(score + 1)}
        disabled={disabled}
      >+</button>
      <div className="text-3xl font-bold w-12 text-center text-white py-1">{score}</div>
      <button 
        className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 rounded-b-lg transition disabled:opacity-20 cursor-pointer"
        onClick={() => setScore(Math.max(0, score - 1))}
        disabled={disabled}
      >-</button>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { updateMatchStatus, updateMatchScore, resetMatch } from "@/lib/actions/admin";

export function MatchAdminRow({ match }: { match: any }) {
  const [isPending, startTransition] = useTransition();
  const [homeScore, setHomeScore] = useState(match.homeScore ?? 0);
  const [awayScore, setAwayScore] = useState(match.awayScore ?? 0);
  const [status, setStatus] = useState(match.status);

  const handleStatusChange = (newStatus: string) => {
    setStatus(newStatus);
    startTransition(async () => {
      await updateMatchStatus(match.id, newStatus);
    });
  };

  const handleSaveScore = () => {
    startTransition(async () => {
      await updateMatchScore(match.id, homeScore, awayScore);
      setStatus("FINISHED");
    });
  };

  const handleReset = () => {
    if (confirm("¿Estás seguro de que querés reiniciar este partido? Esto borrará los goles y le restará los puntos a los usuarios que hayan sumado.")) {
      startTransition(async () => {
        await resetMatch(match.id);
        setStatus("PENDING");
        setHomeScore(0);
        setAwayScore(0);
      });
    }
  };

  const statusColors: any = {
    "PENDING": "text-green-400 bg-green-400/10",
    "LOCKED": "text-orange-400 bg-orange-400/10",
    "IN_PROGRESS": "text-brand-yellow bg-brand-yellow/10",
    "FINISHED": "text-neutral-400 bg-neutral-400/10",
  };

  return (
    <tr className={`border-b border-white/5 hover:bg-white/5 transition-colors ${isPending ? 'opacity-50' : ''}`}>
      <td className="p-3 text-sm text-neutral-300">
        {new Date(match.matchDate).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' })}
      </td>
      <td className="p-3 text-sm text-neutral-300">
        {match.tournament?.name} <br/>
        <span className="text-xs text-neutral-500">{match.group?.name || match.phase}</span>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-3 font-bold text-white">
          <span className="w-24 text-right">{match.homeTeam?.name || '?'}</span>
          <span className="text-neutral-500">vs</span>
          <span className="w-24 text-left">{match.awayTeam?.name || '?'}</span>
        </div>
      </td>
      <td className="p-3 text-center">
        <select 
          value={status}
          onChange={(e) => handleStatusChange(e.target.value)}
          disabled={isPending}
          className={`px-3 py-1 text-xs font-bold rounded-full outline-none appearance-none cursor-pointer ${statusColors[status] || "text-white"}`}
        >
          <option value="PENDING">PENDING (Abierto)</option>
          <option value="LOCKED">LOCKED (Bloqueado)</option>
          <option value="IN_PROGRESS">IN_PROGRESS (En Juego)</option>
          <option value="FINISHED">FINISHED (Finalizado)</option>
        </select>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-2">
          <input 
            type="number" 
            value={homeScore}
            onChange={e => setHomeScore(parseInt(e.target.value) || 0)}
            className="w-12 bg-neutral-800 border border-neutral-600 rounded text-center text-white"
            min="0"
          />
          <span>-</span>
          <input 
            type="number" 
            value={awayScore}
            onChange={e => setAwayScore(parseInt(e.target.value) || 0)}
            className="w-12 bg-neutral-800 border border-neutral-600 rounded text-center text-white"
            min="0"
          />
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="flex flex-col gap-2">
          <button 
            onClick={handleSaveScore}
            disabled={isPending}
            className="bg-brand-yellow text-black px-3 py-1 rounded font-bold text-xs hover:bg-yellow-400 disabled:opacity-50"
          >
            Guardar & Fin
          </button>
          <button 
            onClick={handleReset}
            disabled={isPending}
            className="bg-red-500/20 text-red-400 px-3 py-1 rounded font-bold text-xs hover:bg-red-500/40 disabled:opacity-50 border border-red-500/30"
          >
            Reiniciar
          </button>
        </div>
      </td>
    </tr>
  );
}

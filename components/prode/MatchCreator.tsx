"use client";

import { useState, useTransition } from "react";
import { createKnockoutMatch } from "@/lib/actions/admin";

export function MatchCreator({ tournaments, teams }: { tournaments: any[], teams: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [tournamentId, setTournamentId] = useState(tournaments[0]?.id || "");
  const [phase, setPhase] = useState("ROUND_32");
  const [homeTeamId, setHomeTeamId] = useState("");
  const [awayTeamId, setAwayTeamId] = useState("");
  const [matchDate, setMatchDate] = useState("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!homeTeamId || !awayTeamId || !matchDate) return alert("Faltan datos");

    startTransition(async () => {
      try {
        await createKnockoutMatch(tournamentId, phase, homeTeamId, awayTeamId, new Date(matchDate));
        alert("Partido creado con éxito");
        setHomeTeamId("");
        setAwayTeamId("");
        setMatchDate("");
      } catch (err: any) {
        alert("Error: " + err.message);
      }
    });
  };

  const phases = [
    { value: "ROUND_32", label: "Dieciseisavos de Final" },
    { value: "ROUND_16", label: "Octavos de Final" },
    { value: "QUARTER", label: "Cuartos de Final" },
    { value: "SEMI", label: "Semifinal" },
    { value: "THIRD_PLACE", label: "Tercer Puesto" },
    { value: "FINAL", label: "Final" }
  ];

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8">
      <h3 className="text-xl font-yellow text-brand-yellow mb-4 uppercase">Crear Partido (Fases Eliminatorias)</h3>
      <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 items-end">
        
        <div className="flex flex-col">
          <label className="text-xs text-white/50 mb-1">Torneo</label>
          <select value={tournamentId} onChange={e => setTournamentId(e.target.value)} className="bg-black/50 border border-white/20 rounded p-2 text-white">
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-white/50 mb-1">Fase</label>
          <select value={phase} onChange={e => setPhase(e.target.value)} className="bg-black/50 border border-white/20 rounded p-2 text-white">
            {phases.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-white/50 mb-1">Local</label>
          <select value={homeTeamId} onChange={e => setHomeTeamId(e.target.value)} className="bg-black/50 border border-white/20 rounded p-2 text-white">
            <option value="">-- Equipo --</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-white/50 mb-1">Visitante</label>
          <select value={awayTeamId} onChange={e => setAwayTeamId(e.target.value)} className="bg-black/50 border border-white/20 rounded p-2 text-white">
            <option value="">-- Equipo --</option>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>

        <div className="flex flex-col lg:col-span-2">
          <label className="text-xs text-white/50 mb-1">Fecha y Hora</label>
          <input 
            type="datetime-local" 
            value={matchDate} 
            onChange={e => setMatchDate(e.target.value)} 
            className="bg-black/50 border border-white/20 rounded p-2 text-white"
          />
        </div>

        <div className="flex flex-col">
          <button 
            type="submit" 
            disabled={isPending}
            className="bg-brand-yellow text-black font-bold p-2 rounded hover:bg-yellow-400 disabled:opacity-50 h-[42px]"
          >
            {isPending ? "Creando..." : "Crear"}
          </button>
        </div>
      </form>
    </div>
  );
}

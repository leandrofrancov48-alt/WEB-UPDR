"use client";

import { useState } from "react";

type Match = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  kickoffAt: string;
  homeGoals: number | null;
  awayGoals: number | null;
};

export default function ProdeAdmin({ matches }: { matches: Match[] }) {
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function saveResult(matchId: string, fd: FormData) {
    const homeGoals = Number(fd.get("homeGoals"));
    const awayGoals = Number(fd.get("awayGoals"));

    setBusy(true);
    setMsg("");
    try {
      const res = await fetch(`/api/prode/results/${matchId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ homeGoals, awayGoals }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error");
      setMsg("Resultado guardado ✅");
      location.reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setBusy(false);
    }
  }

  async function recalculate() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/prode/recalculate", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Error");
      setMsg(`Puntos recalculados ✅ (${json.updated} cambios)`);
      location.reload();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error inesperado");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-10 border-t border-white/15 pt-8">
      <h2 className="text-2xl font-yellow text-brand-yellow mb-4">PRODE ADMIN</h2>
      <div className="flex flex-col md:flex-row gap-3 md:items-center mb-6">
        <input value={token} onChange={(e) => setToken(e.target.value)} type="password" placeholder="PRODE_ADMIN_TOKEN" className="px-3 py-2 rounded bg-neutral-800 border border-neutral-600" />
        <button onClick={recalculate} disabled={busy || !token} className="px-4 py-2 rounded-full bg-brand-yellow text-black text-xs font-bold tracking-widest disabled:opacity-50">RECALCULAR PUNTOS</button>
      </div>
      {msg ? <p className="text-sm text-white/80 mb-4">{msg}</p> : null}

      <div className="space-y-3">
        {matches.map((m) => (
          <form
            key={m.id}
            onSubmit={(e) => {
              e.preventDefault();
              void saveResult(m.id, new FormData(e.currentTarget));
            }}
            className="bg-neutral-800/60 border border-neutral-600 rounded-xl p-4 flex flex-wrap items-center gap-3"
          >
            <div className="min-w-[220px]">
              <p className="font-semibold">{m.homeTeam} vs {m.awayTeam}</p>
              <p className="text-xs text-neutral-400">{new Date(m.kickoffAt).toLocaleString("es-AR")}</p>
            </div>
            <input name="homeGoals" type="number" min={0} defaultValue={m.homeGoals ?? ""} className="w-16 px-2 py-1 rounded bg-black/30 border border-neutral-600" />
            <span>-</span>
            <input name="awayGoals" type="number" min={0} defaultValue={m.awayGoals ?? ""} className="w-16 px-2 py-1 rounded bg-black/30 border border-neutral-600" />
            <button disabled={busy || !token} className="ml-auto px-4 py-2 rounded-full bg-white text-black text-xs font-bold tracking-widest disabled:opacity-50">GUARDAR RESULTADO</button>
          </form>
        ))}
      </div>
    </section>
  );
}

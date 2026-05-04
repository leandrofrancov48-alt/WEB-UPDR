import Link from "next/link";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { isProdeAllowed } from "@/lib/prode-access";
import { savePrediction } from "./actions";

export default async function ProdePage() {
  const user = await getSessionUser();

  if (!user) {
    return (
      <div className="section-shell py-16">
        <div className="glass-card p-8">
          <h1 className="font-yellow text-brand-yellow text-4xl">PRODE 1PDR</h1>
          <p className="text-white/80 mt-4">Tenés que iniciar sesión para entrar al prode en prueba.</p>
          <Link href="/login" className="inline-flex mt-6 rounded-full bg-brand-yellow px-6 py-3 text-xs font-bold tracking-widest text-black">INICIAR SESIÓN</Link>
        </div>
      </div>
    );
  }

  if (!isProdeAllowed(user)) {
    return (
      <div className="section-shell py-16">
        <div className="glass-card p-8">
          <h1 className="font-yellow text-brand-yellow text-4xl">PRODE 1PDR</h1>
          <p className="text-white/80 mt-4">Esta sección está en beta cerrada. Todavía no está habilitada para público general.</p>
        </div>
      </div>
    );
  }

  const tournament = await prisma.prodeTournament.findFirst({
    where: { slug: "liga-profesional-demo" },
    include: {
      matches: {
        orderBy: { kickoffAt: "asc" },
      },
    },
  });

  if (!tournament) {
    return <div className="section-shell py-16"><div className="glass-card p-8 text-white/80">No hay torneo configurado todavía.</div></div>;
  }

  const [predictions, leaderboardRows] = await Promise.all([
    prisma.prodePrediction.findMany({
      where: { userId: user.id, match: { tournamentId: tournament.id } },
    }),
    prisma.prodePrediction.groupBy({
      by: ["userId"],
      where: { match: { tournamentId: tournament.id } },
      _sum: { points: true },
      orderBy: { _sum: { points: "desc" } },
      take: 20,
    }),
  ]);

  const users = await prisma.user.findMany({
    where: { id: { in: leaderboardRows.map((r) => r.userId) } },
    select: { id: true, nombre: true, apellido: true },
  });

  const userNameMap = new Map(users.map((u) => [u.id, `${u.nombre} ${u.apellido}`.trim()]));
  const predictionMap = new Map(predictions.map((p) => [p.matchId, p]));

  return (
    <div className="section-shell py-12 md:py-16">
      <div className="glass-card p-6 md:p-8">
        <h1 className="font-yellow text-brand-yellow text-4xl md:text-5xl">PRODE 1PDR</h1>
        <p className="text-white/70 mt-2">{tournament.name} · Guardado por usuario ({user.email})</p>

        <div className="mt-8 grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
          <div className="space-y-4">
            {tournament.matches.map((match) => {
              const pred = predictionMap.get(match.id);
              const locked = new Date(match.kickoffAt) <= new Date();
              return (
                <form key={match.id} action={savePrediction} className="rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5">
                  <input type="hidden" name="matchId" value={match.id} />
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-white font-semibold">{match.homeTeam} vs {match.awayTeam}</p>
                      <p className="text-xs text-white/50 mt-1">{new Date(match.kickoffAt).toLocaleString("es-AR")}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input name="homeScore" type="number" min={0} max={20} defaultValue={pred?.homeScore ?? ""} disabled={locked} className="w-16 rounded-lg bg-black/30 border border-white/20 px-2 py-1 text-center" />
                      <span className="text-white/60">-</span>
                      <input name="awayScore" type="number" min={0} max={20} defaultValue={pred?.awayScore ?? ""} disabled={locked} className="w-16 rounded-lg bg-black/30 border border-white/20 px-2 py-1 text-center" />
                      <button disabled={locked} className="ml-2 rounded-full bg-brand-yellow text-black px-4 py-2 text-xs font-bold tracking-widest disabled:opacity-50">GUARDAR</button>
                    </div>
                  </div>
                </form>
              );
            })}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 h-fit">
            <h2 className="font-yellow text-brand-yellow text-2xl">TABLA</h2>
            <p className="text-xs text-white/60 mt-1 mb-3">Exacto: 3 pts · Resultado: 1 pt</p>
            <div className="space-y-2">
              {leaderboardRows.length === 0 ? (
                <p className="text-sm text-white/60">Todavía no hay puntajes.</p>
              ) : (
                leaderboardRows.map((row, i) => (
                  <div key={row.userId} className="flex items-center justify-between text-sm border-b border-white/10 pb-1">
                    <span className="text-white/90">#{i + 1} {userNameMap.get(row.userId) ?? "Usuario"}</span>
                    <span className="text-brand-yellow font-bold">{row._sum.points ?? 0}</span>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

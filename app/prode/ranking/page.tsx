import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { getActiveTournamentsSorted } from "@/lib/tournament";
import Link from "next/link";

export const revalidate = 60; // Revalidate every minute

export default async function RankingPage(props: { searchParams: Promise<{ tournamentId?: string }> }) {
  const searchParams = await props.searchParams;
  const currentTournamentId = searchParams.tournamentId;
  const currentUser = await getSessionUser();

  // Obtener torneos activos ordenados por cercanía de fecha de partidos
  const tournaments = await getActiveTournamentsSorted();


  const selectedTournament = tournaments.find(t => t.id === currentTournamentId) || tournaments[0];
  const selectedTournamentId = selectedTournament?.id;

  // Obtener usuarios y sus predicciones filtradas por torneo para sumar los puntos
  const users = await prisma.user.findMany({
    include: {
      predictions: {
        where: {
          match: {
            tournamentId: selectedTournamentId
          }
        },
        select: { points: true }
      }
    }
  });

  const ranking = users.map(u => ({
    id: u.id,
    name: u.username || "Usuario",
    points: u.predictions.reduce((acc, pred) => acc + pred.points, 0),
    plenos: u.predictions.filter(pred => pred.points === 5).length
  })).sort((a, b) => b.points - a.points || b.plenos - a.plenos); // Ordenar por puntos y luego por plenos

  // Obtener posición del usuario actual
  const currentUserIndex = ranking.findIndex(u => u.id === currentUser?.id);
  const currentUserStats = currentUserIndex !== -1 ? ranking[currentUserIndex] : null;

  // Mostrar el top 25
  const topUsers = ranking.slice(0, 25);

  return (
    <div className="space-y-8">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        <h1 className="text-5xl text-brand-yellow font-yellow uppercase mb-2">Ranking Global</h1>
        <p className="text-white/80 text-lg">
          Tabla de posiciones general del torneo <span className="text-brand-yellow font-bold">{selectedTournament?.name}</span>.
        </p>
        {selectedTournament?.name.includes("Mundial") && (
          <p className="mt-3 text-xs sm:text-sm text-brand-orange font-bold flex items-center gap-1.5 animate-pulse bg-brand-orange/5 border border-brand-orange/20 px-3 py-2.5 rounded-2xl w-fit">
            <span>🎫</span> ¡El TOP 3 al finalizar este torneo clasifica para un par de entradas para el show de UPDR en Vélez!
          </p>
        )}
      </div>

      {tournaments.length > 1 && (
        <div className="flex justify-center md:justify-start">
          <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit">
            {tournaments.map((t) => {
              const isSelected = t.id === selectedTournamentId;
              return (
                <Link
                  key={t.id}
                  href={`/prode/ranking?tournamentId=${t.id}`}
                  className={`px-5 py-2.5 rounded-xl text-xs font-yellow uppercase transition-all ${
                    isSelected
                      ? "bg-brand-yellow text-black font-bold shadow-lg"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {t.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {currentUserStats && (
        <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-2xl p-6 flex justify-between items-center shadow-[0_0_20px_rgba(255,215,0,0.1)]">
          <div>
            <h2 className="text-xl font-semibold text-brand-yellow mb-1">Tu Posición</h2>
            <p className="text-white/70 text-sm">Estás en el puesto #{currentUserIndex + 1}</p>
          </div>
          <div className="flex gap-8 items-center">
            <div className="text-center">
              <div className="text-brand-yellow font-mono text-2xl font-black">{currentUserStats.plenos}</div>
              <div className="text-[10px] uppercase font-bold text-brand-yellow/50">Plenos</div>
            </div>
            <div className="font-mono text-4xl font-black text-brand-yellow">
              {currentUserStats.points} <span className="text-base text-brand-yellow/70 font-sans font-normal">pts</span>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-white/10 bg-white/5 text-white/50 text-[10px] font-bold uppercase tracking-wider">
          <div className="col-span-1 text-center">Pos</div>
          <div className="col-span-6">Usuario</div>
          <div className="col-span-2 text-center">Plenos</div>
          <div className="col-span-3 text-right pr-4">Puntos</div>
        </div>

        <div className="divide-y divide-white/5">
          {topUsers.map((userStats, index) => (
            <div key={userStats.id} className={`grid grid-cols-12 gap-4 p-4 items-center transition-colors hover:bg-white/5 ${userStats.id === currentUser?.id ? 'bg-white/5 border-l-4 border-brand-yellow' : ''}`}>
              <div className={`col-span-1 text-center font-yellow text-xl ${index === 0 ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)] text-2xl' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-amber-600' : 'text-white/40'}`}>
                #{index + 1}
              </div>
              <div className={`col-span-6 font-semibold text-base flex flex-col sm:flex-row sm:items-center min-w-0 ${userStats.id === currentUser?.id ? 'text-brand-yellow' : 'text-white'}`}>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="truncate max-w-[120px] xs:max-w-[160px] sm:max-w-[200px] block">{userStats.name}</span>
                  {userStats.id === currentUser?.id && <span className="text-[10px] text-brand-yellow/70 font-normal tracking-tighter shrink-0">(Vos)</span>}
                </div>
                <div className="flex flex-wrap gap-1 mt-1 sm:mt-0 sm:ml-2 shrink-0">
                  {index === 0 && <span className="text-[9px] text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded border border-yellow-400/20 uppercase tracking-wider font-bold hidden sm:inline-block">Premio: 3 Sobres</span>}
                  {index === 1 && <span className="text-[9px] text-gray-300 bg-gray-300/10 px-1.5 py-0.5 rounded border border-gray-300/20 uppercase tracking-wider font-bold hidden sm:inline-block">Premio: 2 Sobres</span>}
                  {index === 2 && <span className="text-[9px] text-amber-600 bg-amber-600/10 px-1.5 py-0.5 rounded border border-amber-600/20 uppercase tracking-wider font-bold hidden sm:inline-block">Premio: 1 Sobre</span>}
                  {selectedTournament?.name.includes("Mundial") && (index === 0 || index === 1 || index === 2) && (
                    <span className="text-[8px] sm:text-[9px] text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded border border-brand-orange/20 uppercase tracking-wider font-bold inline-block animate-pulse">
                      Clasifica: Par Entradas Vélez 🎫
                    </span>
                  )}
                </div>
              </div>
              <div className="col-span-2 text-center font-mono text-xl text-white/70">
                {userStats.plenos}
              </div>
              <div className="col-span-3 text-right pr-4 font-mono text-xl font-bold">
                {userStats.points}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

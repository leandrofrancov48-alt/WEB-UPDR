import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export const revalidate = 60; // Revalidate every minute

export default async function RankingPage() {
  const currentUser = await getSessionUser();

  // Obtener usuarios y sus predicciones para sumar los puntos
  // Para optimizar en una app real con muchos usuarios, esto debería guardarse en una tabla de posiciones o caché
  const users = await prisma.user.findMany({
    include: {
      predictions: {
        select: { points: true }
      }
    }
  });

  const ranking = users.map(u => ({
    id: u.id,
    name: u.username,
    points: u.predictions.reduce((acc, pred) => acc + pred.points, 0),
    plenos: u.predictions.filter(pred => pred.points === 5).length
  })).sort((a, b) => b.points - a.points || b.plenos - a.plenos); // Ordenar por puntos y luego por plenos

  // Obtener posición del usuario actual
  const currentUserIndex = ranking.findIndex(u => u.id === currentUser?.id);
  const currentUserStats = currentUserIndex !== -1 ? ranking[currentUserIndex] : null;

  // Mostrar el top 50
  const topUsers = ranking.slice(0, 50);

  return (
    <div className="space-y-10">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-yellow/10 rounded-full blur-[80px] -z-10 pointer-events-none"></div>
        <h1 className="text-5xl text-brand-yellow font-yellow uppercase mb-2">Ranking Global</h1>
        <p className="text-white/80 text-lg">
          Tabla de posiciones general de todos los participantes del Prode.
        </p>
      </div>

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
              <div className={`col-span-6 font-semibold text-base truncate ${userStats.id === currentUser?.id ? 'text-brand-yellow' : 'text-white'}`}>
                {userStats.name} {userStats.id === currentUser?.id && <span className="text-[10px] text-brand-yellow/70 font-normal ml-2 tracking-tighter">(Vos)</span>}
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

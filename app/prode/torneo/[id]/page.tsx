import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Link from "next/link";
import { MatchCard } from "@/components/prode/MatchCard";
import { notFound } from "next/navigation";

const phasesLabels: any = {
  "ROUND_32": "Dieciseisavos de Final",
  "ROUND_16": "Octavos de Final",
  "QUARTER": "Cuartos de Final",
  "SEMI": "Semifinal",
  "THIRD_PLACE": "Tercer Puesto",
  "FINAL": "Final"
};

export default async function TorneoPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  const { id } = await params;

  const tournament = await prisma.tournament.findUnique({
    where: { id },
    include: {
      groups: {
        include: {
          teams: true,
          _count: {
            select: { matches: true }
          }
        },
        orderBy: { name: 'asc' }
      },
      matches: {
        where: { groupId: null },
        include: {
          homeTeam: true,
          awayTeam: true,
          predictions: {
            where: { userId: user?.id }
          }
        },
        orderBy: { matchDate: 'asc' }
      }
    }
  });

  if (!tournament) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <Link href="/prode" className="text-white/50 hover:text-white flex items-center gap-2 mb-4">
        ← Volver a Torneos
      </Link>

      <div className="border border-white/10 rounded-3xl p-8 relative overflow-hidden group shadow-2xl">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{ backgroundImage: `url('${tournament.imageUrl || '/bg-prode.jpg'}')` }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#050b1a] via-[#050b1a]/80 to-[#050b1a]/60"></div>
        
        <div className="relative z-10 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-5xl text-brand-yellow font-yellow uppercase mb-4 drop-shadow-md">{tournament.name}</h1>
            <p className="text-white/90 text-lg max-w-2xl leading-relaxed font-medium drop-shadow">
              Seleccioná la fase o grupo para ver los partidos y dejar tus pronósticos. 
              <br/><span className="text-brand-yellow font-bold">Recordá:</span> 3 pts por acertar resultado, 1 pt por acertar goles (Max 5 pts).
            </p>
          </div>
          {tournament.logoUrl && (
            <img 
              src={tournament.logoUrl} 
              alt={tournament.name}
              className="h-24 md:h-32 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] shrink-0 hidden sm:block"
            />
          )}
        </div>
      </div>

      {tournament.groups.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tournament.groups.map(group => (
            <Link 
              href={`/prode/grupo/${group.id}`} 
              key={group.id}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all hover:border-brand-yellow/50 overflow-hidden flex flex-col items-center text-center shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.15)]"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#050b1a]/80 to-transparent z-0"></div>
              
              <div className="relative z-10 w-full">
                <h2 className="text-3xl font-yellow text-white group-hover:text-brand-yellow transition-colors mb-4">{group.name}</h2>
                
                <div className="flex flex-wrap justify-center gap-2 mb-4 h-6">
                  {group.teams.map(team => (
                    <div key={team.id} className="w-8 h-6 relative" title={team.name}>
                      {team.flagUrl ? (
                        <img src={team.flagUrl} alt={team.name} className="w-full h-full object-cover rounded shadow border border-white/20" />
                      ) : (
                        <div className="w-full h-full bg-white/20 rounded border border-white/30 text-[8px] flex items-center justify-center uppercase overflow-hidden">
                          {team.name.substring(0, 3)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="text-sm font-semibold text-white/50 bg-white/10 rounded-full px-3 py-1 inline-block">
                  {group._count.matches} Partidos
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Knockout Phases */}
      {["ROUND_32", "ROUND_16", "QUARTER", "SEMI", "THIRD_PLACE", "FINAL"].map(phase => {
        const phaseMatches = tournament.matches.filter(m => m.phase === phase);
        if (phaseMatches.length === 0) return null;
        
        return (
          <div key={phase} className="mt-16 space-y-6">
            <div className="flex items-center gap-4">
              <h2 className="text-3xl text-brand-yellow font-yellow uppercase">{phasesLabels[phase]}</h2>
              <div className="flex-1 h-px bg-white/10"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phaseMatches.map(match => (
                <MatchCard 
                  key={match.id} 
                  match={match as any} 
                  prediction={match.predictions[0] as any} 
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

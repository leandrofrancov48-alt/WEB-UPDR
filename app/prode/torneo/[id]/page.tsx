import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import Link from "next/link";
import { notFound } from "next/navigation";
import TournamentDashboard from "@/components/prode/TournamentDashboard";

const phasesLabels: any = {
  "ROUND_32": "Dieciseisavos",
  "ROUND_16": "Octavos",
  "QUARTER": "Cuartos",
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
        include: {
          homeTeam: true,
          awayTeam: true,
          group: true,
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

  // Partition matches into Group Stage vs Knockout Stage
  const groupStageMatches = tournament.matches.filter(m => m.groupId !== null);
  const knockoutMatches = tournament.matches.filter(m => m.groupId === null);

  // Group stage matches categorized by group to identify their round/fecha
  const matchesByGroup: Record<string, typeof groupStageMatches> = {};
  groupStageMatches.forEach(m => {
    if (m.groupId) {
      if (!matchesByGroup[m.groupId]) matchesByGroup[m.groupId] = [];
      matchesByGroup[m.groupId].push(m);
    }
  });

  const matchesByFecha: Record<string, typeof groupStageMatches> = {
    "Fecha 1": [],
    "Fecha 2": [],
    "Fecha 3": []
  };

  Object.keys(matchesByGroup).forEach(groupId => {
    // Sort matches within the group chronologically
    const sorted = matchesByGroup[groupId].sort((a, b) => a.matchDate.getTime() - b.matchDate.getTime());
    sorted.forEach((m, idx) => {
      if (idx < 2) {
        matchesByFecha["Fecha 1"].push(m);
      } else if (idx < 4) {
        matchesByFecha["Fecha 2"].push(m);
      } else {
        matchesByFecha["Fecha 3"].push(m);
      }
    });
  });

  // Sort each Fecha chronologically overall so matches from different groups display in order of play
  matchesByFecha["Fecha 1"].sort((a, b) => a.matchDate.getTime() - b.matchDate.getTime());
  matchesByFecha["Fecha 2"].sort((a, b) => a.matchDate.getTime() - b.matchDate.getTime());
  matchesByFecha["Fecha 3"].sort((a, b) => a.matchDate.getTime() - b.matchDate.getTime());

  // Group knockout stage matches by phase
  const knockoutMatchesByPhase: Record<string, typeof knockoutMatches> = {};
  knockoutMatches.forEach(m => {
    if (!knockoutMatchesByPhase[m.phase]) {
      knockoutMatchesByPhase[m.phase] = [];
    }
    knockoutMatchesByPhase[m.phase].push(m);
  });

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
              Seleccioná la fecha o el grupo para ver los partidos y dejar tus pronósticos. 
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

      <TournamentDashboard
        tournament={tournament}
        groups={tournament.groups}
        matchesByFecha={matchesByFecha}
        knockoutMatchesByPhase={knockoutMatchesByPhase}
        phasesLabels={phasesLabels}
      />
    </div>
  );
}


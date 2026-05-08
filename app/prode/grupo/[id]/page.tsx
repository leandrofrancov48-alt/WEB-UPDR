import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { MatchCard } from "@/components/prode/MatchCard";
import { GroupStandings } from "@/components/prode/GroupStandings";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function GrupoPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const user = await getSessionUser();

  const group = await prisma.tournamentGroup.findUnique({
    where: { id: params.id },
    include: {
      teams: true,
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

  if (!group) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/prode" 
          className="bg-white/10 hover:bg-white/20 text-white w-12 h-12 flex items-center justify-center rounded-full transition-colors font-bold text-xl"
          title="Volver"
        >
          ←
        </Link>
        <h1 className="text-4xl text-brand-yellow font-yellow uppercase">{group.name}</h1>
      </div>

      <div className="flex justify-center">
        <GroupStandings group={group} teams={group.teams} matches={group.matches} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {group.matches.map(match => (
          <MatchCard 
            key={match.id} 
            match={match} 
            prediction={match.predictions[0]} 
          />
        ))}
        {group.matches.length === 0 && (
          <div className="col-span-full py-12 text-center text-white/50 bg-white/5 rounded-2xl border border-white/10">
             Aún no hay partidos programados para este grupo.
          </div>
        )}
      </div>
    </div>
  );
}

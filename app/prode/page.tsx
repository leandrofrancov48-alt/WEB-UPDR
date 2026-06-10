import { getActiveTournamentsSorted, getAllTournamentsSorted } from "@/lib/tournament";
import Link from "next/link";

export default async function TorneosIndexPage() {
  const tournaments = await getAllTournamentsSorted();


  return (
    <div className="space-y-10 py-10">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-5xl text-brand-yellow font-yellow uppercase drop-shadow-md">Elegí tu Torneo</h1>
        <p className="text-white/70 text-lg max-w-2xl mx-auto">
          Seleccioná el torneo en el que querés participar. Jugá con tus amigos y demostrá quién sabe más de fútbol.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {tournaments.map(tournament => {
          const isActive = tournament.status === "ACTIVE";
          const isComingSoon = tournament.status === "COMING_SOON";
          
          return (
            <div key={tournament.id} className="relative group">
              <div className={`absolute inset-0 bg-brand-yellow/20 rounded-3xl blur-xl transition-opacity duration-500 ${isActive ? 'opacity-0 group-hover:opacity-100' : 'opacity-0'}`}></div>
              
              {isActive ? (
                <Link href={`/prode/torneo/${tournament.id}`} className="block relative h-full">
                  <TournamentCard tournament={tournament} isActive={isActive} isComingSoon={isComingSoon} />
                </Link>
              ) : (
                <div className="block relative h-full cursor-not-allowed">
                  <TournamentCard tournament={tournament} isActive={isActive} isComingSoon={isComingSoon} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TournamentCard({ tournament, isActive, isComingSoon }: { tournament: any, isActive: boolean, isComingSoon: boolean }) {
  return (
    <div className={`h-full border border-white/10 rounded-3xl p-8 relative overflow-hidden transition-all duration-300 ${isActive ? 'hover:scale-[1.02] hover:border-brand-yellow/50 bg-[#050b1a]' : 'bg-black/50 grayscale opacity-70'} shadow-2xl`}>
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-15"
        style={{ backgroundImage: `url('${tournament.imageUrl || '/bg-prode.jpg'}')` }}
      ></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-t from-[#050b1a] via-[#050b1a]/70 to-[#050b1a]/40"></div>
      
      <div className="relative z-10 flex items-end justify-between h-full min-h-[200px]">
        <div className="flex flex-col justify-end">
          {isComingSoon && (
            <div className="mb-3 inline-block w-fit bg-brand-yellow text-black font-bold text-xs uppercase px-3 py-1 rounded-full">
              Próximamente
            </div>
          )}
          
          <h2 className="text-3xl text-white font-yellow uppercase mb-2">{tournament.name}</h2>
          {isActive ? (
            <div className="text-brand-yellow font-medium flex items-center gap-2">
              Jugar ahora <span>→</span>
            </div>
          ) : (
            <div className="text-white/50 font-medium">
              Aún no disponible
            </div>
          )}
        </div>

        {tournament.logoUrl && (
          <img 
            src={tournament.logoUrl} 
            alt={tournament.name}
            className="h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] opacity-90 shrink-0"
          />
        )}
      </div>
    </div>
  );
}

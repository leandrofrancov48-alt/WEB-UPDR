import { prisma } from "@/lib/db";
import Link from "next/link";
import { MatchAdminRow } from "./MatchAdminRow";
import { MatchCreator } from "@/components/prode/MatchCreator";
import { isAdminAuthenticated } from "@/lib/actions/adminAuth";
import { AdminLoginForm } from "@/components/prode/AdminLoginForm";

export default async function ProdeAdminPage() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) {
    return <AdminLoginForm />;
  }

  const tournaments = await prisma.tournament.findMany();
  const teams = await prisma.team.findMany({ orderBy: { name: 'asc' } });
  const matches = await prisma.match.findMany({
    include: {
      homeTeam: true,
      awayTeam: true,
      tournament: true,
      group: true,
    },
    orderBy: {
      matchDate: 'asc'
    }
  });

  return (
    <main className="min-h-screen bg-neutral-900 text-white p-8 font-sans">
      <header className="flex justify-between items-center mb-10 border-b border-white/20 pb-4">
        <div className="flex gap-4 items-center">
          <Link href="/control-updr-admin" className="text-neutral-400 hover:text-white transition-colors">
            ← Volver
          </Link>
          <h1 className="text-3xl font-yellow text-brand-yellow">ADMINISTRACIÓN</h1>
        </div>
        <span className="text-xs text-neutral-400">ACCESO PROTEGIDO</span>
      </header>

      <div className="max-w-5xl mx-auto mb-8">
        <MatchCreator tournaments={tournaments} teams={teams} />
      </div>

      <div className="bg-black p-8 rounded-xl border border-brand-yellow/30 shadow-2xl max-w-5xl mx-auto overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-brand-yellow font-yellow">
              <th className="p-3">Fecha</th>
              <th className="p-3">Torneo / Fase</th>
              <th className="p-3 text-center">Partido</th>
              <th className="p-3 text-center">Estado</th>
              <th className="p-3 text-center">Resultado</th>
              <th className="p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {matches.map(match => (
              <MatchAdminRow key={match.id} match={match} />
            ))}
          </tbody>
        </table>
        {matches.length === 0 && <div className="p-8 text-center text-white/50">No hay partidos cargados.</div>}
      </div>
    </main>
  );
}

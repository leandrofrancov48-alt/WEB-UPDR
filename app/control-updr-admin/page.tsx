import { prisma } from "@/lib/db";
import AdminPageClient from "./admin-client";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const matches = await prisma.prodeMatch.findMany({
    orderBy: { kickoffAt: "asc" },
    select: {
      id: true,
      homeTeam: true,
      awayTeam: true,
      kickoffAt: true,
      homeGoals: true,
      awayGoals: true,
    },
  });

  return <AdminPageClient matches={matches.map((m) => ({ ...m, kickoffAt: m.kickoffAt.toISOString() }))} />;
}

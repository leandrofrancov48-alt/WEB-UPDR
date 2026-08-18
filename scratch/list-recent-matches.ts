import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const worldcup = await prisma.tournament.findFirst({
    where: { name: { contains: "Mundial" } }
  });

  if (!worldcup) {
    console.log("No World Cup tournament found.");
    return;
  }

  const matches = await prisma.match.findMany({
    where: {
      tournamentId: worldcup.id,
      matchDate: {
        gte: new Date("2026-06-14T00:00:00Z"),
        lte: new Date("2026-06-19T23:59:59Z")
      }
    },
    include: {
      homeTeam: true,
      awayTeam: true
    },
    orderBy: {
      matchDate: 'asc'
    }
  });

  console.log(`Matches between June 14 and June 19: ${matches.length}`);

  for (const m of matches) {
    const localTime = new Date(m.matchDate).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
    const utcTime = m.matchDate.toISOString();
    console.log(`ID: ${m.id} | ${m.homeTeam?.name} vs ${m.awayTeam?.name} | Status: ${m.status} | Date (ART): ${localTime} | UTC: ${utcTime}`);
  }
}

main().finally(() => prisma.$disconnect());

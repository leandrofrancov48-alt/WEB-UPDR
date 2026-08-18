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

  console.log(`World Cup found: ${worldcup.name} (${worldcup.id})`);

  const matches = await prisma.match.findMany({
    where: { tournamentId: worldcup.id },
    include: {
      homeTeam: true,
      awayTeam: true
    },
    orderBy: {
      matchDate: 'asc'
    }
  });

  console.log(`Total matches: ${matches.length}`);

  for (const m of matches) {
    const localTime = new Date(m.matchDate).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
    const utcTime = m.matchDate.toISOString();
    console.log(`ID: ${m.id} | ${m.homeTeam?.name} vs ${m.awayTeam?.name} | Phase: ${m.phase} | Status: ${m.status} | Date (ART): ${localTime} | UTC: ${utcTime}`);
  }
}

main().finally(() => prisma.$disconnect());

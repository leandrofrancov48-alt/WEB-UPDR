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
    where: { tournamentId: worldcup.id },
    include: {
      homeTeam: true,
      awayTeam: true
    },
    orderBy: {
      matchDate: 'asc'
    }
  });

  console.log(`Total World Cup matches: ${matches.length}`);

  for (const m of matches) {
    const localTime = new Date(m.matchDate).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" });
    const utcTime = m.matchDate.toISOString();
    console.log(`${m.homeTeam?.name} vs ${m.awayTeam?.name} | Date (ART): ${localTime} | UTC: ${utcTime} | ID: ${m.id}`);
  }
}

main().finally(() => prisma.$disconnect());

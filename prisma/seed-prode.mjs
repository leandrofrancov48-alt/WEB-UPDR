import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const tournament = await prisma.prodeTournament.upsert({
    where: { slug: "liga-profesional-demo" },
    update: { name: "Liga Profesional (Demo)", isActive: true },
    create: { name: "Liga Profesional (Demo)", slug: "liga-profesional-demo", isActive: true },
  });

  const matches = [
    ["Boca", "River", "2026-05-11T21:00:00.000Z"],
    ["Racing", "Independiente", "2026-05-12T22:00:00.000Z"],
    ["San Lorenzo", "Huracán", "2026-05-13T19:30:00.000Z"],
  ];

  for (const [homeTeam, awayTeam, kickoffAt] of matches) {
    await prisma.prodeMatch.upsert({
      where: {
        tournamentId_homeTeam_awayTeam_kickoffAt: {
          tournamentId: tournament.id,
          homeTeam,
          awayTeam,
          kickoffAt: new Date(kickoffAt),
        },
      },
      update: {},
      create: { tournamentId: tournament.id, homeTeam, awayTeam, kickoffAt: new Date(kickoffAt) },
    });
  }

  console.log("Prode demo listo ✅");
}

main().finally(async () => {
  await prisma.$disconnect();
});

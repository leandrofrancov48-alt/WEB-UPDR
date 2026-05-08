import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Iniciando Seed de Torneos (Mundial y LPF - OCTAVOS DE FINAL OFICIALES)...")

  await prisma.prediction.deleteMany()
  await prisma.match.deleteMany()
  await prisma.team.deleteMany()
  await prisma.tournamentGroup.deleteMany()
  await prisma.tournament.deleteMany()

  const mundial = await prisma.tournament.create({
    data: {
      name: "Copa Mundial FIFA 2026",
      status: "COMING_SOON",
      imageUrl: "/banner-fifa.jpg",
      active: true,
    }
  })

  const lpf = await prisma.tournament.create({
    data: {
      name: "Copa de la Liga Profesional",
      status: "ACTIVE",
      imageUrl: "/banner-lpf.png",
      logoUrl: "/lpf-logo.png",
      active: true,
    }
  })

  const lpfTeamsData = [
    { name: "Talleres", url: "/teams/talleres.png" },
    { name: "Belgrano", url: "/teams/belgrano.png" },
    { name: "Boca", url: "/teams/boca.png" },
    { name: "Huracán", url: "/teams/huracan.png" },
    { name: "Argentinos", url: "/teams/argentinos.png" },
    { name: "Lanús", url: "/teams/lanus.png" },
    { name: "Independiente Riv.", url: "/teams/independiente%20rivadavia.png" },
    { name: "Unión", url: "/teams/union.png" },
    { name: "Rosario Central", url: "/teams/rosario%20central.png" },
    { name: "Independiente", url: "/teams/indepentiente.png" },
    { name: "Estudiantes", url: "/teams/estudiantes.png" },
    { name: "Racing", url: "/teams/racing.png" },
    { name: "River", url: "/teams/river.png" },
    { name: "San Lorenzo", url: "/teams/san%20lorenzo.png" },
    { name: "Vélez Sarsfield", url: "/teams/velez.png" },
    { name: "Gimnasia La Plata", url: "/teams/gimnasia.png" }
  ];
  
  const teamsMap = new Map();
  for (const t of lpfTeamsData) {
    const team = await prisma.team.create({
      data: { name: t.name, flagUrl: t.url }
    })
    teamsMap.set(t.name, team.id);
  }

  const lpfMatchups = [
    { home: "Talleres", away: "Belgrano", date: "2026-05-09T19:30:00Z" },
    { home: "Boca", away: "Huracán", date: "2026-05-09T22:00:00Z" },
    { home: "Argentinos", away: "Lanús", date: "2026-05-10T00:30:00Z" },
    { home: "Independiente Riv.", away: "Unión", date: "2026-05-10T00:30:00Z" },
    { home: "Rosario Central", away: "Independiente", date: "2026-05-10T18:00:00Z" },
    { home: "Estudiantes", away: "Racing", date: "2026-05-10T20:00:00Z" },
    { home: "River", away: "San Lorenzo", date: "2026-05-10T22:00:00Z" },
    { home: "Vélez Sarsfield", away: "Gimnasia La Plata", date: "2026-05-11T00:30:00Z" },
  ]

  for (const match of lpfMatchups) {
    await prisma.match.create({
      data: {
        tournamentId: lpf.id,
        homeTeamId: teamsMap.get(match.home),
        awayTeamId: teamsMap.get(match.away),
        matchDate: new Date(match.date),
        phase: "ROUND_16", // OCTAVOS DE FINAL
        status: "PENDING"
      }
    })
  }

  console.log("Octavos de Final cargados con escudos ESPN y horarios exactos.")
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect())

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const matchesToUpdate = [
  // Grupo A
  { home: "México", away: "Sudáfrica", date: "2026-06-11T19:00:00Z" },
  { home: "Corea del Sur", away: "República Checa", date: "2026-06-12T02:00:00Z" },
  { home: "Sudáfrica", away: "República Checa", date: "2026-06-18T16:00:00Z" },
  { home: "México", away: "Corea del Sur", date: "2026-06-19T01:00:00Z" },
  { home: "México", away: "República Checa", date: "2026-06-25T01:00:00Z" },
  { home: "Sudáfrica", away: "Corea del Sur", date: "2026-06-25T01:00:00Z" },

  // Grupo B
  { home: "Canadá", away: "Bosnia y Herzegovina", date: "2026-06-12T19:00:00Z" },
  { home: "Qatar", away: "Suiza", date: "2026-06-13T19:00:00Z" },
  { home: "Bosnia y Herzegovina", away: "Suiza", date: "2026-06-18T19:00:00Z" },
  { home: "Canadá", away: "Qatar", date: "2026-06-18T22:00:00Z" },
  { home: "Suiza", away: "Canadá", date: "2026-06-24T19:00:00Z" },
  { home: "Bosnia y Herzegovina", away: "Qatar", date: "2026-06-24T19:00:00Z" },

  // Grupo C
  { home: "Brasil", away: "Marruecos", date: "2026-06-13T22:00:00Z" },
  { home: "Haití", away: "Escocia", date: "2026-06-14T01:00:00Z" },
  { home: "Marruecos", away: "Escocia", date: "2026-06-19T22:00:00Z" },
  { home: "Brasil", away: "Haití", date: "2026-06-20T00:30:00Z" },
  { home: "Brasil", away: "Escocia", date: "2026-06-24T22:00:00Z" },
  { home: "Marruecos", away: "Haití", date: "2026-06-24T22:00:00Z" },

  // Grupo D
  { home: "Estados Unidos", away: "Paraguay", date: "2026-06-13T01:00:00Z" },
  { home: "Australia", away: "Turquía", date: "2026-06-14T04:00:00Z" },
  { home: "Estados Unidos", away: "Australia", date: "2026-06-19T19:00:00Z" },
  { home: "Turquía", away: "Paraguay", date: "2026-06-20T03:00:00Z" },
  { home: "Turquía", away: "Estados Unidos", date: "2026-06-26T02:00:00Z" },
  { home: "Paraguay", away: "Australia", date: "2026-06-26T02:00:00Z" },

  // Grupo E
  { home: "Alemania", away: "Curazao", date: "2026-06-14T17:00:00Z" },
  { home: "Costa de Marfil", away: "Ecuador", date: "2026-06-14T23:00:00Z" },
  { home: "Alemania", away: "Costa de Marfil", date: "2026-06-20T20:00:00Z" },
  { home: "Curazao", away: "Ecuador", date: "2026-06-21T00:00:00Z" },
  { home: "Curazao", away: "Costa de Marfil", date: "2026-06-25T20:00:00Z" },
  { home: "Ecuador", away: "Alemania", date: "2026-06-25T20:00:00Z" },

  // Grupo F
  { home: "Países Bajos", away: "Japón", date: "2026-06-14T20:00:00Z" },
  { home: "Túnez", away: "Suecia", date: "2026-06-15T02:00:00Z" },
  { home: "Países Bajos", away: "Suecia", date: "2026-06-20T17:00:00Z" },
  { home: "Túnez", away: "Japón", date: "2026-06-21T04:00:00Z" },
  { home: "Túnez", away: "Países Bajos", date: "2026-06-25T23:00:00Z" },
  { home: "Japón", away: "Suecia", date: "2026-06-25T23:00:00Z" },

  // Grupo G
  { home: "Bélgica", away: "Egipto", date: "2026-06-15T19:00:00Z" },
  { home: "Irán", away: "Nueva Zelanda", date: "2026-06-16T01:00:00Z" },
  { home: "Bélgica", away: "Irán", date: "2026-06-21T19:00:00Z" },
  { home: "Nueva Zelanda", away: "Egipto", date: "2026-06-22T01:00:00Z" },
  { home: "Nueva Zelanda", away: "Bélgica", date: "2026-06-27T03:00:00Z" },
  { home: "Egipto", away: "Irán", date: "2026-06-27T03:00:00Z" },

  // Grupo H
  { home: "España", away: "Cabo Verde", date: "2026-06-15T16:00:00Z" },
  { home: "Arabia Saudita", away: "Uruguay", date: "2026-06-15T22:00:00Z" },
  { home: "España", away: "Arabia Saudita", date: "2026-06-21T16:00:00Z" },
  { home: "Uruguay", away: "Cabo Verde", date: "2026-06-21T22:00:00Z" },
  { home: "Cabo Verde", away: "Arabia Saudita", date: "2026-06-27T00:00:00Z" },
  { home: "Uruguay", away: "España", date: "2026-06-27T00:00:00Z" },

  // Grupo I
  { home: "Francia", away: "Senegal", date: "2026-06-16T19:00:00Z" },
  { home: "Irak", away: "Noruega", date: "2026-06-16T22:00:00Z" },
  { home: "Francia", away: "Irak", date: "2026-06-22T21:00:00Z" },
  { home: "Noruega", away: "Senegal", date: "2026-06-23T00:00:00Z" },
  { home: "Noruega", away: "Francia", date: "2026-06-26T19:00:00Z" },
  { home: "Senegal", away: "Irak", date: "2026-06-26T19:00:00Z" },

  // Grupo J
  { home: "Argentina", away: "Argelia", date: "2026-06-17T01:00:00Z" },
  { home: "Austria", away: "Jordania", date: "2026-06-17T04:00:00Z" },
  { home: "Argentina", away: "Austria", date: "2026-06-22T17:00:00Z" },
  { home: "Argelia", away: "Jordania", date: "2026-06-23T03:00:00Z" },
  { home: "Argentina", away: "Jordania", date: "2026-06-28T02:00:00Z" },
  { home: "Argelia", away: "Austria", date: "2026-06-28T02:00:00Z" },

  // Grupo K
  { home: "Portugal", away: "RD Congo", date: "2026-06-17T17:00:00Z" },
  { home: "Uzbekistán", away: "Colombia", date: "2026-06-18T02:00:00Z" },
  { home: "Portugal", away: "Uzbekistán", date: "2026-06-23T17:00:00Z" },
  { home: "RD Congo", away: "Colombia", date: "2026-06-24T02:00:00Z" },
  { home: "Portugal", away: "Colombia", date: "2026-06-27T23:30:00Z" },
  { home: "RD Congo", away: "Uzbekistán", date: "2026-06-27T23:30:00Z" },

  // Grupo L
  { home: "Inglaterra", away: "Croacia", date: "2026-06-17T20:00:00Z" },
  { home: "Ghana", away: "Panamá", date: "2026-06-17T23:00:00Z" },
  { home: "Inglaterra", away: "Ghana", date: "2026-06-23T20:00:00Z" },
  { home: "Croacia", away: "Panamá", date: "2026-06-23T23:00:00Z" },
  { home: "Inglaterra", away: "Panamá", date: "2026-06-27T21:00:00Z" },
  { home: "Croacia", away: "Ghana", date: "2026-06-27T21:00:00Z" }
];

async function main() {
  console.log(`Buscando torneo del Mundial en la base de datos...`);
  const tournament = await prisma.tournament.findFirst({
    where: { name: { contains: "Mundial" } }
  });

  if (!tournament) {
    console.error("Error: No se encontró el torneo del Mundial.");
    return;
  }

  console.log(`Torneo encontrado: ${tournament.name} (ID: ${tournament.id})`);
  console.log(`Iniciando la actualización de los 72 partidos...`);

  let updatedCount = 0;
  let notFoundCount = 0;

  for (const m of matchesToUpdate) {
    // Buscar el partido en el torneo actual por nombres de los equipos
    const match = await prisma.match.findFirst({
      where: {
        tournamentId: tournament.id,
        OR: [
          {
            homeTeam: { name: m.home },
            awayTeam: { name: m.away }
          },
          {
            homeTeam: { name: m.away },
            awayTeam: { name: m.home }
          }
        ]
      },
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });

    if (match) {
      const newDate = new Date(m.date);
      await prisma.match.update({
        where: { id: match.id },
        data: { matchDate: newDate }
      });
      console.log(`[OK] ${match.homeTeam?.name} vs ${match.awayTeam?.name} -> ${newDate.toISOString()}`);
      updatedCount++;
    } else {
      console.warn(`[NOT FOUND] No se encontró el partido entre ${m.home} y ${m.away}`);
      notFoundCount++;
    }
  }

  console.log(`\nResumen:`);
  console.log(`- Partidos actualizados con éxito: ${updatedCount}`);
  console.log(`- Partidos no encontrados: ${notFoundCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

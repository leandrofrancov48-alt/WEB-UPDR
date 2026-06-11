import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const GROUPS_DATA = [
  {
    name: "Grupo A",
    teams: [
      { name: "México", flagCode: "mx" },
      { name: "Sudáfrica", flagCode: "za" },
      { name: "Corea del Sur", flagCode: "kr" },
      { name: "República Checa", flagCode: "cz" }
    ]
  },
  {
    name: "Grupo B",
    teams: [
      { name: "Canadá", flagCode: "ca" },
      { name: "Bosnia y Herzegovina", flagCode: "ba" },
      { name: "Qatar", flagCode: "qa" },
      { name: "Suiza", flagCode: "ch" }
    ]
  },
  {
    name: "Grupo C",
    teams: [
      { name: "Brasil", flagCode: "br" },
      { name: "Marruecos", flagCode: "ma" },
      { name: "Haití", flagCode: "ht" },
      { name: "Escocia", flagCode: "gb-sct" }
    ]
  },
  {
    name: "Grupo D",
    teams: [
      { name: "Estados Unidos", flagCode: "us" },
      { name: "Paraguay", flagCode: "py" },
      { name: "Australia", flagCode: "au" },
      { name: "Turquía", flagCode: "tr" }
    ]
  },
  {
    name: "Grupo E",
    teams: [
      { name: "Alemania", flagCode: "de" },
      { name: "Curazao", flagCode: "cw" },
      { name: "Costa de Marfil", flagCode: "ci" },
      { name: "Ecuador", flagCode: "ec" }
    ]
  },
  {
    name: "Grupo F",
    teams: [
      { name: "Países Bajos", flagCode: "nl" },
      { name: "Japón", flagCode: "jp" },
      { name: "Túnez", flagCode: "tn" },
      { name: "Suecia", flagCode: "se" }
    ]
  },
  {
    name: "Grupo G",
    teams: [
      { name: "Bélgica", flagCode: "be" },
      { name: "Egipto", flagCode: "eg" },
      { name: "Irán", flagCode: "ir" },
      { name: "Nueva Zelanda", flagCode: "nz" }
    ]
  },
  {
    name: "Grupo H",
    teams: [
      { name: "España", flagCode: "es" },
      { name: "Cabo Verde", flagCode: "cv" },
      { name: "Arabia Saudita", flagCode: "sa" },
      { name: "Uruguay", flagCode: "uy" }
    ]
  },
  {
    name: "Grupo I",
    teams: [
      { name: "Francia", flagCode: "fr" },
      { name: "Senegal", flagCode: "sn" },
      { name: "Irak", flagCode: "iq" },
      { name: "Noruega", flagCode: "no" }
    ]
  },
  {
    name: "Grupo J", // Grupo de Argentina
    teams: [
      { name: "Argentina", flagCode: "ar" },
      { name: "Argelia", flagCode: "dz" },
      { name: "Austria", flagCode: "at" },
      { name: "Jordania", flagCode: "jo" }
    ]
  },
  {
    name: "Grupo K",
    teams: [
      { name: "Portugal", flagCode: "pt" },
      { name: "RD Congo", flagCode: "cd" },
      { name: "Uzbekistán", flagCode: "uz" },
      { name: "Colombia", flagCode: "co" }
    ]
  },
  {
    name: "Grupo L",
    teams: [
      { name: "Inglaterra", flagCode: "gb-eng" },
      { name: "Croacia", flagCode: "hr" },
      { name: "Ghana", flagCode: "gh" },
      { name: "Panamá", flagCode: "pa" }
    ]
  }
];

const GROUP_DAY_OFFSETS = [
  0, // A -> June 11
  1, // B -> June 12
  2, // C -> June 13
  1, // D -> June 12
  2, // E -> June 13
  2, // F -> June 13
  3, // G -> June 14
  3, // H -> June 14
  4, // I -> June 15
  5, // J -> June 16
  5, // K -> June 16
  5  // L -> June 16
];

async function main() {
  console.log("Iniciando Seed del Prode Mundial 2026...");

  // 1. Encontrar o crear el torneo del Mundial
  let mundial = await prisma.tournament.findFirst({
    where: { name: "Copa Mundial FIFA 2026" }
  });

  if (!mundial) {
    mundial = await prisma.tournament.create({
      data: {
        name: "Copa Mundial FIFA 2026",
        status: "ACTIVE",
        imageUrl: "/banner-fifa.jpg",
        logoUrl: "/fifa-logo.png",
        active: true
      }
    });
  } else {
    mundial = await prisma.tournament.update({
      where: { id: mundial.id },
      data: { 
        status: "ACTIVE", 
        logoUrl: "/fifa-logo.png",
        active: true 
      }
    });
  }

  const tournamentId = mundial.id;
  console.log(`Torneo Mundial ID: ${tournamentId}`);

  // 2. Limpiar partidos y grupos anteriores del Mundial para evitar duplicados
  // Eliminamos predicciones asociadas primero
  const mundialMatches = await prisma.match.findMany({
    where: { tournamentId }
  });
  const mundialMatchIds = mundialMatches.map(m => m.id);
  
  if (mundialMatchIds.length > 0) {
    await prisma.prediction.deleteMany({
      where: { matchId: { in: mundialMatchIds } }
    });
    await prisma.match.deleteMany({
      where: { tournamentId }
    });
  }

  await prisma.tournamentGroup.deleteMany({
    where: { tournamentId }
  });

  // Limpiar selecciones del Mundial anteriores de la BD
  // Para no pisar equipos de la LPF
  await prisma.team.deleteMany({
    where: {
      NOT: {
        name: {
          in: ["Talleres", "Belgrano", "Boca", "Huracán", "Argentinos", "Lanús", "Independiente Riv.", "Unión", "Rosario Central", "Independiente", "Estudiantes", "Racing", "River", "San Lorenzo", "Vélez Sarsfield", "Gimnasia La Plata"]
        }
      }
    }
  });

  // 3. Crear los grupos, selecciones y partidos
  for (let gIdx = 0; gIdx < GROUPS_DATA.length; gIdx++) {
    const groupData = GROUPS_DATA[gIdx];
    console.log(`Creando ${groupData.name}...`);

    // Crear el grupo
    const group = await prisma.tournamentGroup.create({
      data: {
        name: groupData.name,
        tournamentId: tournamentId
      }
    });

    // Crear los equipos de este grupo
    const createdTeams = [];
    for (const teamInfo of groupData.teams) {
      const team = await prisma.team.create({
        data: {
          name: teamInfo.name,
          flagUrl: `https://flagcdn.com/w80/${teamInfo.flagCode}.png`,
          groupId: group.id
        }
      });
      createdTeams.push(team);
    }

    // Programar los 6 encuentros del grupo (Fecha 1, 2 y 3)
    const [t1, t2, t3, t4] = createdTeams;

    // Calcular días realistas en base al índice del grupo para no amontonar partidos
    const dayOffset = GROUP_DAY_OFFSETS[gIdx];
    
    // Configuración base de fechas
    const f1Date = new Date(`2026-06-${String(11 + dayOffset).padStart(2, '0')}T19:00:00Z`);
    const f1DateLater = new Date(`2026-06-${String(11 + dayOffset).padStart(2, '0')}T22:00:00Z`);
    
    const f2Date = new Date(`2026-06-${String(17 + dayOffset).padStart(2, '0')}T19:00:00Z`);
    const f2DateLater = new Date(`2026-06-${String(17 + dayOffset).padStart(2, '0')}T22:00:00Z`);
    
    const f3Date = new Date(`2026-06-${String(23 + Math.floor(gIdx / 3)).padStart(2, '0')}T19:00:00Z`);
    const f3DateLater = new Date(`2026-06-${String(23 + Math.floor(gIdx / 3)).padStart(2, '0')}T22:00:00Z`);


    const matchesToCreate = [
      // Fecha 1
      { homeTeamId: t1.id, awayTeamId: t2.id, matchDate: f1Date },
      { homeTeamId: t3.id, awayTeamId: t4.id, matchDate: f1DateLater },
      // Fecha 2
      { homeTeamId: t1.id, awayTeamId: t3.id, matchDate: f2Date },
      { homeTeamId: t2.id, awayTeamId: t4.id, matchDate: f2DateLater },
      // Fecha 3
      { homeTeamId: t1.id, awayTeamId: t4.id, matchDate: f3Date },
      { homeTeamId: t2.id, awayTeamId: t3.id, matchDate: f3DateLater },
    ];

    // Si es el Grupo J (Argentina), sobreescribir las fechas exactas de Argentina
    // Argentina es t1, Argelia t2, Austria t3, Jordania t4
    if (groupData.name === "Grupo J") {
      // Argentina vs Argelia (t1 vs t2) -> Martes 16 de junio, 22:00 Arg (June 17 01:00 UTC)
      matchesToCreate[0].matchDate = new Date("2026-06-17T01:00:00Z");
      // Austria vs Jordania (t3 vs t4) -> Martes 16 de junio, 18:00 Arg
      matchesToCreate[1].matchDate = new Date("2026-06-16T21:00:00Z");

      // Argentina vs Austria (t1 vs t3) -> Lunes 22 de junio, 14:00 Arg (June 22 17:00 UTC)
      matchesToCreate[2].matchDate = new Date("2026-06-22T17:00:00Z");
      // Argelia vs Jordania (t2 vs t4) -> Lunes 22 de junio, 20:00 Arg
      matchesToCreate[3].matchDate = new Date("2026-06-22T23:00:00Z");

      // Argentina vs Jordania (t1 vs t4) -> Domingo 28 de junio, 23:00 Arg (June 29 02:00 UTC)
      matchesToCreate[4].matchDate = new Date("2026-06-29T02:00:00Z");
      // Argelia vs Austria (t2 vs t3) -> Domingo 28 de junio, 19:00 Arg
      matchesToCreate[5].matchDate = new Date("2026-06-28T22:00:00Z");
    }

    // Guardar los partidos en la base de datos
    for (const matchInfo of matchesToCreate) {
      await prisma.match.create({
        data: {
          tournamentId: tournamentId,
          groupId: group.id,
          homeTeamId: matchInfo.homeTeamId,
          awayTeamId: matchInfo.awayTeamId,
          matchDate: matchInfo.matchDate,
          phase: "GROUP",
          status: "PENDING"
        }
      });
    }
  }

  console.log("Seeding del Prode Mundial 2026 finalizado con éxito.");
}

main()
  .catch(e => {
    console.error("Error al ejecutar seed del mundial:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

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

const GROUP_FECHA_1_DATES = [
  // Grupo A
  [new Date("2026-06-11T19:00:00Z"), new Date("2026-06-12T02:00:00Z")],
  // Grupo B
  [new Date("2026-06-12T19:00:00Z"), new Date("2026-06-13T19:00:00Z")],
  // Grupo C
  [new Date("2026-06-13T22:00:00Z"), new Date("2026-06-14T01:00:00Z")],
  // Grupo D
  [new Date("2026-06-13T01:00:00Z"), new Date("2026-06-14T04:00:00Z")],
  // Grupo E
  [new Date("2026-06-14T17:00:00Z"), new Date("2026-06-14T23:00:00Z")],
  // Grupo F
  [new Date("2026-06-14T20:00:00Z"), new Date("2026-06-15T02:00:00Z")],
  // Grupo G
  [new Date("2026-06-15T19:00:00Z"), new Date("2026-06-16T01:00:00Z")],
  // Grupo H
  [new Date("2026-06-15T16:00:00Z"), new Date("2026-06-15T22:00:00Z")],
  // Grupo I
  [new Date("2026-06-16T19:00:00Z"), new Date("2026-06-16T22:00:00Z")],
  // Grupo J (Argentina)
  [new Date("2026-06-17T01:00:00Z"), new Date("2026-06-17T04:00:00Z")],
  // Grupo K
  [new Date("2026-06-17T17:00:00Z"), new Date("2026-06-18T02:00:00Z")],
  // Grupo L
  [new Date("2026-06-17T20:00:00Z"), new Date("2026-06-17T23:00:00Z")]
];

const GROUP_MATCHES_DATES: Record<string, string[]> = {
  "Grupo A": [
    "2026-06-11T19:00:00Z", // México vs Sudáfrica
    "2026-06-12T02:00:00Z", // Corea del Sur vs República Checa
    "2026-06-19T01:00:00Z", // México vs Corea del Sur
    "2026-06-18T16:00:00Z", // Sudáfrica vs República Checa
    "2026-06-25T01:00:00Z", // México vs República Checa
    "2026-06-25T01:00:00Z"  // Sudáfrica vs Corea del Sur
  ],
  "Grupo B": [
    "2026-06-12T19:00:00Z", // Canadá vs Bosnia y Herzegovina
    "2026-06-13T19:00:00Z", // Qatar vs Suiza
    "2026-06-18T22:00:00Z", // Canadá vs Qatar
    "2026-06-18T19:00:00Z", // Bosnia y Herzegovina vs Suiza
    "2026-06-24T19:00:00Z", // Canadá vs Suiza
    "2026-06-24T19:00:00Z"  // Bosnia y Herzegovina vs Qatar
  ],
  "Grupo C": [
    "2026-06-13T22:00:00Z", // Brasil vs Marruecos
    "2026-06-14T01:00:00Z", // Haití vs Escocia
    "2026-06-20T00:30:00Z", // Brasil vs Haití
    "2026-06-19T22:00:00Z", // Marruecos vs Escocia
    "2026-06-24T22:00:00Z", // Brasil vs Escocia
    "2026-06-24T22:00:00Z"  // Marruecos vs Haití
  ],
  "Grupo D": [
    "2026-06-13T01:00:00Z", // Estados Unidos vs Paraguay
    "2026-06-14T04:00:00Z", // Australia vs Turquía
    "2026-06-19T19:00:00Z", // Estados Unidos vs Australia
    "2026-06-20T03:00:00Z", // Paraguay vs Turquía
    "2026-06-26T02:00:00Z", // Estados Unidos vs Turquía
    "2026-06-26T02:00:00Z"  // Paraguay vs Australia
  ],
  "Grupo E": [
    "2026-06-14T17:00:00Z", // Alemania vs Curazao
    "2026-06-14T23:00:00Z", // Costa de Marfil vs Ecuador
    "2026-06-20T20:00:00Z", // Alemania vs Costa de Marfil
    "2026-06-21T00:00:00Z", // Curazao vs Ecuador
    "2026-06-25T20:00:00Z", // Alemania vs Ecuador
    "2026-06-25T20:00:00Z"  // Curazao vs Costa de Marfil
  ],
  "Grupo F": [
    "2026-06-14T20:00:00Z", // Países Bajos vs Japón
    "2026-06-15T02:00:00Z", // Túnez vs Suecia
    "2026-06-20T17:00:00Z", // Países Bajos vs Suecia
    "2026-06-21T04:00:00Z", // Japón vs Túnez
    "2026-06-25T23:00:00Z", // Países Bajos vs Túnez
    "2026-06-25T23:00:00Z"  // Japón vs Suecia
  ],
  "Grupo G": [
    "2026-06-15T19:00:00Z", // Bélgica vs Egipto
    "2026-06-16T01:00:00Z", // Irán vs Nueva Zelanda
    "2026-06-21T19:00:00Z", // Bélgica vs Irán
    "2026-06-22T01:00:00Z", // Egipto vs Nueva Zelanda
    "2026-06-27T03:00:00Z", // Bélgica vs Nueva Zelanda
    "2026-06-27T03:00:00Z"  // Egipto vs Irán
  ],
  "Grupo H": [
    "2026-06-15T16:00:00Z", // España vs Cabo Verde
    "2026-06-15T22:00:00Z", // Arabia Saudita vs Uruguay
    "2026-06-21T16:00:00Z", // España vs Arabia Saudita
    "2026-06-21T22:00:00Z", // Cabo Verde vs Uruguay
    "2026-06-27T00:00:00Z", // España vs Uruguay
    "2026-06-27T00:00:00Z"  // Cabo Verde vs Arabia Saudita
  ],
  "Grupo I": [
    "2026-06-16T19:00:00Z", // Francia vs Senegal
    "2026-06-16T22:00:00Z", // Irak vs Noruega
    "2026-06-22T21:00:00Z", // Francia vs Irak
    "2026-06-23T00:00:00Z", // Senegal vs Noruega
    "2026-06-26T19:00:00Z", // Francia vs Noruega
    "2026-06-26T19:00:00Z"  // Senegal vs Irak
  ],
  "Grupo J": [
    "2026-06-17T01:00:00Z", // Argentina vs Argelia
    "2026-06-17T04:00:00Z", // Austria vs Jordania
    "2026-06-22T17:00:00Z", // Argentina vs Austria
    "2026-06-23T03:00:00Z", // Argelia vs Jordania
    "2026-06-28T02:00:00Z", // Argentina vs Jordania
    "2026-06-28T02:00:00Z"  // Argelia vs Austria
  ],
  "Grupo K": [
    "2026-06-17T17:00:00Z", // Portugal vs RD Congo
    "2026-06-18T02:00:00Z", // Uzbekistán vs Colombia
    "2026-06-23T17:00:00Z", // Portugal vs Uzbekistán
    "2026-06-24T02:00:00Z", // RD Congo vs Colombia
    "2026-06-27T23:30:00Z", // Portugal vs Colombia
    "2026-06-27T23:30:00Z"  // RD Congo vs Uzbekistán
  ],
  "Grupo L": [
    "2026-06-17T20:00:00Z", // Inglaterra vs Croacia
    "2026-06-17T23:00:00Z", // Ghana vs Panamá
    "2026-06-23T20:00:00Z", // Inglaterra vs Ghana
    "2026-06-23T23:00:00Z", // Croacia vs Panamá
    "2026-06-27T21:00:00Z", // Inglaterra vs Panamá
    "2026-06-27T21:00:00Z"  // Croacia vs Ghana
  ]
};

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

    const groupDates = GROUP_MATCHES_DATES[groupData.name];
    if (!groupDates || groupDates.length !== 6) {
      throw new Error(`Fechas incorrectas o no definidas para el grupo ${groupData.name}`);
    }

    const matchesToCreate = [
      // Fecha 1
      { homeTeamId: t1.id, awayTeamId: t2.id, matchDate: new Date(groupDates[0]) },
      { homeTeamId: t3.id, awayTeamId: t4.id, matchDate: new Date(groupDates[1]) },
      // Fecha 2
      { homeTeamId: t1.id, awayTeamId: t3.id, matchDate: new Date(groupDates[2]) },
      { homeTeamId: t2.id, awayTeamId: t4.id, matchDate: new Date(groupDates[3]) },
      // Fecha 3
      { homeTeamId: t1.id, awayTeamId: t4.id, matchDate: new Date(groupDates[4]) },
      { homeTeamId: t2.id, awayTeamId: t3.id, matchDate: new Date(groupDates[5]) },
    ];

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

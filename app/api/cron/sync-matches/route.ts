import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateMatchPoints } from "@/lib/actions/prode";

export const dynamic = "force-dynamic";

const TEAM_NAME_MAPPING: Record<string, string> = {
  "mexico": "México",
  "south africa": "Sudáfrica",
  "south korea": "Corea del Sur",
  "czech republic": "República Checa",
  "canada": "Canadá",
  "bosnia and herzegovina": "Bosnia y Herzegovina",
  "qatar": "Qatar",
  "switzerland": "Suiza",
  "brazil": "Brasil",
  "morocco": "Marruecos",
  "haiti": "Haití",
  "scotland": "Escocia",
  "united states": "Estados Unidos",
  "paraguay": "Paraguay",
  "australia": "Australia",
  "turkey": "Turquía",
  "germany": "Alemania",
  "curacao": "Curazao",
  "ivory coast": "Costa de Marfil",
  "ecuador": "Ecuador",
  "netherlands": "Países Bajos",
  "japan": "Japón",
  "tunisia": "Túnez",
  "sweden": "Suecia",
  "belgium": "Bélgica",
  "egypt": "Egipto",
  "iran": "Irán",
  "new zealand": "Nueva Zelanda",
  "spain": "España",
  "cape verde": "Cabo Verde",
  "saudi arabia": "Arabia Saudita",
  "uruguay": "Uruguay",
  "france": "Francia",
  "senegal": "Senegal",
  "iraq": "Irak",
  "norway": "Noruega",
  "argentina": "Argentina",
  "algeria": "Argelia",
  "austria": "Austria",
  "jordan": "Jordania",
  "portugal": "Portugal",
  "democratic republic of the congo": "RD Congo",
  "dr congo": "RD Congo",
  "uzbekistan": "Uzbekistán",
  "colombia": "Colombia",
  "england": "Inglaterra",
  "croatia": "Croacia",
  "ghana": "Ghana",
  "panama": "Panamá"
};

const PHASE_MAPPING: Record<string, string> = {
  "group": "GROUP",
  "r32": "ROUND_32",
  "r16": "ROUND_16",
  "qf": "QUARTER",
  "sf": "SEMI",
  "third": "THIRD_PLACE",
  "final": "FINAL"
};

function parseLocalDate(localDateStr: string): Date {
  const [datePart, timePart] = localDateStr.split(' ');
  const [month, day, year] = datePart.split('/').map(Number);
  const [hour, minute] = timePart.split(':').map(Number);
  
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));
  date.setUTCHours(date.getUTCHours() + 4); // EST to UTC approximation
  return date;
}

export async function GET(req: NextRequest) {
  try {
    // 1. Validar seguridad del Cron (Vercel Cron Job estándar)
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get("secret");

    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret) {
      const isHeaderValid = authHeader === `Bearer ${expectedSecret}`;
      const isQueryValid = querySecret === expectedSecret;

      if (!isHeaderValid && !isQueryValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("Iniciando sincronización automática de partidos desde el fixture oficial...");

    // 2. Obtener partidos de la base de datos
    const dbMatches = await prisma.match.findMany({
      include: {
        homeTeam: true,
        awayTeam: true
      }
    });

    const matchesByApiId = new Map<string, typeof dbMatches[0]>();
    for (const m of dbMatches) {
      if (m.apiId) {
        matchesByApiId.set(m.apiId, m);
      }
    }

    // 3. Obtener equipos para resolver nuevos partidos
    const dbTeams = await prisma.team.findMany();
    const teamsByName = new Map<string, string>();
    for (const t of dbTeams) {
      teamsByName.set(t.name.trim().toLowerCase(), t.id);
    }

    // 4. Obtener Torneo para crear partidos si no existen
    const tournament = await prisma.tournament.findFirst({
      where: { name: { contains: "Copa Mundial" } }
    });

    if (!tournament) {
      return NextResponse.json({ error: "Tournament not found in DB" }, { status: 500 });
    }

    // 5. Consumir la API externa
    const apiRes = await fetch("https://worldcup26.ir/get/games", {
      next: { revalidate: 60 } // caché de 1 minuto
    });

    if (!apiRes.ok) {
      throw new Error(`API returned status ${apiRes.status}`);
    }

    const apiData = await apiRes.json();
    const apiGames = apiData.games || [];

    let updatedCount = 0;
    let finishedCount = 0;
    const actionsTaken: string[] = [];

    for (const game of apiGames) {
      const phase = PHASE_MAPPING[game.type];
      if (!phase) continue;

      // Resolver IDs de equipos desde los nombres en inglés de la API
      let homeTeamId: string | null = null;
      let awayTeamId: string | null = null;

      if (game.home_team_name_en) {
        const spanishHomeName = TEAM_NAME_MAPPING[game.home_team_name_en.trim().toLowerCase()];
        if (spanishHomeName) {
          homeTeamId = teamsByName.get(spanishHomeName.toLowerCase()) || null;
        }
      }
      if (game.away_team_name_en) {
        const spanishAwayName = TEAM_NAME_MAPPING[game.away_team_name_en.trim().toLowerCase()];
        if (spanishAwayName) {
          awayTeamId = teamsByName.get(spanishAwayName.toLowerCase()) || null;
        }
      }

      let match = matchesByApiId.get(game.id);

      if (!match) {
        // Si no existe el partido con ese apiId, crearlo
        const parsedDate = parseLocalDate(game.local_date);
        match = await prisma.match.create({
          data: {
            apiId: game.id,
            tournamentId: tournament.id,
            homeTeamId,
            awayTeamId,
            matchDate: parsedDate,
            phase,
            status: "PENDING"
          },
          include: {
            homeTeam: true,
            awayTeam: true
          }
        });
        actionsTaken.push(`Created match ${game.id} (${phase})`);
      }

      // Evaluar actualizaciones
      const isFinished = game.finished === "TRUE";
      const isNotStarted = game.time_elapsed === "notstarted";
      
      const apiHomeScore = (isFinished || !isNotStarted) && game.home_score !== "null" && game.home_score !== null ? parseInt(game.home_score, 10) : null;
      const apiAwayScore = (isFinished || !isNotStarted) && game.away_score !== "null" && game.away_score !== null ? parseInt(game.away_score, 10) : null;

      let newStatus = match.status;
      if (isFinished) {
        newStatus = "FINISHED";
      } else if (isNotStarted) {
        newStatus = "PENDING";
      } else {
        newStatus = "IN_PROGRESS";
      }

      // 1. ¿Se definieron nuevos equipos para partidos eliminatorios?
      const teamUpdateNeeded = 
        (homeTeamId !== null && match.homeTeamId !== homeTeamId) || 
        (awayTeamId !== null && match.awayTeamId !== awayTeamId);

      // 2. ¿Hubo cambios en el resultado o estado?
      const scoreChanged = match.homeScore !== apiHomeScore || match.awayScore !== apiAwayScore;
      const statusChanged = match.status !== newStatus;

      if (teamUpdateNeeded || scoreChanged || statusChanged) {

        // Actualizar base de datos
        const updatedMatch = await prisma.match.update({
          where: { id: match.id },
          data: {
            homeTeamId: homeTeamId || undefined,
            awayTeamId: awayTeamId || undefined,
            homeScore: apiHomeScore,
            awayScore: apiAwayScore,
            status: newStatus
          }
        });

        actionsTaken.push(`Updated game ${game.id}: ${game.home_team_name_en || '?'} vs ${game.away_team_name_en || '?'} | Score: ${apiHomeScore}-${apiAwayScore} | Status: ${newStatus}`);
        updatedCount++;

        // Si el partido acaba de finalizar, calcular y distribuir los puntos
        if (isFinished && match.status !== "FINISHED") {
          try {
            await calculateMatchPoints(match.id);
            finishedCount++;
            actionsTaken.push(`Distributed points for match ${game.id}`);
          } catch (e: any) {
            console.error(`Error calculating points for match ${match.id}:`, e);
            actionsTaken.push(`ERROR calculating points for match ${game.id}: ${e?.message || e}`);
          }
        }
      }
    }

    console.log(`Sincronización finalizada. Actualizados: ${updatedCount}, Finalizados: ${finishedCount}`);

    return NextResponse.json({
      success: true,
      updatedCount,
      finishedCount,
      actionsTaken
    });

  } catch (error: any) {
    console.error("Error en sincronización automática de partidos:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || error },
      { status: 500 }
    );
  }
}

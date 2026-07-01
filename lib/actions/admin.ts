"use server";

import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "./adminAuth";
import { revalidatePath } from "next/cache";
import { calculateMatchPoints } from "./prode";

export async function updateMatchStatus(matchId: string, status: string) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");
  // Assuming there's some admin check here or it's protected by the route, but we check if user exists.
  
  await prisma.match.update({
    where: { id: matchId },
    data: { status }
  });

  revalidatePath("/control-updr-admin/prode");
  revalidatePath("/prode");
  return { success: true };
}

export async function updateMatchScore(matchId: string, homeScore: number, awayScore: number) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  await prisma.match.update({
    where: { id: matchId },
    data: { 
      homeScore, 
      awayScore,
      status: "FINISHED" // Automatically set to finished if score is provided
    }
  });

  // Calculate points for everyone
  await calculateMatchPoints(matchId);

  revalidatePath("/control-updr-admin/prode");
  revalidatePath("/prode");
  return { success: true };
}

export async function resetMatch(matchId: string) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  // Reset match score and status
  await prisma.match.update({
    where: { id: matchId },
    data: { 
      homeScore: null, 
      awayScore: null,
      status: "PENDING"
    }
  });

  // Reset all prediction points for this match
  await prisma.prediction.updateMany({
    where: { matchId: matchId },
    data: { points: 0 }
  });

  revalidatePath("/control-updr-admin/prode");
  revalidatePath("/prode");
  return { success: true };
}

export async function createKnockoutMatch(tournamentId: string, phase: string, homeTeamId: string, awayTeamId: string, matchDate: Date) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  await prisma.match.create({
    data: {
      tournamentId,
      phase,
      homeTeamId,
      awayTeamId,
      matchDate,
      status: "PENDING"
    }
  });

  revalidatePath("/control-updr-admin/prode");
  revalidatePath("/prode");
  return { success: true };
}

export async function approveArtistApplication(id: string) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  const application = await prisma.artistApplication.findUnique({
    where: { id },
  });

  if (!application) throw new Error("Postulación no encontrada");

  // 1. Mark as APPROVED
  await prisma.artistApplication.update({
    where: { id },
    data: { status: "APPROVED" },
  });

  // 2. Create Band or Update User
  if (application.registrationType === "MUSICIAN") {
    await prisma.user.update({
      where: { id: application.userId },
      data: {
        isMusician: true,
        instrument: application.genre, // Genre stores instrument for musicians in application
        bio: application.bio,
        profilePic: application.profilePic,
        showPersonalData: application.showName,
        showContactPhone: application.showPhone,
        latitude: application.lat,
        longitude: application.lng,
        mediaUrls: application.mediaUrls,
      },
    });
  } else if (application.registrationType === "BAND") {
    await prisma.band.create({
      data: {
        name: application.artistName,
        bio: application.bio,
        genre: application.genre,
        profilePic: application.profilePic,
        instagram: application.instagram,
        spotify: application.spotify,
        youtube: application.youtube,
        ownerId: application.userId,
        city: application.city,
        latitude: application.lat,
        longitude: application.lng,
        mediaUrls: application.mediaUrls,
      },
    });
  }

  revalidatePath("/control-updr-admin/emergentes");
  revalidatePath("/artistas");
  return { success: true };
}

export async function rejectArtistApplication(id: string) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  await prisma.artistApplication.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  revalidatePath("/control-updr-admin/emergentes");
  return { success: true };
}

export async function getAlbumStats() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  const totalUsers = await prisma.user.count();
  const totalOpenedPacks = await prisma.openedPack.count();
  
  const totalStickersInExistenceAgg = await prisma.userSticker.aggregate({
    _sum: {
      quantity: true
    }
  });
  const totalStickersInExistence = totalStickersInExistenceAgg._sum.quantity || 0;

  const usersWithStickers = await prisma.user.findMany({
    where: {
      stickers: {
        some: {}
      }
    },
    select: {
      id: true,
      nombre: true,
      apellido: true,
      username: true,
      stickers: {
        select: {
          quantity: true
        }
      }
    },
    take: 50
  });

  const sortedCollectors = usersWithStickers.map(u => {
    const uniqueCount = u.stickers.length;
    const totalCount = u.stickers.reduce((acc, s) => acc + s.quantity, 0);
    return {
      id: u.id,
      name: `${u.nombre} ${u.apellido}`,
      username: u.username || u.id.substring(0, 8),
      uniqueCount,
      totalCount
    };
  }).sort((a, b) => b.uniqueCount - a.uniqueCount).slice(0, 5);

  return {
    totalUsers,
    totalOpenedPacks,
    totalStickersInExistence,
    topCollectors: sortedCollectors
  };
}

export async function giftStickerPacks(emailOrUsername: string, amount: number) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  if (!emailOrUsername || amount <= 0) {
    throw new Error("Datos inválidos");
  }

  const targetUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: { equals: emailOrUsername, mode: "insensitive" } },
        { username: { equals: emailOrUsername, mode: "insensitive" } }
      ]
    }
  });

  if (!targetUser) {
    throw new Error("Usuario no encontrado por email o username");
  }

  await prisma.user.update({
    where: { id: targetUser.id },
    data: {
      packBalance: {
        increment: amount
      }
    }
  });

  revalidatePath("/control-updr-admin/album");
  revalidatePath("/album");
  return { 
    success: true, 
    targetUser: `${targetUser.nombre} ${targetUser.apellido} (@${targetUser.username})` 
  };
}

export async function deleteArtistOrBand(applicationId: string, reason?: string) {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  const application = await prisma.artistApplication.findUnique({
    where: { id: applicationId },
  });

  if (!application) throw new Error("Postulación no encontrada");

  // Save the deletion reason on the target user
  await prisma.user.update({
    where: { id: application.userId },
    data: {
      artistDeletionReason: reason || "Motivo no especificado por la administración."
    }
  });

  if (application.status === "APPROVED") {
    if (application.registrationType === "MUSICIAN") {
      await prisma.user.update({
        where: { id: application.userId },
        data: {
          isMusician: false,
          instrument: null,
          bio: null,
          profilePic: null,
          latitude: null,
          longitude: null
        }
      });
    } else if (application.registrationType === "BAND") {
      const band = await prisma.band.findFirst({
        where: {
          ownerId: application.userId,
          name: application.artistName
        }
      });
      if (band) {
        await prisma.band.delete({
          where: { id: band.id }
        });
      }
    }
  }

  await prisma.artistApplication.delete({
    where: { id: applicationId }
  });

  revalidatePath("/control-updr-admin/emergentes");
  revalidatePath("/artistas");
  revalidatePath("/perfil");
  return { success: true };
}

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
  date.setUTCHours(date.getUTCHours() + 4);
  return date;
}

export async function syncMatchesFromOfficialFixture() {
  // 1. Obtener partidos de la base de datos
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

  // 2. Obtener equipos para resolver nuevos partidos
  const dbTeams = await prisma.team.findMany();
  const teamsByName = new Map<string, string>();
  for (const t of dbTeams) {
    teamsByName.set(t.name.trim().toLowerCase(), t.id);
  }

  // 3. Obtener Torneo
  const tournament = await prisma.tournament.findFirst({
    where: { name: { contains: "Copa Mundial" } }
  });

  if (!tournament) {
    throw new Error("Tournament not found in DB");
  }

  // 4. Consumir la API externa
  const apiRes = await fetch("https://worldcup26.ir/get/games", {
    cache: "no-store"
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

    // Resolver IDs de equipos
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

    const teamUpdateNeeded = 
      (homeTeamId !== null && match.homeTeamId !== homeTeamId) || 
      (awayTeamId !== null && match.awayTeamId !== awayTeamId);

    const scoreChanged = match.homeScore !== apiHomeScore || match.awayScore !== apiAwayScore;
    const statusChanged = match.status !== newStatus;

    if (teamUpdateNeeded || scoreChanged || statusChanged) {
      await prisma.match.update({
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

  // 5. Actualizar fecha de última sincronización
  await prisma.tournament.update({
    where: { id: tournament.id },
    data: { lastFixtureSync: new Date() }
  });

  // Revalidar rutas para mostrar cambios
  try {
    revalidatePath("/control-updr-admin/prode");
    revalidatePath("/prode");
  } catch (error) {
    // Suppress error if called during render
  }

  return {
    success: true,
    updatedCount,
    finishedCount,
    actionsTaken
  };
}

export async function checkAndSyncFixtureLazy() {
  try {
    const tournament = await prisma.tournament.findFirst({
      where: { name: { contains: "Copa Mundial" } }
    });

    if (!tournament) return;

    const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
    if (!tournament.lastFixtureSync || tournament.lastFixtureSync < twoMinutesAgo) {
      console.log("Lazy Sync: Sincronizando fixture por inactividad (>2min)...");
      await syncMatchesFromOfficialFixture();
    }
  } catch (e) {
    console.error("Error in lazy sync:", e);
  }
}

export async function forceSyncFixture() {
  const isAdmin = await isAdminAuthenticated();
  if (!isAdmin) throw new Error("No autenticado");

  return await syncMatchesFromOfficialFixture();
}


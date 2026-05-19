"use server";

import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { calculateMatchPoints } from "./prode";

export async function updateMatchStatus(matchId: string, status: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");
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
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

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
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

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
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

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
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

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
      },
    });
  }

  revalidatePath("/control-updr-admin/emergentes");
  revalidatePath("/artistas");
  return { success: true };
}

export async function rejectArtistApplication(id: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  await prisma.artistApplication.update({
    where: { id },
    data: { status: "REJECTED" },
  });

  revalidatePath("/control-updr-admin/emergentes");
  return { success: true };
}

export async function getAlbumStats() {
  const adminUser = await getSessionUser();
  if (!adminUser) throw new Error("No autenticado");

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
  const adminUser = await getSessionUser();
  if (!adminUser) throw new Error("No autenticado");

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
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

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


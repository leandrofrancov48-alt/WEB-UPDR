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


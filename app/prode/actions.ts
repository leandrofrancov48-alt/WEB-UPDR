"use server";

import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { isProdeAllowed } from "@/lib/prode-access";
import { revalidatePath } from "next/cache";

export async function savePrediction(formData: FormData) {
  const user = await getSessionUser();
  if (!isProdeAllowed(user)) throw new Error("No autorizado");

  const matchId = String(formData.get("matchId") ?? "");
  const homeScore = Number(formData.get("homeScore"));
  const awayScore = Number(formData.get("awayScore"));

  if (!matchId || Number.isNaN(homeScore) || Number.isNaN(awayScore)) {
    throw new Error("Datos inválidos");
  }

  if (homeScore < 0 || awayScore < 0 || homeScore > 20 || awayScore > 20) {
    throw new Error("Marcador fuera de rango");
  }

  const match = await prisma.prodeMatch.findUnique({ where: { id: matchId } });
  if (!match) throw new Error("Partido no encontrado");
  if (new Date(match.kickoffAt) <= new Date()) throw new Error("Partido bloqueado");

  await prisma.prodePrediction.upsert({
    where: {
      userId_matchId: {
        userId: user!.id,
        matchId,
      },
    },
    update: { homeScore, awayScore },
    create: { userId: user!.id, matchId, homeScore, awayScore },
  });

  revalidatePath("/prode");
}

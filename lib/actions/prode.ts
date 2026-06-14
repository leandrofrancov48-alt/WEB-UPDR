"use server";

import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";
import { revalidatePath } from "next/cache";

// ==========================================
// PREDICCIONES
// ==========================================

export async function submitPrediction(matchId: string, homeScore: number, awayScore: number) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  // Verificar que el partido no haya empezado o finalizado
  const match = await prisma.match.findUnique({ where: { id: matchId } });
  if (!match) throw new Error("Partido no encontrado");
  if (match.status !== "PENDING") throw new Error("El partido ya empezó o finalizó");
  
  const cutoff = new Date(match.matchDate.getTime() - 5 * 60 * 1000); // 5 min antes
  if (cutoff < new Date()) {
     throw new Error("Los pronósticos se cierran 5 minutos antes del partido");
  }

  await prisma.prediction.upsert({
    where: {
      userId_matchId: {
        userId: user.id,
        matchId: match.id,
      },
    },
    update: {
      homeScore,
      awayScore,
    },
    create: {
      userId: user.id,
      matchId: match.id,
      homeScore,
      awayScore,
    },
  });

  revalidatePath("/prode");
  return { success: true };
}

// ==========================================
// GRUPOS PRIVADOS
// ==========================================

export async function createPrivateGroup(name: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  // Generar código aleatorio de 6 caracteres
  const code = Math.random().toString(36).substring(2, 8).toUpperCase();

  const group = await prisma.privateGroup.create({
    data: {
      name,
      code,
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          status: "APPROVED"
        },
      },
    },
  });

  revalidatePath("/prode/grupos");
  return { success: true, group };
}

export async function joinPrivateGroup(code: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  const group = await prisma.privateGroup.findUnique({
    where: { code: code.toUpperCase() },
  });

  if (!group) throw new Error("Código inválido o grupo no encontrado");

  // Verificar si ya es miembro
  const existingMember = await prisma.privateGroupMember.findUnique({
    where: {
      groupId_userId: {
        groupId: group.id,
        userId: user.id,
      },
    },
  });

  if (existingMember) throw new Error("Ya eres miembro de este grupo");

  await prisma.privateGroupMember.create({
    data: {
      groupId: group.id,
      userId: user.id,
      status: "PENDING"
    },
  });

  revalidatePath("/prode/grupos");
  return { success: true, groupId: group.id };
}

export async function approveGroupRequest(groupId: string, userId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  // Verify ownership
  const group = await prisma.privateGroup.findUnique({ where: { id: groupId } });
  if (!group || group.ownerId !== user.id) throw new Error("No autorizado");

  await prisma.privateGroupMember.update({
    where: { groupId_userId: { groupId, userId } },
    data: { status: "APPROVED" }
  });

  revalidatePath(`/prode/grupo/${groupId}`);
  return { success: true };
}

export async function rejectGroupRequest(groupId: string, userId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  // Verify ownership
  const group = await prisma.privateGroup.findUnique({ where: { id: groupId } });
  if (!group || group.ownerId !== user.id) throw new Error("No autorizado");

  await prisma.privateGroupMember.delete({
    where: { groupId_userId: { groupId, userId } }
  });

  revalidatePath(`/prode/grupo/${groupId}`);
  return { success: true };
}

// ==========================================
// CALCULAR PUNTOS
// ==========================================
export async function calculateMatchPoints(matchId: string) {
  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: { predictions: true }
  });

  if (!match || match.homeScore === null || match.awayScore === null) {
      throw new Error("Partido no finalizado o resultados no cargados");
  }

  const realHomeScore = match.homeScore;
  const realAwayScore = match.awayScore;
  
  // Determinar ganador real: 1 = Home, -1 = Away, 0 = Draw
  const realResult = realHomeScore > realAwayScore ? 1 : (realHomeScore < realAwayScore ? -1 : 0);

  const updates: any[] = [];

  match.predictions.forEach(pred => {
    let points = 0;
    
    // Goles local
    if (pred.homeScore === realHomeScore) points += 1;
    // Goles visitante
    if (pred.awayScore === realAwayScore) points += 1;
    
    // Resultado
    const predResult = pred.homeScore > pred.awayScore ? 1 : (pred.homeScore < pred.awayScore ? -1 : 0);
    if (predResult === realResult) {
       points += 3;
    }
    
    const isPleno = points === 5;
    const shouldAwardPack = isPleno && !pred.packAwarded;

    updates.push(prisma.prediction.update({
      where: { id: pred.id },
      data: { 
        points,
        packAwarded: shouldAwardPack ? true : undefined,
      }
    }));

    if (shouldAwardPack) {
      updates.push(prisma.user.update({
        where: { id: pred.userId },
        data: { 
          packBalance: { increment: 1 },
          showPlenoNotification: true
        }
      }));
    }
  });

  await prisma.$transaction(updates);

  // Check for 20 pts and 40 pts rewards
  const userIdsToCheck = Array.from(new Set(match.predictions.map(p => p.userId)));
  for (const userId of userIdsToCheck) {
    const allPreds = await prisma.prediction.findMany({
      where: {
        userId,
        match: {
          tournamentId: match.tournamentId
        }
      }
    });
    const totalPoints = allPreds.reduce((acc, p) => acc + p.points, 0);

    // 20 points reward (gives a 2-card pack)
    if (totalPoints >= 20) {
      const alreadyAwarded = await prisma.tournamentReward.findUnique({
        where: {
          userId_tournamentId_rewardType: {
            userId,
            tournamentId: match.tournamentId,
            rewardType: "20PTS"
          }
        }
      });
      if (!alreadyAwarded) {
        await prisma.$transaction([
          prisma.tournamentReward.create({
            data: {
              userId,
              tournamentId: match.tournamentId,
              rewardType: "20PTS"
            }
          }),
          prisma.user.update({
            where: { id: userId },
            data: {
              show20PtsNotification: true,
              pack2Balance: { increment: 1 }
            }
          })
        ]);
      }
    }

    // 40 points reward (gives a 3-card pack)
    if (totalPoints >= 40) {
      const alreadyAwarded = await prisma.tournamentReward.findUnique({
        where: {
          userId_tournamentId_rewardType: {
            userId,
            tournamentId: match.tournamentId,
            rewardType: "40PTS"
          }
        }
      });
      if (!alreadyAwarded) {
        await prisma.$transaction([
          prisma.tournamentReward.create({
            data: {
              userId,
              tournamentId: match.tournamentId,
              rewardType: "40PTS"
            }
          }),
          prisma.user.update({
            where: { id: userId },
            data: {
              show40PtsNotification: true,
              pack3Balance: { increment: 1 }
            }
          })
        ]);
      }
    }
  }

  return { success: true };
}

// ==========================================
// ELIMINAR / SALIR DE GRUPO
// ==========================================

export async function deleteGroup(groupId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  const group = await prisma.privateGroup.findUnique({ where: { id: groupId } });
  if (!group || group.ownerId !== user.id) throw new Error("No autorizado");

  // Borrar miembros primero, luego el grupo
  await prisma.privateGroupMember.deleteMany({ where: { groupId } });
  await prisma.privateGroup.delete({ where: { id: groupId } });

  revalidatePath("/prode/grupos");
  return { success: true };
}

export async function leaveGroup(groupId: string) {
  const user = await getSessionUser();
  if (!user) throw new Error("No autenticado");

  // No puede irse el dueño, debe eliminar el grupo
  const group = await prisma.privateGroup.findUnique({ where: { id: groupId } });
  if (!group) throw new Error("Grupo no encontrado");
  if (group.ownerId === user.id) throw new Error("Sos el dueño, debes eliminar el grupo");

  await prisma.privateGroupMember.delete({
    where: { groupId_userId: { groupId, userId: user.id } }
  });

  revalidatePath("/prode/grupos");
  return { success: true };
}

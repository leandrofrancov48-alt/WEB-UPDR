import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("=== INICIANDO ACTUALIZACION RETROACTIVA DE RECOMPENSAS PRODE ===");

  // 1. Buscar todos los torneos activos
  const activeTournaments = await prisma.tournament.findMany({
    where: { active: true }
  });

  console.log(`Torneos activos encontrados: ${activeTournaments.length}`);
  for (const t of activeTournaments) {
    console.log(`- Torneo: ${t.name} (ID: ${t.id})`);
  }

  // 2. Obtener todos los usuarios que tienen predicciones registradas
  const predictions = await prisma.prediction.findMany({
    where: {
      match: {
        tournamentId: { in: activeTournaments.map(t => t.id) }
      }
    },
    select: { userId: true }
  });

  const userIds = Array.from(new Set(predictions.map(p => p.userId)));
  console.log(`\nUsuarios con predicciones en torneos activos: ${userIds.length}`);

  let rewardsAwardedCount = 0;

  for (const userId of userIds) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true }
    });

    if (!user) continue;

    for (const tournament of activeTournaments) {
      // Calcular puntos del usuario en este torneo
      const userPreds = await prisma.prediction.findMany({
        where: {
          userId: user.id,
          match: { tournamentId: tournament.id }
        },
        select: { points: true }
      });

      const totalPoints = userPreds.reduce((sum, p) => sum + p.points, 0);

      // Calcular hitos
      const maxMilestone = Math.floor(totalPoints / 20) * 20;

      if (maxMilestone < 20) continue;

      for (let milestone = 20; milestone <= maxMilestone; milestone += 20) {
        const rewardType = `${milestone}PTS`;

        // Verificar si ya tiene registrada esta recompensa
        const alreadyAwarded = await prisma.tournamentReward.findUnique({
          where: {
            userId_tournamentId_rewardType: {
              userId: user.id,
              tournamentId: tournament.id,
              rewardType
            }
          }
        });

        if (!alreadyAwarded) {
          console.log(`Usuario: ${user.username} (${user.email}) | Puntos: ${totalPoints} | Asignando hito: ${rewardType}`);

          let updateData = {};
          if (milestone === 20) {
            updateData = {
              show20PtsNotification: true,
              packBalance: { increment: 1 }
            };
          } else if (milestone === 40) {
            updateData = {
              show40PtsNotification: true,
              packBalance: { increment: 1 }
            };
          } else {
            updateData = {
              show20PtsNotification: true,
              pack2Balance: { increment: 1 }
            };
          }

          // Crear recompensa y actualizar usuario transaccionalmente
          await prisma.$transaction([
            prisma.tournamentReward.create({
              data: {
                userId: user.id,
                tournamentId: tournament.id,
                rewardType
              }
            }),
            prisma.user.update({
              where: { id: user.id },
              data: updateData
            })
          ]);

          rewardsAwardedCount++;
        }
      }
    }
  }

  console.log(`\n=== PROCESO COMPLETADO ===`);
  console.log(`Total de nuevas recompensas otorgadas de forma retroactiva: ${rewardsAwardedCount}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

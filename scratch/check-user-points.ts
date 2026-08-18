import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Consultando base de datos para verificar puntos de usuarios...");

  // Buscar todos los torneos
  const tournaments = await prisma.tournament.findMany();
  console.log(`Torneos registrados en la BD:`);
  for (const t of tournaments) {
    console.log(`- ${t.name} (ID: ${t.id}), Active: ${t.active}`);
  }

  // Buscar usuarios con notificaciones activas o balances de sobres especiales
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { show20PtsNotification: true },
        { show40PtsNotification: true },
        { pack2Balance: { gt: 0 } },
        { pack3Balance: { gt: 0 } }
      ]
    },
    select: {
      id: true,
      username: true,
      email: true,
      show20PtsNotification: true,
      show40PtsNotification: true,
      pack2Balance: true,
      pack3Balance: true,
    }
  });

  console.log(`\nUsuarios encontrados con flags o balances especiales: ${users.length}`);

  for (const u of users) {
    console.log(`\nUsuario: ${u.username} (${u.email}) | ID: ${u.id}`);
    console.log(`- Balances: pack2Balance=${u.pack2Balance}, pack3Balance=${u.pack3Balance}`);
    console.log(`- Notificaciones: 20Pts=${u.show20PtsNotification}, 40Pts=${u.show40PtsNotification}`);

    // Consultar puntos del usuario por torneo
    for (const t of tournaments) {
      const preds = await prisma.prediction.findMany({
        where: {
          userId: u.id,
          match: {
            tournamentId: t.id
          }
        }
      });
      const totalPoints = preds.reduce((sum, p) => sum + p.points, 0);
      console.log(`  * Puntos en "${t.name}": ${totalPoints} (Predicciones con puntos: ${preds.filter(p => p.points > 0).length})`);
    }

    // Consultar recompensas registradas en TournamentReward
    const rewards = await prisma.tournamentReward.findMany({
      where: { userId: u.id }
    });
    console.log(`  * Recompensas registradas en BD:`);
    if (rewards.length === 0) {
      console.log(`    Ninguna`);
    } else {
      for (const r of rewards) {
        const t = tournaments.find(x => x.id === r.tournamentId);
        console.log(`    - Tipo: ${r.rewardType} en torneo "${t?.name || r.tournamentId}"`);
      }
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Buscando anomalías de puntaje y recompensas de forma optimizada...");

  // 1. Obtener todos los torneos
  const tournaments = await prisma.tournament.findMany();
  console.log(`Cargados ${tournaments.length} torneos.`);

  // 2. Obtener todos los TournamentReward de la BD
  const allRewards = await prisma.tournamentReward.findMany();
  console.log(`Cargadas ${allRewards.length} recompensas de torneo.`);

  // 3. Obtener los usuarios de interés (los que tienen notificaciones activas, balance de sobres, o registros de recompensa)
  const userIdsWithRewards = new Set(allRewards.map(r => r.userId));
  
  const usersToCheck = await prisma.user.findMany({
    where: {
      OR: [
        { id: { in: Array.from(userIdsWithRewards) } },
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

  console.log(`Analizando ${usersToCheck.length} usuarios con posibles registros o balances...`);

  // 4. Obtener todas las predicciones de estos usuarios en una sola consulta
  const userIds = usersToCheck.map(u => u.id);
  const predictions = await prisma.prediction.findMany({
    where: {
      userId: { in: userIds }
    },
    include: {
      match: {
        select: {
          tournamentId: true
        }
      }
    }
  });
  console.log(`Cargadas ${predictions.length} predicciones.`);

  // 5. Agrupar predicciones por usuario y torneo en memoria
  // Estructura: pointsMap[userId][tournamentId] = points
  const pointsMap: Record<string, Record<string, number>> = {};
  for (const pred of predictions) {
    const userId = pred.userId;
    const tournamentId = pred.match.tournamentId;
    
    if (!pointsMap[userId]) {
      pointsMap[userId] = {};
    }
    if (!pointsMap[userId][tournamentId]) {
      pointsMap[userId][tournamentId] = 0;
    }
    pointsMap[userId][tournamentId] += pred.points;
  }

  // 6. Agrupar recompensas por usuario en memoria
  const rewardsMap: Record<string, typeof allRewards> = {};
  for (const r of allRewards) {
    if (!rewardsMap[r.userId]) {
      rewardsMap[r.userId] = [];
    }
    rewardsMap[r.userId].push(r);
  }

  let anomaliesFound = 0;

  for (const u of usersToCheck) {
    const uPoints = pointsMap[u.id] || {};
    const uRewards = rewardsMap[u.id] || [];

    const maxPointsInAnyTournament = Math.max(0, ...Object.values(uPoints));

    let isAnomalous = false;
    const reasons: string[] = [];

    // Anomalía 1: Tiene registro de recompensa pero no tiene los puntos suficientes en ese torneo específico
    for (const r of uRewards) {
      const pts = uPoints[r.tournamentId] || 0;
      if (r.rewardType === "20PTS" && pts < 20) {
        isAnomalous = true;
        reasons.push(`Tiene registro TournamentReward 20PTS en "${tournaments.find(x => x.id === r.tournamentId)?.name}" pero solo tiene ${pts} puntos.`);
      }
      if (r.rewardType === "40PTS" && pts < 40) {
        isAnomalous = true;
        reasons.push(`Tiene registro TournamentReward 40PTS en "${tournaments.find(x => x.id === r.tournamentId)?.name}" pero solo tiene ${pts} puntos.`);
      }
    }

    // Anomalía 2: show20PtsNotification es true pero no tiene >= 20 puntos en ningún torneo
    if (u.show20PtsNotification && maxPointsInAnyTournament < 20) {
      isAnomalous = true;
      reasons.push(`show20PtsNotification=true pero el puntaje máximo en cualquier torneo es ${maxPointsInAnyTournament}`);
    }

    // Anomalía 3: show40PtsNotification es true pero no tiene >= 40 puntos en ningún torneo
    if (u.show40PtsNotification && maxPointsInAnyTournament < 40) {
      isAnomalous = true;
      reasons.push(`show40PtsNotification=true pero el puntaje máximo en cualquier torneo es ${maxPointsInAnyTournament}`);
    }

    // Anomalía 4: pack2Balance > 0 pero no tiene >= 20 puntos en ningún torneo
    if (u.pack2Balance > 0 && maxPointsInAnyTournament < 20) {
      isAnomalous = true;
      reasons.push(`pack2Balance=${u.pack2Balance} pero el puntaje máximo en cualquier torneo es ${maxPointsInAnyTournament}`);
    }

    // Anomalía 5: pack3Balance > 0 pero no tiene >= 40 puntos en ningún torneo
    if (u.pack3Balance > 0 && maxPointsInAnyTournament < 40) {
      isAnomalous = true;
      reasons.push(`pack3Balance=${u.pack3Balance} pero el puntaje máximo en cualquier torneo es ${maxPointsInAnyTournament}`);
    }

    if (isAnomalous) {
      anomaliesFound++;
      console.log(`\n[ANOMALÍA] Usuario: ${u.username} (${u.email}) | ID: ${u.id}`);
      for (const r of reasons) {
        console.log(`  - ${r}`);
      }
      console.log("  Puntajes reales por torneo:");
      for (const t of tournaments) {
        console.log(`    * "${t.name}": ${uPoints[t.id] || 0} pts`);
      }
    }
  }

  console.log(`\nTotal de anomalías encontradas: ${anomaliesFound}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

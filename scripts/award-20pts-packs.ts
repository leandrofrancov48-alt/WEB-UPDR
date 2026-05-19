import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting retroactive 20pts pack reward script...");

  // Get all users
  const users = await prisma.user.findMany({
    select: { id: true, hasReceived20PtsPack: true }
  });

  let awardedCount = 0;

  for (const user of users) {
    if (user.hasReceived20PtsPack) continue;

    // Calculate total points
    const preds = await prisma.prediction.findMany({
      where: { userId: user.id }
    });
    const totalPoints = preds.reduce((acc, p) => acc + p.points, 0);

    if (totalPoints >= 20) {
      console.log(`Awarding pack to user ${user.id} (Points: ${totalPoints})`);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          hasReceived20PtsPack: true,
          show20PtsNotification: true,
          packBalance: { increment: 1 }
        }
      });
      awardedCount++;
    }
  }

  console.log(`Finished. Awarded packs to ${awardedCount} users.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

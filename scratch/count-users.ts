import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const predictionCount = await prisma.prediction.count();
    const stickerCount = await prisma.userSticker.count();
    const bandCount = await prisma.band.count();
    const appCount = await prisma.artistApplication.count();

    console.log(`TOTAL_USERS: ${userCount}`);
    console.log(`TOTAL_PREDICTIONS: ${predictionCount}`);
    console.log(`TOTAL_USER_STICKERS: ${stickerCount}`);
    console.log(`TOTAL_BANDS: ${bandCount}`);
    console.log(`TOTAL_ARTIST_APPLICATIONS: ${appCount}`);

    // Check users by month
    const usersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date('2026-08-01')
        }
      }
    });
    console.log(`USERS_REGISTERED_IN_AUGUST_2026: ${usersThisMonth}`);

  } catch (error) {
    console.error('Error querying DB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

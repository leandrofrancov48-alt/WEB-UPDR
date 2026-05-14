import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const PUBLIC_STICKER_DIR = 'C:/Users/Lean/.gemini/antigravity/scratch/public/stickers';

async function main() {
  console.log('Resetting album progress...');
  
  // 1. Delete all user stickers
  await prisma.userSticker.deleteMany({});
  
  // 2. Reset user pack balances and welcome flag
  await prisma.user.updateMany({
    data: {
      packBalance: 0,
      hasClaimedWelcome: false,
    },
  });

  // 3. Clear old stickers to avoid number conflicts if needed, or just upsert
  // Since we want to update the set, let's delete all first
  await prisma.sticker.deleteMany({});

  // 4. Seed new stickers
  const files = fs.readdirSync(PUBLIC_STICKER_DIR);
  const stickerData: Record<string, { name: string; rarity: string; solucion?: string }> = {};

  for (const file of files) {
    if (!file.endsWith('.png')) continue;

    const match = file.match(/CARD (\w+) - (.*) SOLUCION(?: V2)?\.png/);
    if (!match) continue;

    const [_, rarity, name] = match;
    const key = `${rarity}-${name}`;

    if (!stickerData[key]) {
      stickerData[key] = { name, rarity };
    }

    stickerData[key].solucion = `/stickers/${file}`;
  }

  let number = 1;
  for (const key in stickerData) {
    const data = stickerData[key];
    if (!data.solucion) continue;

    console.log(`Creating sticker: ${data.name} (${data.rarity})`);
    await prisma.sticker.create({
      data: {
        number: number,
        name: data.name,
        image: data.solucion,
        rarity: data.rarity,
        category: data.rarity,
      },
    });
    number++;
  }

  console.log('Album reset and seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

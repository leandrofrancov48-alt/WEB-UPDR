import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const PUBLIC_STICKER_DIR = 'C:/Users/Lean/.gemini/antigravity/scratch/public/stickers';

async function main() {
  const files = fs.readdirSync(PUBLIC_STICKER_DIR);
  const stickerData: Record<string, { name: string; rarity: string; solucion?: string; sombra?: string }> = {};

  for (const file of files) {
    if (!file.endsWith('.png')) continue;

    const match = file.match(/CARD (\w+) - (.*) (SOLUCION|SOMBRA)\.png/);
    if (!match) continue;

    const [_, rarity, name, type] = match;
    const key = `${rarity}-${name}`;

    if (!stickerData[key]) {
      stickerData[key] = { name, rarity };
    }

    const url = `/stickers/${file}`;

    if (type === 'SOLUCION') stickerData[key].solucion = url;
    if (type === 'SOMBRA') stickerData[key].sombra = url;
  }

  let number = 1;
  for (const key in stickerData) {
    const data = stickerData[key];
    if (!data.solucion) continue;

    console.log(`Upserting sticker: ${data.name} (${data.rarity})`);
    await prisma.sticker.upsert({
      where: { number: number },
      update: {
        name: data.name,
        image: data.solucion,
        shadowImage: data.sombra,
        rarity: data.rarity,
        category: data.rarity,
      },
      create: {
        number: number,
        name: data.name,
        image: data.solucion,
        shadowImage: data.sombra,
        rarity: data.rarity,
        category: data.rarity,
      },
    });
    number++;
  }

  console.log('Seed local assets completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

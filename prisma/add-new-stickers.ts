import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const PUBLIC_STICKER_DIR = 'C:/Users/Lean/.gemini/antigravity/scratch/public/stickers';

async function main() {
  console.log('Iniciando registro de nuevas figuritas conservando las anteriores...');

  // 1. Obtener figuritas actuales
  const existingStickers = await prisma.sticker.findMany({
    orderBy: { number: 'asc' },
  });

  const existingMap = new Map<string, typeof existingStickers[0]>();
  let maxNumber = 0;

  for (const s of existingStickers) {
    existingMap.set(s.name, s);
    if (s.number > maxNumber) {
      maxNumber = s.number;
    }
  }

  console.log(`Figuritas existentes en BD: ${existingStickers.length}. Número máximo actual: ${maxNumber}`);

  // 2. Leer archivos de la carpeta
  const files = fs.readdirSync(PUBLIC_STICKER_DIR);
  const newStickerData: Array<{ name: string; rarity: string; imagePath: string }> = [];

  for (const file of files) {
    if (!file.endsWith('.png')) continue;

    const match = file.match(/CARD (\w+) - (.*) SOLUCION(?: V2)?\.png/);
    if (!match) continue;

    const [_, rarity, name] = match;
    const cleanName = name.trim().toUpperCase();

    // Si ya existe una figurita con ese nombre en la base de datos, no la agregamos como nueva
    if (existingMap.has(cleanName)) {
      console.log(`La figurita "${cleanName}" ya existe en la base de datos con número ${existingMap.get(cleanName)?.number}. Manteniendo intacta.`);
      continue;
    }

    newStickerData.push({
      name: cleanName,
      rarity: rarity.toUpperCase(),
      imagePath: `/stickers/${file}`,
    });
  }

  console.log(`Nuevas figuritas detectadas para agregar: ${newStickerData.length}`);

  // 3. Crear las nuevas figuritas asignando números secuenciales a partir de maxNumber + 1
  let nextNumber = maxNumber + 1;
  for (const data of newStickerData) {
    console.log(`Registrando figurita #${nextNumber}: ${data.name} (${data.rarity}) -> ${data.imagePath}`);
    await prisma.sticker.create({
      data: {
        number: nextNumber,
        name: data.name,
        image: data.imagePath,
        rarity: data.rarity,
        category: data.rarity,
      },
    });
    nextNumber++;
  }

  console.log('Registro de nuevas figuritas finalizado con éxito.');
}

main()
  .catch((e) => {
    console.error('Error al registrar nuevas figuritas:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

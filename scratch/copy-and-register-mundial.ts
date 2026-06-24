import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const SOURCE_DIR = 'C:/Users/Lean/Documents/ANTIGRAVITY/Figuritas de la CC - Finales/NUEVAS';
const DEST_DIR = 'C:/Users/Lean/.gemini/antigravity/scratch/public/stickers';

const MUNDIAL_STICKERS = [
  {
    fileName: 'Figurita Mundial V2 - Dj Pipo_00000.png',
    cleanName: 'DJ PIPO',
    targetName: 'CARD MUNDIAL - DJ PIPO SOLUCION.png'
  },
  {
    fileName: 'Figurita Mundial V2 - Pinky_00000.png',
    cleanName: 'PINKY',
    targetName: 'CARD MUNDIAL - PINKY SOLUCION.png'
  },
  {
    fileName: 'Figurtita Mundial V2 - Damo_00000.png',
    cleanName: 'DAMO',
    targetName: 'CARD MUNDIAL - DAMO SOLUCION.png'
  }
];

async function main() {
  console.log('Iniciando copiado y registro de las figuritas de la categoría MUNDIAL (con verificación de rareza)...');

  // 1. Obtener figuritas actuales para encontrar el número máximo y evitar duplicados
  const existingStickers = await prisma.sticker.findMany({
    orderBy: { number: 'asc' },
  });

  // Mapear por nombre y rareza para permitir nombres repetidos con diferente rareza
  const existingMap = new Map<string, typeof existingStickers[0]>();
  let maxNumber = 0;

  for (const s of existingStickers) {
    existingMap.set(`${s.name}-${s.rarity}`, s);
    if (s.number > maxNumber) {
      maxNumber = s.number;
    }
  }

  console.log(`Figuritas existentes en BD: ${existingStickers.length}. Número máximo actual: ${maxNumber}`);

  // 2. Verificar que exista la carpeta de origen
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Directorio de origen no existe: ${SOURCE_DIR}`);
    process.exit(1);
  }

  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  let nextNumber = maxNumber + 1;

  for (const item of MUNDIAL_STICKERS) {
    const sourcePath = path.join(SOURCE_DIR, item.fileName);
    const destPath = path.join(DEST_DIR, item.targetName);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Archivo de origen no encontrado: ${sourcePath}. Saltando.`);
      continue;
    }

    // Copiar el archivo físicamente
    console.log(`Copiando: ${item.fileName} -> ${item.targetName}`);
    fs.copyFileSync(sourcePath, destPath);

    // Verificar si ya existe en la base de datos
    const key = `${item.cleanName}-MUNDIAL`;
    if (existingMap.has(key)) {
      console.log(`La figurita "${item.cleanName}" (MUNDIAL) ya existe en la base de datos con el número ${existingMap.get(key)?.number}. Saltando inserción.`);
      continue;
    }

    // Insertar en base de datos
    const dbImage = `/stickers/${item.targetName}`;
    console.log(`Registrando en BD #${nextNumber}: ${item.cleanName} (MUNDIAL) -> ${dbImage}`);
    
    await prisma.sticker.create({
      data: {
        number: nextNumber,
        name: item.cleanName,
        image: dbImage,
        rarity: 'MUNDIAL',
        category: 'MUNDIAL',
      },
    });

    nextNumber++;
  }

  console.log('¡Proceso completado con éxito!');
}

main()
  .catch((e) => {
    console.error('Error durante la ejecución:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

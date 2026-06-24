import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const SOURCE_DIR = 'C:/Users/Lean/Documents/ANTIGRAVITY/Figuritas de la CC - Finales/NUEVAS';
const DEST_DIR = 'C:/Users/Lean/.gemini/antigravity/scratch/public/stickers';

const CUMBIERIZANDO_STICKERS = [
  { fileName: 'Figurita Cumbierizando - Bahiano.png', cleanName: 'BAHIANO' },
  { fileName: 'Figurita Cumbierizando - Cazzu.png', cleanName: 'CAZZU' },
  { fileName: 'Figurita Cumbierizando - Chaqueño Palavecino.png', cleanName: 'CHAQUEÑO PALAVECINO' },
  { fileName: 'Figurita Cumbierizando - FMK.png', cleanName: 'FMK' },
  { fileName: 'Figurita Cumbierizando - Juanes.png', cleanName: 'JUANES' },
  { fileName: 'Figurita Cumbierizando - Luciano Pereyra.png', cleanName: 'LUCIANO PEREYRA' },
  { fileName: 'Figurita Cumbierizando - Maria Becerra.png', cleanName: 'MARIA BECERRA' },
  { fileName: 'Figurita Cumbierizando - Mau y Ricky.png', cleanName: 'MAU Y RICKY' },
  { fileName: 'Figurita Cumbierizando - Mono Kapanga.png', cleanName: 'MONO KAPANGA' }
];

async function main() {
  console.log('Iniciando copiado y registro de las figuritas de la categoría Cumbierizando (CUMBIERIZED)...');

  // 1. Obtener figuritas actuales para encontrar el número máximo y evitar duplicados
  const existingStickers = await prisma.sticker.findMany({
    orderBy: { number: 'asc' },
  });

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

  for (const item of CUMBIERIZANDO_STICKERS) {
    const targetName = `CARD CUMBIERIZED - ${item.cleanName} SOLUCION.png`;
    const sourcePath = path.join(SOURCE_DIR, item.fileName);
    const destPath = path.join(DEST_DIR, targetName);

    if (!fs.existsSync(sourcePath)) {
      console.warn(`Archivo de origen no encontrado: ${sourcePath}. Saltando.`);
      continue;
    }

    // Copiar el archivo físicamente
    console.log(`Copiando: ${item.fileName} -> ${targetName}`);
    fs.copyFileSync(sourcePath, destPath);

    // Verificar si ya existe en la base de datos
    const key = `${item.cleanName}-CUMBIERIZED`;
    if (existingMap.has(key)) {
      console.log(`La figurita "${item.cleanName}" (CUMBIERIZED) ya existe en la base de datos con el número ${existingMap.get(key)?.number}. Saltando inserción.`);
      continue;
    }

    // Insertar en base de datos
    const dbImage = `/stickers/${targetName}`;
    console.log(`Registrando en BD #${nextNumber}: ${item.cleanName} (CUMBIERIZED) -> ${dbImage}`);
    
    await prisma.sticker.create({
      data: {
        number: nextNumber,
        name: item.cleanName,
        image: dbImage,
        rarity: 'CUMBIERIZED',
        category: 'CUMBIERIZED',
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

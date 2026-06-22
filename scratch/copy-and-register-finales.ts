import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const SOURCE_DIR = 'C:/Users/Lean/Documents/ANTIGRAVITY/Figuritas de la CC - Finales/NUEVAS';
const DEST_DIR = 'C:/Users/Lean/.gemini/antigravity/scratch/public/stickers';

async function main() {
  console.log('Iniciando copiado y registro de las figuritas de la CC - Finales...');

  // 1. Obtener figuritas actuales para encontrar el número máximo y evitar duplicados
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

  // 2. Leer archivos de la carpeta de origen
  if (!fs.existsSync(SOURCE_DIR)) {
    console.error(`Directorio de origen no existe: ${SOURCE_DIR}`);
    process.exit(1);
  }

  const files = fs.readdirSync(SOURCE_DIR);
  
  if (!fs.existsSync(DEST_DIR)) {
    fs.mkdirSync(DEST_DIR, { recursive: true });
  }

  let nextNumber = maxNumber + 1;

  for (const file of files) {
    if (!file.endsWith('.png')) continue;

    // Determinar rareza y nombre limpio
    let targetFileName = '';
    let rarity = '';
    let cleanName = '';

    const lowerFile = file.toLowerCase();
    if (lowerFile.startsWith('figurita leyenda - ')) {
      const rest = file.substring('figurita leyenda - '.length, file.length - '.png'.length);
      cleanName = rest.trim().toUpperCase();
      rarity = 'LEGEND';
      targetFileName = `CARD LEGEND - ${cleanName} SOLUCION.png`;
    } else if (lowerFile.startsWith('figurita normal - ')) {
      const rest = file.substring('figurita normal - '.length, file.length - '.png'.length);
      cleanName = rest.trim().toUpperCase();
      rarity = 'GOLD';
      targetFileName = `CARD GOLD - ${cleanName} SOLUCION.png`;
    } else {
      console.log(`Archivo ignorado: ${file}`);
      continue;
    }

    const sourcePath = path.join(SOURCE_DIR, file);
    const destPath = path.join(DEST_DIR, targetFileName);

    // Copiar el archivo físicamente
    console.log(`Copiando: ${file} -> ${targetFileName}`);
    fs.copyFileSync(sourcePath, destPath);

    // Verificar si ya existe en la base de datos
    if (existingMap.has(cleanName)) {
      console.log(`La figurita "${cleanName}" ya existe en la base de datos con el número ${existingMap.get(cleanName)?.number}. Saltando inserción.`);
      continue;
    }

    // Insertar en base de datos
    const dbImage = `/stickers/${targetFileName}`;
    console.log(`Registrando en BD #${nextNumber}: ${cleanName} (${rarity}) -> ${dbImage}`);
    
    await prisma.sticker.create({
      data: {
        number: nextNumber,
        name: cleanName,
        image: dbImage,
        rarity: rarity,
        category: rarity,
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

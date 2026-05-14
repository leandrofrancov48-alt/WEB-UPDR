import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const stickers = [
    { number: 1, name: 'Escudo UPDR', rarity: 'RARE', category: 'General', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/escudo_updr' },
    { number: 2, name: 'Estudio Principal', rarity: 'COMMON', category: 'Estudio', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/estudio_1' },
    { number: 3, name: 'Matias', rarity: 'COMMON', category: 'Staff', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/matias' },
    { number: 4, name: 'Tanito', rarity: 'COMMON', category: 'Staff', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/tanito' },
    { number: 5, name: 'Viole', rarity: 'COMMON', category: 'Staff', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/viole' },
    { number: 6, name: 'Duki en el programa', rarity: 'LEGENDARY', category: 'Momentos', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/duki_moment' },
    { number: 7, name: 'Microfono Dorado', rarity: 'RARE', category: 'Objetos', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/mic_gold' },
    { number: 8, name: 'Cámara 1', rarity: 'COMMON', category: 'Equipo', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/camara' },
    { number: 9, name: 'Set de Mate', rarity: 'COMMON', category: 'Objetos', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/mate' },
    { number: 10, name: 'Invitado Especial', rarity: 'RARE', category: 'Artistas', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/guest' },
    { number: 11, name: 'Consola de Sonido', rarity: 'COMMON', category: 'Estudio', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/console' },
    { number: 12, name: 'Auriculares Pro', rarity: 'COMMON', category: 'Objetos', image: 'https://res.cloudinary.com/dv768jv9i/image/upload/v1/stickers/phones' },
    // Add more up to 30 as needed
  ];

  for (const sticker of stickers) {
    await prisma.sticker.upsert({
      where: { number: sticker.number },
      update: sticker,
      create: sticker,
    });
  }

  console.log('Seed stickers completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

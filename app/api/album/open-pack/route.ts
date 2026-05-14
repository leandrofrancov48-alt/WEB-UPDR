import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const dbUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { packBalance: true },
      });

      if (!dbUser || dbUser.packBalance <= 0) {
        return NextResponse.json({ error: 'No packs available' }, { status: 400 });
      }

      // 1. Decrease pack balance
      await tx.user.update({
        where: { id: user.id },
        data: { packBalance: { decrement: 1 } },
      });

      // 2. Select a random sticker based on rarity
      // User requirements: GOLD (60%), CUMBIERIZED (30%), LEGEND (10%)
      const rand = Math.random() * 100;
      let rarity = 'GOLD';
      if (rand < 10) rarity = 'LEGEND';
      else if (rand < 40) rarity = 'CUMBIERIZED';

      const stickersOfRarity = await tx.sticker.findMany({
        where: { rarity },
      });

      // Fallback to GOLD if no stickers of selected rarity exist
      let finalStickers = stickersOfRarity;
      if (finalStickers.length === 0) {
        finalStickers = await tx.sticker.findMany({ where: { rarity: 'GOLD' } });
      }

      if (finalStickers.length === 0) {
        return NextResponse.json({ error: 'No stickers found' }, { status: 500 });
      }

      const randomSticker = finalStickers[Math.floor(Math.random() * finalStickers.length)];

      // 3. Upsert UserSticker
      const userSticker = await tx.userSticker.upsert({
        where: {
          userId_stickerId: {
            userId: user.id,
            stickerId: randomSticker.id,
          },
        },
        update: { quantity: { increment: 1 } },
        create: {
          userId: user.id,
          stickerId: randomSticker.id,
          quantity: 1,
        },
      });

      return NextResponse.json({
        sticker: randomSticker,
        isNew: userSticker.quantity === 1,
      });
    });
  } catch (error) {
    console.error('Error opening pack:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

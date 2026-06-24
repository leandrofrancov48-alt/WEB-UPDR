import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    return await prisma.$transaction(async (tx) => {
      const dbUser = await tx.user.findUnique({
        where: { id: user.id },
        select: { packBalance: true, pack2Balance: true, pack3Balance: true },
      });

      if (!dbUser || (dbUser.packBalance <= 0 && dbUser.pack2Balance <= 0 && dbUser.pack3Balance <= 0)) {
        return NextResponse.json({ error: 'No packs available' }, { status: 400 });
      }

      // Determine which pack to open (priority: 3-cards first, then 2-cards, then default)
      let cardCount = 1;
      let packType = "DEFAULT";
      let updateFields = {};

      if (dbUser.pack3Balance > 0) {
        cardCount = 3;
        packType = "3_CARDS";
        updateFields = { pack3Balance: { decrement: 1 } };
      } else if (dbUser.pack2Balance > 0) {
        cardCount = 2;
        packType = "2_CARDS";
        updateFields = { pack2Balance: { decrement: 1 } };
      } else {
        cardCount = 1;
        packType = "DEFAULT";
        updateFields = { packBalance: { decrement: 1 } };
      }

      // 1. Decrease pack balance
      await tx.user.update({
        where: { id: user.id },
        data: updateFields,
      });

      const openedStickers = [];
      const isNewFlags = [];

      for (let i = 0; i < cardCount; i++) {
        // Probabilities: GOLD (68%), TENDENCIA (15%), MUNDIAL (7%), LEGEND (7%), CUMBIERIZED (3%)
        const rand = Math.random() * 100;
        let rarity = 'GOLD';
        if (rand < 3) rarity = 'CUMBIERIZED';
        else if (rand < 10) rarity = 'LEGEND';
        else if (rand < 17) rarity = 'MUNDIAL';
        else if (rand < 32) rarity = 'TENDENCIA';

        const stickersOfRarity = await tx.sticker.findMany({
          where: { rarity },
        });

        // Fallback to GOLD if no stickers of selected rarity exist
        let finalStickers = stickersOfRarity;
        if (finalStickers.length === 0) {
          finalStickers = await tx.sticker.findMany({ where: { rarity: 'GOLD' } });
        }

        if (finalStickers.length === 0) {
          throw new Error('No stickers found');
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

        openedStickers.push(randomSticker);
        isNewFlags.push(userSticker.quantity === 1);
      }

      // 4. Log the pack opening
      await tx.openedPack.create({
        data: {
          userId: user.id,
          packType: packType,
        }
      });

      return NextResponse.json({
        stickers: openedStickers,
        isNewFlags: isNewFlags,
      });
    });
  } catch (error) {
    console.error('Error opening pack:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

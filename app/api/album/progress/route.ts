import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allStickers = await prisma.sticker.findMany({
      orderBy: { number: 'asc' },
    });

    console.log(`API: Found ${allStickers.length} stickers in DB`);

    const userStickers = await prisma.userSticker.findMany({
      where: { userId: user.id },
      include: { sticker: true },
    });

    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { packBalance: true, hasClaimedWelcome: true },
    });

    const totalGlobalOpenedPacks = await prisma.openedPack.count();

    return NextResponse.json({
      stickers: allStickers,
      owned: userStickers,
      packBalance: fullUser?.packBalance ?? 0,
      hasClaimedWelcome: fullUser?.hasClaimedWelcome ?? false,
      totalGlobalOpenedPacks,
    });
  } catch (error) {
    console.error('Error fetching album progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

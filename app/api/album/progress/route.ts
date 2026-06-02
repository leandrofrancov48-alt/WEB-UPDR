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

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        packBalance: true, 
        lastWeeklyPackDate: true, 
        hasClaimedWelcome: true, 
        show20PtsNotification: true 
      },
    });

    let currentPackBalance = dbUser?.packBalance ?? 0;

    // Calcular lunes de la semana actual en Argentina
    const nowStr = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
    const nowInArg = new Date(nowStr);
    const day = nowInArg.getDay();
    const diff = day === 0 ? 6 : day - 1;
    const argMonday = new Date(nowInArg);
    argMonday.setDate(nowInArg.getDate() - diff);
    argMonday.setHours(0, 0, 0, 0);
    const mondayIsoStr = `${argMonday.getFullYear()}-${String(argMonday.getMonth() + 1).padStart(2, '0')}-${String(argMonday.getDate()).padStart(2, '0')}T00:00:00-03:00`;
    const currentWeekMondayUtc = new Date(mondayIsoStr);

    // Si el usuario no ha recibido el sobre semanal de la semana actual, se lo entregamos en el momento (Lazy-awarding fail-safe)
    if (dbUser && (!dbUser.lastWeeklyPackDate || dbUser.lastWeeklyPackDate < currentWeekMondayUtc)) {
      console.log(`Lazy-awarding weekly pack to user ${user.id} (${user.email})`);
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          packBalance: { increment: 1 },
          lastWeeklyPackDate: new Date(),
        },
        select: { packBalance: true },
      });
      currentPackBalance = updatedUser.packBalance;
    }

    const totalGlobalOpenedPacks = await prisma.openedPack.count();

    return NextResponse.json({
      stickers: allStickers,
      owned: userStickers,
      packBalance: currentPackBalance,
      hasClaimedWelcome: dbUser?.hasClaimedWelcome ?? false,
      show20PtsNotification: dbUser?.show20PtsNotification ?? false,
      totalGlobalOpenedPacks,
    });
  } catch (error) {
    console.error('Error fetching album progress:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

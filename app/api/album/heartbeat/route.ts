import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

function getActiveSlot(date: Date): string | null {
  const day = date.getDay();
  const hour = date.getHours();

  if (day === 1) { // Monday
    if (hour >= 18 && hour < 20) return "LUNES_18_20";
    if (hour >= 20 && hour < 22) return "LUNES_20_22";
  } else if (day === 2) { // Tuesday
    if (hour >= 18 && hour < 20) return "MARTES_18_20";
  } else if (day === 3) { // Wednesday
    if (hour >= 21 && hour < 23) return "MIERCOLES_21_23";
  } else if (day === 4) { // Thursday
    if (hour >= 18 && hour < 20) return "JUEVES_18_20";
  }

  return null;
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { minutes } = await request.json();
    
    const nowInArg = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Argentina/Buenos_Aires"}));
    const activeSlot = getActiveSlot(nowInArg);

    if (!activeSlot) {
      return NextResponse.json({ success: true, message: 'Outside watch-to-earn hours', watchTimeMinutes: 0 });
    }

    const fullUser = await prisma.user.findUnique({ where: { id: user.id }, select: { lastPackSlot: true, lastActiveSlot: true, watchTimeMinutes: true } });
    if (!fullUser) throw new Error("User not found");

    if (fullUser.lastPackSlot === activeSlot) {
      return NextResponse.json({ success: true, message: 'Pack already claimed for this slot', watchTimeMinutes: fullUser.watchTimeMinutes });
    }

    if (fullUser.lastActiveSlot !== activeSlot) {
       await prisma.user.update({
         where: { id: user.id },
         data: { lastActiveSlot: activeSlot, watchTimeMinutes: 0 }
       });
       fullUser.watchTimeMinutes = 0;
    }

    const increment = Math.min(Math.max(0, minutes || 0), 10);
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        watchTimeMinutes: { increment }
      }
    });

    let grantedPack = false;
    if (updatedUser.watchTimeMinutes >= 60) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          packBalance: { increment: 1 },
          watchTimeMinutes: 0,
          lastPackSlot: activeSlot
        }
      });
      grantedPack = true;
    }

    return NextResponse.json({ 
      success: true, 
      watchTimeMinutes: grantedPack ? 0 : updatedUser.watchTimeMinutes,
      grantedPack 
    });
  } catch (error) {
    console.error('Error in heartbeat:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { minutes } = await request.json();
    
    // Check if user already got a pack today
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (user.lastWatchPackDate && new Date(user.lastWatchPackDate) >= today) {
      return NextResponse.json({ 
        success: true, 
        message: 'Daily limit reached',
        watchTimeMinutes: user.watchTimeMinutes 
      });
    }

    // Validate minutes to prevent cheating (e.g. max 10 mins per heartbeat)
    const increment = Math.min(Math.max(0, minutes || 0), 10);
    
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        watchTimeMinutes: {
          increment: increment
        }
      }
    });

    let grantedPack = false;
    if (updatedUser.watchTimeMinutes >= 30) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          packBalance: { increment: 1 },
          watchTimeMinutes: 0, // Reset time after reward
          lastWatchPackDate: new Date()
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

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getSessionUser } from '@/lib/session';

export async function POST() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { hasClaimedWelcome: true },
    });

    if (dbUser?.hasClaimedWelcome) {
      return NextResponse.json({ error: 'Welcome pack already claimed' }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        packBalance: { increment: 1 },
        hasClaimedWelcome: true,
      },
    });

    return NextResponse.json({ success: true, message: 'Welcome pack claimed!' });
  } catch (error) {
    console.error('Error claiming welcome pack:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

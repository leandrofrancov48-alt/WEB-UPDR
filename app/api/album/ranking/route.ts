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
    const totalStickersCount = await prisma.sticker.count();
    if (totalStickersCount === 0) {
      return NextResponse.json({ ranking: [] });
    }

    // Agrupar UserStickers por usuario para contar cantidad de figuritas únicas
    const userProgress = await prisma.userSticker.groupBy({
      by: ['userId'],
      _count: {
        stickerId: true,
      },
      orderBy: {
        _count: {
          stickerId: 'desc',
        },
      },
      take: 20, // Top 20 coleccionistas
    });

    const userIds = userProgress.map(p => p.userId);

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        username: true,
        nombre: true,
        apellido: true,
      },
    });

    const ranking = userProgress.map((p, index) => {
      const u = users.find(x => x.id === p.userId);
      const uniqueCount = p._count.stickerId;
      const percentage = parseFloat(((uniqueCount / totalStickersCount) * 100).toFixed(1));
      return {
        rank: index + 1,
        username: u?.username || 'Anónimo',
        displayName: u ? `${u.nombre} ${u.apellido.charAt(0)}.` : 'Anónimo',
        uniqueCount,
        percentage,
      };
    });

    return NextResponse.json({ ranking });
  } catch (error) {
    console.error('Error fetching album ranking:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

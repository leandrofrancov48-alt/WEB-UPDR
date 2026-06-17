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
    const result = await prisma.$transaction(async (tx) => {
      // 1. Obtener todas las figuritas del usuario con cantidad mayor a 1
      const userStickers = await tx.userSticker.findMany({
        where: {
          userId: user.id,
          quantity: { gt: 1 },
        },
        orderBy: {
          quantity: 'desc', // Empezamos a consumir de las que tienen más copias
        },
      });

      // 2. Calcular el total de duplicadas (cantidad - 1 por cada fila)
      const totalDuplicates = userStickers.reduce((sum, us) => sum + (us.quantity - 1), 0);

      if (totalDuplicates < 3) {
        return { error: 'No tienes suficientes figuritas repetidas. Se necesitan al menos 3.', status: 400 };
      }

      // 3. Descontar exactamente 3 repetidas
      let needed = 3;
      for (const us of userStickers) {
        const dups = us.quantity - 1;
        const deduct = Math.min(needed, dups);
        
        await tx.userSticker.update({
          where: { id: us.id },
          data: { quantity: us.quantity - deduct },
        });

        needed -= deduct;
        if (needed === 0) break;
      }

      if (needed > 0) {
        throw new Error('Error al procesar el descuento de duplicados.');
      }

      // 4. Otorgar 1 sobre estándar al balance de sobres del usuario
      const updatedUser = await tx.user.update({
        where: { id: user.id },
        data: {
          packBalance: { increment: 1 },
        },
        select: {
          packBalance: true,
          pack2Balance: true,
          pack3Balance: true,
        },
      });

      return { success: true, updatedUser };
    });

    if ('error' in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }

    return NextResponse.json({
      success: true,
      packBalance: result.updatedUser.packBalance,
      pack2Balance: result.updatedUser.pack2Balance,
      pack3Balance: result.updatedUser.pack3Balance,
    });

  } catch (error) {
    console.error('Error exchanging duplicates:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const [dbBands, dbApplications] = await Promise.all([
      prisma.band.findMany({
        select: {
          id: true,
          name: true,
          bio: true,
          _count: {
            select: { likes: true }
          }
        },
        orderBy: {
          likes: { _count: 'desc' }
        },
        take: 10
      }),
      prisma.artistApplication.findMany({
        where: {
          status: 'APPROVED'
        },
        select: {
          id: true,
          artistName: true,
          bio: true,
          genre: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      })
    ]);

    const emergingBands = [
      ...dbBands.map((b, i) => ({
        id: `db_band_${b.id}`,
        name: b.name,
        logo: '🔥',
        category: `⭐ ARTISTA EMERGENTE UPDR (Top #${i + 1} Votos)`,
        actionLabel: 'Iniciar carrera en',
        requiredOvr: 40,
        baseSuccessRate: 100,
        bonusTalent: 3,
        bonusCharisma: 3,
        description: b.bio || `Artista emergente destacado de la comunidad UPDR con ${b._count.likes} apoyos de la gente.`,
        positiveText: `¡Gran debut en el circuito emergente con ${b.name}!`,
        negativeText: '¡La banda se lució en su primera fecha!'
      })),
      ...dbApplications.map((a, i) => ({
        id: `db_app_${a.id}`,
        name: a.artistName,
        logo: '🎤',
        category: `⭐ ARTISTA EMERGENTE UPDR`,
        actionLabel: 'Sumarte al proyecto de',
        requiredOvr: 40,
        baseSuccessRate: 100,
        bonusTalent: 3,
        bonusCharisma: 3,
        description: a.bio || `Banda emergente postulada en Un Poco de Ruido en género ${a.genre || 'Cumbia'}.`,
        positiveText: `¡Debut explosivo junto a ${a.artistName}!`,
        negativeText: '¡Gran recepción del público emergente!'
      }))
    ];

    return NextResponse.json({ bands: emergingBands });
  } catch (error) {
    console.error('Error fetching emerging bands for sim:', error);
    return NextResponse.json({ bands: [] });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });
  }

  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        show20PtsNotification: true,
        show40PtsNotification: true,
        showPlenoNotification: true,
      },
    });

    let points20 = 20;
    let points40 = 40;

    if (dbUser?.show20PtsNotification || dbUser?.show40PtsNotification) {
      const rewards = await prisma.tournamentReward.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });

      if (dbUser.show20PtsNotification) {
        const reward20 = rewards.find(r => {
          const match = r.rewardType.match(/^(\d+)PTS$/);
          if (!match) return false;
          const pts = parseInt(match[1], 10);
          return pts === 20 || pts >= 60;
        });
        if (reward20) {
          points20 = parseInt(reward20.rewardType, 10);
        }
      }

      if (dbUser.show40PtsNotification) {
        const reward40 = rewards.find(r => {
          const match = r.rewardType.match(/^(\d+)PTS$/);
          if (!match) return false;
          const pts = parseInt(match[1], 10);
          return pts === 40;
        });
        if (reward40) {
          points40 = parseInt(reward40.rewardType, 10);
        }
      }
    }

    return NextResponse.json({
      show20PtsNotification: dbUser?.show20PtsNotification ?? false,
      show40PtsNotification: dbUser?.show40PtsNotification ?? false,
      showPlenoNotification: dbUser?.showPlenoNotification ?? false,
      points20,
      points40,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

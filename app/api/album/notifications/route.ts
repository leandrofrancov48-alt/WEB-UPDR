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

    return NextResponse.json({
      show20PtsNotification: dbUser?.show20PtsNotification ?? false,
      show40PtsNotification: dbUser?.show40PtsNotification ?? false,
      showPlenoNotification: dbUser?.showPlenoNotification ?? false,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

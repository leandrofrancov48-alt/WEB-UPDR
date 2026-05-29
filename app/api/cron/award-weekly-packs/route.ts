import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Validar seguridad del Cron (Vercel Cron Job estándar)
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get("secret");

    const expectedSecret = process.env.CRON_SECRET;

    // Si se configuró un CRON_SECRET, validar que coincida con el header de Vercel o el query param
    if (expectedSecret) {
      const isHeaderValid = authHeader === `Bearer ${expectedSecret}`;
      const isQueryValid = querySecret === expectedSecret;

      if (!isHeaderValid && !isQueryValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("Iniciando cron automático de sobres semanales...");

    // 2. Obtener lunes de la semana actual en Argentina (UTC-3)
    const nowStr = new Date().toLocaleString("en-US", { timeZone: "America/Argentina/Buenos_Aires" });
    const nowInArg = new Date(nowStr);

    const day = nowInArg.getDay();
    const diff = day === 0 ? 6 : day - 1;

    const argMonday = new Date(nowInArg);
    argMonday.setDate(nowInArg.getDate() - diff);
    argMonday.setHours(0, 0, 0, 0);

    const mondayIsoStr = `${argMonday.getFullYear()}-${String(argMonday.getMonth() + 1).padStart(2, '0')}-${String(argMonday.getDate()).padStart(2, '0')}T00:00:00-03:00`;
    const currentWeekMondayUtc = new Date(mondayIsoStr);

    const now = new Date();

    // 3. Ejecutar la actualización masiva atómica y ultra rápida con updateMany
    const result = await prisma.user.updateMany({
      where: {
        OR: [
          { lastWeeklyPackDate: null },
          { lastWeeklyPackDate: { lt: currentWeekMondayUtc } }
        ]
      },
      data: {
        packBalance: { increment: 1 },
        lastWeeklyPackDate: now
      }
    });

    console.log(`Cron finalizado. Se otorgaron sobres a ${result.count} usuarios.`);

    return NextResponse.json({
      success: true,
      message: `Sobres semanales otorgados a ${result.count} usuarios.`,
      count: result.count,
      currentMonday: mondayIsoStr
    });
  } catch (error: any) {
    console.error("Error en cron de sobres semanales:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || error },
      { status: 500 }
    );
  }
}

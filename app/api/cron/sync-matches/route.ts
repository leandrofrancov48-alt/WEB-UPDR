import { NextRequest, NextResponse } from "next/server";
import { syncMatchesFromOfficialFixture } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    // 1. Validar seguridad del Cron (Vercel Cron Job estándar)
    const authHeader = req.headers.get("authorization");
    const { searchParams } = new URL(req.url);
    const querySecret = searchParams.get("secret");

    const expectedSecret = process.env.CRON_SECRET;

    if (expectedSecret) {
      const isHeaderValid = authHeader === `Bearer ${expectedSecret}`;
      const isQueryValid = querySecret === expectedSecret;

      if (!isHeaderValid && !isQueryValid) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    console.log("Iniciando sincronización automática de partidos desde el fixture oficial...");
    const result = await syncMatchesFromOfficialFixture();
    return NextResponse.json(result);

  } catch (error: any) {
    console.error("Error en sincronización automática de partidos:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error?.message || error },
      { status: 500 }
    );
  }
}

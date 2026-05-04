import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest, { params }: { params: Promise<{ matchId: string }> }) {
  const adminToken = process.env.PRODE_ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: "PRODE_ADMIN_TOKEN no configurado" }, { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { matchId } = await params;
  const body = await req.json().catch(() => null);
  const homeGoals = Number(body?.homeGoals);
  const awayGoals = Number(body?.awayGoals);

  if (Number.isNaN(homeGoals) || Number.isNaN(awayGoals) || homeGoals < 0 || awayGoals < 0 || homeGoals > 20 || awayGoals > 20) {
    return NextResponse.json({ error: "Resultado inválido" }, { status: 400 });
  }

  await prisma.prodeMatch.update({
    where: { id: matchId },
    data: { homeGoals, awayGoals },
  });

  return NextResponse.json({ ok: true });
}

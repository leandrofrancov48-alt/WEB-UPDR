import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calcPredictionPoints } from "@/lib/prode-scoring";

export async function POST(req: NextRequest) {
  const adminToken = process.env.PRODE_ADMIN_TOKEN;
  if (!adminToken) {
    return NextResponse.json({ error: "PRODE_ADMIN_TOKEN no configurado" }, { status: 503 });
  }

  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${adminToken}`) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const predictions = await prisma.prodePrediction.findMany({
    include: { match: true },
  });

  let updated = 0;

  for (const p of predictions) {
    if (p.match.homeGoals === null || p.match.awayGoals === null) continue;
    const points = calcPredictionPoints(
      { homeGoals: p.match.homeGoals, awayGoals: p.match.awayGoals },
      { homeScore: p.homeScore, awayScore: p.awayScore }
    );

    if (points !== p.points) {
      await prisma.prodePrediction.update({ where: { id: p.id }, data: { points } });
      updated += 1;
    }
  }

  return NextResponse.json({ ok: true, updated });
}

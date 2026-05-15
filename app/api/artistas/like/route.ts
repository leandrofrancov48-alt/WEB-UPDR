import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Debes iniciar sesión para dar me gusta" }, { status: 401 });
    }

    const { type, targetId } = await req.json();

    if (!type || !targetId) {
      return NextResponse.json({ error: "Faltan parámetros" }, { status: 400 });
    }

    if (type === "band") {
      const band = await prisma.band.findUnique({
        where: { id: targetId },
        select: { ownerId: true },
      });

      if (!band) {
        return NextResponse.json({ error: "Banda no encontrada" }, { status: 404 });
      }

      if (band.ownerId === user.id) {
        return NextResponse.json({ error: "No puedes darle me gusta a tu propia banda" }, { status: 403 });
      }

      const existingLike = await prisma.bandLike.findUnique({
        where: {
          userId_bandId: {
            userId: user.id,
            bandId: targetId,
          },
        },
      });

      if (existingLike) {
        await prisma.bandLike.delete({
          where: { id: existingLike.id },
        });
        const newCount = await prisma.bandLike.count({ where: { bandId: targetId } });
        return NextResponse.json({ liked: false, count: newCount });
      } else {
        await prisma.bandLike.create({
          data: {
            userId: user.id,
            bandId: targetId,
          },
        });
        const newCount = await prisma.bandLike.count({ where: { bandId: targetId } });
        return NextResponse.json({ liked: true, count: newCount });
      }
    } else if (type === "musician") {
      if (targetId === user.id) {
        return NextResponse.json({ error: "No puedes darte me gusta a ti mismo" }, { status: 403 });
      }

      const musician = await prisma.user.findUnique({
        where: { id: targetId, isMusician: true },
        select: { id: true },
      });

      if (!musician) {
        return NextResponse.json({ error: "Músico no encontrado" }, { status: 404 });
      }

      const existingLike = await prisma.musicianLike.findUnique({
        where: {
          userId_targetMusicianId: {
            userId: user.id,
            targetMusicianId: targetId,
          },
        },
      });

      if (existingLike) {
        await prisma.musicianLike.delete({
          where: { id: existingLike.id },
        });
        const newCount = await prisma.musicianLike.count({ where: { targetMusicianId: targetId } });
        return NextResponse.json({ liked: false, count: newCount });
      } else {
        await prisma.musicianLike.create({
          data: {
            userId: user.id,
            targetMusicianId: targetId,
          },
        });
        const newCount = await prisma.musicianLike.count({ where: { targetMusicianId: targetId } });
        return NextResponse.json({ liked: true, count: newCount });
      }
    }

    return NextResponse.json({ error: "Tipo inválido" }, { status: 400 });
  } catch (error: any) {
    console.error("Error toggling like:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

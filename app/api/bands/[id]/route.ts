import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();

    // Verify ownership
    const band = await prisma.band.findUnique({
      where: { id },
      select: { ownerId: true },
    });

    if (!band) {
      return NextResponse.json({ error: "Banda no encontrada" }, { status: 404 });
    }

    if (band.ownerId !== user.id) {
      return NextResponse.json({ error: "No tenés permiso para editar esta banda" }, { status: 403 });
    }

    // Update band
    const updatedBand = await prisma.band.update({
      where: { id },
      data: {
        name: body.name,
        bio: body.bio,
        genre: body.genre,
        instagram: body.instagram,
        spotify: body.spotify,
        youtube: body.youtube,
        profilePic: body.profilePic,
        coverPic: body.coverPic,
        city: body.city,
      },
    });

    return NextResponse.json({ success: true, band: updatedBand });
  } catch (error) {
    console.error("Error updating band:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

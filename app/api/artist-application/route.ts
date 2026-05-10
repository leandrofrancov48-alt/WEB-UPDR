import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const {
      artistName,
      genre,
      bio,
      instagram,
      spotify,
      youtube,
      address,
      street,
      number,
      city,
      postalCode,
      mediaUrls,
      contactPhone,
      showEmail,
      showName,
      showPhone,
    } = body;

    if (!artistName || !address) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const application = await prisma.artistApplication.create({
      data: {
        userId: user.id,
        artistName,
        genre,
        bio,
        instagram,
        spotify,
        youtube,
        address,
        street,
        number,
        city,
        postalCode,
        mediaUrls,
        contactPhone,
        showEmail,
        showName,
        showPhone,
      },
    });

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

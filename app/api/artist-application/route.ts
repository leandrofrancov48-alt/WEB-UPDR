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
      registrationType,
      artistName,
      genre,
      bio,
      instrument,
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
      showPersonalData,
      showContactPhone,
      profilePic,
      lat,
      lng,
    } = body;

    if (!artistName || !address) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    // 1. Create the Application (for moderation/tracking)
    const application = await prisma.artistApplication.create({
      data: {
        userId: user.id,
        artistName,
        genre: registrationType === "MUSICIAN" ? instrument : genre,
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
        status: "APPROVED", // Set to APPROVED immediately
        showEmail: body.showEmail || false,
        showName: showPersonalData,
        showPhone: showContactPhone,
        lat,
        lng,
      },
    });

    // 2. Update User Profile if it's a Musician
    if (registrationType === "MUSICIAN") {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          isMusician: true,
          instrument,
          bio,
          profilePic,
          showPersonalData,
          showContactPhone,
          latitude: lat,
          longitude: lng,
        },
      });
    }

    // 3. Create Band if it's a Band
    if (registrationType === "BAND") {
      await prisma.band.create({
        data: {
          name: artistName,
          bio,
          genre,
          instagram,
          spotify,
          youtube,
          profilePic,
          ownerId: user.id,
          city,
          latitude: lat,
          longitude: lng,
        },
      });
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Error creating application:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

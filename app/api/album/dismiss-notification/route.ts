import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }

    const body = await request.json();
    const { type } = body;

    let updateData = {};
    if (type === "20pts") {
      updateData = { show20PtsNotification: false };
    } else if (type === "40pts") {
      updateData = { show40PtsNotification: false };
    } else if (type === "pleno") {
      updateData = { showPlenoNotification: false };
    } else {
      return NextResponse.json({ error: "Tipo de notificación inválido" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error dismissing notification:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const { id } = await params;
    const { status } = await req.json(); // ACCEPTED or REJECTED

    if (!["ACCEPTED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }

    const membership = await prisma.bandMember.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!membership) return NextResponse.json({ error: "Membresía no encontrada" }, { status: 404 });
    if (membership.userId !== user.id) return NextResponse.json({ error: "No tenés permiso" }, { status: 403 });

    await prisma.bandMember.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating membership:", error);
    return NextResponse.json({ error: "Error interno" }, { status: 500 });
  }
}

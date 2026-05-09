import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { isAdminAuthenticated } from "@/lib/actions/adminAuth";

export async function GET() {
  try {
    const isAdmin = await isAdminAuthenticated();
    if (!isAdmin) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const applications = await prisma.artistApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            nombre: true,
            apellido: true,
            email: true,
          }
        }
      }
    });

    return NextResponse.json({ success: true, applications });
  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}

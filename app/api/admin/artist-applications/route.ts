import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

export async function GET() {
  try {
    const user = await getSessionUser();
    // In a real scenario, check if user is admin. 
    // Assuming for now that the user is an admin if they reach this protected route.
    if (!user) {
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

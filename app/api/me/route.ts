import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/session";
import { prisma } from "@/lib/db";

export async function GET() {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ user: null, isStaff: false });
  }

  const staff = await prisma.staffMember.findFirst({
    where: {
      OR: [
        { userId: user.id },
        { email: { equals: user.email.trim(), mode: "insensitive" } },
      ],
      activo: true,
    },
    select: { id: true, sector: true, rol: true },
  });

  return NextResponse.json({
    user,
    isStaff: Boolean(staff),
    staffSector: staff?.sector || null,
    staffRole: staff?.rol || null,
    isAdminPagos: staff?.rol === "ADMIN_PAGOS",
  });
}

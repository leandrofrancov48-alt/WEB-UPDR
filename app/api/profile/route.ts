import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,20}$/;
const PHONE_REGEX = /^\+\d{1,4}\d{6,15}$/;
const DNI_REGEX = /^\d{7,12}$/;

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { 
      id: true,
      email: true, 
      username: true, 
      nombre: true, 
      apellido: true, 
      celular: true, 
      dni: true, 
      birthDate: true,
      isMusician: true,
      artistDeletionReason: true,
      artistApplications: {
        orderBy: { createdAt: 'desc' },
        take: 1
      },
      bandsOwned: {
        where: { status: 'ACTIVE' }
      },
      memberships: {
        where: { status: 'PENDING' },
        include: { band: true }
      }
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = (await req.json()) as { username?: string; nombre?: string; apellido?: string; celular?: string; dni?: string; birthDate?: string };

  const username = (body.username ?? "").trim().toLowerCase();
  const nombre = (body.nombre ?? "").trim();
  const apellido = (body.apellido ?? "").trim();
  const celular = (body.celular ?? "").trim();
  const dni = (body.dni ?? "").replace(/\D/g, "");
  const birthDateRaw = (body.birthDate ?? "").trim();

  if (!USERNAME_REGEX.test(username)) {
    return NextResponse.json({ error: "Nombre de usuario inválido" }, { status: 400 });
  }
  if (!NAME_REGEX.test(nombre) || !NAME_REGEX.test(apellido)) {
    return NextResponse.json({ error: "Nombre y apellido inválidos" }, { status: 400 });
  }
  if (celular && !PHONE_REGEX.test(celular)) {
    return NextResponse.json({ error: "Celular inválido" }, { status: 400 });
  }
  if (dni && !DNI_REGEX.test(dni)) {
    return NextResponse.json({ error: "DNI inválido" }, { status: 400 });
  }

  const birthDate = birthDateRaw ? new Date(`${birthDateRaw}T00:00:00.000Z`) : null;
  if (!birthDate || Number.isNaN(birthDate.getTime()) || birthDate > new Date()) {
    return NextResponse.json({ error: "Fecha de nacimiento inválida" }, { status: 400 });
  }

  const existingUsername = await prisma.user.findFirst({ where: { username, id: { not: sessionUser.id } }, select: { id: true } });
  if (existingUsername) return NextResponse.json({ error: "Ese nombre de usuario ya está en uso" }, { status: 409 });

  if (dni) {
    const existingDni = await prisma.user.findFirst({ where: { dni, id: { not: sessionUser.id } }, select: { id: true } });
    if (existingDni) return NextResponse.json({ error: "Ese DNI ya está en uso" }, { status: 409 });
  }

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: { 
      username, 
      nombre, 
      apellido, 
      celular: celular || undefined, 
      dni: dni || undefined, 
      birthDate 
    },
  });

  return NextResponse.json({ ok: true });
}

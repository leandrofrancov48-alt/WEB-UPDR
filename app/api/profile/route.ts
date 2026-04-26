import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getSessionUser } from "@/lib/session";

const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const PHONE_REGEX = /^\+\d{1,4}\d{6,15}$/;
const DNI_REGEX = /^\d{7,12}$/;

export async function GET() {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: { email: true, nombre: true, apellido: true, celular: true, dni: true, birthDate: true },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const body = (await req.json()) as { nombre?: string; apellido?: string; celular?: string; dni?: string; birthDate?: string };

  const nombre = (body.nombre ?? "").trim();
  const apellido = (body.apellido ?? "").trim();
  const celular = (body.celular ?? "").trim();
  const dni = (body.dni ?? "").replace(/\D/g, "");
  const birthDateRaw = (body.birthDate ?? "").trim();

  if (!NAME_REGEX.test(nombre) || !NAME_REGEX.test(apellido)) {
    return NextResponse.json({ error: "Nombre y apellido inválidos" }, { status: 400 });
  }
  if (!PHONE_REGEX.test(celular)) {
    return NextResponse.json({ error: "Celular inválido" }, { status: 400 });
  }
  if (!DNI_REGEX.test(dni)) {
    return NextResponse.json({ error: "DNI inválido" }, { status: 400 });
  }

  const birthDate = birthDateRaw ? new Date(`${birthDateRaw}T00:00:00.000Z`) : null;
  if (!birthDate || Number.isNaN(birthDate.getTime()) || birthDate > new Date()) {
    return NextResponse.json({ error: "Fecha de nacimiento inválida" }, { status: 400 });
  }

  const existingDni = await prisma.user.findFirst({ where: { dni, id: { not: sessionUser.id } }, select: { id: true } });
  if (existingDni) return NextResponse.json({ error: "Ese DNI ya está en uso" }, { status: 409 });

  await prisma.user.update({
    where: { id: sessionUser.id },
    data: { nombre, apellido, celular, dni, birthDate },
  });

  return NextResponse.json({ ok: true });
}

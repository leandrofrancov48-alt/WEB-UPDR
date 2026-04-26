import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { appendUserToSheet } from "@/lib/sheets";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

type Mode = "login" | "register";
type Payload = {
  mode?: Mode;
  email?: string;
  nombre?: string;
  apellido?: string;
  celular?: string;
  dni?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com)$/i;
const DNI_REGEX = /^\d{7,12}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const PHONE_REGEX = /^\+\d{1,4}\d{6,15}$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const mode: Mode = body.mode === "register" ? "register" : "login";

    const email = (body.email ?? "").trim().toLowerCase();
    const dni = (body.dni ?? "").replace(/\D/g, "");
    const nombre = (body.nombre ?? "").trim();
    const apellido = (body.apellido ?? "").trim();
    const celular = (body.celular ?? "").replace(/\s+/g, "");
    const password = (body.password ?? "").trim();

    if (!EMAIL_REGEX.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
    if (!DNI_REGEX.test(dni)) return NextResponse.json({ error: "DNI inválido." }, { status: 400 });
    if (password.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });

    if (mode === "register") {
      if (!NAME_REGEX.test(nombre) || !NAME_REGEX.test(apellido)) {
        return NextResponse.json({ error: "Nombre y apellido solo aceptan letras." }, { status: 400 });
      }
      if (!PHONE_REGEX.test(celular)) {
        return NextResponse.json({ error: "Celular inválido. Debe incluir prefijo de país." }, { status: 400 });
      }

      const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { dni }] } });
      if (exists) {
        return NextResponse.json({ error: "Ya existe una cuenta con ese email o DNI." }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, nombre, apellido, celular, dni, passwordHash },
      });

      await appendUserToSheet({ email, nombre, apellido, celular, dni });
      await createSession(user.id);
      return NextResponse.json({ ok: true });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });
    if (user.dni !== dni) return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Credenciales inválidas." }, { status: 401 });

    await createSession(user.id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "No se pudo continuar" }, { status: 500 });
  }
}

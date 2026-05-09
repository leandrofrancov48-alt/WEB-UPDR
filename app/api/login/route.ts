import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { appendUserToSheet } from "@/lib/sheets";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/session";

type Mode = "login" | "register";
type Payload = {
  mode?: Mode;
  email?: string;
  username?: string;
  login?: string;
  nombre?: string;
  apellido?: string;
  celular?: string;
  dni?: string;
  birthDate?: string;
  password?: string;
};

const EMAIL_REGEX = /^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com)$/i;
const DNI_REGEX = /^\d{7,12}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9._-]{3,20}$/;
const PHONE_REGEX = /^\+\d{1,4}\d{6,15}$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const mode: Mode = body.mode === "register" ? "register" : "login";

    const login = (body.login ?? body.email ?? "").trim().toLowerCase();
    const email = (body.email ?? "").trim().toLowerCase();
    const dni = (body.dni ?? "").replace(/\D/g, "");
    const username = (body.username ?? "").trim().toLowerCase();
    const nombre = (body.nombre ?? "").trim();
    const apellido = (body.apellido ?? "").trim();
    const celular = (body.celular ?? "").replace(/\s+/g, "");
    const birthDateRaw = (body.birthDate ?? "").trim();
    const password = (body.password ?? "").trim();

    if (password.length < 8) return NextResponse.json({ error: "La contraseña debe tener al menos 8 caracteres." }, { status: 400 });

    if (mode === "register") {
      if (!EMAIL_REGEX.test(email)) return NextResponse.json({ error: "Email inválido." }, { status: 400 });
      if (!USERNAME_REGEX.test(username)) {
        return NextResponse.json({ error: "Nombre de usuario inválido. Usá 3-20 caracteres (letras, números, punto, guión o guión bajo)." }, { status: 400 });
      }
      if (!NAME_REGEX.test(nombre) || !NAME_REGEX.test(apellido)) {
        return NextResponse.json({ error: "Nombre y apellido solo aceptan letras." }, { status: 400 });
      }

      const birthDate = birthDateRaw ? new Date(`${birthDateRaw}T00:00:00.000Z`) : null;
      if (!birthDate || Number.isNaN(birthDate.getTime()) || birthDate > new Date()) {
        return NextResponse.json({ error: "Fecha de nacimiento inválida." }, { status: 400 });
      }

      const exists = await prisma.user.findFirst({ where: { OR: [{ email }, { username }] } });
      if (exists) {
        return NextResponse.json({ error: "Ya existe una cuenta con ese email o nombre de usuario." }, { status: 409 });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { 
          email, 
          username, 
          nombre, 
          apellido, 
          celular: celular || null, 
          dni: dni || null, 
          birthDate, 
          passwordHash 
        },
      });

      try {
        await appendUserToSheet({ email, nombre, apellido, celular: celular || null, dni: dni || null });
      } catch (sheetError) {
        console.error("Error updating sheet:", sheetError);
      }
      await createSession(user.id);
      return NextResponse.json({ ok: true });
    }

    const isEmailLogin = login.includes("@");
    const user = await prisma.user.findFirst({
      where: isEmailLogin ? { email: login } : { username: login },
    });

    if (!user) {
      return NextResponse.json({ error: isEmailLogin ? "Ese email no está registrado." : "Ese nombre de usuario no existe." }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return NextResponse.json({ error: "Contraseña incorrecta." }, { status: 401 });

    await createSession(user.id);
    return NextResponse.json({ ok: true });
    } catch (e: any) {
      console.error("Registration error:", e);
      return NextResponse.json({ error: `No se pudo continuar: ${e.message || "Error desconocido"}` }, { status: 500 });
    }
}

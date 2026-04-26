import { NextResponse } from "next/server";
import { appendUserToSheet } from "@/lib/sheets";
import { encodeSession, SESSION_COOKIE, type SessionUser } from "@/lib/session";

type Payload = Partial<SessionUser> & { mode?: "login" | "register" };

const EMAIL_REGEX = /^[^\s@]+@(gmail\.com|outlook\.com|hotmail\.com|yahoo\.com|icloud\.com)$/i;
const DNI_REGEX = /^\d{7,12}$/;
const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ' -]+$/;
const PHONE_REGEX = /^\+\d{1,4}\d{6,15}$/;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const mode = body.mode === "register" ? "register" : "login";

    const user: SessionUser = {
      email: (body.email ?? "").trim().toLowerCase(),
      nombre: (body.nombre ?? "").trim(),
      apellido: (body.apellido ?? "").trim(),
      celular: (body.celular ?? "").replace(/\s+/g, ""),
      dni: (body.dni ?? "").replace(/\D/g, ""),
    };

    if (!user.email || !user.dni) {
      return NextResponse.json({ error: "Ingresá email y DNI" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(user.email)) {
      return NextResponse.json({ error: "Email inválido (gmail/outlook/hotmail/yahoo/icloud)." }, { status: 400 });
    }

    if (!DNI_REGEX.test(user.dni)) {
      return NextResponse.json({ error: "DNI inválido. Solo números." }, { status: 400 });
    }

    if (mode === "register") {
      if (!user.nombre || !user.apellido || !user.celular) {
        return NextResponse.json({ error: "Para registrarte completá todos los campos" }, { status: 400 });
      }

      if (!NAME_REGEX.test(user.nombre) || !NAME_REGEX.test(user.apellido)) {
        return NextResponse.json({ error: "Nombre y apellido solo aceptan letras." }, { status: 400 });
      }

      if (!PHONE_REGEX.test(user.celular)) {
        return NextResponse.json({ error: "Celular inválido. Debe incluir prefijo de país." }, { status: 400 });
      }

      await appendUserToSheet(user);
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, encodeSession(user), {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
    });

    return res;
  } catch {
    return NextResponse.json({ error: "No se pudo continuar" }, { status: 500 });
  }
}

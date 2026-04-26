import { NextResponse } from "next/server";
import { appendUserToSheet } from "@/lib/sheets";
import { encodeSession, SESSION_COOKIE, type SessionUser } from "@/lib/session";

type Payload = Partial<SessionUser> & { mode?: "login" | "register" };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Payload;
    const mode = body.mode === "register" ? "register" : "login";

    const user: SessionUser = {
      email: (body.email ?? "").trim().toLowerCase(),
      nombre: (body.nombre ?? "").trim(),
      apellido: (body.apellido ?? "").trim(),
      celular: (body.celular ?? "").trim(),
      dni: (body.dni ?? "").trim(),
    };

    if (!user.email || !user.dni) {
      return NextResponse.json({ error: "Ingresá email y DNI" }, { status: 400 });
    }

    if (mode === "register" && (!user.nombre || !user.apellido || !user.celular)) {
      return NextResponse.json({ error: "Para registrarte completá todos los campos" }, { status: 400 });
    }

    if (mode === "register") {
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

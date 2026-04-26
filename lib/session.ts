import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export const SESSION_COOKIE = "updr_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 30;

export type SessionUser = {
  id: string;
  email: string;
  nombre: string;
  apellido: string;
  celular: string;
  dni: string;
};

function sessionExpiryDate() {
  return new Date(Date.now() + SESSION_MAX_AGE * 1000);
}

export async function createSession(userId: string) {
  const token = randomUUID();
  const expiresAt = sessionExpiryDate();

  await prisma.session.create({ data: { token, userId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (token) await prisma.session.deleteMany({ where: { token } });
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) return null;

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } });
    cookieStore.delete(SESSION_COOKIE);
    return null;
  }

  return {
    id: session.user.id,
    email: session.user.email,
    nombre: session.user.nombre,
    apellido: session.user.apellido,
    celular: session.user.celular,
    dni: session.user.dni,
  };
}

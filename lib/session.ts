import { cookies } from "next/headers";

export const SESSION_COOKIE = "updr_session";

export type SessionUser = {
  email: string;
  nombre: string;
  apellido: string;
  celular: string;
  dni: string;
};

export function encodeSession(user: SessionUser) {
  return Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
}

export function decodeSession(raw?: string | null): SessionUser | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8"));
    if (!parsed?.email || !parsed?.nombre || !parsed?.apellido || !parsed?.celular || !parsed?.dni) {
      return null;
    }
    return parsed as SessionUser;
  } catch {
    return null;
  }
}

export async function getSessionUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  return decodeSession(token);
}

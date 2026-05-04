import { SessionUser } from "@/lib/session";

export function isProdeAllowed(user: SessionUser | null) {
  if (!user) return false;

  const raw = process.env.PRODE_BETA_ALLOW_EMAILS ?? "";
  const allow = raw
    .split(",")
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);

  if (allow.length === 0) return false;
  return allow.includes(user.email.toLowerCase());
}

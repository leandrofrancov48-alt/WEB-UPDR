import { NextRequest, NextResponse } from "next/server";
import { decodeSession, SESSION_COOKIE } from "@/lib/session";

function unauthorizedResponse() {
  return new NextResponse("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="UPDR Admin"',
    },
  });
}

export function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/control-updr-admin")) {
    const user = process.env.ADMIN_USER;
    const pass = process.env.ADMIN_PASSWORD;

    if (!user || !pass) {
      return new NextResponse("Admin auth is not configured", { status: 503 });
    }

    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Basic ")) {
      return unauthorizedResponse();
    }

    const base64 = auth.split(" ")[1] ?? "";
    const decoded = Buffer.from(base64, "base64").toString("utf8");
    const [reqUser, reqPass] = decoded.split(":");

    if (reqUser !== user || reqPass !== pass) {
      return unauthorizedResponse();
    }

    return NextResponse.next();
  }

  const isPublic = pathname === "/login" || pathname.startsWith("/api/login") || pathname.startsWith("/_next") || pathname === "/favicon.ico";
  if (isPublic) return NextResponse.next();

  const session = decodeSession(req.cookies.get(SESSION_COOKIE)?.value);
  if (!session) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

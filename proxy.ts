import { NextRequest, NextResponse } from "next/server";

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

  if (!pathname.startsWith("/control-updr-admin")) {
    return NextResponse.next();
  }

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

export const config = {
  matcher: ["/control-updr-admin/:path*"],
};

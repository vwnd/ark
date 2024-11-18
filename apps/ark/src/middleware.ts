import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {
  AUTH_COOKIE,
  getAuthCookie,
  REFRESH_COOKIE,
} from "./app/auth/auth-cookie";

const unauthenticatedRoutes = ["/auth/login"];

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();

  const authenticated = !!cookieStore.get(AUTH_COOKIE)?.value;

  if (!authenticated && cookieStore.get(REFRESH_COOKIE)) {
    const refreshRes = await fetch(`${process.env.API_URL}/auth/refresh`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      method: "POST",
    });
    const authCookies = getAuthCookie(refreshRes);
    if (authCookies?.accessToken) {
      const response = NextResponse.redirect(request.url);
      response.cookies.set(authCookies.accessToken);
      return response;
    }
  }

  if (
    !authenticated &&
    !unauthenticatedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route)
    )
  ) {
    return Response.redirect(new URL("/auth/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

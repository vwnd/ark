"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAuthCookie } from "../auth-cookie";

export default async function login(_prevState: unknown, formData: FormData) {
  const cookieStore = await cookies();
  const res = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(Object.fromEntries(formData)),
  });
  if (!res.ok) {
    return { error: "Credentials are not valid." };
  }
  const cookie = getAuthCookie(res);
  if (cookie?.accessToken) {
    cookieStore.set(cookie.accessToken);
  }
  if (cookie?.refreshToken) {
    cookieStore.set(cookie.refreshToken);
  }
  redirect("/");
}

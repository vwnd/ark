"use server";

import { cookies } from "next/headers";

interface UserInfo {
  id: string;
  name: string;
  email: string;
}

export async function currentUser(): Promise<UserInfo | undefined> {
  const cookieStore = await cookies();

  const query = `
    query UserInfo {
      userInfo {
        id
        name
        email
      }
  }`;
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
    body: JSON.stringify({ query }),
  });

  const { data } = await response.json();

  const userInfo = data.userInfo as UserInfo;

  return userInfo;
}

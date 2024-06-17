import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    uid: string;
    role: string;
    expires: ISODateString;
  }
}

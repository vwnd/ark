import { NuxtAuthHandler } from "#auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { db } from "~/server/database/drizzle";
import { users } from "~/server/database/schema";
import { eq } from "drizzle-orm";

if (
  !process.env.GOOGLE_OAUTH_CLIENT_ID ||
  !process.env.GOOGLE_OAUTH_CLIENT_SECRET ||
  !process.env.GITHUB_OAUTH_CLIENT_ID ||
  !process.env.GITHUB_OAUTH_CLIENT_SECRET
) {
  throw new Error(
    "Missing OAuth providers configuration. Please check your environment variables."
  );
}

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET || "my-auth-secret",
  providers: [
    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    }),
    // @ts-expect-error
    GitHubProvider.default({
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      const { email, name, image: avatar } = user;

      if (!email || !name || !avatar) {
        console.error("Not enough information to authenticate user", user);
        return false;
      }

      const existingUser = await db.query.users.findFirst({
        where: (user, { eq }) => eq(user.email, user.email),
      });

      if (!existingUser) {
        await db.insert(users).values({ email, name, avatar });
      }

      return true;
    },
    jwt: async ({ token, user }) => {
      console.log("JWT CALLBACK", user, token);
      const userData =
        user && user.email
          ? await db.query.users.findFirst({
              where: eq(users.email, user.email),
            })
          : null;

      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.jwt = user ? (user as any).access_token || "" : "";
        token.id = userData ? userData.id || "" : "";
        token.role = user ? (user as any).role || "" : "";
      }
      return Promise.resolve(token);
    },
    session: async ({ session, token }) => {
      (session as any).role = token.role;
      (session as any).uid = token.id;
      return Promise.resolve(session);
    },
  },
  pages: {
    signIn: "/login",
  },
});

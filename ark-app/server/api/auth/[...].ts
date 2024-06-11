import { NuxtAuthHandler } from "#auth";
import { eq } from "drizzle-orm";
import GoogleProvider from "next-auth/providers/google";
import { db } from "~/server/database/drizzle";
import { users } from "~/server/database/schema";

if (
  !process.env.GOOGLE_OAUTH_CLIENT_ID ||
  !process.env.GOOGLE_OAUTH_CLIENT_SECRET
) {
  throw new Error(
    "Missing GOOGLE_OAUTH_CLIENT_ID or GOOGLE_OAUTH_CLIENT_SECRET environment variables"
  );
}

export default NuxtAuthHandler({
  providers: [
    // @ts-expect-error
    GoogleProvider.default({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
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
  },
  pages: {
    signIn: "/login",
  },
});

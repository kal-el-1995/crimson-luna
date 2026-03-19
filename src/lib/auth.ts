import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
    Credentials({
      id: "demo",
      name: "Demo",
      credentials: {},
      async authorize() {
        return {
          id: "demo-user-1",
          name: "Luna Demo",
          email: "luna@crimsonluna.demo",
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if (user.id === "demo-user-1") {
          token.demoExpiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
        }
      }
      // Fallback for tokens created before this callback was added
      if (!token.id) token.id = token.sub;
      return token;
    },
    session({ session, token }) {
      session.user.id = (token.id ?? token.sub) as string;
      if (token.demoExpiresAt) {
        (session as any).demoExpiresAt = token.demoExpiresAt;
      }
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const publicPaths = ["/"];
      const isPublic = publicPaths.includes(nextUrl.pathname);

      // Expired demo session → treat as unauthenticated
      if (
        isLoggedIn &&
        (auth as any)?.demoExpiresAt &&
        Date.now() > (auth as any).demoExpiresAt
      ) {
        return Response.redirect(new URL("/", nextUrl));
      }

      if (!isPublic && !isLoggedIn) {
        return Response.redirect(new URL("/", nextUrl));
      }
      return true;
    },
  },
  session: {
    strategy: "jwt",
  },
});

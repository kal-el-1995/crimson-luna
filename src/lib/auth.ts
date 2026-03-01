import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
      if (user) token.id = user.id;
      // Fallback for tokens created before this callback was added
      if (!token.id) token.id = token.sub;
      return token;
    },
    session({ session, token }) {
      session.user.id = (token.id ?? token.sub) as string;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const publicPaths = ["/"];
      const isPublic = publicPaths.includes(nextUrl.pathname);

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

import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      async authorize(user) {
        if (user) {
          return user;
        }
        return null;
      },
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID as string,
      clientSecret: process.env.AUTH_GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 2 * 60 * 60, // 2 hour
  },
  pages: {
    signIn: '/login',
    error: '/error',
  },
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        return profile?.email_verified &&
          profile.email?.endsWith('@example.com')
          ? true
          : false;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});

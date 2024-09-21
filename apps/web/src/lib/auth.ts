import axios from 'axios';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { axiosInstance } from './axios';

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
    async signIn({ account, user }: any) {
      if (account?.provider === 'google') {
        const accessToken = account?.access_token;
        console.log('Google Access Token', accessToken);

        const { data } = await axiosInstance.post('/auth/google', {
          accessToken,
        });
        console.log(data);

        user.id = data.data.id;
        user.name = data.data.name;
        user.role = data.data.role;
        user.provider = data.data.provider;
        user.token = data.token;
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

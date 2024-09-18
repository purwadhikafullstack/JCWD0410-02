import { JWT_SECRET } from '@/config';
import prisma from '@/prisma';
import { Role } from '@prisma/client';
import { OAuth2Client } from 'google-auth-library';
import { sign } from 'jsonwebtoken';
import { jwtDecode } from 'jwt-decode';

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage',
);

interface LoginGoogleArgs {
  email: string;
  name: string;
  imageUrl: string;
}

export const getGoogleTokenService = async (code: string, role: Role) => {
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    const idToken = tokens.id_token;

    const decode = jwtDecode(idToken as string) as LoginGoogleArgs;

    const existingUser = await prisma.user.findFirst({
      where: { email: decode.email },
    });

    if (
      existingUser &&
      existingUser.imageUrl &&
      existingUser.imageUrl.includes('googleusercontent.com')
    ) {
      const token = sign({ id: existingUser.id }, JWT_SECRET!, {
        expiresIn: '2h',
      });

      return {
        message: 'login google success',
        data: existingUser,
        token: token,
      };
    }

    if (existingUser?.password) {
      throw new Error('Please login using email');
    }

    const newUser = await prisma.user.create({
      data: {
        email: decode.email,
        name: decode.name,
        imageUrl: decode.imageUrl,
        isVerified: true,
        role,
      },
    });

    const token = sign({ id: newUser.id }, JWT_SECRET!, {
      expiresIn: '2h',
    });

    return {
      message: 'Login by Google Success!',
      data: newUser,
      token: token,
    };
  } catch (error) {
    throw error;
  }
};

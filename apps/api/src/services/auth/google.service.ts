import { JWT_SECRET } from '@/config';
import { getUserInfo } from '@/lib/getUserInfo';
import { transporter } from '@/lib/nodemailer';
import prisma from '@/prisma';
import { sign } from 'jsonwebtoken';

export const loginWithGoogleService = async (accessToken: string) => {
  try {
    const userInfo = await getUserInfo(accessToken);

    if (!userInfo) {
      return {
        status: 400,
        message: 'Failed to get user info from google',
      };
    }

    const user = await prisma.user.findFirst({
      where: { email: userInfo.email },
    });

    if (user && user.provider !== 'GOOGLE') {
      throw new Error('Provider not Google');
    }
    let newUser;

    if (!user) {
      newUser = await prisma.user.create({
        data: {
          email: userInfo.email,
          name: userInfo.name,
          isVerified: true,
          provider: 'GOOGLE',
        },
      });

      await transporter.sendMail({
        from: 'Admin',
        to: userInfo.email,
        subject: 'Welcome to EaseCoz',
        html: `<p>Welcome to EaseCoz</p>`,
      });
    }

    const token = sign({ id: newUser?.id || user?.id }, JWT_SECRET!, {
      expiresIn: '2h',
    });

    return {
      message: `Hello ${userInfo.name}`,
      data: newUser || user,
      token,
    };
  } catch (error) {
    throw error;
  }
};

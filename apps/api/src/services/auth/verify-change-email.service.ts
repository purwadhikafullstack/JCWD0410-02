import { BASE_URL_FE } from '@/config';
import { transporter } from '@/lib/nodemailer';
import prisma from '@/prisma';
import fs from 'fs';
import Handlebars from 'handlebars';
import path from 'path';

export const verifyChangeEmailService = async (
  userId: number,
  email: string,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, isVerified: true, email },
    });

    if (user) {
      throw new Error('Email already verified');
    }
    const verifyChangeEmailUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
        email: email,
      },
    });

    const link = BASE_URL_FE + '/login';

    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/verify-change-email-success.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({
      newEmail: email,
      link: link,
    });

    await transporter.sendMail({
      from: 'Admin',
      to: email,
      subject: 'Change Email Verification Successful',
      html: htmlToSend,
    });

    return {
      message: 'Thank You! Your email has been verified',
      data: verifyChangeEmailUser,
    };
  } catch (error) {
    console.error('Error in verifyService:', error);
    throw error;
  }
};

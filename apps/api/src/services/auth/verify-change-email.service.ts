import fs from 'fs';
import path from 'path';
import prisma from '@/prisma';
import Handlebars from 'handlebars';
import { hashPassword } from '@/lib/bcrypt';
import { transporter } from '@/lib/nodemailer';
import { BASE_URL_FE } from '@/config';

export const verifyChangeEmailService = async (userId: number) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId, isVerified: true },
    });

    if (!user) {
      throw new Error('Email already verified');
    }
    const verifyChangeEmailUser = await prisma.user.update({
      where: { id: userId },
      data: {
        isVerified: true,
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
      name: user.name,
      link: link,
    });

    await transporter.sendMail({
      from: 'Admin',
      to: user.email,
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

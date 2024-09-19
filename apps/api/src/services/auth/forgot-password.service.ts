import prisma from '@/prisma';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import Handlebars from 'handlebars';
import { BASE_URL_FE, JWT_SECRET } from '@/config';
import { transporter } from '@/lib/nodemailer';

export const forgotPasswordService = async (body: Pick<User, 'email'>) => {
  try {
    const { email } = body;
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      throw new Error('Invalid email address');
    }

    const token = sign({ id: user.id }, JWT_SECRET!, {
      expiresIn: '60m',
    });

    const link = BASE_URL_FE + `/reset-password/${token}`;

    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/forgot-password.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ name: user?.name, link: link });

    await transporter.sendMail({
      from: 'Admin',
      to: user.email,
      subject: 'Reset Password',
      html: htmlToSend,
    });

    return {
      message: `email to reset password has been sent to ${email}`,
      email,
    };
  } catch (error) {
    throw error;
  }
};

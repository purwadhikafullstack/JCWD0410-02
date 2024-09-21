import { BASE_URL_FE, JWT_SECRET } from '@/config';
import { transporter } from '@/lib/nodemailer';
import prisma from '@/prisma';
import fs from 'fs';
import { sign } from 'jsonwebtoken';
import path from 'path';
import Handlebars from 'handlebars';

export const changeEmailService = async (userId: number, email: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (email && email !== user.email) {
      const userEmail = await prisma.user.findFirst({
        where: { email: { equals: email } },
      });
      if (userEmail) {
        throw new Error('Email already in use');
      }
    }

    const updateEmail = await prisma.user.update({
      where: { id: userId },
      data: { email, isVerified: false },
    });

    const token = sign(
      { id: Number(updateEmail!.id) || user!.id },
      JWT_SECRET!,
      { expiresIn: '60m' },
    );

    const link = BASE_URL_FE + `/verify-email/${token}`;

    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/change-email.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ name: user.name, link: link });

    await transporter.sendMail({
      from: 'Admin',
      to: user.email,
      subject: 'Please verify your email',
      html: htmlToSend,
    });
    return {
      message: `email to change email has been sent to ${email}`,
    };
  } catch (error) {
    throw error;
  }
};

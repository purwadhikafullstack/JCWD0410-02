import prisma from '@/prisma';
import { User } from '@prisma/client';
import { sign } from 'jsonwebtoken';
import { BASE_URL_FE, JWT_SECRET } from '@/config';
import path from 'path';
import fs from 'fs';
import Handlebars from 'handlebars';
import { transporter } from '@/lib/nodemailer';

export const registerService = async (body: User) => {
  try {
    const { email } = body;

    const existingUser = await prisma.user.findFirst({
      where: { email },
    });

    const checkIsDelete = await prisma.user.findFirst({
      where: { email, isDeleted: true },
    });

    if (existingUser && !checkIsDelete) {
      throw new Error('Email already exist');
    }

    let newUser;

    if (!existingUser) {
      newUser = await prisma.user.create({
        data: {
          ...body,
        },
      });
    }

    if (checkIsDelete) {
      newUser = await prisma.user.update({
        where: { id: existingUser?.id },
        data: {
          ...body,
          isDeleted: false,
          isVerified: false,
        },
      });
    }

    const token = sign(
      { id: Number(newUser!.id) || existingUser!.id },
      JWT_SECRET!,
      {
        expiresIn: '30m',
      },
    );

    const link = BASE_URL_FE + `/verification?token=${token}`;

    const emailTemplatePath = path.join(
      __dirname,
      '../../../templates/verify.hbs',
    );

    const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf-8');

    const template = Handlebars.compile(emailTemplateSource);
    const htmlToSend = template({ name: newUser?.name, link: link });

    await transporter.sendMail({
      from: 'Admin',
      to: email,
      subject: 'Please verify your account',
      html: htmlToSend,
    });

    return {
      message: 'Register success, please check your email',
      token,
    };
  } catch (error) {
    throw error;
  }
};

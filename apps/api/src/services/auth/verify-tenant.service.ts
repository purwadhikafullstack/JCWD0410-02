import fs from 'fs';
import path from 'path';
import prisma from '@/prisma';
import Handlebars from 'handlebars';
import { hashPassword } from '@/lib/bcrypt';
import { transporter } from '@/lib/nodemailer';
import { BASE_URL_FE } from '@/config';
import { Prisma, Tenant } from '@prisma/client';

export const verifyTenantService = async (
  userId: number,
  password: string,
  body: Tenant,
) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof password !== 'string') {
      throw new Error('password must be string');
    }

    const hashedPassword = await hashPassword(password);

    return await prisma.$transaction(
      async (prisma: Prisma.TransactionClient) => {
        const verifyUser = await prisma.user.update({
          where: { id: userId },
          data: {
            password: hashedPassword,
            isVerified: true,
          },
        });

        const { name, phone, bankName, bankNumber } = body;

        const newTenant = await prisma.tenant.create({
          data: {
            bankName,
            bankNumber,
            name,
            phone,
            user: { connect: { id: userId } },
          },
        });

        const link = BASE_URL_FE + '/login';

        const emailTemplatePath = path.join(
          __dirname,
          '../../../templates/welcome.hbs',
        );

        const emailTemplateSource = fs.readFileSync(emailTemplatePath, 'utf8');

        const template = Handlebars.compile(emailTemplateSource);
        const htmlToSend = template({ name: user.name, link: link });

        await transporter.sendMail({
          from: 'Admin',
          to: user.email,
          subject: 'Welcome to EaseCoz!',
          html: htmlToSend,
        });

        return {
          message: 'Thank You! Your email has been verified',
          data: { verifyUser, newTenant },
        };
      },
    );
  } catch (error) {
    console.error('Error in verifyService:', error);
    throw error;
  }
};

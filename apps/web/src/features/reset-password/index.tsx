'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useResetPassword from '@/hooks/api/auth/useResetPassword';
import { useFormik } from 'formik';
import Image from 'next/image';
import { FC } from 'react';
import { ResetPasswordSchema } from './schemas/ResetPasswordSchema';

interface ResetPasswordPageProps {
  token: string;
}

const ResetPasswordPage: FC<ResetPasswordPageProps> = ({ token }) => {
  const { mutateAsync: resetPassword, isPending } = useResetPassword(token);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      await resetPassword(values);
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative h-auto lg:h-auto lg:w-1/2 overflow-hidden">
          <Image
            src="/resetPasswordImage.svg"
            alt="reset Password Page Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8">
          <Card>
            <CardHeader className="mb-6 text-center lg:text-left">
              <CardTitle className="text-3xl font-bold text-center text-[#336aea]">
                Enter your new password
              </CardTitle>
              <p className="text-sm text-center">
                Choose a strong password with at least 6 characters
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Your Password"
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {!!formik.touched.password && !!formik.errors.password ? (
                      <p className="text-xs text-red-500">
                        {formik.errors.password}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="confirmPassword">Password</Label>
                    <Input
                      name="confirmPassword"
                      type="confirmPassword"
                      placeholder="Confirm Your Password"
                      value={formik.values.confirmPassword}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {!!formik.touched.confirmPassword &&
                    !!formik.errors.confirmPassword ? (
                      <p className="text-xs text-red-500">
                        {formik.errors.confirmPassword}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Button className="mt-7 w-full" disabled={isPending}>
                  {isPending ? 'Loading...' : 'Change password'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ResetPasswordPage;

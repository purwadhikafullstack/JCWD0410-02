'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useChangeEmail from '@/hooks/api/auth/useChangeEmail';
import { useFormik } from 'formik';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEmailSchema } from './schemas/ChangeEmailSchema';

const ChangeEmailPage = () => {
  const { mutateAsync: forgotPassword, isPending } = useChangeEmail();

  const formik = useFormik({
    initialValues: {
      email: '',
    },
    validationSchema: ChangeEmailSchema,
    onSubmit: async (values) => {
      await forgotPassword(values);
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative h-auto lg:h-auto lg:w-1/2 overflow-hidden">
          <Image
            src="/forgotPasswordImage.svg"
            alt="forgot Password Page Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8">
          <Card>
            <CardHeader className="mb-6 text-center lg:text-left">
              <CardTitle className="text-3xl font-bold text-center text-[#336aea]">
                Change your email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {!!formik.touched.email && !!formik.errors.email ? (
                      <p className="text-xs text-red-500">
                        {formik.errors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Button className="mt-7 w-full" disabled={isPending}>
                  {isPending ? 'Loading...' : 'Change Email'}
                </Button>
              </form>
              <Link href="/login" className="mt-3 flex justify-center text-sm">
                Back to Login
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default ChangeEmailPage;

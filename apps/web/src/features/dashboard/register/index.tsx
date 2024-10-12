'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormik } from 'formik';
import { RegisterSchema } from './schemas/RegisterSchema';
import useRegister from '@/hooks/api/auth/useRegister';
import Link from 'next/link';
import { Role } from '@/types/user';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const RegisterDashboardPage = () => {
  const { mutateAsync: register, isPending } = useRegister();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      role: Role.TENANT,
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values) => {
      await register(values);
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative h-auto lg:h-auto lg:w-1/2 overflow-hidden">
          <Image
            src="/registerPageImage.svg"
            alt="Register Page Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8">
          <Card>
            <CardHeader className="mb-6 text-center lg:text-left">
              <CardTitle className="text-3xl font-bold text-center">
                Join EaseCoz
              </CardTitle>
              <Link href="/login" className="mt-3 flex justify-center text-xs">
                Already have an account? Login
              </Link>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Name of the owner</Label>
                    <Input
                      name="name"
                      type="text"
                      placeholder="Name of the owner"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {!!formik.touched.name && !!formik.errors.name ? (
                      <p className="text-xs text-red-500">
                        {formik.errors.name}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="email">Business email</Label>
                    <Input
                      name="email"
                      type="email"
                      placeholder="Your business email"
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
                  {isPending ? 'Loading...' : 'Join'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default RegisterDashboardPage;

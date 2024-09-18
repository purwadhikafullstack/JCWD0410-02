'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import useLoginByGoogle from '@/hooks/api/auth/useGoogleAuth';
import useLogin from '@/hooks/api/auth/useLogin';
import { useFormik } from 'formik';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';
import { LoginSchema } from './schemas/LoginSchema';
import { signIn } from 'next-auth/react';

const LoginPage = () => {
  const { mutateAsync: login, isPending: isLoginPending } = useLogin();
  // const { mutateAsync: google, isPending: isGoogleLoginPending } =
  //   useLoginByGoogle();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      await login(values);
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative h-auto lg:h-auto lg:w-1/2 overflow-hidden">
          <Image
            src="/loginPage.svg"
            alt="Login Page Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8">
          <Card>
            <CardHeader className="mb-6 text-center lg:text-left">
              <CardTitle className="text-3xl font-bold text-center text-[#336aea]">
                Welcome back!
              </CardTitle>
              <p className="text-center text-base">Log in to your EaseCoz</p>
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
                </div>

                <Button className="mt-7 w-full" disabled={isLoginPending}>
                  {isLoginPending ? 'Loading...' : 'Log in'}
                </Button>
                <div className="relative flex py-5 items-center">
                  <div className="flex-grow border-t border-gray-400"></div>
                  <span className="flex-shrink mx-4 text-gray-400">Or</span>
                  <div className="flex-grow border-t border-gray-400"></div>
                </div>
                <div>
                  <Button
                    className="w-full text-base bg-transparent text-black hover:bg-[#f3f4f6] gap-3"
                    onClick={() => signIn('google')}
                  >
                    <FcGoogle size={25} />
                    Continue with Google
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;

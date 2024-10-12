'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import useVerificationTenant from '@/hooks/api/auth/useVerificationTenant';
import { useFormik } from 'formik';
import Image from 'next/image';
import { FC } from 'react';
import { VerificationTenantSchema } from './schemas/VerificationTenantSchema';
import FormInput from '@/components/FormInput';

interface VerificationTenantPageProps {
  token: string;
}

const VerificationTenantPage: FC<VerificationTenantPageProps> = ({ token }) => {
  const { mutateAsync: verification, isPending } = useVerificationTenant(token);
  console.log(token);

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
      name: '',
      phone: '',
      bankName: '',
      bankNumber: '',
    },
    validationSchema: VerificationTenantSchema,
    onSubmit: async (values) => {
      await verification({
        ...values,
        bankNumber: Number(values.bankNumber),
        phone: String(values.phone),
      });
    },
  });

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative h-auto lg:h-auto lg:w-1/2 overflow-hidden">
          <Image
            src="/verificationTenantPage.svg"
            alt="Verification Page Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8">
          <Card>
            <CardHeader className="mb-6 text-center lg:text-left">
              <CardTitle className="text-3xl font-bold text-center text-[#336aea]">
                Complete Registration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={formik.handleSubmit}>
                <div className="grid gap-4">
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex flex-col space-y-1.5">
                      <FormInput
                        name="name"
                        label="Business Name"
                        type="text"
                        placeholder="Business Name"
                        value={formik.values.name}
                        isError={!!formik.touched.name && !!formik.errors.name}
                        error={formik.errors.name}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <FormInput
                        name="phone"
                        label="Business Phone"
                        type="number"
                        placeholder="Business Phone"
                        value={formik.values.phone}
                        isError={
                          !!formik.touched.phone && !!formik.errors.phone
                        }
                        error={formik.errors.phone}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="flex flex-col space-y-1.5">
                      <FormInput
                        name="bankName"
                        label="Bank Name"
                        type="text"
                        placeholder="Bank Name"
                        value={formik.values.bankName}
                        isError={
                          !!formik.touched.bankName && !!formik.errors.bankName
                        }
                        error={formik.errors.bankName}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <FormInput
                        name="bankNumber"
                        label="Bank Number"
                        type="number"
                        placeholder="Bank Number"
                        value={formik.values.bankNumber}
                        isError={
                          !!formik.touched.bankNumber &&
                          !!formik.errors.bankNumber
                        }
                        error={formik.errors.bankNumber}
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormInput
                      name="password"
                      label="Password"
                      type="password"
                      placeholder="Your password"
                      value={formik.values.password}
                      isError={
                        !!formik.touched.password && !!formik.errors.password
                      }
                      error={formik.errors.password}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <FormInput
                      name="confirmPassword"
                      label="Confirm Password"
                      type="password"
                      placeholder="Your confirm password"
                      value={formik.values.confirmPassword}
                      isError={
                        !!formik.touched.confirmPassword &&
                        !!formik.errors.confirmPassword
                      }
                      error={formik.errors.confirmPassword}
                      onBlur={formik.handleBlur}
                      onChange={formik.handleChange}
                    />
                  </div>
                </div>

                <Button className="mt-7 w-full" disabled={isPending}>
                  {isPending ? 'Verifying...' : 'Complete Registration'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default VerificationTenantPage;

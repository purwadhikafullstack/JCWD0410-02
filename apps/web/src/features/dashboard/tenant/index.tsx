'use client';

import FormInput from '@/components/FormInput';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import useGetTenant from '@/hooks/api/auth/useGetTenant';
import useUpdateTenant from '@/hooks/api/auth/useUpdateTenant';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { ChangeEvent, useRef, useState } from 'react';
import { TenantSchema } from './schemas/TenantSchema';

const TenantPage = () => {
  const session = useSession();
  const [selectedImage, setSelectedImage] = useState<string>('');
  const photoRef = useRef<HTMLInputElement>(null);
  const onChangeProfile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      formik.setFieldValue('imageUrl', files[0]);
      setSelectedImage(URL.createObjectURL(files[0]));
    }
  };
  const removeSelectedImage = () => {
    formik.setFieldValue('profilePicture', null);
    setSelectedImage('');
    if (photoRef.current) {
      photoRef.current.value = '';
    }
  };

  const { data } = useGetTenant();
  const tenantId = Number(data?.id);
  const { mutateAsync: profile, isPending } = useUpdateTenant(tenantId);

  const formik = useFormik({
    initialValues: {
      imageUrl: '',
      name: data?.name || '',
      phone: data?.phone || 0,
      bankName: data?.bankName || '',
      bankNumber: data?.bankNumber || 0,
    },
    validationSchema: TenantSchema,
    onSubmit: async (values) => {
      await profile({
        ...values,
        phone: Number(values.phone),
        bankNumber: Number(values.bankNumber),
      });
    },
    enableReinitialize: true,
  });

  return (
    <div>
      {/* Main Dashboard Content */}
      <section className="p-6 container max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center text-[#336aea]">
              Tenant's Detail
            </CardTitle>
          </CardHeader>
          <form onSubmit={formik.handleSubmit}>
            <CardContent className="space-y-5">
              <div className="grid md:grid-cols-[1fr_3fr]">
                <div className="grid items-center justify-center">
                  <Avatar className="h-40 w-40">
                    {selectedImage ? (
                      <AvatarImage src={selectedImage} />
                    ) : (
                      <AvatarImage src={data?.imageUrl} />
                    )}
                    <AvatarFallback>N</AvatarFallback>
                  </Avatar>
                  <Input
                    type="file"
                    className="absolute w-24 ml-24 opacity-0 z-10"
                    accept="image/*"
                    onChange={onChangeProfile}
                    ref={photoRef}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-7">
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
                  <FormInput
                    name="phone"
                    label="Phone"
                    type="number"
                    placeholder="phone"
                    value={formik.values.phone}
                    isError={!!formik.touched.phone && !!formik.errors.phone}
                    error={formik.errors.phone}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
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
                  <FormInput
                    name="bankNumber"
                    label="Bank Number"
                    type="number"
                    placeholder="Bank Number"
                    value={formik.values.bankNumber}
                    isError={
                      !!formik.touched.bankNumber && !!formik.errors.bankNumber
                    }
                    error={formik.errors.bankNumber}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button disabled={isPending}>
                  {isPending ? 'Loading...' : 'Save Change'}
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </section>
    </div>
  );
};

export default TenantPage;

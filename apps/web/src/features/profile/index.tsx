'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { ChangeEvent, useRef, useState } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';
import { ProfileSchema } from './schemas/ProfileSchema';
import useUpdateProfile from '@/hooks/api/auth/useUpdateProfile';
import { Input } from '@/components/ui/input';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { FaCircleXmark } from 'react-icons/fa6';

const ProfilePage = () => {
  const session = useSession();
  const isVerified = session.data?.user.isVerified;
  const [iconColor, setIconColor] = useState('#B8BACF');
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
  const { mutateAsync: profile, isPending } = useUpdateProfile(
    Number(session.data?.user.id),
  );
  const formik = useFormik({
    initialValues: {
      imageUrl: '',
      name: session.data?.user.name || '',
      email: session.data?.user.email || '',
    },
    validationSchema: ProfileSchema,
    onSubmit: async (values) => {
      await profile(values);
    },
    enableReinitialize: true,
  });
  return (
    <main className="min-h-screen items-center justify-center p-4">
      <div className="my-[70px] max-w-6xl mx-auto">
        <div className="grid grid-cols-[1fr_3fr]">
          <div className="mx-auto">
            <div
              className="w-[150px] h-[150px] border border-[#B8BACF] rounded-full overflow-hidden flex items-center justify-center relative hover:border-[#336aea]"
              onMouseEnter={() => setIconColor('#336aea')}
              onMouseLeave={() => setIconColor('#B8BACF')}
            >
              {selectedImage ? (
                <>
                  <Image
                    src={selectedImage}
                    alt="Profile Picture"
                    className="object-cover"
                    fill
                  />
                </>
              ) : null}
              <input
                type="file"
                className="absolute inset-0 opacity-0 z-10"
                accept="image/*"
                onChange={onChangeProfile}
                ref={photoRef}
              />
              <MdOutlineFileUpload size="25px" color={iconColor} />
              <p className="text-[iconColor]">Profile Picture</p>
            </div>

            {selectedImage && (
              <div className="flex items-center justify-center mt-7">
                <Button variant={'destructive'} onClick={removeSelectedImage}>
                  Remove Photo
                </Button>
              </div>
            )}
          </div>

          <div>
            <Card>
              <CardHeader className="mb-6 text-center lg:text-left">
                <CardTitle className="text-3xl font-bold text-center text-[#336aea]">
                  My Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={formik.handleSubmit}>
                  <div className="grid gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <label htmlFor="name" className="font-semibold">
                        Full Name
                      </label>
                      <Input
                        name="name"
                        type="name"
                        placeholder="Nama Lengkap"
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
                  </div>

                  <div className="flex flex-col mt-5">
                    <div className="flex justify-between">
                      <label htmlFor="email" className="font-semibold">
                        Email
                      </label>
                      <p className="flex items-center">
                        {isVerified ? (
                          <span className="flex items-center text-green-500">
                            <IoMdCheckmarkCircle className="mr-1" /> Email
                            Verified
                          </span>
                        ) : (
                          <span className="flex items-center text-red-500">
                            <FaCircleXmark className="mr-1" /> Email Unverified
                          </span>
                        )}
                      </p>
                    </div>
                    <Input
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

                  <div className="flex justify-between items-center mt-5">
                    <div className="flex gap-5">
                      <Link href="/change-password" className="text-[#006BB4]">
                        Change Password?
                      </Link>
                      <Link href="/change-email" className="text-[#006BB4]">
                        Change Email?
                      </Link>
                    </div>
                    <div>
                      <Button className="mt-3" disabled={isPending}>
                        {isPending ? 'Loading...' : 'Save Change'}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ProfilePage;

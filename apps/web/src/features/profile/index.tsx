'use client';

import useUpdateProfile from '@/hooks/api/useUpdateProfile';
import { useFormik } from 'formik';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { ChangeEvent, useRef, useState } from 'react';
import { ProfileSchema } from './schemas/ProfileSchema';
import { MdOutlineFileUpload } from 'react-icons/md';

const ProfilePage = () => {
  const session = useSession();

  // if (session.data?.user.role !== 'USER') {
  //   console.log(session.data?.user.role);

  //   return redirect('/login');
  // }
  const [iconColor, setIconColor] = useState('#B8BACF');
  const [selectedImage, setSelectedImage] = useState<string>('');
  const photoRef = useRef<HTMLInputElement>(null);
  const onChangeProfile = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      formik.setFieldValue('profile_picture', files[0]);
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
      imageUrl: null,
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
    <div className="my-[70px] max-w-6xl mx-auto">
      <div className="grid grid-cols-[1fr_3fr]">
        <div className="mx-auto">
          <div
            className="w-[150px] h-[150px] border border-[#B8BACF] rounded-full overflow-hidden flex items-center justify-center relative hover:border-[#E86B32]"
            onMouseEnter={() => setIconColor('#E86B32')}
            onMouseLeave={() => setIconColor('#B8BACF')}
          >
            {selectedImage ? (
              <>
                <img
                  src={selectedImage}
                  alt="Profile Picture"
                  className="object-cover"
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
              <button className="btn" onClick={removeSelectedImage}>
                Remove Photo
              </button>
            </div>
          )}
        </div>

        <div>
          <form onSubmit={formik.handleSubmit}>
            <div className="form-group">
              <label className="block mb-2">
                Full Name
                <span className="text-red-500 ml-1"></span>
              </label>
              <input
                type="text"
                placeholder="Nama Lengkap"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                className="input"
              />
            </div>

            <div className="form-group mt-7">
              <label className="block mb-2">
                Email
                <span className="text-red-500 ml-1"></span>
              </label>
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                className="input"
              />
            </div>

            <div className="flex justify-between items-center mt-5">
              <a href="/ubah-password" className="text-[#006BB4]">
                Change Password?
              </a>
              <button
                type="submit"
                className={`btn ${isPending ? 'bg-gray-500' : 'hover:bg-[#003249] text-whitesmoke'}`}
                disabled={isPending}
                style={{ color: '#003249' }}
              >
                {isPending ? 'Loading...' : 'Save Change'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

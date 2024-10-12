// 'use client';
// import useAxios from '@/hooks/useAxios';
// import { useMutation } from '@tanstack/react-query';
// import { AxiosError } from 'axios';
// import { signIn } from 'next-auth/react';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-toastify';

// interface GooglePayload {
//   code: string;
// }

// export default function useLoginByGoogle() {
//   const { axiosInstance } = useAxios();
//   const router = useRouter();

//   return useMutation({
//     mutationFn: async (payload: GooglePayload) => {
//       const { data } = await axiosInstance.post('/auth/google', payload);
//       return data;
//     },
//     onSuccess: ({ data }) => {
//       signIn('google', { ...data, redirect: false });
//       toast.success('Login by Google Success');
//       router.replace('/');
//     },
//     onError: (error: AxiosError<any>) => {
//       toast.error(error.response?.data);
//     },
//   });
//   // const googleLogin = useGoogleLogin({
//   //   onSuccess: async ({ code }) => {
//   //     try {
//   //       const response = await axiosInstance.post('/auth/google', { code });
//   //       const { data } = response;

//   //       setUser(data);
//   //       dispatch(loginAction(data.data));
//   //       localStorage.setItem('token', data.token);

//   //       toast.success('Login by Google Succes');
//   //       router.push('/');
//   //     } catch (error) {
//   //       if (error instanceof AxiosError) {
//   //         toast.error(error.response?.data);
//   //       }
//   //     }
//   //   },
//   //   flow: 'auth-code',
//   // });

//   // const logout = () => {
//   //   googleLogout();
//   //   setUser(null);
//   // };

//   // return { googleLogin, logout, user };
// }

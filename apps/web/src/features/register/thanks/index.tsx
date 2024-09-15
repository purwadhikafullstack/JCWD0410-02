'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const ThanksPage = () => {
  const router = useRouter();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative h-auto lg:h-auto lg:w-1/2 overflow-hidden">
          <Image
            src="/Congratulations.svg"
            alt="Success Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8">
          <div className="flex w-full flex-col items-center">
            <h1 className="text-3xl font-medium">Congratulations! 🎉🎉🎉</h1>
            <p>You're one step closer!</p>
            <p className="mt-[50px] text-l text-[#0f172a]">
              Please check your email to verify.
            </p>
            <Button
              className="w-full mt-[50px] py-2 first-line:"
              onClick={() => router.push('/login')}
            >
              Login
            </Button>
            <Button
              variant="link"
              className="w-full py-2"
              onClick={() => router.push('/')}
            >
              Back to home
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThanksPage;

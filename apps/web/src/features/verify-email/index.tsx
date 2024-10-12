'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import useChangeEmailVerify from '@/hooks/api/auth/useChangeEmailVerify';
import Image from 'next/image';
import { FC, useEffect } from 'react';

interface VerificationPageProps {
  token: string;
}

const VerifiyChangeEmailPage: FC<VerificationPageProps> = ({ token }) => {
  const { mutateAsync: verification, isPending } = useChangeEmailVerify(token);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl overflow-hidden rounded-lg bg-white shadow-lg">
        <div className="relative h-auto lg:h-auto lg:w-1/2 overflow-hidden">
          <Image
            src="/verificationPage.svg"
            alt="Verification Page Image"
            fill
            className="object-cover"
          />
        </div>
        <div className="w-full lg:w-1/2 p-8">
          <Card>
            <CardHeader className="mb-6 text-center lg:text-left">
              <CardTitle className="text-3xl font-bold text-center text-[#336aea]">
                Change Email Verification
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button
                className="mt-7 w-full"
                disabled={isPending}
                onClick={() => verification()}
              >
                {isPending ? 'Verifying...' : 'Verify Now'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default VerifiyChangeEmailPage;

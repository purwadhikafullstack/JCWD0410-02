import VerificationPage from '@/features/verification';
import React, { FC } from 'react';

interface VerificationPageProps {
  token: string;
}

const Verification = ({ params }: { params: { token: string } }) => {
  return <VerificationPage token={params.token} />;
};

export default Verification;

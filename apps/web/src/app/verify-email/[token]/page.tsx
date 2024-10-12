import VerifiyChangeEmailPage from '@/features/verify-email';

const ChangeEmailVerification = ({ params }: { params: { token: string } }) => {
  return <VerifiyChangeEmailPage token={params.token} />;
};

export default ChangeEmailVerification;

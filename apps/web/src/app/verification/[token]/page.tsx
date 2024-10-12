import VerificationPage from '@/features/verification';

const Verification = ({ params }: { params: { token: string } }) => {
  return <VerificationPage token={params.token} />;
};

export default Verification;

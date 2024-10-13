import VerificationTenantPage from '@/features/verification-tenant';

const VerificationTenant = ({ params }: { params: { token: string } }) => {
  return <VerificationTenantPage token={params.token} />;
};

export default VerificationTenant;

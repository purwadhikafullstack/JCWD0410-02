'use client';

import UploadPaymentProofFeature from "@/features/payment-proof";


interface UploadProofPageProps {
  params: { id: string }; // Expect id from params in props
}

const UploadProofPage = ({ params }: UploadProofPageProps) => {
  const { id } = params; 
  // Handle case where id is not yet available (optional, but not necessary)
  if (!id) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {/* Pass transactionId as 'id' from params */}
      <UploadPaymentProofFeature transactionId={parseInt(id)} />
    </div>
  );
};

export default UploadProofPage;

'use client';

import UploadPaymentProofFeature from "@/features/payment-proof";


interface UploadProofPageProps {
  params: { id: string }; 
}

const UploadProofPage = ({ params }: UploadProofPageProps) => {
  const { id } = params; 
  if (!id) {
    return 
  }

  return (
    <div>
      <UploadPaymentProofFeature transactionId={parseInt(id)} />
    </div>
  );
};

export default UploadProofPage;

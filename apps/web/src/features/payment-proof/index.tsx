'use client';

import { useState } from 'react';
import useUploadPaymentProof from '@/hooks/api/transaction-user/useUploadPaymentProof';
import { Button } from '@/components/ui/button';
import useGetTransactionDetails from '@/hooks/api/transaction-user/useGetDetailTransaction';
import Countdown, { CountdownRenderProps } from 'react-countdown';

interface UploadPaymentProofFeatureProps {
  transactionId: number;
}

const UploadPaymentProofFeature: React.FC<UploadPaymentProofFeatureProps> = ({ transactionId }) => {
  const [file, setFile] = useState<File | null>(null);
  const { mutate: uploadProof } = useUploadPaymentProof();

  const { data: transactionDetails, isLoading, error } = useGetTransactionDetails(transactionId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadProof({ transactionId, file });
    }
  };

  const renderCountdown = ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      return <span className="text-red-500">Transaction expired</span>;
    } else {
      return (
        <span className="text-blue-600 font-semibold">
          {hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  if (isLoading) {
    return <p>Loading transaction details...</p>;
  }

  if (error) {
    return <p>Failed to load transaction details. Please try again.</p>;
  }

  if (!transactionDetails) {
    return <p>No transaction details found</p>;
  }

  const countdownDate = new Date(new Date(transactionDetails.createdAt).getTime() + 60 * 60 * 1000);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">Transaction Information</h3>
          <p>Please transfer the amount of:</p>
          <p className="text-3xl font-bold text-blue-600">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(transactionDetails.totalAmount)}
          </p>
          <div className="space-y-1">
            <p><strong>Bank Name:</strong> {transactionDetails.bankName}</p>
            <p><strong>Bank Account Number:</strong> {transactionDetails.bankNumber}</p>
            <p><strong>Buyer Name:</strong> {transactionDetails.buyerName}</p>
          </div>
        </div>

        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="font-medium">Please upload the payment proof before the timer runs out:</p>
          <Countdown date={countdownDate} renderer={renderCountdown} />
        </div>
        <div className="space-y-4">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".jpg, .png"
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
          />
          <Button onClick={handleUpload} disabled={!file} className="w-full">
            Upload Payment Proof
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPaymentProofFeature;

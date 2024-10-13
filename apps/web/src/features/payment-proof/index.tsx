'use client';

import { useState } from 'react';
import useUploadPaymentProof from '@/hooks/api/transaction-user/useUploadPaymentProof';
import useCancelTransaction from '@/hooks/api/transaction-user/useCancelTransaction';
import useGetTransactionDetails from '@/hooks/api/transaction-user/useGetDetailTransaction';
import Countdown, { CountdownRenderProps } from 'react-countdown';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';

interface UploadPaymentProofFeatureProps {
  transactionId: number;
}

const UploadPaymentProofFeature: React.FC<UploadPaymentProofFeatureProps> = ({
  transactionId,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const router = useRouter();

  const { mutate: uploadProof } = useUploadPaymentProof();
  const { mutate: cancelTransaction } = useCancelTransaction();
  const { data: transactionDetails, isLoading, error } = useGetTransactionDetails(transactionId);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (file) {
      uploadProof({ transactionId, file }, {
        onSuccess: () => {
          router.push('/');
        },
      });
    }
  };

  const handleCancelOrder = () => {
    cancelTransaction({ transactionId }, {
      onSuccess: () => {
        router.push('/');
      },
    });
  };

  const renderCountdown = ({ hours, minutes, seconds, completed }: CountdownRenderProps) => {
    if (completed) {
      router.push('/');
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Card className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>

          <CardContent className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-10 w-1/2" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-5 w-3/4" />
            </div>

            <div className="p-4 bg-gray-100 rounded-lg">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-1/2" />
            </div>

            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>

          <CardFooter className="space-y-4">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      </div>
    );
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
      <Card className="max-w-4xl w-full mx-auto p-6 bg-white rounded-lg shadow-lg space-y-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Transaction Information</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
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

          <div className="p-4 bg-gray-100 rounded-lg">
            <p className="font-medium">Please upload the payment proof before the timer runs out:</p>
            <Countdown date={countdownDate} renderer={renderCountdown} />
          </div>

          <div className="space-y-4">
            <Input
              type="file"
              onChange={handleFileChange}
              accept=".jpg, .png"
              className="block w-full text-sm text-gray-900 border-gray-300 cursor-pointer bg-gray-50"
            />
            <Button onClick={handleUpload} disabled={!file} className="w-full">
              Upload Payment Proof
            </Button>
          </div>
        </CardContent>

        <CardFooter className="space-y-4">
          <Button onClick={handleCancelOrder} className="w-full bg-red-500 text-white">
            Cancel Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default UploadPaymentProofFeature;

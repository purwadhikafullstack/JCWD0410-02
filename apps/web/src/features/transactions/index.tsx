"use client";

import { Transaction } from '@/types/transaction';
import useGetUserTransactions from '@/hooks/api/transaction-user/useGetUserOrders';
import ReviewModal from '@/components/ReviewModal';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const TransactionList = () => {
  const router = useRouter();
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setModalOpen] = useState(false);
  const itemsPerPage = 5;

  const { data, isLoading, error } = useGetUserTransactions({
    page: currentPage,
    take: itemsPerPage,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  useEffect(() => {
    if (data && data.data.length > 0) setSelectedTransaction(data.data[0]);
  }, [data]);

  const handlePageChange = (direction: 'next' | 'prev') => {
    if (direction === 'next' && data && currentPage * itemsPerPage < data.meta.total) {
      setCurrentPage(currentPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleWriteReview = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const selectedPropertyId = selectedTransaction?.room?.property?.id;
  const isProcessedAndPastEndDate = selectedTransaction?.status === 'PROCESSED' && new Date(selectedTransaction?.endDate) <= new Date();
  const hasNoReviews = selectedTransaction?.reviews?.length === 0;

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const renderStatusBadge = (status: string) => (
    <Badge className={status === 'PROCESSED' ? 'bg-green-500 text-white' : status === 'CANCELLED' ? 'bg-red-500 text-white' : 'bg-gray-300 text-black'}>
      {status.replace(/_/g, ' ')}
    </Badge>
  );

  return (
    <div className="container mx-auto p-6 mt-16 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Daftar Transaksi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.data.map((transaction: Transaction) => (
              <Card key={transaction.id} className={`cursor-pointer border ${selectedTransaction?.id === transaction.id ? 'bg-gray-100' : ''}`} onClick={() => setSelectedTransaction(transaction)}>
                <CardContent>
                  <h3 className="font-bold text-lg">{transaction.room.name} - {transaction.room.property.title}</h3>
                  {renderStatusBadge(transaction.status)}
                  <p>Total: Rp{transaction.total}</p>
                  <p>Tanggal: {new Date(transaction.createdAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <Button variant="outline" onClick={() => handlePageChange('prev')} disabled={currentPage === 1}>Previous</Button>
            <span className="text-sm">Page {currentPage}</span>
            <Button variant="outline" onClick={() => handlePageChange('next')} disabled={data && currentPage * itemsPerPage >= data.meta.total}>Next</Button>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          {selectedTransaction ? (
            <>
              <CardHeader>
                <CardTitle>Detail Transaksi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-bold">Properti: {selectedTransaction.room.property.title}</h3>
                  <p>Nama Kamar: {selectedTransaction.room.name}</p>
                  <p>Total Pembayaran: Rp{selectedTransaction.total}</p>
                </div>
                <div>
                  <h3 className="font-bold">Status Transaksi</h3>
                  <p>{selectedTransaction.status.replace(/_/g, ' ')}</p>
                  {selectedTransaction.status === 'WAITING_FOR_PAYMENT' && (
                    <Button variant="destructive" onClick={() => router.push(`/upload-proof/${selectedTransaction.id}`)}>Upload Bukti Pembayaran</Button>
                  )}
                </div>
                <div>
                  <h3 className="font-bold">Tanggal Transaksi</h3>
                  <p>Mulai: {new Date(selectedTransaction.startDate).toLocaleDateString()}</p>
                  <p>Selesai: {new Date(selectedTransaction.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="font-bold">Bukti Pembayaran</h3>
                  {selectedTransaction.paymentProof ? (
                    <a href={selectedTransaction.paymentProof} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Lihat Bukti Pembayaran</a>
                  ) : <p>Tidak ada bukti pembayaran</p>}
                </div>
                {isProcessedAndPastEndDate && (
                  <div>
                    <h3 className="font-bold">Review</h3>
                    {hasNoReviews ? <p>Belum ada review</p> : selectedTransaction.reviews?.map((review, index) => (
                      <div key={index} className="mt-2">
                        <p><strong>Rating:</strong> {review.rating}/5</p>
                        <p><strong>Review:</strong> {review.review}</p>
                        <p><small>Posted on: {new Date(review.createdAt).toLocaleDateString()}</small></p>
                      </div>
                    ))}
                  </div>
                )}
                {isProcessedAndPastEndDate && hasNoReviews && (
                  <Button variant="default" onClick={handleWriteReview}>Tulis Review</Button>
                )}
              </CardContent>
            </>
          ) : <CardContent>Pilih transaksi dari daftar di kiri untuk melihat detailnya.</CardContent>}
        </Card>
      </div>
      <ReviewModal isOpen={isModalOpen} onClose={handleCloseModal} transactionId={selectedTransaction?.id} propertyId={selectedPropertyId} />
    </div>
  );
};

export default TransactionList;

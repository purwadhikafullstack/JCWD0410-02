'use client';
import React, { useState, useEffect } from 'react';
import { Transaction } from '@/types/transaction';
import useGetUserTransactions from '@/hooks/api/transaction-user/useGetUserOrders';

const TransactionList = () => {
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const { data, isLoading, error } = useGetUserTransactions({
    page: 1,
    take: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // useEffect untuk menetapkan transaksi terpilih saat data dimuat
  useEffect(() => {
    // Cek jika data ada dan panjang array lebih dari 0
    if (data && data.data.length > 0) {
      // Menetapkan transaksi terbaru sebagai transaksi terpilih
      setSelectedTransaction(data.data[0]);
    }
  }, [data]); // Dependency pada data, agar useEffect dijalankan ulang saat data berubah

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="grid grid-cols-12 gap-4 p-6">
      {/* List Transaksi di Kiri */}
      <div className="col-span-4">
        <h3 className="text-xl font-bold mb-4">Daftar Transaksi</h3>
        <div className="space-y-4">
          {data?.data.map((transaction: Transaction) => (
            <div
              key={transaction.id}
              className={`cursor-pointer border p-4 rounded-lg shadow-sm hover:bg-gray-100 ${
                selectedTransaction?.id === transaction.id ? 'bg-gray-100' : ''
              }`}
              onClick={() => setSelectedTransaction(transaction)}
            >
              <h3 className="font-bold text-lg">
                {transaction.room.property.title}
              </h3>
              <p>Status: {transaction.status.replace(/_/g, ' ')}</p>
              <p>Total: Rp{transaction.total}</p>
              <p>
                Tanggal: {new Date(transaction.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Detail Transaksi di Kanan */}
      <div className="col-span-8 bg-white p-6 rounded-lg shadow-lg">
        {selectedTransaction ? (
          <>
            <h2 className="text-2xl font-bold mb-4">Detail Transaksi</h2>
            <div className="space-y-4">
              <div className="border-b pb-4">
                <h3 className="font-bold">
                  Properti: {selectedTransaction.room.property.title}
                </h3>
                <p>Kategori: {selectedTransaction.room.property.category}</p>
                <p>Total Pembayaran: Rp{selectedTransaction.total}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-bold">Status Transaksi</h3>
                <p>{selectedTransaction.status.replace(/_/g, ' ')}</p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-bold">Tanggal Transaksi</h3>
                <p>
                  Mulai:{' '}
                  {new Date(selectedTransaction.startDate).toLocaleDateString()}
                </p>
                <p>
                  Selesai:{' '}
                  {new Date(selectedTransaction.endDate).toLocaleDateString()}
                </p>
              </div>

              <div className="border-b pb-4">
                <h3 className="font-bold">Bukti Pembayaran</h3>
                {selectedTransaction.paymentProof ? (
                  <a
                    href={selectedTransaction.paymentProof}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    Lihat Bukti Pembayaran
                  </a>
                ) : (
                  <p>Tidak ada bukti pembayaran</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <p>Pilih transaksi dari daftar di kiri untuk melihat detailnya.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;

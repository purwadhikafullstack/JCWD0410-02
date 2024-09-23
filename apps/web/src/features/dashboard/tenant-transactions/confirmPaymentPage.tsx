"use client"
import React, { useState } from 'react';
import { StatusTransaction, Transaction } from '@/types/transaction';
import useGetTransactions from '@/hooks/api/transaction-tenant/useGetOrders'; // Hook untuk mendapatkan transaksi
import useConfirmPayment from '@/hooks/api/transaction-tenant/useConfirmPayment'; // Hook untuk konfirmasi pembayaran

const ConfirmPayment = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusTransaction | 'ALL'>('ALL');
  const [page, setPage] = useState<number>(1);
  const [processedTransactions, setProcessedTransactions] = useState<number[]>([]); // Tambahkan state untuk melacak transaksi yang diproses
  const take = 10; // Number of transactions per page

  // Fetch transactions using the custom hook
  const { data, isLoading, error, refetch } = useGetTransactions({
    tenantId: 1, // Sesuaikan tenantId yang benar di sini
    status: selectedStatus === 'ALL' ? undefined : selectedStatus, 
    page,
    take,
  });

  // Call the useConfirmPayment hook
  const confirmPaymentMutation = useConfirmPayment();

  // Handle status filter change
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as StatusTransaction | 'ALL';
    setSelectedStatus(selectedValue);
    setPage(1); // Reset to first page when status changes
  };

  // Handle confirm or reject payment
  const handleConfirmPayment = (transactionId: number, confirm: boolean) => {
    confirmPaymentMutation.mutate({ transactionId, confirm }, {
      onSuccess: () => {
        setProcessedTransactions([...processedTransactions, transactionId]); // Tambahkan transactionId ke list yang sudah diproses
        refetch(); // Refetch data setelah mutasi berhasil
      },
    });
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Order List</h2>

        {/* Dropdown for status filter */}
        <div className="flex items-center">
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={handleStatusChange}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="ALL">All</option>
            {Object.values(StatusTransaction).map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 bg-white">
          <thead>
            <tr>
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">User Name</th>
              <th className="border px-4 py-2">Property</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Actions</th> {/* Kolom Actions */}
            </tr>
          </thead>
          <tbody>
            {data?.data.map((transaction: Transaction) => (
              <tr key={transaction.id}>
                <td className="border px-4 py-2">{transaction.id}</td>
                <td className="border px-4 py-2">{transaction.user.name}</td>
                <td className="border px-4 py-2">{transaction.room.property.title}</td>
                <td className="border px-4 py-2">{transaction.total}</td>
                <td className="border px-4 py-2">{transaction.status}</td>
                <td className="border px-4 py-2">{new Date(transaction.createdAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2">
                  {/* Tambahkan tombol konfirmasi dan tolak */}
                  {transaction.status === "WAITING_FOR_PAYMENT_CONFIRMATION" && (
                    <>
                      <button
                        onClick={() => handleConfirmPayment(transaction.id, true)}
                        className="bg-green-500 text-white px-2 py-1 rounded mr-2"
                        disabled={processedTransactions.includes(transaction.id) || confirmPaymentMutation.status === 'pending'} // Disable button setelah transaksi diproses atau pending
                      >
                        {confirmPaymentMutation.status === 'pending' ? 'Loading...' : 'Konfirmasi'}
                      </button>
                      <button
                        onClick={() => handleConfirmPayment(transaction.id, false)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                        disabled={processedTransactions.includes(transaction.id) || confirmPaymentMutation.status === 'pending'} // Disable button setelah transaksi diproses atau pending
                      >
                        {confirmPaymentMutation.status === 'pending' ? 'Loading...' : 'Tolak'}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 bg-gray-200 rounded-lg ${page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-700">Page {page}</p>
        <button
          onClick={() => setPage(page + 1)}
          disabled={data && page * take >= data.total}
          className={`px-4 py-2 bg-gray-200 rounded-lg ${data && page * take >= data.total ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ConfirmPayment;

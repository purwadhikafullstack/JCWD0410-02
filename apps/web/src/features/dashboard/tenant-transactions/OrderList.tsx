"use client";
import React, { useState } from 'react';
import { StatusTransaction, Transaction } from '@/types/transaction';
import useGetTransactions from '@/hooks/api/transaction-tenant/useGetOrders'; // Import the correct hook

const TransactionList = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusTransaction | 'ALL'>('ALL');
  const [page, setPage] = useState<number>(1);
  const take = 10; // Number of transactions per page

  // Fetch transactions using the custom hook
  const { data, isLoading, error } = useGetTransactions({
    tenantId: 1,
    status: selectedStatus === 'ALL' ? undefined : selectedStatus, // If 'ALL', don't filter by status
    page,
    take,
  });

  // Handle status filter change
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value as StatusTransaction | 'ALL';
    setSelectedStatus(selectedValue);
    setPage(1); // Reset to first page when status changes
  };

  // Navigate to next page
  const handleNextPage = () => {
    if (data && page * take < data.total) {
      setPage((prev) => prev + 1);
    }
  };

  // Navigate to previous page
  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`px-4 py-2 bg-gray-200 rounded-lg ${page === 1 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-700">Page {page}</p>
        <button
          onClick={handleNextPage}
          disabled={data && page * take >= data.total}
          className={`px-4 py-2 bg-gray-200 rounded-lg ${data && page * take >= data.total ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionList;

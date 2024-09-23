"use client";

import React, { useState } from "react";
import { StatusTransaction, Transaction } from "@/types/transaction";
import { FiMoreVertical } from "react-icons/fi";
import useGetTransactions from "@/hooks/api/transaction-tenant/useGetOrders";
import EditModal from "@/components/EditModal";
import DetailModal from "@/components/DetailModal";
import CancelOrderModal from "@/components/CancelOrderModal";

const TableTransaction = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusTransaction | "ALL">("ALL");
  const [page, setPage] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isCancelOpen, setIsCancelOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const take = 10;

  const { data, isLoading, error, refetch } = useGetTransactions({
    tenantId: 1,
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
    page,
    take,
  });

  const handleDetail = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailOpen(true);
  };

  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsEditOpen(true);
  };

  const handleCancel = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsCancelOpen(true);
  };

  const closeModal = () => {
    setIsDetailOpen(false);
    setIsEditOpen(false);
    setIsCancelOpen(false);
  };

  const toggleDropdown = (id: number) => {
    setDropdownOpen(dropdownOpen === id ? null : id);
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-4 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Order List</h2>
        <div className="flex items-center">
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as StatusTransaction | "ALL")}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="ALL">All</option>
            {Object.values(StatusTransaction).map((status) => (
              <option key={status} value={status}>
                {status.replace(/_/g, " ")}
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
              <th className="border px-4 py-2">Payment Proof</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data.map((transaction: Transaction) => (
              <tr key={transaction.id}>
                <td className="border px-4 py-2">{transaction.id}</td>
                <td className="border px-4 py-2">{transaction.user.name}</td>
                <td className="border px-4 py-2">{transaction.room.property.title}</td>
                <td className="border px-4 py-2">
                  {transaction.paymentProof ? (
                    <a href={transaction.paymentProof} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                      View Proof
                    </a>
                  ) : (
                    "No Proof"
                  )}
                </td>
                <td className="border px-4 py-2">{transaction.status.replace(/_/g, " ")}</td>
                <td className="border px-4 py-2 relative">
                  <div className="relative">
                    <FiMoreVertical
                      className="cursor-pointer text-blue-500"
                      onClick={() => toggleDropdown(transaction.id)}
                    />
                    {dropdownOpen === transaction.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
                        <button
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            handleDetail(transaction);
                            toggleDropdown(transaction.id);
                          }}
                        >
                          Detail
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                          onClick={() => {
                            handleEdit(transaction);
                            toggleDropdown(transaction.id);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="block w-full px-4 py-2 text-left hover:bg-gray-100 text-red-600"
                          onClick={() => {
                            handleCancel(transaction);
                            toggleDropdown(transaction.id);
                          }}
                        >
                          Cancel Order
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className={`px-4 py-2 bg-gray-200 rounded-lg ${page === 1 ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-700">Page {page}</p>
        <button
          onClick={() => setPage(page + 1)}
          disabled={data && page * take >= data.total}
          className={`px-4 py-2 bg-gray-200 rounded-lg ${data && page * take >= data.total ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          Next
        </button>
      </div>

      {isDetailOpen && selectedTransaction && (
        <DetailModal transaction={selectedTransaction} closeModal={closeModal} />
      )}

      {isEditOpen && selectedTransaction && (
        <EditModal transaction={selectedTransaction} closeModal={closeModal} refetch={refetch} />
      )}

      {isCancelOpen && selectedTransaction && (
        <CancelOrderModal transaction={selectedTransaction} closeModal={closeModal} refetch={refetch} />
      )}
    </div>
  );
};

export default TableTransaction;

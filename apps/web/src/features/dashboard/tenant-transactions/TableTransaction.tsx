"use client";

import React, { useState } from "react";
import { StatusTransaction, Transaction } from "@/types/transaction";
import { FiMoreVertical } from "react-icons/fi";
import useGetTransactions from "@/hooks/api/transaction-tenant/useGetOrders";
import EditModal from "@/components/EditModal";
import DetailModal from "@/components/DetailModal";
import CancelOrderModal from "@/components/CancelOrderModal";
import Image from "next/image";

const TableTransaction = () => {
  const [selectedStatus, setSelectedStatus] = useState<StatusTransaction | "ALL">("ALL");
  const [page, setPage] = useState<number>(1);
  const [dropdownOpen, setDropdownOpen] = useState<number | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isCancelOpen, setIsCancelOpen] = useState<boolean>(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const take = 5;
  const { data, isLoading, error, refetch } = useGetTransactions({
    tenantId: 1, 
    status: selectedStatus === "ALL" ? undefined : selectedStatus,
    page,
    take,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const handleModal = (type: "detail" | "edit" | "cancel", transaction: Transaction) => {
    setSelectedTransaction(transaction);
    if (type === "detail") setIsDetailOpen(true);
    else if (type === "edit") setIsEditOpen(true);
    else setIsCancelOpen(true);
  };

  const closeModal = () => {
    setIsDetailOpen(false);
    setIsEditOpen(false);
    setIsCancelOpen(false);
  };

  const toggleDropdown = (transactionId: number) => {
    if (dropdownOpen === transactionId) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(transactionId);
    }
  };

  const renderDropdown = (transaction: Transaction) => (
    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-10">
      {["Detail", "Edit", "Cancel Order"].map((action, index) => (
        <button
          key={index}
          className={`block w-full px-4 py-2 text-left hover:bg-gray-100 ${action === "Cancel Order" && "text-red-600"}`}
          onClick={() => {
            handleModal(action.toLowerCase() as "detail" | "edit" | "cancel", transaction);
            setDropdownOpen(null);
          }}
        >
          {action}
        </button>
      ))}
    </div>
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-md rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Order List</h2>
        <select
          id="status-filter"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value as StatusTransaction | "ALL")}
          className="border-gray-300 rounded-lg shadow-sm px-4 py-2"
        >
          <option value="ALL">All</option>
          {Object.values(StatusTransaction).map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {["User Name", "Property", "Payment Proof", "Status", "Actions"].map((header) => (
                <th key={header} className="px-6 py-3 border-b border-gray-200">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600">
            {data?.data.map((transaction: Transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 border-b border-gray-200">{transaction.user?.name}</td>
                <td className="px-6 py-4 border-b border-gray-200">{transaction.room?.property?.title}</td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {transaction.paymentProof ? (
                    <Image
                      src={transaction.paymentProof}
                      alt="Payment Proof"
                      width={128} 
                      height={128}
                      className="object-cover rounded-lg"
                    />
                  ) : (
                    "No Proof"
                  )}
                </td>
                <td
                  className={`px-6 py-4 border-b border-gray-200 ${
                    transaction.status === "PROCESSED" ? "text-green-500" : ""
                  } ${transaction.status === "CANCELLED" ? "text-red-500" : ""}`}
                >
                  {transaction.status.replace(/_/g, " ")}
                </td>
                <td className="px-6 py-4 border-b border-gray-200 relative">
                  <FiMoreVertical
                    className="cursor-pointer text-gray-600 hover:text-gray-800"
                    onClick={() => toggleDropdown(transaction.id)}
                  />
                  {dropdownOpen === transaction.id && renderDropdown(transaction)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-500">Showing {data?.data.length || 0} rows per page</div>
        <div className="flex items-center space-x-2">
          {["Previous", "Next"].map((buttonText, index) => (
            <button
              key={buttonText}
              onClick={() => setPage(buttonText === "Previous" ? page - 1 : page + 1)}
              disabled={index === 0 ? page === 1 : data && page * take >= data.meta.total}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                index === 0
                  ? page === 1
                    ? "text-gray-400 bg-gray-200 cursor-not-allowed"
                    : "text-blue-600 bg-gray-100 hover:bg-gray-200"
                  : data && page * take >= data.meta.total
                  ? "text-gray-400 bg-gray-200 cursor-not-allowed"
                  : "text-blue-600 bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {buttonText}
            </button>
          ))}
        </div>
      </div>

      {isDetailOpen && selectedTransaction && <DetailModal transaction={selectedTransaction} closeModal={closeModal} />}
      {isEditOpen && selectedTransaction && <EditModal transaction={selectedTransaction} closeModal={closeModal} refetch={refetch} />}
      {isCancelOpen && selectedTransaction && (
        <CancelOrderModal transaction={selectedTransaction} closeModal={closeModal} refetch={refetch} />
      )}
    </div>
  );
};

export default TableTransaction;

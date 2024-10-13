"use client";
import React from 'react';
import useGetSalesReport from '@/hooks/api/salesandanalysis/useGetSalesReport';

const CardSalesTransaction: React.FC = () => {
  const { data, isLoading, error } = useGetSalesReport({
    startDate: undefined, 
    endDate: undefined,
    sortBy: 'totalSales',
  });

  if (isLoading) {
    return 
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const totalSales = data?.reduce((acc, report) => acc + report.totalSales, 0) || 0;
  const totalTransactions = data?.reduce((acc, report) => acc + report.transactions, 0) || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h3 className="text-gray-500 text-sm mb-2">Total Sales</h3>
        <p className="text-4xl font-bold">{totalSales.toLocaleString()}</p> 
        <p className="text-sm text-gray-400 mt-1">Total sales for the current period</p>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg"> 
        <h3 className="text-gray-500 text-sm mb-2">Total Transactions</h3>
        <p className="text-4xl font-bold">{totalTransactions.toLocaleString()}</p> 
        <p className="text-sm text-gray-400 mt-1">Total transactions for the current period</p>
      </div>
    </div>
  );
};

export default CardSalesTransaction;

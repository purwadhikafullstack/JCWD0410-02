"use client";

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useGetSalesReport from '@/hooks/api/salesandanalysis/useGetSalesReport'; // Mengimpor hook untuk mengambil data dari API

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartCardTransactions: React.FC = () => {
  // Mengambil data dari API menggunakan useGetSalesReport
  const { data, isLoading, error } = useGetSalesReport({
    startDate: undefined, // Kamu bisa menyesuaikan dengan range tanggal jika diperlukan
    endDate: undefined,
    sortBy: 'transactions', // Mengambil data berdasarkan transactions
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  // Menyiapkan data untuk chart terkait Total Transactions
  const chartData = {
    labels: data?.map((report) => report.property) || ['Transactions'],
    datasets: [
      {
        label: 'Total Transactions',
        data: data?.map((report) => report.transactions || 0) || [3462], // Mengambil data total transactions dari API
        backgroundColor: ['rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(153, 102, 255, 1)'],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Total Transactions Data',
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartCardTransactions;

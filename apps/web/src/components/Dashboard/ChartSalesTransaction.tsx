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
import useGetSalesReport from '@/hooks/api/salesandanalysis/useGetSalesReport'; 

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ChartCard: React.FC = () => {
  const { data, isLoading, error } = useGetSalesReport({
    startDate: undefined, 
    endDate: undefined,
    sortBy: 'totalSales',
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  const chartData = {
    labels: data?.map((report) => report.property) || ['Sales', 'Transactions'],
    datasets: [
      {
        label: 'Total Amount',
        data: data?.map((report) => report.totalSales || 0) || [103430, 3462], 
        backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
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
        text: 'Sales and Transactions Data',
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default ChartCard;

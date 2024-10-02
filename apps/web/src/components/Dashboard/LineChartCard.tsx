"use client";

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import useGetSalesReport from '@/hooks/api/salesandanalysis/useGetSalesReport'; 

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const LineChartCard: React.FC = () => {
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
    labels: data?.map((report) => report.property) || ['Property 1', 'Property 2'],
    datasets: [
      {
        label: 'Total Sales',
        data: data?.map((report) => report.totalSales) || [100000, 150000], 
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
      {
        label: 'Total Transactions',
        data: data?.map((report) => report.transactions) || [50, 30], 
        fill: false,
        borderColor: 'rgba(153, 102, 255, 1)',
        tension: 0.1,
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
        text: 'Sales and Transactions (Line Chart)',
      },
    },
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default LineChartCard;

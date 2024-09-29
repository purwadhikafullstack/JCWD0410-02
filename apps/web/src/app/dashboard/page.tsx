import React from 'react';
import Navbar from '@/components/Dashboard/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';
import CardSalesTransaction from '@/components/Dashboard/CardSalesTransaction';
import ChartCard from '@/components/Dashboard/ChartSalesTransaction';
import LineChartCard from '@/components/Dashboard/LineChartCard';
import ChartCardTransactions from '@/components/Dashboard/ChartTotalTransactions';
// import SalesAndBuyerStats from '@/features/dashboard';

const Dashboard: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
        {/* Navbar */}
        <Navbar />

        {/* Main Dashboard Content */}
        <div className="p-6">
          <div className="container mx-auto p-6">
            <CardSalesTransaction />

            {/* Flex layout for charts */}
            <div className="mt-8 flex flex-col lg:flex-row justify-between space-y-4 lg:space-y-0 lg:space-x-4">
              <ChartCard />
              <ChartCardTransactions />
            </div>

            {/* Transactions Chart (additional if needed) */}
            <div className="mt-8">
              <LineChartCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

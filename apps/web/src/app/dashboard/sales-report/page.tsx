import React from 'react';
import Navbar from '@/components/Dashboard/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';
import SalesReportChart from '@/features/dashboard/salesreport';


const SalesReport: React.FC = () => {
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
          {/* Contoh Konten Utama */}
          <SalesReportChart />
        </div>
      </div>
    </div>
  );
};

export default SalesReport;

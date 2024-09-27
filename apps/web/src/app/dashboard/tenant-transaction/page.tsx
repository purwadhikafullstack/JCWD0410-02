import React from 'react';
import Navbar from '@/components/Dashboard/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';
import TableTransaction from '@/features/dashboard/tenant-transactions/TableTransaction';

const Home: React.FC = () => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900">
        {/* Navbar */}
        <Navbar brandText="Main Dashboard" />

        {/* Main Dashboard Content */}
        <div className="p-6">
          {/* Contoh Konten Utama */}
          <TableTransaction />
        </div>
      </div>
    </div>
  );
};

export default Home;

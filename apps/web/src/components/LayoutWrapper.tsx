'use client';
import Navbar from '@/components/Dashboard/Navbar';
import Sidebar from '@/components/Dashboard/Sidebar';
import { PropsWithChildren } from 'react';

const LayoutWrapper = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-grow bg-gray-100 dark:bg-gray-900 overflow-y-auto">
        {/* Navbar */}
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default LayoutWrapper;
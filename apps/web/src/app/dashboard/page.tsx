import dynamic from 'next/dynamic';
import React from 'react';

const DashboardPage = dynamic(() => import('@/features/dashboard'), {
  ssr: false,
});

const Dashboard = () => {
  return <DashboardPage />;
};

export default Dashboard;

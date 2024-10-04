import SalesReportChart from '@/features/dashboard/salesreport';
import React from 'react';

const SalesReport: React.FC = () => {
  return (
    <div>
    {/* Main Dashboard Content */}
    <section className="p-6 container max-w-7xl mx-auto space-y-10">
      <SalesReportChart/>
    </section>
  </div>
  );
};

export default SalesReport;

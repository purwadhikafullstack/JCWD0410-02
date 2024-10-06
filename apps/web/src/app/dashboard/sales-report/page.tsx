import React from 'react';
import SalesReportChart from '@/features/dashboard/salesreport';

const SalesReport: React.FC = () => {
  return (
    <div>
      <section className="p-6 container max-w-7xl mx-auto space-y-10">
        <SalesReportChart />
      </section>
    </div>
  );
};

export default SalesReport;

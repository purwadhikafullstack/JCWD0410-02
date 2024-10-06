import React from 'react';
import TableTransaction from '@/features/dashboard/tenant-transactions/TableTransaction';

const TenantManagement: React.FC = () => {
  return (
    <div>
      <section className="p-6 container max-w-7xl mx-auto space-y-10">
        <TableTransaction />
      </section>
    </div>
  );
};

export default TenantManagement;

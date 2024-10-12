import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PropertyTenantList from './components/PropertyTenantList';

const PropertyManagementPage = () => {
  return (
    <div>
      {/* Main Dashboard Content */}
      <section className="p-6 container max-w-7xl mx-auto space-y-10">
        <div className="flex gap-3">
          <Link href="/dashboard/property/create">
            <Button>Create Property</Button>
          </Link>
          <Link href="/dashboard/room/create">
            <Button variant={'outline'}>Create Room</Button>
          </Link>
        </div>
        <PropertyTenantList />
      </section>
    </div>
  );
};

export default PropertyManagementPage;

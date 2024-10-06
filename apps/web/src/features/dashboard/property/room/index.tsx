import { Button } from '@/components/ui/button';
import Link from 'next/link';
import RoomTenantList from './components/RoomTenantList';

const RoomManagementPage = () => {
  return (
    <div>
      {/* Main Dashboard Content */}
      <section className="p-6 container max-w-7xl mx-auto space-y-10">
        <Link href="/dashboard/room/create">
          <Button>Create Room</Button>
        </Link>
        <RoomTenantList />
      </section>
    </div>
  );
};

export default RoomManagementPage;

import { Input } from '@/components/ui/input';

const CreateRoomPage = () => {
  return (
    <div>
      {/* Main Dashboard Content */}
      <section className="p-6 container max-w-7xl mx-auto space-y-10">
        <Input placeholder="Room Name" />
        <Input placeholder="Stock" />
        <Input placeholder="Price" />
        <Input placeholder="PropertyId" />
        <Input placeholder="Guest per Room" />
        <Input placeholder="Room Facility" />
        <Input placeholder="Room Image" />
      </section>
    </div>
  );
};

export default CreateRoomPage;

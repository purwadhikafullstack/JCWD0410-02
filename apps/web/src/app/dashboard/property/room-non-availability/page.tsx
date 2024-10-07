import RoomNonAvailabilityPage from '@/features/dashboard/property/roomNonAvailability';

const RoomNonAvailability = ({ params }: { params: { id: number } }) => {
  return <RoomNonAvailabilityPage roomId={params.id} />;
};

export default RoomNonAvailability;

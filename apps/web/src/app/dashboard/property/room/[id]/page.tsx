import UpdateRoomPage from '@/features/dashboard/property/room/update-delete';

const UpdateRoom = ({ params }: { params: { id: number } }) => {
  return <UpdateRoomPage roomId={params.id} />;
};

export default UpdateRoom;

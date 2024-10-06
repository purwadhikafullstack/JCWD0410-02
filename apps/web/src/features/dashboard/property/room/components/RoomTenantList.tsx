'use client';
import Pagination from '@/components/Pagination';
import RoomCard from '@/components/RoomTenantCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetRooms } from '@/hooks/api/room/useGetRooms';
import { useState } from 'react';

const RoomTenantList = () => {
  const [page, setPage] = useState(1);
  const { data, isPending } = useGetRooms({
    page,
    take: 4,
  });

  const onPageChange = ({ selected }: { selected: number }) => {
    setPage(selected + 1);
  };

  if (isPending) {
    return (
      <div className="container max-w-7xl mx-auto md:grid grid-cols-4 gap-5">
        <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
        <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
        <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
        <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
        <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
        <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
        <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
        <Skeleton className="relative h-[300px] w-full rounded-2xl overflow-hidden" />
      </div>
    );
  }

  if (!data) {
    return <h1>Room tidak ditemukan</h1>;
  }
  return (
    <>
      <h3 className="container max-w-7xl mx-auto font-semibold text-2xl mb-3 text-center md:text-left">
        Room
      </h3>
      <section className="container max-w-7xl mx-auto md:grid grid-cols-4 gap-5">
        {data?.data.map((room, index) => {
          return (
            <RoomCard
              key={index}
              id={room.id}
              guest={room.guest}
              imageUrl={room.roomImages?.[0]?.imageUrl}
              name={room.name}
              stock={room.stock}
              price={room.price}
            />
          );
        })}
      </section>
      <div className="container max-w-7xl mx-auto flex justify-center mt-10">
        <Pagination
          take={data.meta.take}
          total={data.meta.total}
          onPageChange={onPageChange}
          page={page}
        />
      </div>
    </>
  );
};

export default RoomTenantList;

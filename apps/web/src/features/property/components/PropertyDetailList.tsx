'use client';

import PropertyDetailCard from '@/components/PropertyDetailCard';
import useGetProperty from '@/hooks/api/property/useGetProperty';
import React, { FC } from 'react';

interface PropertyDetailPageProps {
  propertySlug: string;
}

const PropertyDetailList: FC<PropertyDetailPageProps> = ({ propertySlug }) => {
  const { data, isPending } = useGetProperty(propertySlug);

  if (isPending) {
    return <h1>Loading...</h1>;
  }

  if (!data) {
    return <h1>Property Room tidak ditemukan</h1>;
  }

  return (
    <>
      {data.rooms
        .filter((room) => !room.isDeleted)
        .map((room) => (
          <PropertyDetailCard
            key={room.id}
            roomId={room.id}
            name={room.name}
            imageUrl={room.roomImages[0]?.imageUrl || ''}
            guest={room.guest}
            price={room.price}
            roomFacilities={room.roomFacilities}
          />
        ))}
    </>
  );
};

export default PropertyDetailList;

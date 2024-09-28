'use client';
import Pagination from '@/components/Pagination';
import PropertyCard from '@/components/PropertyCard';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProperties } from '@/hooks/api/property/useGetProperties';
import { useState } from 'react';

const PropertyList = () => {
  const [page, setPage] = useState(1);
  const { data, isPending } = useGetProperties({
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
    return <h1>Property tidak ditemukan</h1>;
  }
  return (
    <>
      <h3 className="container max-w-7xl mx-auto font-semibold text-2xl mb-3 text-center md:text-left">
        Property
      </h3>
      <section className="container max-w-7xl mx-auto md:grid grid-cols-4 gap-5">
        {data?.data.map((property, index) => {
          return (
            <PropertyCard
              slug={property.slug}
              key={index}
              imageUrl={property.propertyImages[0]?.imageUrl}
              title={property.title}
              rating={property.reviews[0]?.rating}
              description={property.description}
              price={property.rooms[0]?.price}
              category={property.category}
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

export default PropertyList;

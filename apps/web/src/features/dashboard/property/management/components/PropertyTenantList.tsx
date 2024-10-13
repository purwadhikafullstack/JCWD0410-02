'use client';
import Pagination from '@/components/Pagination';
import PropertyTenantCard from '@/components/PropertyTenantCard';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetProperties } from '@/hooks/api/property/useGetProperties';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

const PropertyTenantList = () => {
  const session = useSession();
  const [page, setPage] = useState(1);
  const { data, isPending } = useGetProperties({
    page,
    take: 4,
    tenantId: Number(session.data?.user.id),
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
    return (
      <h5 className="container max-w-7xl mx-auto font-semibold mb-3 text-center md:text-left">
        Property Not Found
      </h5>
    );
  }
  return (
    <>
      <h3 className="container max-w-7xl mx-auto font-semibold text-2xl mb-3 text-center md:text-left">
        Property
      </h3>
      <section className="container max-w-7xl mx-auto md:grid grid-cols-4 gap-5">
        {data?.data
          .filter(
            (property) => property.tenantId === Number(session.data?.user.id),
          )
          .map((property, index) => {
            return (
              <PropertyTenantCard
                key={index}
                id={property.id}
                imageUrl={property.propertyImages[0]?.imageUrl}
                title={property.title}
                rating={property.reviews[0]?.rating}
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

export default PropertyTenantList;

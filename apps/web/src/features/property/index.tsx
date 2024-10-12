'use client';

import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import useGetProperty from '@/hooks/api/property/useGetProperty';
import Image from 'next/image';
import { FC } from 'react';
import { GoStarFill } from 'react-icons/go';
import { IoIosRestaurant } from 'react-icons/io';
import { IoWifi } from 'react-icons/io5';
import { LuAirVent } from 'react-icons/lu';
import { PiElevator, PiSwimmingPoolFill } from 'react-icons/pi';
import { TbClock24, TbParkingCircle } from 'react-icons/tb';
import PropertyDetailList from './components/PropertyDetailList';

interface PropertyDetailPageProps {
  propertySlug: string;
}

const PropertyDetailPage: FC<PropertyDetailPageProps> = ({ propertySlug }) => {
  const { data, isPending } = useGetProperty(propertySlug);

  const lat = data?.latitude;
  const long = data?.longitude;
  const zoom = 16;

  if (isPending) {
    return (
      <div className="container max-w-7xl mx-auto my-28 px-3 md:px-0 md:grid gap-5">
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
  return (
    <main className="max-w-7xl mx-auto my-28 px-3 md:px-0">
      <section>
        <div className="relative h-[500px] rounded-xl overflow-hidden">
          <Image
            src={data?.propertyImages[0]?.imageUrl!}
            alt="PropertyImage"
            className="object-cover"
            fill
          />
        </div>
        <h2 className="font-semibold text-2xl">{data?.title}</h2>
        <div className="flex items-center gap-1 mt-3">
          {data?.reviews[0]?.rating ? (
            <div className="flex items-center gap-1">
              <GoStarFill className="text-[#fbae2c]" />
              <p className="text-sm font-medium">{data?.reviews[0]?.rating}</p>
            </div>
          ) : (
            <div className="flex items-center gap-1">
              <GoStarFill className="text-[#fbae2c]" />
              <p className="text-sm font-medium">0</p>
            </div>
          )}

          <Badge variant="secondary">{data?.propertycategory.name}</Badge>
          <p>| by {data?.tenant.name}</p>
        </div>
        <div className="border-t-2 mt-5 border-gray-200"></div>
        <h3 className="font-semibold text-xl mt-5">Description</h3>
        <p className="mt-2 text-justify">{data?.description}</p>
      </section>
      <iframe
        src={`https://maps.google.com/maps?q=${lat},${long}&z=${zoom}&output=embed`}
        width="100%"
        height="450"
        className="mt-10 rounded-xl"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <section className="mt-10 space-y-5">
        <h3 className="font-semibold text-xl">
          Available Room Types in {data?.title}
        </h3>
        <div className="grid md:grid-cols-2 gap-10">
          <PropertyDetailList propertySlug={propertySlug} />
        </div>
      </section>
    </main>
  );
};

export default PropertyDetailPage;

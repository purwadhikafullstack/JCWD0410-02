'use client';

import Image from 'next/image';
import { FC } from 'react';
import { Card, CardHeader } from './ui/card';
import { RoomFacility } from '@/types/roomFacility';
import ReservationForm from '@/features/reservation-room';
import { FaSquareCheck } from 'react-icons/fa6';

interface PropertyDetailCardProps {
  roomId: number;
  name: string;
  imageUrl: string;
  roomFacilities: RoomFacility[];
  price: number;
  guest: number;
  transactionId?: number;
}

const PropertyDetailCard: FC<PropertyDetailCardProps> = ({
  roomId,
  name,
  imageUrl,
  roomFacilities,
  price,
  guest,
  transactionId,
}) => {
  return (
    <Card className="mt-7 md:mt-0">
      <div className="relative h-[300px] overflow-hidden rounded-lg">
        <Image src={imageUrl} alt="RoomImage" fill className="object-cover" />
      </div>
      <CardHeader>
        <section className="grid md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-xl text-center"> {name}</h4>
            <p className="text-center">Room for {guest} people</p>
          </div>
          <div>
            <h4 className="font-semibold text-base text-center mt-7 md:mt-0">
              Price/room/night
            </h4>
            <p className="text-[#396ee4] font-medium text-xl text-center">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(price)}
            </p>
          </div>
          <div className="text-center md:text-left">
            <h5 className="font-semibold text-base mt-14">Room Facilities</h5>
            <div className="grid gap-x-3 justify-center md:justify-start">
              {roomFacilities.map((facilities) => (
                <div key={facilities.id}>
                  <div className="flex items-center gap-3 justify-center md:justify-start">
                    <FaSquareCheck className="text-green-500" />
                    <h5 className="font-medium line-clamp-1">
                      {facilities.title}
                    </h5>
                  </div>
                  <p className="pl-7 text-center md:text-justify line-clamp-3 md:pr-10">
                    {facilities.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-14">
            <ReservationForm
              roomId={roomId}
              price={price}
              transactionId={transactionId}
            />
          </div>
        </section>
      </CardHeader>
    </Card>
  );
};

export default PropertyDetailCard;

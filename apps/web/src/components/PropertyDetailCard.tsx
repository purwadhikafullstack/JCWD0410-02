'use client';

import Image from 'next/image';
import { FC } from 'react';
import { Card, CardHeader } from './ui/card';
import { RoomFacility } from '@/types/roomFacility';
import ReservationForm from '@/features/reservation-room';

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
    <Card className="grid md:grid-cols-2">
      <CardHeader>
        <h4 className="font-semibold text-lg">{name}</h4>
        <div className="relative h-[300px] overflow-hidden rounded-lg">
          <Image src={imageUrl} alt="RoomImage" fill className="object-cover" />
        </div>
        <h5 className="font-semibold text-base">Room Facilities</h5>
        <div className="grid grid-cols-2 gap-x-3">
          {roomFacilities.map((facilities) => (
            <div key={facilities.id}>
              <p>{facilities.title}</p>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardHeader className="justify-between my-20">
        <div>
          <h4 className="font-semibold text-base text-center">Price/room/night</h4>
          <p className="text-[#396ee4] font-medium text-xl text-center">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(price)}
          </p>
          <p className="text-center">Room for {guest} people</p>
        </div>
        <div>
          <ReservationForm roomId={roomId} price={price} transactionId={transactionId} />
        </div>
      </CardHeader>
    </Card>
  );
};

export default PropertyDetailCard;

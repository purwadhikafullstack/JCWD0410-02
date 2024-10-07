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
    <Card className="grid md:grid-cols-2">
      {/* Bagian kiri card yang berisi detail properti */}
      <CardHeader>
        <h4 className="font-semibold text-lg">{name}</h4>
        <div className="relative h-[300px] overflow-hidden rounded-lg">
          <Image src={imageUrl} alt="RoomImage" fill className="object-cover" />
        </div>
        <h5 className="font-semibold text-base">Room Facilities</h5>
        <div className="grid gap-x-3">
          {roomFacilities.map((facilities) => (
            <div key={facilities.id}>
              <div className="flex items-center gap-3 ">
                <FaSquareCheck className="text-green-500" />
                <h5 className="font-medium line-clamp-1">{facilities.title}</h5>
              </div>
              <p className="pl-7 text-justify line-clamp-3">
                {facilities.description}
              </p>
            </div>
          ))}
        </div>
      </CardHeader>

      {/* Bagian kanan card yang berisi harga dan form reservasi */}
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
          {/* Komponen ReservationForm yang digunakan untuk pemesanan */}
          <ReservationForm roomId={roomId} price={price} transactionId={transactionId} />
        </div>
      </CardHeader>
    </Card>
  );
};

export default PropertyDetailCard;

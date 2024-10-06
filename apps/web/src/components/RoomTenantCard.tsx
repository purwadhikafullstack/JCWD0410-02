import Image from 'next/image';
import { FC } from 'react';
import { DatePickerWithRange } from './DateRangePicker';
import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';
import { RoomFacility } from '@/types/roomFacility';
import { FaSquareCheck } from 'react-icons/fa6';
import Link from 'next/link';

interface RoomCardProps {
  id: number;
  name: string;
  stock: number;
  price: number;
  guest: number;
  imageUrl: string;
}
const RoomCard: FC<RoomCardProps> = ({
  id,
  name,
  stock,
  price,
  guest,
  imageUrl,
}) => {
  return (
    <Link href={`/dashboard/property/room/${id}`}>
      <Card>
        <CardHeader>
          <h4 className="font-semibold text-lg">{name}</h4>
          <div className="relative h-[300px] overflow-hidden rounded-lg">
            <Image
              src={imageUrl}
              alt="RoomImage"
              fill
              className="object-cover"
            ></Image>
          </div>
        </CardHeader>
        <CardHeader>
          <div className="-mt-7">
            <div>
              <h4 className="font-semibold text-base text-center">
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
            <div className="mt-3">
              <p className="text-center">Room for {guest} people</p>
              <p className="text-center">Stock: {stock} Rooms</p>
            </div>
          </div>
        </CardHeader>
      </Card>
    </Link>
  );
};

export default RoomCard;

import Image from 'next/image';
import { FC } from 'react';
import { DatePickerWithRange } from './DateRangePicker';
import { Button } from './ui/button';
import { Card, CardHeader } from './ui/card';
import { RoomFacility } from '@/types/roomFacility';
import { FaSquareCheck } from 'react-icons/fa6';

interface PropertyDetailCardProps {
  name: string;
  imageUrl: string;
  roomFacilities: RoomFacility[];
  price: number;
  guest: number;
}
const PropertyDetailCard: FC<PropertyDetailCardProps> = ({
  name,
  imageUrl,
  roomFacilities,
  price,
  guest,
}) => {
  return (
    <Card className="grid md:grid-cols-2">
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
        <h5 className="font-semibold text-base">Room Facilities</h5>
        <div className="grid gap-x-3">
          {roomFacilities.map((facilities) => {
            return (
              <div key={facilities.id}>
                <div className="flex items-center gap-3 ">
                  <div>
                    <FaSquareCheck className="text-green-500" />
                  </div>
                  <h5 className="font-medium line-clamp-1">
                    {facilities.title}
                  </h5>
                </div>
                <p className="pl-7 text-justify line-clamp-3">
                  {facilities.description}
                </p>
              </div>
            );
          })}
        </div>
      </CardHeader>
      <CardHeader className="justify-between my-28">
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
          <p className="text-center">Room for {guest} people</p>
        </div>
        <div>
          <DatePickerWithRange />
          <Button className="w-full">Choose</Button>
        </div>
      </CardHeader>
    </Card>
  );
};

export default PropertyDetailCard;

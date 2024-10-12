import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { FC } from 'react';
import { Badge } from './ui/badge';
import { GoStarFill } from 'react-icons/go';
import Link from 'next/link';

interface PropertyCardProps {
  imageUrl: string;
  title: string;
  rating: number;
  id: number;
}

const PropertyTenantCard: FC<PropertyCardProps> = ({
  imageUrl,
  title,
  rating,
  id,
}) => {
  return (
    <Link href={`/dashboard/property/management/${id}`}>
      <Card className="space-y-1">
        <CardHeader>
          <div className="relative h-[225px] w-full rounded-2xl overflow-hidden">
            <Image
              src={imageUrl}
              alt="thumbnail"
              fill
              className="object-cover"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
            {rating ? (
              <div className="flex items-center gap-1">
                <GoStarFill className="text-[#fbae2c]" />
                <p className="text-sm font-medium">{rating}</p>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <GoStarFill className="text-slate-200" />
                <p className="text-sm font-medium">0</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyTenantCard;

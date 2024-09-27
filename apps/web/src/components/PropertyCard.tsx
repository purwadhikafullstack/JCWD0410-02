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

interface PropertyCardProps {
  imageUrl: string;
  title: string;
  rating: number;
  description: string;
  price: number;
  category: string;
}

const PropertyCard: FC<PropertyCardProps> = ({
  imageUrl,
  title,
  rating,
  description,
  category,
  price,
}) => {
  return (
    <Card className="space-y-1">
      <CardHeader>
        <div className="relative h-[225px] w-full rounded-2xl overflow-hidden">
          <Image src={imageUrl} alt="thumbnail" fill className="object-cover" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center">
          <CardTitle className="text-base line-clamp-1">{title}</CardTitle>
          <div className="flex items-center gap-1">
            <GoStarFill className="text-[#fbae2c]" />
            <p className="text-sm font-medium">{rating}</p>
          </div>
        </div>
        <CardDescription className="line-clamp-3 my-3">
          {description}
        </CardDescription>
        <div className="flex justify-between">
          <p className="text-[#396ee4] font-medium">
            {new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(price)}
          </p>
          <Badge variant="secondary">{category}</Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;

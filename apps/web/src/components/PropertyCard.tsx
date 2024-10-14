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
  description: string;
  price: number;
  category: string;
  slug: string;
}

const PropertyCard: FC<PropertyCardProps> = ({
  imageUrl,
  title,
  rating,
  description,
  category,
  price,
  slug,
}) => {
  return (
    <Link href={`/property/${slug}`}>
      <Card className="space-y-1 rounded-2xl overflow-hidden mt-7 md:mt-0">
        <div className="relative h-[225px] w-full overflow-hidden rounded-b-md">
          <Image src={imageUrl} alt="thumbnail" fill className="object-cover" />
        </div>
        <CardContent>
          <div className="flex justify-between items-center mt-5">
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
    </Link>
  );
};

export default PropertyCard;

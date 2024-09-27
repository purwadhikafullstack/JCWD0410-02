import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import React from 'react';
import Image from 'next/image';
import { Card, CardContent } from './ui/card';
import Link from 'next/link';

const BestDeals = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  const imagePaths = [
    '/BestDeals1.svg',
    '/BestDeals2.svg',
    '/BestDeals3.svg',
    '/BestDeals4.svg',
    '/BestDeals5.svg',
  ];

  return (
    <div className="container max-w-7xl mx-auto">
      <h3 className="font-semibold text-2xl mb-3 text-center md:text-left">
        Best deals for a price-less travel!
      </h3>
      <div>
        <Carousel plugins={[plugin.current]} className="mx-auto">
          <CarouselContent className="mx-auto -ml-1">
            {imagePaths.map((src, index) => (
              <CarouselItem
                key={index}
                className="pl-1 md:basis-1/2 lg:basis-1/3"
              >
                <div className="p-1">
                  <Card>
                    <CardContent className="flex h-[200px] items-center justify-center p-6 overflow-hidden">
                      <Link href="/">
                        <Image
                          src={src}
                          alt={`Deal image ${index + 1}`}
                          width={500}
                          height={200}
                        />
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </Carousel>
      </div>
    </div>
  );
};

export default BestDeals;

'use client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import React from 'react';

export const Jumbotron = () => {
  const pathname = usePathname();
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/lupa-password' ||
    pathname === '/reset-password' ||
    pathname === '/ubah-password' ||
    pathname === '/register/thanks' ||
    pathname === '/forgot-password' ||
    pathname.startsWith('/verification') ||
    pathname.startsWith('/reset-password') ||
    pathname.startsWith('/dashboard')
  ) {
    return null;
  }
  return (
    <div className="w-full overflow-hidden">
      <div>
        <div className="absolute z-[15] flex flex-col gap-12 items-center justify-center inset-0 h-[85vh] md:h-[70vh]">
          <p className="drop-shadow font-bold text-3xl md:text-5xl w-[50%] lg:w-full text-center text-white">
            Find the accommodation of your next adventure
          </p>
        </div>
        <Carousel plugins={[plugin.current]}>
          <CarouselContent className="h-[600px]">
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/HeroSection_Image1.svg"
                alt="HeroSection_Image1"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/HeroSection_Image2.svg"
                alt="HeroSection_Image2"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/HeroSection_Image3.svg"
                alt="HeroSection_Image3"
                fill
                className="object-cover"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
      <div className="grid grid-cols-3"></div>
    </div>
  );
};

{
  /* <p onClick={() => signOut()} className="cursor-pointer">
        sign out
      </p> */
}

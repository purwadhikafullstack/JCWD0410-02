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
    <div>
      <div className="w-full overflow-hidden rounded-b-3xl relative">
        <div className="absolute z-[15] flex flex-col items-center justify-center inset-0 h-[70vh] md:h-[65vh]">
          <p className="drop-shadow-2xl font-bold w-[60%] text-3xl md:text-5xl md:w-[50%] lg:w-full text-center text-white leading-snug">
            Easy Living, Cozy Feels
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
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/HeroSection_Image4.svg"
                alt="HeroSection_Image4"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/HeroSection_Image5.svg"
                alt="HeroSection_Image5"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/HeroSection_Image6.svg"
                alt="HeroSection_Image6"
                fill
                className="object-cover"
              />
            </CarouselItem>
            <CarouselItem className="relative w-full overflow-hidden">
              <Image
                src="/HeroSection_Image7.svg"
                alt="HeroSection_Image7"
                fill
                className="object-cover"
              />
            </CarouselItem>
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
};

{
  /* <p onClick={() => signOut()} className="cursor-pointer">
        sign out
      </p> */
}

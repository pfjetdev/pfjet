'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Plane, X, ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface EmptyLegFlightInfoProps {
  aircraftName: string;
  aircraftCategory: string;
  fromCode: string;
  fromCity: string;
  toCode: string;
  toCity: string;
  departureTime: string;
  departureDate: string;
  arrivalTime: string;
  arrivalDate: string;
  duration: string;
  aircraftImage?: string;
  aircraftGallery?: string[];
}

export default function EmptyLegFlightInfo({
  aircraftName,
  aircraftCategory,
  fromCode,
  fromCity,
  toCode,
  toCity,
  departureTime,
  departureDate,
  arrivalTime,
  arrivalDate,
  duration,
  aircraftImage = '/aircraft/light.png',
  aircraftGallery = []
}: EmptyLegFlightInfoProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Use gallery if available, otherwise use single image
  const gallery = aircraftGallery.length > 0 ? aircraftGallery : [aircraftImage];

  // Sync carousel with lightbox index
  useEffect(() => {
    if (!carouselApi) return;

    carouselApi.scrollTo(lightboxImageIndex);

    const onSelect = () => {
      setLightboxImageIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on('select', onSelect);
    return () => {
      carouselApi.off('select', onSelect);
    };
  }, [carouselApi, lightboxImageIndex]);

  return (
    <div className="bg-white dark:bg-card rounded-2xl sm:rounded-[24px] overflow-hidden px-4 sm:px-6 py-3 sm:py-3">
      <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
        {/* Left Side - Flight Information */}
        <div className="flex flex-col gap-4 sm:gap-6 w-full md:w-[414px] shrink-0">
          {/* Header - Aircraft Name and Category */}
          <div className="flex items-center justify-between w-full leading-normal">
            <p
              className="font-medium text-[#0f142e] dark:text-foreground text-sm sm:text-[18px] tracking-[0.9px]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {aircraftName}
            </p>
            <p
              className="font-normal text-[#959595] dark:text-muted-foreground text-[11px] sm:text-[13px] tracking-[0.65px]"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {aircraftCategory}
            </p>
          </div>

          {/* Flight Route - Large Airport Codes */}
          <div className="flex gap-6 sm:gap-[48px] items-center py-2 sm:py-3 w-full">
            {/* From Code */}
            <div className="flex flex-col leading-normal">
              <p
                className="font-semibold text-[#0f142e] dark:text-foreground text-3xl sm:text-[48px] tracking-[1.8px] sm:tracking-[2.4px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {fromCode}
              </p>
              <p
                className="font-semibold text-[#0f142e] dark:text-foreground text-[10px] sm:text-[12px] tracking-[0.6px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {fromCity}
              </p>
            </div>

            {/* Plane Icon with lines */}
            <div className="flex flex-1 gap-2 sm:gap-[12px] items-center justify-center min-w-0 min-h-0">
              <div className="h-0 w-3 sm:w-[20px] relative shrink-0">
                <div className="absolute inset-0 top-[-1px]">
                  <div className="h-[1px] w-full bg-[#959595] dark:bg-muted-foreground"></div>
                </div>
              </div>
              <Plane className="w-5 h-5 sm:w-6 sm:h-6 text-[#0f142e] dark:text-foreground rotate-90 shrink-0" strokeWidth={2} />
              <div className="h-0 w-3 sm:w-[20px] relative shrink-0">
                <div className="absolute inset-0 top-[-1px]">
                  <div className="h-[1px] w-full bg-[#959595] dark:bg-muted-foreground"></div>
                </div>
              </div>
            </div>

            {/* To Code */}
            <div className="flex flex-col items-end justify-center leading-normal">
              <p
                className="font-semibold text-[#0f142e] dark:text-foreground text-3xl sm:text-[48px] tracking-[1.8px] sm:tracking-[2.4px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {toCode}
              </p>
              <p
                className="font-semibold text-[#0f142e] dark:text-foreground text-[10px] sm:text-[12px] tracking-[0.6px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {toCity}
              </p>
            </div>
          </div>

          {/* Flight Times and Duration */}
          <div className="flex items-center justify-between h-auto sm:h-[60px] relative w-full">
            {/* Departure */}
            <div className="flex flex-col items-start justify-center leading-normal text-[#0f142e] dark:text-foreground">
              <p
                className="font-bold text-sm sm:text-[18px] tracking-[0.9px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {departureTime}
              </p>
              <p
                className="font-medium text-[10px] sm:text-[12px] tracking-[0.6px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {departureDate}
              </p>
            </div>

            {/* Duration - Centered */}
            <div className="flex flex-col items-center justify-center absolute left-1/2 -translate-x-1/2 top-0 sm:top-[7px] leading-normal text-[#0f142e] dark:text-foreground">
              <p
                className="font-medium text-xs sm:text-[15px] tracking-[0.75px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {duration}
              </p>
              <p
                className="font-medium text-[10px] sm:text-[12px] tracking-[0.6px] whitespace-nowrap"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Flight Duration
              </p>
            </div>

            {/* Arrival */}
            <div className="flex flex-col items-end justify-center leading-normal text-[#0f142e] dark:text-foreground">
              <p
                className="font-bold text-sm sm:text-[18px] tracking-[0.9px] uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {arrivalTime}
              </p>
              <p
                className="font-medium text-[10px] sm:text-[12px] tracking-[0.6px]"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {arrivalDate}
              </p>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="hidden md:block w-[1px] bg-[#959595] dark:bg-border self-stretch"></div>

        {/* Right Side - Aircraft Gallery */}
        <div className="flex flex-1 flex-col gap-2 items-start overflow-hidden py-3 self-stretch min-w-0 min-h-0">
          {/* Main Image */}
          <button
            onClick={() => {
              setLightboxImageIndex(0);
              setIsLightboxOpen(true);
            }}
            className="relative w-full aspect-[16/9] overflow-hidden rounded-xl group cursor-pointer"
          >
            <Image
              src={gallery[0]}
              alt={aircraftName}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-black/90 rounded-full p-2 shadow-lg">
                <ZoomIn className="w-4 h-4 text-foreground" />
              </div>
            </div>
          </button>

          {/* Thumbnail Row */}
          {gallery.length > 1 && (
            <div className="grid grid-cols-4 gap-1.5 w-full h-[50px]">
              {gallery.slice(1, 5).map((image, index) => {
                const actualIndex = index + 1;
                const isLastVisible = actualIndex === 4;
                const remainingImages = gallery.length - 5;
                const shouldShowCounter = isLastVisible && remainingImages > 0;

                return (
                  <button
                    key={actualIndex}
                    onClick={() => {
                      setLightboxImageIndex(actualIndex);
                      setIsLightboxOpen(true);
                    }}
                    className="relative overflow-hidden rounded-lg group cursor-pointer"
                  >
                    <Image
                      src={image}
                      alt={`${aircraftName} - ${actualIndex + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="80px"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />

                    {shouldShowCounter && (
                      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                        <span className="text-white text-sm font-bold">+{remainingImages}</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[100vw] md:max-w-[95vw] w-full h-[100vh] md:h-[95vh] p-0 bg-black border-0 rounded-none md:rounded-lg">
          <VisuallyHidden>
            <DialogTitle>{aircraftName} Gallery</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex flex-col">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/60 to-transparent">
              <div className="bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                <span className="text-white text-xs md:text-sm font-medium">
                  {lightboxImageIndex + 1} / {gallery.length}
                </span>
              </div>

              <DialogClose className="rounded-full bg-white/10 hover:bg-white/20 p-2 transition-all duration-300 backdrop-blur-sm">
                <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>

            {/* Carousel */}
            <div className="flex-1 flex items-center justify-center pt-16 pb-24 md:pt-20 md:pb-28">
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "center",
                  loop: true,
                  startIndex: lightboxImageIndex,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {gallery.map((image, index) => (
                    <CarouselItem key={index} className="pl-0">
                      <div className="relative w-full h-[35vh] md:h-[60vh] mx-auto">
                        <Image
                          src={image}
                          alt={`${aircraftName} - ${index + 1}`}
                          fill
                          className="object-contain"
                          priority={index === lightboxImageIndex}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Arrows - Desktop only */}
                <CarouselPrevious className="hidden md:flex left-4 h-12 w-12 bg-white/10 hover:bg-white/20 border-0 backdrop-blur-sm text-white" />
                <CarouselNext className="hidden md:flex right-4 h-12 w-12 bg-white/10 hover:bg-white/20 border-0 backdrop-blur-sm text-white" />
              </Carousel>
            </div>

            {/* Thumbnail Navigation */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] md:max-w-[90vw] overflow-x-auto scrollbar-hide">
              <div className="flex gap-1.5 md:gap-2 p-1.5 md:p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                {gallery.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setLightboxImageIndex(index)}
                    className={`
                      relative flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-md overflow-hidden border-2 transition-all duration-300
                      ${
                        lightboxImageIndex === index
                          ? "border-white scale-105 md:scale-110 shadow-lg"
                          : "border-white/30 hover:border-white/60 opacity-60 hover:opacity-100"
                      }
                    `}
                  >
                    <Image
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Plane,
  Users,
  Gauge,
  Briefcase,
  ArrowLeft,
  CheckCircle2,
  X,
  ZoomIn,
} from "lucide-react";
import { getAircraftBySlug, getAircraftByCategory, Aircraft } from "@/lib/supabase-client";
import { Skeleton } from "@/components/ui/skeleton";

export default function AircraftModelPage() {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const model = params.model as string;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImageIndex, setLightboxImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  // Sync carousel with lightboxImageIndex
  useEffect(() => {
    if (carouselApi && isLightboxOpen) {
      carouselApi.scrollTo(lightboxImageIndex);
    }
  }, [carouselApi, lightboxImageIndex, isLightboxOpen]);

  // Update lightboxImageIndex when carousel changes
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setLightboxImageIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);
  const [aircraftData, setAircraftData] = useState<Aircraft | null>(null);
  const [categoryModels, setCategoryModels] = useState<Aircraft[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAircraft() {
      setLoading(true);

      // Load current aircraft
      const aircraft = await getAircraftBySlug(category, model);
      setAircraftData(aircraft);

      // Load other models in this category
      const models = await getAircraftByCategory(category);
      setCategoryModels(models);

      setLoading(false);
    }

    loadAircraft();
  }, [category, model]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background transition-colors duration-300">
        <main className="pt-6 px-4 pb-12">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Back Button Skeleton */}
            <Skeleton className="h-10 w-32 rounded-md" />

            {/* Header Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-12 w-80" />
            </div>

            {/* Main Content Skeleton */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Left Column - 70% */}
              <div className="lg:w-[70%] space-y-6">
                {/* Gallery Skeleton - Bento Grid */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-4 gap-3 h-[500px]">
                      {/* Large Image Skeleton */}
                      <Skeleton className="col-span-2 row-span-2 rounded-lg" />
                      {/* Small Images Skeleton */}
                      {Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="rounded-lg" />
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Specifications Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                    <Skeleton className="h-4 w-64 mt-2" />
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                          <Skeleton className="w-5 h-5 rounded" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Description & Features Skeleton */}
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-48" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div>
                      <Skeleton className="h-5 w-32 mb-3" />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="flex items-center space-x-2">
                            <Skeleton className="w-4 h-4 rounded-full flex-shrink-0" />
                            <Skeleton className="h-4 flex-1" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - 30% */}
              <div className="lg:w-[30%]">
                <Card className="sticky top-6">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-5 h-5 rounded" />
                      <Skeleton className="h-6 w-48" />
                    </div>
                    <Skeleton className="h-4 w-40 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full rounded-lg" />
                    ))}
                    <div className="pt-4 border-t border-border">
                      <Skeleton className="h-11 w-full rounded-md" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  if (!aircraftData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Aircraft Not Found</h1>
          <Button onClick={() => router.push("/aircraft")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fleet
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <main className="pt-6 px-4 pb-12">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => router.push("/aircraft")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Fleet
          </Button>

          {/* Header */}
          <div className="space-y-2">
            <Badge variant="outline" className="mb-2">
              {aircraftData.category}
            </Badge>
            <h1
              className="text-4xl md:text-5xl font-medium text-foreground tracking-[2.4px]"
              style={{ fontFamily: "Clash Display, sans-serif" }}
            >
              {aircraftData.name}
            </h1>
          </div>

          {/* Main Content */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Column - 70% */}
            <div className="lg:w-[70%] space-y-6">
              {/* Gallery - Mobile: 1 large + row of small | Desktop: 2 top + 3 bottom */}
              <Card>
                <CardContent className="px-4 py-0">
                  {/* Mobile Layout */}
                  <div className="flex flex-col gap-2 md:hidden">
                    {/* Main large image */}
                    {aircraftData.gallery[0] && (
                      <button
                        onClick={() => {
                          setLightboxImageIndex(0);
                          setIsLightboxOpen(true);
                        }}
                        className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted group cursor-pointer"
                      >
                        <Image
                          src={aircraftData.gallery[0]}
                          alt={`${aircraftData.name} - Image 1`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          priority
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-black/90 rounded-full p-3 shadow-lg">
                            <ZoomIn className="w-5 h-5 text-foreground" />
                          </div>
                        </div>
                      </button>
                    )}

                    {/* Small images row */}
                    <div className="grid grid-cols-4 gap-2 h-[60px]">
                      {[1, 2, 3, 4].map((index) => {
                        const imageExists = aircraftData.gallery[index];
                        const isLastImage = index === 4;
                        const remainingImages = aircraftData.gallery.length - 5;
                        const shouldShowCounter = isLastImage && remainingImages > 0;

                        if (!imageExists) return null;

                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setLightboxImageIndex(index);
                              setIsLightboxOpen(true);
                            }}
                            className="relative rounded-lg overflow-hidden bg-muted group cursor-pointer"
                          >
                            <Image
                              src={aircraftData.gallery[index]}
                              alt={`${aircraftData.name} - Image ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-black/90 rounded-full p-1.5 shadow-lg">
                                <ZoomIn className="w-3 h-3 text-foreground" />
                              </div>
                            </div>

                            {/* Counter Overlay for last image if there are more */}
                            {shouldShowCounter && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-white text-lg font-bold">
                                  +{remainingImages}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Desktop Layout */}
                  <div className="hidden md:flex flex-col gap-2">
                    {/* Top row - 2 images */}
                    <div className="grid grid-cols-2 gap-2 h-[280px]">
                      {[0, 1].map((index) => {
                        const imageExists = aircraftData.gallery[index];
                        if (!imageExists) return null;

                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setLightboxImageIndex(index);
                              setIsLightboxOpen(true);
                            }}
                            className="relative rounded-lg overflow-hidden bg-muted group cursor-pointer"
                          >
                            <Image
                              src={aircraftData.gallery[index]}
                              alt={`${aircraftData.name} - Image ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              priority={index === 0}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-black/90 rounded-full p-3 shadow-lg">
                                <ZoomIn className="w-5 h-5 text-foreground" />
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Bottom row - 3 images */}
                    <div className="grid grid-cols-3 gap-2 h-[180px]">
                      {[2, 3, 4].map((index) => {
                        const imageExists = aircraftData.gallery[index];
                        const isLastImage = index === 4;
                        const remainingImages = aircraftData.gallery.length - 5;
                        const shouldShowCounter = isLastImage && remainingImages > 0;

                        if (!imageExists) return null;

                        return (
                          <button
                            key={index}
                            onClick={() => {
                              setLightboxImageIndex(index);
                              setIsLightboxOpen(true);
                            }}
                            className="relative rounded-lg overflow-hidden bg-muted group cursor-pointer"
                          >
                            <Image
                              src={aircraftData.gallery[index]}
                              alt={`${aircraftData.name} - Image ${index + 1}`}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 dark:bg-black/90 rounded-full p-2 shadow-lg">
                                <ZoomIn className="w-4 h-4 text-foreground" />
                              </div>
                            </div>

                            {/* Counter Overlay for last image if there are more */}
                            {shouldShowCounter && (
                              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                <span className="text-white text-3xl font-bold">
                                  +{remainingImages}
                                </span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Specifications */}
              <Card>
                <CardHeader>
                  <CardTitle>Specifications</CardTitle>
                  <CardDescription>
                    Technical details and performance metrics
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <Users className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Passengers</p>
                        <p className="text-sm font-semibold text-foreground">
                          {aircraftData.passengers}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <Plane className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Range</p>
                        <p className="text-sm font-semibold text-foreground">
                          {aircraftData.range}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <Gauge className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Speed</p>
                        <p className="text-sm font-semibold text-foreground">
                          {aircraftData.speed}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <Briefcase className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Baggage</p>
                        <p className="text-sm font-semibold text-foreground">
                          {aircraftData.baggage}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-5 h-5 text-primary mt-0.5 flex items-center justify-center text-xs font-bold">
                        H
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cabin Height</p>
                        <p className="text-sm font-semibold text-foreground">
                          {aircraftData.cabin_height}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-5 h-5 text-primary mt-0.5 flex items-center justify-center text-xs font-bold">
                        W
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Cabin Width</p>
                        <p className="text-sm font-semibold text-foreground">
                          {aircraftData.cabin_width}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Description & Features */}
              <Card>
                <CardHeader>
                  <CardTitle>About This Aircraft</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {aircraftData.full_description}
                  </p>
                  <div>
                    <h3 className="font-semibold text-foreground mb-3">Key Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {aircraftData.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - 30% */}
            <div className="lg:w-[30%]">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plane className="w-5 h-5 text-primary" />
                    Available {aircraftData.category} Models
                  </CardTitle>
                  <CardDescription>
                    Explore other aircraft in this category
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categoryModels.map((aircraft) => (
                    <button
                      key={aircraft.slug}
                      onClick={() => router.push(`/aircraft/${category}/${aircraft.slug}`)}
                      className={`
                        w-full text-left p-4 rounded-lg border transition-all
                        ${
                          aircraft.slug === model
                            ? "bg-primary border-primary text-primary-foreground"
                            : "bg-card border-border hover:border-primary hover:bg-card/80"
                        }
                      `}
                    >
                      <h3 className="font-semibold text-sm mb-1">{aircraft.name}</h3>
                      <p className={`text-xs ${
                        aircraft.slug === model
                          ? "text-primary-foreground/80"
                          : "text-muted-foreground"
                      }`}>
                        {aircraft.passengers} • {aircraft.range}
                      </p>
                    </button>
                  ))}

                  <div className="pt-4 border-t border-border">
                    <Button className="w-full" size="lg">
                      Request a Quote
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Fullscreen Lightbox Dialog */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-[100vw] md:max-w-[95vw] w-full h-[100vh] md:h-[95vh] p-0 bg-black border-0 rounded-none md:rounded-lg">
          <VisuallyHidden>
            <DialogTitle>{aircraftData.name} Gallery</DialogTitle>
          </VisuallyHidden>
          <div className="relative w-full h-full flex flex-col">
            {/* Header - Mobile optimized */}
            <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-3 md:p-4 bg-gradient-to-b from-black/60 to-transparent">
              {/* Aircraft Name - Hidden on mobile for cleaner look */}
              <div className="hidden md:block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-white text-sm font-medium">
                  {aircraftData.name}
                </span>
              </div>

              {/* Image Counter - Centered on mobile */}
              <div className="md:absolute md:left-1/2 md:-translate-x-1/2 bg-white/10 backdrop-blur-sm px-3 py-1.5 md:px-4 md:py-2 rounded-full">
                <span className="text-white text-xs md:text-sm font-medium">
                  {lightboxImageIndex + 1} / {aircraftData.gallery.length}
                </span>
              </div>

              {/* Close Button */}
              <DialogClose className="rounded-full bg-white/10 hover:bg-white/20 p-2 transition-all duration-300 backdrop-blur-sm ml-auto">
                <X className="h-5 w-5 md:h-6 md:w-6 text-white" />
                <span className="sr-only">Close</span>
              </DialogClose>
            </div>

            {/* Carousel - Full screen on mobile */}
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
                  {aircraftData.gallery.map((image, index) => (
                    <CarouselItem key={index} className="pl-0">
                      <div className="relative w-full h-[35vh] md:h-[60vh] mx-auto">
                        <Image
                          src={image}
                          alt={`${aircraftData.name} - Image ${index + 1}`}
                          fill
                          className="object-contain"
                          priority={index === lightboxImageIndex}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Navigation Arrows - Hidden on mobile, use swipe instead */}
                <CarouselPrevious className="hidden md:flex left-4 h-12 w-12 bg-white/10 hover:bg-white/20 border-0 backdrop-blur-sm text-white" />
                <CarouselNext className="hidden md:flex right-4 h-12 w-12 bg-white/10 hover:bg-white/20 border-0 backdrop-blur-sm text-white" />
              </Carousel>
            </div>

            {/* Thumbnail Navigation - Smaller on mobile */}
            <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-[95vw] md:max-w-[90vw] overflow-x-auto scrollbar-hide">
              <div className="flex gap-1.5 md:gap-2 p-1.5 md:p-2 bg-white/10 backdrop-blur-sm rounded-lg">
                {aircraftData.gallery.map((image, index) => (
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

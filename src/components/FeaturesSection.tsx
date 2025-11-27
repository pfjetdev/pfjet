'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRight, X, Percent, Shield, Clock, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/useIsMobile";

const features = [
  {
    title: "Save Up to 75% with Empty Legs",
    icon: Percent,
    description: "Empty leg flights occur when a private jet needs to reposition after dropping off passengers. Instead of flying empty, these flights are offered at significantly reduced rates.",
    benefits: [
      "Savings of 50-75% compared to standard charter prices",
      "Same luxury experience at a fraction of the cost",
      "Access to premium aircraft at budget-friendly rates",
      "Perfect for flexible travelers"
    ],
    cta: "Browse empty legs"
  },
  {
    title: "Maximum Comfort and Privacy",
    icon: Sparkles,
    description: "Experience unparalleled luxury in the skies. Our private jets offer the ultimate in comfort and privacy, allowing you to work, relax, or sleep in complete peace.",
    benefits: [
      "Spacious cabins with premium leather seating",
      "Full privacy for confidential meetings",
      "Customizable catering to your preferences",
      "Quiet, peaceful environment without crowds"
    ],
    cta: "Explore our fleet"
  },
  {
    title: "Flexibility and Spontaneity",
    icon: Clock,
    description: "Fly on your schedule, not the airline's. With private jet travel, you choose when and where to fly, with the ability to change plans at short notice.",
    benefits: [
      "Depart when you're ready, no fixed schedules",
      "Access to 5,000+ airports worldwide",
      "Last-minute bookings available",
      "Multi-city trips without connections"
    ],
    cta: "Plan your trip"
  },
  {
    title: "Guaranteed Safety and Quality",
    icon: Shield,
    description: "Your safety is our top priority. We partner only with operators that meet the highest safety standards and maintain rigorous quality controls.",
    benefits: [
      "All operators vetted and certified",
      "Aircraft maintained to highest standards",
      "Experienced, professional flight crews",
      "24/7 support throughout your journey"
    ],
    cta: "Learn about safety"
  }
];

interface FeatureModalProps {
  feature: typeof features[0] | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function FeatureContent({ feature }: { feature: typeof features[0] }) {
  const Icon = feature.icon;

  return (
    <div className="space-y-6">
      {/* Icon */}
      <div className="flex justify-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Icon className="w-8 h-8 text-primary" />
        </div>
      </div>

      {/* Description */}
      <p
        className="text-base text-muted-foreground text-center leading-relaxed"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {feature.description}
      </p>

      {/* Benefits */}
      <div className="space-y-3">
        <h4
          className="text-sm font-semibold text-foreground"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          Key Benefits
        </h4>
        <ul className="space-y-2">
          {feature.benefits.map((benefit, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span
                className="text-sm text-muted-foreground"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {benefit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="pt-2">
        <a
          href="tel:+14158542675"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-red)', fontFamily: 'Montserrat, sans-serif' }}
        >
          <span>Call us: +1 (415) 854-2675</span>
        </a>
      </div>
    </div>
  );
}

function FeatureModal({ feature, open, onOpenChange }: FeatureModalProps) {
  const isMobile = useIsMobile();

  if (!feature) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="pb-safe">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle
              className="text-xl font-semibold"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {feature.title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-6">
            <FeatureContent feature={feature} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="p-6 pt-4">
          {/* Custom close button */}
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <DialogHeader className="text-center pb-4">
            <DialogTitle
              className="text-xl font-semibold"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {feature.title}
            </DialogTitle>
          </DialogHeader>
          <FeatureContent feature={feature} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function FeaturesSection() {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleFeatureClick = (feature: typeof features[0]) => {
    setSelectedFeature(feature);
    setModalOpen(true);
  };

  return (
    <section className="py-6 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border flex flex-col cursor-pointer active:scale-[0.98]"
              onClick={() => handleFeatureClick(feature)}
            >
              <CardHeader className="pb-2 md:pb-4 pt-3 md:pt-6 px-3 md:px-6">
                <CardTitle className="text-sm md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 md:pb-6 px-3 md:px-6 pt-0 mt-auto">
                <div className="flex items-center text-xs md:text-sm text-muted-foreground group-hover:text-primary transition-colors">
                  <span style={{ fontFamily: 'Clash Display, sans-serif' }}>Learn more</span>
                  <MoveRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Feature Modal/Drawer */}
      <FeatureModal
        feature={selectedFeature}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </section>
  );
}
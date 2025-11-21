'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MoveRight } from "lucide-react";

const features = [
  {
    title: "Save Up to 75% with Empty Legs"
  },
  {
    title: "Maximum Comfort and Privacy"
  },
  {
    title: "Flexibility and Spontaneity"
  },
  {
    title: "Guaranteed Safety and Quality"
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-6 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border flex flex-col">
              <CardHeader className="pb-2 md:pb-4 pt-3 md:pt-6 px-3 md:px-6">
                <CardTitle className="text-sm md:text-lg font-semibold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-3 md:pb-6 px-3 md:px-6 pt-0">
                <div className="flex items-center text-xs md:text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                  <span style={{ fontFamily: 'Clash Display, sans-serif' }}>Ask for details</span>
                  <MoveRight className="ml-1 md:ml-2 h-3 w-3 md:h-4 md:w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
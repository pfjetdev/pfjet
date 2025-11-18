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
    <section className="py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-border/50 hover:border-border flex flex-col h-full">
              <CardHeader className="pb-4 flex-grow">
                <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="mt-auto">
                <div className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer group">
                  <span style={{ fontFamily: 'Clash Display, sans-serif' }}>Ask for details</span>
                  <MoveRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
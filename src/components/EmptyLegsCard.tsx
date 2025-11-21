import React from 'react';
import { Card } from '@/components/ui/card';
import { Calendar, Users, MoveUpRight } from 'lucide-react';

interface EmptyLegsCardProps {
  date?: string;
  passengers?: string;
  route?: string;
  price?: string;
  image?: string;
}

const EmptyLegsCard: React.FC<EmptyLegsCardProps> = ({
  date = "Sep 10, Tue",
  passengers = "Up to 10",
  route = "Zurich - Mykonos",
  price = "From $ 3,800",
  image = "/day.jpg"
}) => {
  return (
    <Card className="w-full max-w-sm overflow-hidden p-0 transition-transform hover:scale-[1.02] active:scale-[0.98]">
      {/* Первый див с фоновым изображением города */}
      <div
        className="relative aspect-square bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Градиент для лучшей читаемости текста */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Контент в левом нижнем углу */}
        <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 text-white">
          {/* Дата и пассажиры горизонтально с фоном */}
          <div className="flex items-center gap-2 md:gap-4 mb-2 md:mb-3">
            {/* Дата с иконкой календаря */}
            <div className="flex items-center gap-1.5 md:gap-2 bg-black/50 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
              <Calendar className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium whitespace-nowrap" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {date}
              </span>
            </div>

            {/* Количество пассажиров */}
            <div className="flex items-center gap-1.5 md:gap-2 bg-black/50 backdrop-blur-sm px-2 md:px-3 py-1 md:py-1.5 rounded-lg">
              <Users className="w-3 h-3 md:w-4 md:h-4" />
              <span className="text-xs md:text-sm font-medium whitespace-nowrap" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {passengers}
              </span>
            </div>
          </div>

          {/* Направление */}
          <div className="font-sans text-sm md:text-lg font-semibold md:font-semibold">
            {route}
          </div>
        </div>
      </div>

      {/* Второй див с ценой */}
      <div className="px-3 md:px-4 py-3 md:pb-4 flex items-center justify-center">
        <div className="text-base md:text-lg font-medium" style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: '500' }}>
          {price}
        </div>

        {/* Иконка MoveUpRight в плашке */}
        <div className="bg-black text-white p-1.5 md:p-2 rounded-lg hover:bg-gray-800 active:scale-95 transition-all cursor-pointer ml-auto">
          <MoveUpRight className="w-4 h-4 md:w-5 md:h-5" />
        </div>
      </div>
    </Card>
  );
};

export default EmptyLegsCard;
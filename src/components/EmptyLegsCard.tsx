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
    <Card className="w-full max-w-sm overflow-hidden p-0">
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
        <div className="absolute bottom-4 left-4 text-white">
          {/* Дата и пассажиры горизонтально с фоном */}
          <div className="flex items-center gap-4 mb-3">
            {/* Дата с иконкой календаря */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Calendar className="w-4 h-4" />
              <span className="text-sm font-medium" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {date}
              </span>
            </div>
            
            {/* Количество пассажиров */}
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                {passengers}
              </span>
            </div>
          </div>
          
          {/* Направление */}
          <div className="font-sans" style={{ fontSize: '18px', fontWeight: '600' }}>
            {route}
          </div>
        </div>
      </div>
      
      {/* Второй див с ценой */}
      <div className="px-4 pb-4 flex items-center justify-center">
        <div className="text-lg font-medium" style={{ fontFamily: 'Clash Display, sans-serif', fontWeight: '500' }}>
          {price}
        </div>
        
        {/* Иконка MoveUpRight в плашке */}
        <div className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 transition-colors cursor-pointer ml-auto">
          <MoveUpRight className="w-5 h-5" />
        </div>
      </div>
    </Card>
  );
};

export default EmptyLegsCard;
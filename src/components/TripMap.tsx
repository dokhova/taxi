import { MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import carTopView from "figma:asset/0598746954d0c1af8802d777672a80f19cf3aa28.png";

export function TripMap() {
  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden">
      {/* Route line from car to destination */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <path
          d="M 50% 50% Q 65% 35%, calc(100% - 80px) 80px"
          stroke="#4285F4"
          strokeWidth="3"
          fill="none"
          strokeDasharray="8 8"
          opacity="0.6"
        />
      </svg>

      {/* Start point */}
      <div className="absolute left-16 bottom-16 flex items-center gap-2">
      </div>

      {/* End point */}
      <div className="absolute right-16 top-32">
        <MapPin className="w-8 h-8" style={{ color: '#E74639', fill: '#E74639' }} />
      </div>

      {/* Car position (current location) */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          {/* Пульсирующий круг текущей позиции */}
          <div className="relative flex items-center justify-center">
            {/* Внешний пульсирующий круг */}
            <div 
              className="absolute w-8 h-8 rounded-full animate-ping"
              style={{ 
                background: 'rgba(52, 171, 83, 0.4)',
              }}
            />
            {/* Основной круг */}
            <div 
              className="relative w-4 h-4 rounded-full border-2 border-white shadow-lg"
              style={{ 
                background: '#34AB53',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
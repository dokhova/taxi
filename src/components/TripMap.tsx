import { MapPin, Navigation } from "lucide-react";

interface TripMapProps {
  onRelaxationClick: () => void;
}

export function TripMap({ onRelaxationClick }: TripMapProps) {
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
      <div className="absolute right-16 top-16">
        <MapPin className="w-8 h-8" style={{ color: '#E74639', fill: '#E74639' }} />
      </div>

      {/* Car position (current location) */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="relative">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg ring-4 ring-white/20">
            <Navigation className="w-6 h-6 text-[#19191B] transform rotate-45 -translate-x-0.5" />
          </div>
        </div>
      </div>

      {/* ETA badge */}
      <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2 border border-white/20">
        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#34AB53' }}></div>
        <span className="text-sm text-white">12 мин до прибытия</span>
      </div>

      {/* Distance badge */}
      <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
        <span className="text-sm text-white">3.2 км</span>
      </div>
    </div>
  );
}
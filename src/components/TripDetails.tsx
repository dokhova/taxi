import { MapPin, Circle, Clock, Wallet } from "lucide-react";

interface TripDetailsProps {
  pickup: string;
  destination: string;
  estimatedTime: string;
  price: string;
  status: string;
}

export function TripDetails({
  pickup,
  destination,
  estimatedTime,
  price,
  status,
}: TripDetailsProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      {/* Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#34AB53' }}></div>
          <span className="text-sm text-gray-600">{status}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{estimatedTime}</span>
        </div>
      </div>

      {/* Route */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center mt-1">
            <Circle className="w-3 h-3" style={{ color: '#4285F4', fill: '#4285F4' }} />
            <div className="w-0.5 h-8 bg-gray-200 my-1"></div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Откуда</p>
            <p className="text-sm">{pickup}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="mt-1">
            <MapPin className="w-3 h-3" style={{ color: '#E74639', fill: '#E74639' }} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-500 mb-1">Куда</p>
            <p className="text-sm">{destination}</p>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-600">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Стоимость поездки</span>
          </div>
          <span className="text-lg">{price} ₽</span>
        </div>
      </div>
    </div>
  );
}
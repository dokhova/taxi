import { MapPin, Circle, Clock, Wallet } from "lucide-react";

interface TripDetailsProps {
  pickup: string;
  destination: string;
  estimatedTime: string;
  price: string;
  status: string;
  t?: (key: string) => string;
}

export function TripDetails({
  pickup,
  destination,
  estimatedTime,
  price,
  status,
  t = (key) => key,
}: TripDetailsProps) {
  return (
    <div className="bg-white/5 rounded-2xl shadow-sm border border-white/10 p-5 backdrop-blur-sm">
      {/* Status */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#34AB53' }}></div>
          <span className="text-sm text-white/80">{status}</span>
        </div>
        <div className="flex items-center gap-2 text-white/80">
          <Clock className="w-4 h-4" />
          <span className="text-sm">{estimatedTime}</span>
        </div>
      </div>

      {/* Route */}
      <div className="space-y-3 mb-4">
        <div className="flex gap-3">
          <div className="flex flex-col items-center mt-1">
            <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#4285F4' }}></div>
            <div className="w-0.5 h-8 bg-white/20 my-1"></div>
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/50 mb-1">{t("pickup")}</p>
            <p className="text-sm text-white">{pickup}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="mt-1">
            <MapPin className="w-3 h-3" style={{ color: '#E74639', fill: '#E74639' }} />
          </div>
          <div className="flex-1">
            <p className="text-xs text-white/50 mb-1">{t("destination")}</p>
            <p className="text-sm text-white">{destination}</p>
          </div>
        </div>
      </div>

      {/* Price */}
      <div className="pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-white/80">
            <Wallet className="w-4 h-4" />
            <span className="text-sm">{t("tripCost")}</span>
          </div>
          <span className="text-lg text-white">{price} ₽</span>
        </div>
      </div>
    </div>
  );
}
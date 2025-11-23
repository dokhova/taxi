import { MapPin } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import carTopView from "figma:asset/c320f1901adf0237bb34f9d14450c9679cef5c95.png";

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
          <ImageWithFallback
            src={carTopView}
            alt="Car top view"
            className="w-12 h-12 object-contain drop-shadow-lg"
          />
        </div>
      </div>
    </div>
  );
}
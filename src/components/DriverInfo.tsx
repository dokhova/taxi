import { Star, Phone, MessageCircle } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface DriverInfoProps {
  name: string;
  rating: number;
  photoUrl: string;
  carModel: string;
  carNumber: string;
  carColor: string;
}

export function DriverInfo({
  name,
  rating,
  photoUrl,
  carModel,
  carNumber,
  carColor,
}: DriverInfoProps) {
  return (
    <div className="bg-white/5 rounded-2xl shadow-sm border border-white/10 p-4 backdrop-blur-sm">
      <div className="flex items-start gap-3">
        {/* Driver photo */}
        <div className="relative flex-shrink-0">
          <ImageWithFallback
            src={photoUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#19191B]" style={{ backgroundColor: '#34AB53' }}></div>
        </div>

        {/* Driver details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg text-white truncate">{name}</h3>
            <div className="flex items-center gap-1 bg-yellow-500/20 px-2 py-0.5 rounded-full border border-yellow-500/30 flex-shrink-0">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm text-yellow-500">{rating}</span>
            </div>
          </div>
          <p className="text-sm text-white/60 mt-0.5">
            {carColor} {carModel}
          </p>
          <p className="text-xs text-white/40 mt-0.5">{carNumber}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 flex-shrink-0">
          <button className="w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors border border-white/10">
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
          <button className="w-11 h-11 rounded-full flex items-center justify-center transition-colors border border-[#34AB53]/30" style={{ backgroundColor: '#34AB53' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d924a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34AB53'}>
            <Phone className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
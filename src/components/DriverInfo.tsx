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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center gap-4">
        {/* Driver photo */}
        <div className="relative flex-shrink-0">
          <ImageWithFallback
            src={photoUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white" style={{ backgroundColor: '#34AB53' }}></div>
        </div>

        {/* Driver details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg whitespace-nowrap">{name}</h3>
            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-sm">{rating}</span>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {carColor} {carModel}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{carNumber}</p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button className="w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
            <MessageCircle className="w-5 h-5 text-gray-700" />
          </button>
          <button className="w-12 h-12 rounded-full flex items-center justify-center transition-colors" style={{ backgroundColor: '#34AB53' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#2d924a'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#34AB53'}>
            <Phone className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
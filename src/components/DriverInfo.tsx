import { Phone, MessageCircle } from "lucide-react";
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
    <div className="bg-white/5 rounded-2xl border border-white/10 p-4 backdrop-blur-sm">
      <div className="flex items-center gap-4">
        {/* Driver photo */}
        <div className="relative flex-shrink-0">
          <ImageWithFallback
            src={photoUrl}
            alt={name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-[#19191B]" style={{ backgroundColor: '#34AB53' }}></div>
        </div>

        {/* Driver info - centered */}
        <div className="flex-1 min-w-0">
          {/* Name */}
          <h3 className="text-white truncate mb-1">{name}</h3>
          
          {/* Car model */}
          <p className="text-sm text-white/70">
            {carColor} {carModel}
          </p>
          
          {/* License plate */}
          <p className="text-xs text-white/50 mt-0.5">{carNumber}</p>
        </div>

        {/* Action buttons - right side */}
        <div className="flex gap-2 flex-shrink-0">
          <button 
            className="w-12 h-12 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center transition-colors"
            aria-label="Отправить сообщение"
          >
            <MessageCircle className="w-5 h-5 text-white" />
          </button>
          <button 
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:brightness-110"
            style={{ backgroundColor: '#34AB53' }}
            aria-label="Позвонить"
          >
            <Phone className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
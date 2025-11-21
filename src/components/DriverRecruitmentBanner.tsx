import { ChevronRight } from "lucide-react";
import abstractImage from "figma:asset/d0b39761592f6a325b9a50fd51a0022df2131af2.png";

interface DriverRecruitmentBannerProps {
  onClick: () => void;
}

export function DriverRecruitmentBanner({ onClick }: DriverRecruitmentBannerProps) {
  return (
    <button 
      onClick={onClick} 
      className="relative overflow-hidden rounded-2xl transition-all max-w-xs active:scale-[0.98] w-full"
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={abstractImage}
          alt="Relaxation"
          className="w-full h-full object-cover opacity-15"
        />
      </div>

      <div className="flex items-center justify-between p-4 relative z-10">
        <div className="text-left">
          <h3 className="text-base text-white mb-0.5 flex items-center gap-1">
            Спокойный режим
          </h3>
          <p className="text-xs text-white/70">
            Пауза в движении
          </p>
        </div>
        
        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-white/70 flex-shrink-0 ml-2" />
      </div>
    </button>
  );
}
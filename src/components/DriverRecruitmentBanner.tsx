import { ChevronRight } from "lucide-react";
import abstractImage from "figma:asset/d0b39761592f6a325b9a50fd51a0022df2131af2.png";

interface DriverRecruitmentBannerProps {
  onClick: () => void;
}

export function DriverRecruitmentBanner({ onClick }: DriverRecruitmentBannerProps) {
  return (
    <button onClick={onClick} className="bg-white rounded-xl shadow-md overflow-hidden transition-transform max-w-xs relative active:scale-[0.98]">
      <div className="flex items-center relative z-10">
        <div className="flex-1 p-3 pr-2">
          <h3 className="text-base mb-0.5 text-left flex items-center gap-1">
            Спокойный режим
            <ChevronRight className="w-4 h-4 translate-y-0.5" />
          </h3>
          <p className="text-xs text-gray-400 text-left">
            Пауза в движении
          </p>
        </div>
        <div className="w-20 h-16"></div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-full">
        <img
          src={abstractImage}
          alt="Relaxation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent"></div>
      </div>
    </button>
  );
}
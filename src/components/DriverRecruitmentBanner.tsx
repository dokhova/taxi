import { ChevronRight } from "lucide-react";

interface DriverRecruitmentBannerProps {
  onClick: () => void;
}

export function DriverRecruitmentBanner({ onClick }: DriverRecruitmentBannerProps) {
  return (
    <button 
      onClick={onClick} 
      className="relative overflow-hidden rounded-2xl transition-all max-w-xs active:scale-[0.98] w-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10"
    >
      <div className="flex items-center justify-between p-4">
        <div className="text-left">
          <h3 className="text-base text-white mb-0.5">
            Спокойный режим
          </h3>
          <p className="text-xs text-white/60">
            Пауза в движении
          </p>
        </div>
        
        {/* Arrow */}
        <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0 ml-2" />
      </div>
    </button>
  );
}
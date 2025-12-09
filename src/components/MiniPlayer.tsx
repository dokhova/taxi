import { Play, Pause, ChevronDown, ChevronUp, SkipBack, SkipForward, Car, Leaf, Waves } from "lucide-react";
import { useRef, useEffect } from "react";

interface MiniPlayerProps {
  isPlaying: boolean;
  currentTime: number;
  togglePlayPause: (e: React.MouseEvent) => void;
  formatTime: (seconds: number) => string;
  audioRef: React.RefObject<HTMLAudioElement>;
  isExpanded: boolean;
  onExpandToggle: () => void;
  selectedTrack: string;
  onTrackChange: (track: string) => void;
  tracks: {
    [key: string]: {
      name: string;
      subtitle: string;
      icon: string;
    };
  };
  t?: (key: string) => string;
}

export function MiniPlayer({ 
  isPlaying, 
  currentTime, 
  togglePlayPause, 
  formatTime, 
  audioRef, 
  isExpanded, 
  onExpandToggle, 
  selectedTrack, 
  onTrackChange, 
  tracks,
  t = (key) => key,
}: MiniPlayerProps) {
  const trackKeys = Object.keys(tracks);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const trackButtonRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});
  
  // Автоскролл к выбранной карточке
  useEffect(() => {
    if (isExpanded && scrollContainerRef.current && trackButtonRefs.current[selectedTrack]) {
      const container = scrollContainerRef.current;
      const selectedButton = trackButtonRefs.current[selectedTrack];
      
      if (selectedButton) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = selectedButton.getBoundingClientRect();
        
        // Вычисляем нужный scroll offset для центрирования кнопки
        const scrollLeft = selectedButton.offsetLeft - (container.offsetWidth / 2) + (selectedButton.offsetWidth / 2);
        
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedTrack, isExpanded]);
  
  // Маппинг иконок
  const iconMap: { [key: string]: JSX.Element } = {
    meditation: <Car className="w-5 h-5 text-white" strokeWidth={1.5} />,
    ambient: <Waves className="w-5 h-5 text-white" strokeWidth={1.5} />,
    nature: <Leaf className="w-5 h-5 text-white" strokeWidth={1.5} />,
  };
  
  return (
    <div className="relative">
      {/* Collapsed state - компактная кнопка */}
      <div
        className={`rounded-2xl backdrop-blur-sm border transition-all duration-300 ${ 
          isExpanded ? 'opacity-0 pointer-events-none scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          width: '220px',
          height: '64px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex items-center gap-3 px-3 h-full">
          {/* Кнопка Play/Pause в круге слева с градиентом */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause(e);
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
            style={{
              background: 'linear-gradient(100deg, #A8D531 0%, #34A853 100%)',
            }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-white" fill="white" />
            ) : (
              <Play className="w-4 h-4 text-white translate-x-[1px]" fill="white" />
            )}
          </button>
          
          {/* Название по центру с подзаголовком */}
          <button
            onClick={onExpandToggle}
            className="flex-1 text-left min-w-0"
          >
            <div className="text-white font-medium truncate">
              {tracks[selectedTrack].name}
            </div>
            <div className="text-white/60 text-sm truncate">
              {tracks[selectedTrack].subtitle}
            </div>
          </button>
          
          {/* Стрелочка вниз справа */}
          <button
            onClick={onExpandToggle}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronDown className="w-5 h-5 text-white/60" />
          </button>
        </div>
      </div>

      {/* Expanded state - полная панель поверх всего */}
      <div 
        className={`absolute top-0 left-0 z-50 rounded-2xl backdrop-blur-sm border transition-all duration-300 ${
          isExpanded ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
        }`}
        style={{
          width: '220px',
          background: 'rgba(255, 255, 255, 0.03)',
          borderColor: 'rgba(255, 255, 255, 0.08)',
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 px-3 py-3 border-b" style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium truncate">{t('relaxWidgetTitle')}</h3>
            <p className="text-white/50 text-xs truncate">{t('relaxWidgetSubtitle')}</p>
          </div>
          <button
            onClick={onExpandToggle}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronUp className="w-5 h-5 text-white/60" />
          </button>
        </div>
        
        {/* Track cards */}
        <div className="relative my-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-3" ref={scrollContainerRef} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {trackKeys.map((key) => (
              <button
                key={key}
                onClick={() => onTrackChange(key)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all flex-shrink-0 shadow-sm border ${ 
                  selectedTrack === key 
                    ? 'border-white/20' 
                    : 'border-white/10 hover:border-white/15'
                }`}
                style={{
                  background: selectedTrack === key 
                    ? 'rgba(255, 255, 255, 0.08)' 
                    : 'rgba(255, 255, 255, 0.03)',
                  backdropFilter: 'blur(8px)',
                }}
                ref={(el) => trackButtonRefs.current[key] = el}
              >
                <div className="flex items-center justify-center flex-shrink-0">
                  {iconMap[key]}
                </div>
                <div className="text-left">
                  <div className="text-xs font-medium text-white whitespace-nowrap">{tracks[key].name}</div>
                  <div className="text-[10px] text-white/60 whitespace-nowrap">{tracks[key].subtitle}</div>
                </div>
              </button>
            ))}
            {/* Spacer для предотвращения ухода последней карточки слишком влево */}
            <div className="flex-shrink-0 w-8" />
          </div>
        </div>
        
        {/* Плеер */}
        <div className="px-3 pb-3">
          {/* Progress bar */}
          <div className="mb-3">
            <div className="h-1 bg-white/10 rounded-full overflow-hidden mb-1.5">
              <div 
                className="h-full rounded-full transition-all"
                style={{
                  width: audioRef.current?.duration 
                    ? `${(currentTime / audioRef.current.duration) * 100}%` 
                    : '0%',
                  background: 'linear-gradient(90deg, #A8D531 0%, #34A853 100%)',
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/60">
              <span>{formatTime(currentTime)}</span>
              <span>{audioRef.current?.duration ? formatTime(audioRef.current.duration) : '0:00'}</span>
            </div>
          </div>
          
          {/* Кнопки управления */}
          <div className="flex items-center justify-center gap-6">
            <button
              className="text-white/70 hover:text-white transition-colors"
              onClick={() => {
                const currentIndex = trackKeys.indexOf(selectedTrack);
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : trackKeys.length - 1;
                onTrackChange(trackKeys[prevIndex]);
              }}
            >
              <SkipBack className="w-4 h-4" />
            </button>
            
            <button
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-lg hover:opacity-90"
              style={{
                background: 'linear-gradient(100deg, #A8D531 0%, #34A853 100%)',
              }}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-white" fill="white" />
              ) : (
                <Play className="w-5 h-5 text-white translate-x-[1px]" fill="white" />
              )}
            </button>
            
            <button
              className="text-white/70 hover:text-white transition-colors"
              onClick={() => {
                const currentIndex = trackKeys.indexOf(selectedTrack);
                const nextIndex = currentIndex < trackKeys.length - 1 ? currentIndex + 1 : 0;
                onTrackChange(trackKeys[nextIndex]);
              }}
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
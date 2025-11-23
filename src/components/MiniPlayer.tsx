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
  tracks 
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
    meditation: <Car className="w-7 h-7 text-white" strokeWidth={1.5} />,
    ambient: <Waves className="w-7 h-7 text-white" strokeWidth={1.5} />,
    nature: <Leaf className="w-7 h-7 text-white" strokeWidth={1.5} />,
  };
  
  return (
    <div className="relative">
      {/* Collapsed state - стеклянная капсула (всегда рендерится для сохранения места) */}
      <div
        className={`overflow-hidden rounded-2xl shadow-lg border backdrop-blur-xl transition-opacity mt-2 ${
          isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          background: 'rgba(255, 255, 255, 0.1)',
          borderColor: 'rgba(255, 255, 255, 0.05)',
          maxWidth: '260px',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div className="flex items-center gap-3 px-4 py-3">
          {/* Кнопка Play/Pause в круге слева */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause(e);
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-white/10 transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
            }}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 text-white" fill="white" />
            ) : (
              <Play className="w-5 h-5 text-white translate-x-[1px]" fill="white" />
            )}
          </button>
          
          {/* Название по центру с подзаголовком */}
          <button
            onClick={onExpandToggle}
            className="flex-1 text-left"
          >
            <div className="text-white">
              {isPlaying ? tracks[selectedTrack].name : 'Пауза в пути'}
            </div>
            <div className="text-white/40 text-sm">
              {isPlaying ? tracks[selectedTrack].subtitle : 'практики'}
            </div>
          </button>
          
          {/* Стрелочка вниз справа */}
          <button
            onClick={onExpandToggle}
            className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ChevronDown className="w-5 h-5 text-white/50" />
          </button>
        </div>
      </div>

      {/* Expanded state - полная панель поверх всего */}
      {isExpanded && (
        <div 
          className="absolute top-0 left-0 z-50 overflow-hidden rounded-3xl shadow-2xl backdrop-blur-xl border border-white/30"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            maxWidth: '260px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-12 h-12 flex-shrink-0" /> {/* Spacer for alignment */}
            <h3 className="flex-1 text-white/90 -ml-[60px]">{tracks[selectedTrack].name}</h3>
            <button
              onClick={onExpandToggle}
              className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <ChevronUp className="w-5 h-5 text-white/70" />
            </button>
          </div>
          
          {/* Track cards */}
          <div className="relative mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-4 pr-8" ref={scrollContainerRef}>
              {trackKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => onTrackChange(key)}
                  className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all flex-shrink-0 border ${ 
                    selectedTrack === key 
                      ? 'bg-transparent border-white/40' 
                      : 'bg-transparent border-white/10 hover:border-white/20'
                  }`}
                  ref={(el) => trackButtonRefs.current[key] = el}
                >
                  <div className="flex items-center justify-center flex-shrink-0">
                    {iconMap[key]}
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-white/90 whitespace-nowrap">{tracks[key].name}</div>
                    <div className="text-xs text-white/50 whitespace-nowrap">{tracks[key].subtitle}</div>
                  </div>
                </button>
              ))}
            </div>
            {/* Gradient fade indicator на правом краю */}
            <div 
              className="absolute top-0 right-0 h-full w-12 pointer-events-none"
              style={{
                background: 'linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1) 70%)'
              }}
            />
          </div>
          
          {/* Плеер */}
          <div className="px-4 pb-4">
            {/* Progress bar */}
            <div className="mb-5">
              <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-[#34AB53] rounded-full transition-all"
                  style={{
                    width: audioRef.current?.duration 
                      ? `${(currentTime / audioRef.current.duration) * 100}%` 
                      : '0%'
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-white/40">
                <span>{formatTime(currentTime)}</span>
                <span>{audioRef.current?.duration ? formatTime(audioRef.current.duration) : '0:00'}</span>
              </div>
            </div>
            
            {/* Кнопки правления */}
            <div className="flex items-center justify-center gap-8">
              <button
                className="text-white/60 hover:text-white/90 transition-colors"
                onClick={() => {
                  const currentIndex = trackKeys.indexOf(selectedTrack);
                  const prevIndex = currentIndex > 0 ? currentIndex - 1 : trackKeys.length - 1;
                  onTrackChange(trackKeys[prevIndex]);
                }}
              >
                <SkipBack className="w-5 h-5" />
              </button>
              
              <button
                onClick={togglePlayPause}
                className="w-14 h-14 bg-[#34AB53] hover:bg-[#3ec05f] rounded-full flex items-center justify-center transition-all shadow-lg"
              >
                {isPlaying ? (
                  <Pause className="w-6 h-6 text-white" fill="white" />
                ) : (
                  <Play className="w-6 h-6 text-white translate-x-[1px]" fill="white" />
                )}
              </button>
              
              <button
                className="text-white/60 hover:text-white/90 transition-colors"
                onClick={() => {
                  const currentIndex = trackKeys.indexOf(selectedTrack);
                  const nextIndex = currentIndex < trackKeys.length - 1 ? currentIndex + 1 : 0;
                  onTrackChange(trackKeys[nextIndex]);
                }}
              >
                <SkipForward className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
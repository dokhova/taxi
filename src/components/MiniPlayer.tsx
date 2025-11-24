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
    meditation: <Car className="w-5 h-5" strokeWidth={1.5} style={{ color: 'rgba(0, 0, 0, 0.7)' }} />,
    ambient: <Waves className="w-5 h-5" strokeWidth={1.5} style={{ color: 'rgba(0, 0, 0, 0.7)' }} />,
    nature: <Leaf className="w-5 h-5" strokeWidth={1.5} style={{ color: 'rgba(0, 0, 0, 0.7)' }} />,
  };
  
  return (
    <div className="relative">
      {/* Collapsed state - стеклянная капсула (всегда рендерится для сохранения места) */}
      <div
        className={`rounded-2xl backdrop-blur-sm transition-opacity mt-[24px] ${
          isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        style={{
          maxWidth: '220px',
          background: 'linear-gradient(100deg, #A8D531 0%, #34A853 100%)',
          boxShadow: '0 2px 12px 0 rgba(168, 213, 49, 0.15)',
        }}
      >
        <div className="flex items-center gap-2 px-3 py-2">
          {/* Кнопка Play/Pause в круге слева */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause(e);
            }}
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-white/20 transition-colors"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
            }}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="rgba(0, 0, 0, 0.7)" style={{ color: 'rgba(0, 0, 0, 0.7)' }} />
            ) : (
              <Play className="w-4 h-4 translate-x-[1px]" fill="rgba(0, 0, 0, 0.7)" style={{ color: 'rgba(0, 0, 0, 0.7)' }} />
            )}
          </button>
          
          {/* Название по центру с подзаголовком */}
          <button
            onClick={onExpandToggle}
            className="flex-1 text-left"
          >
            <div className="font-medium truncate text-sm" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>
              {isPlaying ? tracks[selectedTrack].name : 'Пауза в пути'}
            </div>
            <div className="text-xs" style={{ color: 'rgba(0, 0, 0, 0.55)' }}>
              {isPlaying ? tracks[selectedTrack].subtitle : 'Практики'}
            </div>
          </button>
          
          {/* Стрелочка вниз справа */}
          <button
            onClick={onExpandToggle}
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors"
          >
            <ChevronDown className="w-4 h-4" style={{ color: 'rgba(0, 0, 0, 0.6)' }} />
          </button>
        </div>
      </div>

      {/* Expanded state - полная панель поверх всего */}
      {isExpanded && (
        <div 
          className="absolute top-0 left-0 z-50 rounded-2xl backdrop-blur-sm"
          style={{
            maxWidth: '220px',
            background: 'linear-gradient(100deg, #A8D531 0%, #34A853 100%)',
            boxShadow: '0 2px 12px 0 rgba(168, 213, 49, 0.15)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-9 h-9 flex-shrink-0" /> {/* Spacer for alignment */}
            <h3 className="flex-1 font-medium text-sm -ml-[44px]" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>{tracks[selectedTrack].name}</h3>
            <button
              onClick={onExpandToggle}
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/15 transition-colors"
            >
              <ChevronUp className="w-4 h-4" style={{ color: 'rgba(0, 0, 0, 0.6)' }} />
            </button>
          </div>
          
          {/* Track cards */}
          <div className="relative mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide px-3" ref={scrollContainerRef} style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              {trackKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => onTrackChange(key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all flex-shrink-0 shadow-sm ${ 
                    selectedTrack === key 
                      ? 'border border-white/50' 
                      : 'border border-white/30 hover:border-white/45'
                  }`}
                  style={{
                    background: selectedTrack === key 
                      ? 'rgba(255, 255, 255, 0.35)' 
                      : 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(8px)',
                  }}
                  ref={(el) => trackButtonRefs.current[key] = el}
                >
                  <div className="flex items-center justify-center flex-shrink-0">
                    <div style={{ color: 'rgba(0, 0, 0, 0.7)' }}>
                      {iconMap[key]}
                    </div>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-medium whitespace-nowrap" style={{ color: 'rgba(0, 0, 0, 0.75)' }}>{tracks[key].name}</div>
                    <div className="text-[10px] whitespace-nowrap" style={{ color: 'rgba(0, 0, 0, 0.55)' }}>{tracks[key].subtitle}</div>
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
              <div className="h-1 bg-white/20 rounded-full overflow-hidden mb-1.5">
                <div 
                  className="h-full rounded-full transition-all"
                  style={{
                    width: audioRef.current?.duration 
                      ? `${(currentTime / audioRef.current.duration) * 100}%` 
                      : '0%',
                    background: 'rgba(255, 255, 255, 0.6)',
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px]" style={{ color: 'rgba(0, 0, 0, 0.5)' }}>
                <span>{formatTime(currentTime)}</span>
                <span>{audioRef.current?.duration ? formatTime(audioRef.current.duration) : '0:00'}</span>
              </div>
            </div>
            
            {/* Кнопки правления */}
            <div className="flex items-center justify-center gap-6">
              <button
                className="transition-all hover:opacity-100"
                style={{ color: 'rgba(0, 0, 0, 0.65)' }}
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
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all shadow-lg hover:bg-white/30"
                style={{
                  background: 'rgba(255, 255, 255, 0.25)',
                }}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5" fill="rgba(0, 0, 0, 0.7)" style={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                ) : (
                  <Play className="w-5 h-5 translate-x-[1px]" fill="rgba(0, 0, 0, 0.7)" style={{ color: 'rgba(0, 0, 0, 0.7)' }} />
                )}
              </button>
              
              <button
                className="transition-all hover:opacity-100"
                style={{ color: 'rgba(0, 0, 0, 0.65)' }}
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
      )}
    </div>
  );
}
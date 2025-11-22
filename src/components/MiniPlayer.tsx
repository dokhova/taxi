import { Play, Pause, ChevronDown, ChevronUp, SkipBack, SkipForward, Car, Leaf, Waves } from "lucide-react";

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
  
  // Маппинг иконок
  const iconMap: { [key: string]: JSX.Element } = {
    meditation: <Car className="w-7 h-7 text-white" strokeWidth={1.5} />,
    ambient: <Waves className="w-7 h-7 text-white" strokeWidth={1.5} />,
    nature: <Leaf className="w-7 h-7 text-white" strokeWidth={1.5} />,
  };
  
  return (
    <div className="relative">
      {!isExpanded ? (
        // Collapsed state - темная капсула
        <div
          className="overflow-hidden rounded-full shadow-lg backdrop-blur-xl"
          style={{
            background: 'rgba(42, 42, 44, 0.85)',
            maxWidth: '260px',
          }}
        >
          <div className="flex items-center gap-4 px-4 py-4">
            {/* Кнопка Play/Pause в круге слева */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause(e);
              }}
              className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 hover:bg-[#6a6a6c] transition-colors"
              style={{
                background: 'rgba(80, 80, 82, 0.8)',
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
              <div className="text-white/50 text-sm">
                {isPlaying ? tracks[selectedTrack].subtitle : 'практики'}
              </div>
            </button>
            
            {/* Стрелочка вниз справа */}
            <button
              onClick={onExpandToggle}
              className="flex-shrink-0 -mr-1"
            >
              <ChevronDown className="w-5 h-5 text-white/50" />
            </button>
          </div>
        </div>
      ) : (
        // Expanded state - полная панель поверх всего
        <div 
          className="absolute top-0 left-0 right-0 z-50 overflow-hidden rounded-3xl p-6 shadow-2xl backdrop-blur-xl"
          style={{
            background: 'rgba(42, 42, 44, 0.85)',
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl text-white/90">{tracks[selectedTrack].name}</h3>
            <button
              onClick={onExpandToggle}
              className="w-10 h-10 bg-white/10 hover:bg-white/15 rounded-full flex items-center justify-center transition-all"
            >
              <ChevronUp className="w-5 h-5 text-white/70" />
            </button>
          </div>
          
          {/* Track cards */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
            {trackKeys.map((key) => (
              <button
                key={key}
                onClick={() => onTrackChange(key)}
                className={`flex items-center gap-3 px-5 py-4 rounded-xl transition-all flex-shrink-0 border ${
                  selectedTrack === key 
                    ? 'bg-transparent border-white/40' 
                    : 'bg-transparent border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-center flex-shrink-0">
                  {iconMap[key]}
                </div>
                <div className="text-left">
                  <div className="text-sm text-white/90 whitespace-nowrap">{tracks[key].name}</div>
                </div>
              </button>
            ))}
          </div>
          
          {/* Плеер */}
          <div className="pt-4">
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
            
            {/* Кнопки управления */}
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
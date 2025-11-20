import { X, Repeat, SkipBack, SkipForward, Shuffle, Play, Pause, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface RelaxationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "meditation" | "breathing" | "whitenoise";

export function RelaxationModal({ isOpen, onClose }: RelaxationModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>("meditation");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const [isShuffle, setIsShuffle] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const audioFiles = {
    meditation: "/mp3/pause_ru.mp3",
    breathing: "/mp3/4444.mp3",
    whitenoise: "", // No audio file yet
  };

  const durations = {
    meditation: 0, // Will be set from audio metadata
    breathing: 0, // Will be set from audio metadata
    whitenoise: 300,
  };
  
  const [duration, setDuration] = useState(180);

  // Initialize audio element
  useEffect(() => {
    if (audioFiles[activeTab]) {
      console.log("🔄 Loading audio:", audioFiles[activeTab]);
      setAudioLoaded(false);
      setAudioError(false);
      
      // First, check if file exists
      fetch(audioFiles[activeTab], { method: 'HEAD' })
        .then(response => {
          console.log("📡 File check response:", {
            status: response.status,
            ok: response.ok,
            contentType: response.headers.get('content-type'),
            url: response.url
          });
          
          if (!response.ok) {
            console.error("❌ File not found (404) or server error:", response.status);
            setAudioError(true);
            return;
          }
        })
        .catch(err => {
          console.error("❌ Network error checking file:", err);
        });
      
      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.loop = isRepeat;
      audio.preload = "metadata";
      
      // Handle metadata loaded (get duration)
      const handleLoadedMetadata = () => {
        console.log("✅ Audio metadata loaded. Duration:", audio.duration);
        setDuration(Math.floor(audio.duration));
        setAudioLoaded(true);
      };

      // Handle audio can play
      const handleCanPlay = () => {
        console.log("✅ Audio can play");
        setAudioLoaded(true);
      };

      // Handle audio load error
      const handleError = (e: Event) => {
        const audioElement = e.target as HTMLAudioElement;
        console.error("❌ Audio element error event:", {
          errorCode: audioElement.error?.code,
          errorMessage: audioElement.error?.message,
          src: audioElement.src,
          networkState: audioElement.networkState,
          readyState: audioElement.readyState,
          event: e
        });
        
        // Error codes explanation
        if (audioElement.error?.code === 1) {
          console.error("MEDIA_ERR_ABORTED: Загрузка прервана пользователем");
        } else if (audioElement.error?.code === 2) {
          console.error("MEDIA_ERR_NETWORK: Файл не найден или проблема сети");
        } else if (audioElement.error?.code === 3) {
          console.error("MEDIA_ERR_DECODE: Ошибка декодирования файла");
        } else if (audioElement.error?.code === 4) {
          console.error("MEDIA_ERR_SRC_NOT_SUPPORTED: Формат не поддерживается или файл недоступен");
        }
        
        setAudioError(true);
        setAudioLoaded(false);
      };

      // Update current time
      const handleTimeUpdate = () => {
        setCurrentTime(audio.currentTime);
      };

      // Handle audio end
      const handleEnded = () => {
        if (!isRepeat) {
          setIsPlaying(false);
          setCurrentTime(0);
        }
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);
      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("error", handleError);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);
      
      // Set source AFTER adding event listeners
      console.log("🎵 Setting audio source:", audioFiles[activeTab]);
      audio.src = audioFiles[activeTab];
      audio.load();
      
      audioRef.current = audio;

      return () => {
        audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener("timeupdate", handleTimeUpdate);
        audio.removeEventListener("ended", handleEnded);
        audio.pause();
        audio.src = "";
      };
    } else {
      // For whitenoise without audio file
      console.log("⚠️ No audio file for:", activeTab);
      setAudioLoaded(false);
      setDuration(300);
    }
  }, [activeTab, isRepeat]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      if (isPlaying) {
        console.log("Playing audio");
        audioRef.current.play().catch(err => {
          console.error("Audio play error:", err);
          setAudioError(true);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, audioLoaded]);

  // Fallback timer for tracks without audio files or if audio fails
  useEffect(() => {
    if (isOpen && isPlaying && (!audioFiles[activeTab] || audioError)) {
      console.log("Using fallback timer");
      const interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            if (isRepeat) {
              return 0;
            } else {
              setIsPlaying(false);
              return 0;
            }
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isOpen, isPlaying, duration, isRepeat, activeTab, audioError]);

  useEffect(() => {
    // Reset time and stop playing when switching tabs
    setCurrentTime(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [activeTab]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = (currentTime / duration) * 100;
  const circumference = 2 * Math.PI * 70;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!isOpen) return null;

  const handleSkipBack = () => {
    if (currentTime > 10) {
      setCurrentTime(prev => prev - 10);
    } else {
      setCurrentTime(0);
    }
  };

  const handleSkipForward = () => {
    if (currentTime + 10 < duration) {
      setCurrentTime(prev => prev + 10);
    } else {
      setCurrentTime(duration);
    }
  };

  const handlePrevious = () => {
    const tabs: Tab[] = ["meditation", "breathing", "whitenoise"];
    const currentIndex = tabs.indexOf(activeTab);
    const prevIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[prevIndex]);
  };

  const handleNext = () => {
    const tabs: Tab[] = ["meditation", "breathing", "whitenoise"];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  const handleShuffle = () => {
    if (!isShuffle) {
      setIsShuffle(true);
      const tabs: Tab[] = ["meditation", "breathing", "whitenoise"];
      const otherTabs = tabs.filter(t => t !== activeTab);
      const randomTab = otherTabs[Math.floor(Math.random() * otherTabs.length)];
      setActiveTab(randomTab);
    } else {
      setIsShuffle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl">
        {/* Close button - outside modal on mobile, inside on desktop */}
        <button
          onClick={onClose}
          className="absolute -top-14 right-0 md:top-4 md:right-4 z-10 w-10 h-10 bg-black/60 hover:bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center transition-colors border border-white/20"
        >
          <X className="w-5 h-5 text-white/90" />
        </button>

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full bg-black/40 backdrop-blur-2xl rounded-xl shadow-2xl overflow-hidden p-4 md:p-6 border border-white/10 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex flex-col md:flex-row gap-4 md:gap-6">
            {/* Left side - Sessions list */}
            <div className="flex-1 space-y-2 md:max-w-md">
              {/* Meditation */}
              <motion.button
                onClick={() => setActiveTab("meditation")}
                className={`w-full rounded-2xl p-4 text-left transition-all flex items-center gap-4 ${
                  activeTab === "meditation"
                    ? "bg-white/10"
                    : "bg-transparent hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 grid grid-cols-3 gap-0.5">
                    {[...Array(9)].map((_, i) => (
                      <div key={i} className="bg-white/70 rounded-full" />
                    ))}
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white">
                    Тишина в пути
                  </h3>
                  <p className="text-white/50 text-sm">
                    Медитация
                  </p>
                </div>

                {/* Play indicator */}
                {activeTab === "meditation" ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="w-1 h-4 bg-white/70 rounded-full mr-0.5" />
                    <div className="w-1 h-4 bg-white/70 rounded-full" />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/40" />
                )}
              </motion.button>

              {/* Breathing */}
              <motion.button
                onClick={() => setActiveTab("breathing")}
                className={`w-full rounded-2xl p-4 text-left transition-all flex items-center gap-4 ${
                  activeTab === "breathing"
                    ? "bg-white/10"
                    : "bg-transparent hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-6 h-6 rounded-full border-2 border-white/70 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white/70" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white">
                    Ровный темп
                  </h3>
                  <p className="text-white/50 text-sm">
                    Дыхание
                  </p>
                </div>

                {/* Play indicator */}
                {activeTab === "breathing" ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="w-1 h-4 bg-white/70 rounded-full mr-0.5" />
                    <div className="w-1 h-4 bg-white/70 rounded-full" />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/40" />
                )}
              </motion.button>

              {/* White noise */}
              <motion.button
                onClick={() => setActiveTab("whitenoise")}
                className={`w-full rounded-2xl p-4 text-left transition-all flex items-center gap-4 ${
                  activeTab === "whitenoise"
                    ? "bg-white/10"
                    : "bg-transparent hover:bg-white/5"
                }`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center flex-shrink-0">
                  <div className="relative w-6 h-6">
                    <div className="absolute inset-0 rounded-full border-2 border-white/70" />
                    <div className="absolute inset-1 rounded-full border-2 border-white/50" />
                    <div className="absolute inset-2 rounded-full border-2 border-white/30" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-white">
                    Мягкий фон
                  </h3>
                  <p className="text-white/50 text-sm">
                    Мелодия
                  </p>
                </div>

                {/* Play indicator */}
                {activeTab === "whitenoise" ? (
                  <div className="w-8 h-8 flex items-center justify-center">
                    <div className="w-1 h-4 bg-white/70 rounded-full mr-0.5" />
                    <div className="w-1 h-4 bg-white/70 rounded-full" />
                  </div>
                ) : (
                  <ChevronRight className="w-5 h-5 text-white/40" />
                )}
              </motion.button>
            </div>

            {/* Right side - Player */}
            <div className="w-full md:w-96 bg-white/10 backdrop-blur-xl rounded-xl p-4 md:p-6 flex flex-col items-center border border-white/20 shadow-2xl">
              {/* Title */}
              <div className="text-center mb-3 md:mb-4">
                <p className="text-white/60 text-xs md:text-sm">
                  {activeTab === "meditation" ? "Тишина в пути" : activeTab === "breathing" ? "Ровный темп" : "Мягкий фон"}
                </p>
                <h3 className="text-white text-sm md:text-base">
                  {activeTab === "meditation" ? "Медитация" : activeTab === "breathing" ? "Дыхание" : "Мелодия"}
                </h3>
              </div>

              {/* Circular progress */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center mb-3 md:mb-4">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="8"
                    fill="none"
                  />
                  {/* Progress circle - only show when playing or has progress */}
                  {(isPlaying || currentTime > 0) && (
                    <circle
                      cx="50%"
                      cy="50%"
                      r="45%"
                      stroke={activeTab === "meditation" ? "#34AB53" : activeTab === "breathing" ? "#4285F4" : "#E74639"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={2 * Math.PI * 60}
                      strokeDashoffset={2 * Math.PI * 60 - (progress / 100) * 2 * Math.PI * 60}
                      strokeLinecap="round"
                      style={{ transition: "stroke-dashoffset 0.5s ease" }}
                    />
                  )}
                </svg>

                {/* Play/Pause button */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="absolute inset-0 m-auto w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/30 transition-all border border-white/30"
                  style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
                >
                  {isPlaying ? (
                    <Pause className="w-6 h-6 md:w-8 md:h-8 text-white" fill="currentColor" />
                  ) : (
                    <Play className="w-6 h-6 md:w-8 md:h-8 text-white translate-x-[1px]" fill="currentColor" />
                  )}
                </button>
              </div>

              {/* Time */}
              <div className="flex items-center justify-between w-full px-2 md:px-4 mb-3 md:mb-4">
                <span className="text-white/90 text-xs md:text-sm">{formatTime(currentTime)}</span>
                <span className="text-white/50 text-xs md:text-sm">{formatTime(duration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-2 md:gap-4">
                <button 
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors ${
                    isRepeat ? 'bg-white/10' : ''
                  }`}
                >
                  <Repeat className={`w-4 h-4 md:w-5 md:h-5 ${isRepeat ? 'text-white' : 'text-white/70'}`} />
                </button>
                <button 
                  onClick={handlePrevious}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                >
                  <SkipBack className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
                </button>
                <button 
                  onClick={handleNext}
                  className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors"
                >
                  <SkipForward className="w-4 h-4 md:w-5 md:h-5 text-white/70" />
                </button>
                <button 
                  onClick={handleShuffle}
                  className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center hover:bg-white/10 rounded-full transition-colors ${
                    isShuffle ? 'bg-white/10' : ''
                  }`}
                >
                  <Shuffle className={`w-4 h-4 md:w-5 md:h-5 ${isShuffle ? 'text-white' : 'text-white/70'}`} />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
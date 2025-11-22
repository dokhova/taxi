import {
  X,
  Repeat,
  SkipBack,
  SkipForward,
  Shuffle,
  Play,
  Pause,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";

interface RelaxationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Tab = "meditation" | "ambient" | "nature";

export function RelaxationModal({
  isOpen,
  onClose,
}: RelaxationModalProps) {
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
    ambient: "/mp3/ambient.mp3",
    nature: "/mp3/nature.mp3",
  };

  const durations = {
    meditation: 0, // Will be set from audio metadata
    ambient: 0, // Will be set from audio metadata
    nature: 0, // Will be set from audio metadata
  };

  const [duration, setDuration] = useState(180);

  // Initialize audio element
  useEffect(() => {
    if (audioFiles[activeTab]) {
      setAudioLoaded(false);
      setAudioError(false);

      const audio = new Audio();
      audio.crossOrigin = "anonymous";
      audio.loop = isRepeat;
      audio.preload = "metadata";

      // Handle metadata loaded
      const handleLoadedMetadata = () => {
        setDuration(Math.floor(audio.duration));
        setAudioLoaded(true);
      };

      // Handle audio can play
      const handleCanPlay = () => {
        setAudioLoaded(true);
      };

      // Handle audio load error
      const handleError = () => {
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

      audio.addEventListener(
        "loadedmetadata",
        handleLoadedMetadata,
      );
      audio.addEventListener("canplay", handleCanPlay);
      audio.addEventListener("error", handleError);
      audio.addEventListener("timeupdate", handleTimeUpdate);
      audio.addEventListener("ended", handleEnded);

      audio.src = audioFiles[activeTab];
      audio.load();

      audioRef.current = audio;

      return () => {
        audio.removeEventListener(
          "loadedmetadata",
          handleLoadedMetadata,
        );
        audio.removeEventListener("canplay", handleCanPlay);
        audio.removeEventListener("error", handleError);
        audio.removeEventListener(
          "timeupdate",
          handleTimeUpdate,
        );
        audio.removeEventListener("ended", handleEnded);
        audio.pause();
        audio.src = "";
      };
    } else {
      // For whitenoise without audio file
      setAudioLoaded(false);
      setDuration(300);
    }
  }, [activeTab, isRepeat]);

  // Handle play/pause
  useEffect(() => {
    if (audioRef.current && audioLoaded) {
      if (isPlaying) {
        console.log("Playing audio");
        audioRef.current.play().catch((err) => {
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
    if (
      isOpen &&
      isPlaying &&
      (!audioFiles[activeTab] || audioError)
    ) {
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
  }, [
    isOpen,
    isPlaying,
    duration,
    isRepeat,
    activeTab,
    audioError,
  ]);

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
  const strokeDashoffset =
    circumference - (progress / 100) * circumference;

  if (!isOpen) return null;

  const handleSkipBack = () => {
    if (currentTime > 10) {
      setCurrentTime((prev) => prev - 10);
    } else {
      setCurrentTime(0);
    }
  };

  const handleSkipForward = () => {
    if (currentTime + 10 < duration) {
      setCurrentTime((prev) => prev + 10);
    } else {
      setCurrentTime(duration);
    }
  };

  const handlePrevious = () => {
    const tabs: Tab[] = ["meditation", "ambient", "nature"];
    const currentIndex = tabs.indexOf(activeTab);
    const prevIndex =
      currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    setActiveTab(tabs[prevIndex]);
  };

  const handleNext = () => {
    const tabs: Tab[] = ["meditation", "ambient", "nature"];
    const currentIndex = tabs.indexOf(activeTab);
    const nextIndex = (currentIndex + 1) % tabs.length;
    setActiveTab(tabs[nextIndex]);
  };

  const handleShuffle = () => {
    if (!isShuffle) {
      setIsShuffle(true);
      const tabs: Tab[] = ["meditation", "ambient", "nature"];
      const otherTabs = tabs.filter((t) => t !== activeTab);
      const randomTab =
        otherTabs[Math.floor(Math.random() * otherTabs.length)];
      setActiveTab(randomTab);
    } else {
      setIsShuffle(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl">
        {/* Minimize button */}
        <button
          onClick={onClose}
          className="absolute -top-16 right-0 md:-top-16 md:right-0 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors shadow-lg"
        >
          <ChevronDown className="w-6 h-6 text-white" />
        </button>

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full bg-[#19191B] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          style={{ maxHeight: '85vh' }}
        >
          <div className="flex flex-col md:flex-row">
            {/* Left - Vertical list for practices (desktop) / Top horizontal slider (mobile) */}
            <div className="flex-shrink-0 md:border-r border-b md:border-b-0 border-white/10 md:w-80">
              {/* Mobile - Horizontal slider */}
              <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory scrollbar-hide px-3 py-3 gap-2">
                {/* Meditation */}
                <motion.button
                  onClick={() => setActiveTab("meditation")}
                  className={`flex-shrink-0 w-56 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all snap-center ${
                    activeTab === "meditation"
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/5 hover:bg-white/10 border border-transparent"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeTab === "meditation" ? "bg-green-500/20 border border-green-500/30" : "bg-white/10"
                  }`}>
                    <div className="w-4 h-4 grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={activeTab === "meditation" ? "bg-green-500 rounded-full w-1 h-1" : "bg-white/50 rounded-full w-1 h-1"}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white">Тишина в пути</h3>
                    <p className="text-white/50 text-sm">Медитация</p>
                  </div>
                </motion.button>

                {/* Ambient */}
                <motion.button
                  onClick={() => setActiveTab("ambient")}
                  className={`flex-shrink-0 w-56 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all snap-center ${
                    activeTab === "ambient"
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/5 hover:bg-white/10 border border-transparent"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeTab === "ambient" ? "bg-blue-500/20 border border-blue-500/30" : "bg-white/10"
                  }`}>
                    <div className="relative w-4 h-4">
                      <div className={`absolute inset-0 rounded-full border-2 ${
                        activeTab === "ambient" ? "border-blue-500" : "border-white/50"
                      }`} />
                      <div className={`absolute inset-1 rounded-full border ${
                        activeTab === "ambient" ? "border-blue-400" : "border-white/30"
                      }`} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white">Мягкий фон</h3>
                    <p className="text-white/50 text-sm">Амбиент</p>
                  </div>
                </motion.button>

                {/* Nature */}
                <motion.button
                  onClick={() => setActiveTab("nature")}
                  className={`flex-shrink-0 w-56 flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all snap-center ${
                    activeTab === "nature"
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/5 hover:bg-white/10 border border-transparent"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeTab === "nature" ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/10"
                  }`}>
                    <div className="relative w-4 h-4">
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
                        activeTab === "nature" ? "bg-emerald-500" : "bg-white/50"
                      }`} />
                      <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 rounded-full ${
                        activeTab === "nature" ? "bg-emerald-500" : "bg-white/50"
                      }`} />
                      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full ${
                        activeTab === "nature" ? "bg-emerald-500" : "bg-white/50"
                      }`} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white">Звук природы</h3>
                    <p className="text-white/50 text-sm">Мелодия</p>
                  </div>
                </motion.button>
              </div>

              {/* Desktop - Vertical list */}
              <div className="hidden md:flex md:flex-col p-3 gap-2">
                {/* Meditation */}
                <motion.button
                  onClick={() => setActiveTab("meditation")}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    activeTab === "meditation"
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/5 hover:bg-white/10 border border-transparent"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeTab === "meditation" ? "bg-green-500/20 border border-green-500/30" : "bg-white/10"
                  }`}>
                    <div className="w-5 h-5 grid grid-cols-3 gap-0.5">
                      {[...Array(9)].map((_, i) => (
                        <div
                          key={i}
                          className={activeTab === "meditation" ? "bg-green-500 rounded-full" : "bg-white/50 rounded-full"}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white">Тишина в пути</h3>
                    <p className="text-white/50 text-sm">Медитация</p>
                  </div>

                  {activeTab === "meditation" && (
                    <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0" />
                  )}
                </motion.button>

                {/* Ambient */}
                <motion.button
                  onClick={() => setActiveTab("ambient")}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    activeTab === "ambient"
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/5 hover:bg-white/10 border border-transparent"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeTab === "ambient" ? "bg-blue-500/20 border border-blue-500/30" : "bg-white/10"
                  }`}>
                    <div className="relative w-5 h-5">
                      <div className={`absolute inset-0 rounded-full border-2 ${
                        activeTab === "ambient" ? "border-blue-500" : "border-white/50"
                      }`} />
                      <div className={`absolute inset-1 rounded-full border ${
                        activeTab === "ambient" ? "border-blue-400" : "border-white/30"
                      }`} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white">Мягкий фон</h3>
                    <p className="text-white/50 text-sm">Амбиент</p>
                  </div>

                  {activeTab === "ambient" && (
                    <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0" />
                  )}
                </motion.button>

                {/* Nature */}
                <motion.button
                  onClick={() => setActiveTab("nature")}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-left transition-all ${
                    activeTab === "nature"
                      ? "bg-white/10 border border-white/20"
                      : "bg-white/5 hover:bg-white/10 border border-transparent"
                  }`}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    activeTab === "nature" ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/10"
                  }`}>
                    <div className="relative w-5 h-5">
                      <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full ${
                        activeTab === "nature" ? "bg-emerald-500" : "bg-white/50"
                      }`} />
                      <div className={`absolute bottom-0 left-0 w-2 h-2 rounded-full ${
                        activeTab === "nature" ? "bg-emerald-500" : "bg-white/50"
                      }`} />
                      <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${
                        activeTab === "nature" ? "bg-emerald-500" : "bg-white/50"
                      }`} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-white">Звук природы</h3>
                    <p className="text-white/50 text-sm">Мелодия</p>
                  </div>

                  {activeTab === "nature" && (
                    <ChevronRight className="w-5 h-5 text-white/50 flex-shrink-0" />
                  )}
                </motion.button>
              </div>
            </div>

            {/* Right - Player */}
            <div className="relative px-3 md:px-5 pt-6 pb-6 flex flex-col flex-1 justify-center">
              {/* Title */}
              <div className="text-center mb-8">
                <h2 className="text-white text-2xl mb-2">
                  {activeTab === "meditation"
                    ? "Тишина в пути"
                    : activeTab === "ambient"
                      ? "Мягкий фон"
                      : "Звук природы"}
                </h2>
                <p className="text-white/70 text-base">
                  {activeTab === "meditation"
                    ? "Медитация"
                    : activeTab === "ambient"
                      ? "Амбиент"
                      : "Мелодия"}
                </p>
              </div>

              {/* Progress bar */}
              <div className="mb-8 px-4">
                <div className="relative h-1 bg-white/30 rounded-full overflow-visible mb-4">
                  {/* Progress fill */}
                  <div 
                    className="absolute top-0 left-0 h-full bg-white rounded-full transition-all duration-300"
                    style={{
                      width: `${progress}%`,
                    }}
                  />
                  {/* Slider thumb */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-300"
                    style={{
                      left: `calc(${progress}% - 6px)`,
                    }}
                  />
                </div>
                
                {/* Time display */}
                <div className="flex items-center justify-between text-base">
                  <span className="text-white/90">
                    {formatTime(currentTime)}
                  </span>
                  <span className="text-white/90">
                    {formatTime(duration)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-8">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all ${
                    isShuffle ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Shuffle className="w-6 h-6 text-white" />
                </button>
                
                <button
                  onClick={handlePrevious}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
                >
                  <SkipBack className="w-7 h-7 text-white" fill="white" />
                </button>
                
                {/* Center Play/Pause button with ring */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="relative w-20 h-20 flex items-center justify-center transition-all hover:scale-105"
                >
                  {/* Inner button */}
                  <div className="relative z-10 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20">
                    {isPlaying ? (
                      <Pause 
                        className="w-7 h-7" 
                        fill="white"
                        color="white"
                      />
                    ) : (
                      <Play 
                        className="w-7 h-7 translate-x-0.5" 
                        fill="white"
                        color="white"
                      />
                    )}
                  </div>
                </button>
                
                <button
                  onClick={handleNext}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all"
                >
                  <SkipForward className="w-7 h-7 text-white" fill="white" />
                </button>
                
                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`w-12 h-12 flex items-center justify-center hover:bg-white/10 rounded-full transition-all ${
                    isRepeat ? "opacity-100" : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Repeat className="w-6 h-6 text-white" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
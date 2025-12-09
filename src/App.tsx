import { DriverInfo } from "./components/DriverInfo";
import { TripMap } from "./components/TripMap";
import { TripDetails } from "./components/TripDetails";
import { RelaxationModal } from "./components/RelaxationModal";
import { MiniPlayer } from "./components/MiniPlayer";
import { MoreVertical, Shield, ChevronRight, Play, Pause, Globe } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import faviconImg from "figma:asset/58927ff4e7977a8aaf7b4dbcd3c9164adf40c2be.png";
import { translations, Language } from "./locales/translations";

export default function App() {
  const [isRelaxationModalOpen, setIsRelaxationModalOpen] = useState(false);
  const [isRelaxationExpanded, setIsRelaxationExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<string>("meditation");
  const [language, setLanguage] = useState<Language>("en");
  const audioRef = useRef<HTMLAudioElement>(null);

  const t = (key: keyof typeof translations.en) => translations[language][key];

  // Set page title and favicon
  useEffect(() => {
    document.title = "Ride Spokspace";
    
    // Set favicon
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/png';
    link.rel = 'icon';
    link.href = faviconImg;
    document.getElementsByTagName('head')[0].appendChild(link);
  }, []);

  const tracks = {
    meditation: {
      name: t("silenceOnTheRoad"),
      subtitle: t("meditationSubtitle"),
      icon: "meditation",
      src: language === "ru" ? "/mp3/pause_ru.mp3" : "/mp3/pause_en.mp3",
    },
    ambient: {
      name: t("softBackground"),
      subtitle: t("ambientSubtitle"),
      icon: "ambient",
      src: "/mp3/ambient.mp3",
    },
    nature: {
      name: t("natureSound"),
      subtitle: t("natureSubtitle"),
      icon: "nature",
      src: "/mp3/nature.mp3",
    },
  };

  const tripData = {
    driver: {
      name: language === "ru" ? "Александр" : "Alexander",
      rating: 4.9,
      photoUrl: "https://images.unsplash.com/photo-1640658506905-351be27a1c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3NjM2MzAwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      carModel: "Toyota Camry",
      carNumber: "А123ВС 77",
      carColor: t("black"),
    },
    pickup: language === "ru" ? "ул. Тверская, 12" : "12 Tverskaya St",
    destination: language === "ru" ? "Аэропорт Шереметьево, Терминал D" : "Sheremetyevo Airport, Terminal D",
    estimatedTime: language === "ru" ? "12 мин" : "12 min",
    price: "1 250",
    status: t("inProgress"),
  };

  useEffect(() => {
    const currentRef = audioRef.current;
    if (currentRef) {
      if (isPlaying) {
        currentRef.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        currentRef.pause();
      }
    }
    
    const interval = setInterval(() => {
      if (currentRef && isPlaying) {
        setCurrentTime(currentRef.currentTime);
      }
    }, 100);
    
    return () => {
      clearInterval(interval);
      if (currentRef) {
        currentRef.pause();
      }
    };
  }, [isPlaying]);

  // Смена трека при изменении selectedTrack
  useEffect(() => {
    const currentRef = audioRef.current;
    if (currentRef) {
      const wasPlaying = isPlaying;
      currentRef.pause();
      currentRef.src = tracks[selectedTrack as keyof typeof tracks].src;
      currentRef.load();
      setCurrentTime(0);
      if (wasPlaying) {
        currentRef.play().catch(() => {
          setIsPlaying(false);
        });
      }
    }
  }, [selectedTrack, language]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const togglePlayPause = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-[#19191B] relative">
      {/* Map background for entire screen */}
      <div className="fixed inset-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1717343824623-06293a62a70d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaXR5JTIwbWFwfGVufDF8fHx8MTc2MzU0MDg0OXww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="City map background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-[#19191B]/60"></div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto p-4 space-y-3 md:space-y-4 relative z-10">
        {/* Mini Player with Language Switcher */}
        <div className="flex items-start justify-between gap-4 mt-3 md:mt-[24px]">
          <MiniPlayer
            isPlaying={isPlaying}
            currentTime={currentTime}
            togglePlayPause={togglePlayPause}
            formatTime={formatTime}
            audioRef={audioRef}
            isExpanded={isRelaxationExpanded}
            onExpandToggle={() => setIsRelaxationExpanded(!isRelaxationExpanded)}
            selectedTrack={selectedTrack}
            onTrackChange={setSelectedTrack}
            tracks={tracks}
            t={t}
          />
          
          {/* Language Switcher */}
          <button
            onClick={() => setLanguage(language === "ru" ? "en" : "ru")}
            className="flex items-center gap-2 backdrop-blur-sm border rounded-xl px-3 py-3 transition-colors flex-shrink-0 h-[64px]"
            style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <Globe className="w-4 h-4 text-white/70" />
            <span className="text-sm text-white/90">{language === "ru" ? "RU" : "EN"}</span>
          </button>
        </div>

        {/* Map */}
        <TripMap />

        {/* Driver info */}
        <DriverInfo
          name={tripData.driver.name}
          rating={tripData.driver.rating}
          photoUrl={tripData.driver.photoUrl}
          carModel={tripData.driver.carModel}
          carNumber={tripData.driver.carNumber}
          carColor={tripData.driver.carColor}
        />

        {/* Trip details */}
        <TripDetails
          pickup={tripData.pickup}
          destination={tripData.destination}
          estimatedTime={tripData.estimatedTime}
          price={tripData.price}
          status={tripData.status}
          t={t}
        />

        {/* Safety button */}
        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-2 transition-colors">
          <Shield className="w-5 h-5" style={{ color: '#4285F4' }} />
          <span className="text-sm text-white/90">{t("tripSafety")}</span>
        </button>

        {/* Relaxation modal */}
        <RelaxationModal
          isOpen={isRelaxationModalOpen}
          onClose={() => setIsRelaxationModalOpen(false)}
          isExpanded={isRelaxationExpanded}
          onExpandToggle={() => setIsRelaxationExpanded(!isRelaxationExpanded)}
          selectedTrack={selectedTrack}
          onTrackChange={setSelectedTrack}
          tracks={tracks}
        />

        {/* Audio player */}
        <audio 
          ref={audioRef} 
          src={tracks[selectedTrack as keyof typeof tracks].src}
          loop 
          onError={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}
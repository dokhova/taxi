import { DriverInfo } from "./components/DriverInfo";
import { TripMap } from "./components/TripMap";
import { TripDetails } from "./components/TripDetails";
import { RelaxationModal } from "./components/RelaxationModal";
import { MoreVertical, Shield, ChevronRight, Play, Pause } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [isRelaxationModalOpen, setIsRelaxationModalOpen] = useState(false);
  const [isRelaxationExpanded, setIsRelaxationExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState<string>("meditation");
  const audioRef = useRef<HTMLAudioElement>(null);

  const tracks = {
    meditation: {
      name: "Тишина в пути",
      subtitle: "Медитация",
      icon: "meditation",
    },
    ambient: {
      name: "Мягкий фон",
      subtitle: "Амбиент",
      icon: "ambient",
    },
    nature: {
      name: "Звук природы",
      subtitle: "Природа",
      icon: "nature",
    },
  };

  const tripData = {
    driver: {
      name: "Александр П.",
      rating: 4.9,
      photoUrl: "https://images.unsplash.com/photo-1640658506905-351be27a1c14?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBkcml2ZXIlMjBwb3J0cmFpdCUyMG1hbnxlbnwxfHx8fDE3NjM2MzAwMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      carModel: "Toyota Camry",
      carNumber: "А123ВС 77",
      carColor: "Черный",
    },
    pickup: "ул. Тверская, 12",
    destination: "Аэропорт Шереметьево, Терминал D",
    estimatedTime: "12 мин",
    price: "1 250",
    status: "В пути",
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
      <div className="max-w-2xl mx-auto p-4 space-y-4 relative z-10">
        {/* Map */}
        <TripMap 
          onRelaxationClick={() => setIsRelaxationModalOpen(true)}
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
        />

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
        />

        {/* Safety button */}
        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex items-center justify-center gap-2 transition-colors">
          <Shield className="w-5 h-5" style={{ color: '#4285F4' }} />
          <span className="text-sm text-white/90">Безопасность поездки</span>
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

        {/* Audio player - using working source */}
        <audio 
          ref={audioRef} 
          src="https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Kangaroo_MusiQue_-_The_Neverwritten_Role_Playing_Game.mp3" 
          loop 
          onError={() => setIsPlaying(false)}
        />
      </div>
    </div>
  );
}
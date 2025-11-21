import { DriverInfo } from "./components/DriverInfo";
import { TripMap } from "./components/TripMap";
import { TripDetails } from "./components/TripDetails";
import { RelaxationModal } from "./components/RelaxationModal";
import { MoreVertical, Shield } from "lucide-react";
import { useState } from "react";

export default function App() {
  const [isRelaxationModalOpen, setIsRelaxationModalOpen] = useState(false);

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
        <TripMap onRelaxationClick={() => setIsRelaxationModalOpen(true)} />

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
        />
      </div>
    </div>
  );
}
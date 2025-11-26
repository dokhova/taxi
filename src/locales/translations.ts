export const translations = {
  en: {
    // Trip details
    pickup: "Pickup",
    destination: "Destination",
    estimatedTime: "min",
    inProgress: "In progress",
    tripCost: "Trip cost",
    
    // Driver info
    rating: "Rating",
    
    // Safety
    tripSafety: "Trip Safety",
    
    // Relaxation
    calmMode: "Calm Mode",
    pauseInMotion: "Pause in motion",
    practices: "Practices",
    meditation: "Meditation",
    
    // Tracks
    silenceOnTheRoad: "Calm Ride",
    meditationSubtitle: "Meditation",
    softBackground: "Soft background",
    ambientSubtitle: "Ambient",
    natureSound: "Nature Song",
    natureSubtitle: "Melody",
    
    // Driver
    carModel: "Car",
    carNumber: "Plate",
    carColor: "Color",
    
    // Colors
    black: "Black",
    white: "White",
    silver: "Silver",
    gray: "Gray",
  },
  ru: {
    // Trip details
    pickup: "Откуда",
    destination: "Куда",
    estimatedTime: "мин",
    inProgress: "В пути",
    tripCost: "Стоимость поездки",
    
    // Driver info
    rating: "Рейтинг",
    
    // Safety
    tripSafety: "Безопасность поездки",
    
    // Relaxation
    calmMode: "Спокойный режим",
    pauseInMotion: "Пауза в движении",
    practices: "Практики",
    meditation: "Медитация",
    
    // Tracks
    silenceOnTheRoad: "Пауза в пути",
    meditationSubtitle: "Медитация",
    softBackground: "Мягкий фон",
    ambientSubtitle: "Амбиент",
    natureSound: "Звук природы",
    natureSubtitle: "Мелодия",
    
    // Driver
    carModel: "Машина",
    carNumber: "Номер",
    carColor: "Цвет",
    
    // Colors
    black: "Черный",
    white: "Белый",
    silver: "Серебристый",
    gray: "Серый",
  }
};

export type Language = 'en' | 'ru';
export type TranslationKey = keyof typeof translations.en;
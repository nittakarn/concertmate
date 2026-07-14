export interface Round {
  key: string;
  label: string;
  date: string;
}

export interface TicketZone {
  zone: string;
  price: number;
  type: string;
  color: string;
  perks: string;
  hasSoundcheck?: boolean;
  hasEarlyEntry?: boolean;
}

export interface Hotel {
  id: string;
  name: string;
  dist: string;
  rating: number;
  price: number;
  mapQuery: string;
  reason: string;
  image?: string;
  bookingUrl?: string;
}

export interface Transit {
  bts?: string;
  boat?: string;
  public: string;
  driving: string;
  grab: string;
  returnNote: string;
}

export interface ChecklistItem {
  text: string;
  pending: boolean;
}

export interface Concert {
  id: string;
  name: string;
  venueName: string;
  venueQuery: string;
  doorTime: string;
  showTime: string;
  isOutdoor: boolean;
  rounds: Round[];
  prices: TicketZone[];
  hotels: Hotel[];
  transit: Transit;
  weatherNote: string;
  checklistExtra: ChecklistItem[];
}

export interface RecommendRequest {
  concertId: string;
  budget: number;
  hotelPriorities: string[];
  needHotel: boolean;
  hotelNights: number;
  transportCost: number;
  merchCost: number;
  foodCost: number;
  otherCost: number;
}

export interface RankedHotel {
  rank: number;
  hotel: Hotel;
  score: number;
  reasoning: string;
}

export interface RecommendResponse {
  rankedHotels: RankedHotel[];
}

export interface WizardState {
  budget: number;
  ticketType: string;
  ticketPrefs: string[];
  needHotel: boolean;
  hotelNights: number;
  hotelPriorities: string[];
  transportCost: number;
  merchCost: number;
  foodCost: number;
  otherCost: number;
  haveTicket?: boolean;
  preselectedZone?: string;
}

export type AppScreen = "home" | "wizard" | "loading" | "dashboard";

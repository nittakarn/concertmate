from pydantic import BaseModel
from typing import Optional


class Round(BaseModel):
    key: str
    label: str
    date: str


class TicketZone(BaseModel):
    zone: str
    price: int
    type: str
    color: str
    perks: str
    hasSoundcheck: bool = False
    hasEarlyEntry: bool = False


class Hotel(BaseModel):
    id: str
    name: str
    dist: str
    rating: float
    price: int
    mapQuery: str
    reason: str
    image: Optional[str] = None
    bookingUrl: Optional[str] = None


class Transit(BaseModel):
    bts: Optional[str] = None
    boat: Optional[str] = None
    public: str
    driving: str
    grab: str
    returnNote: str


class ChecklistItem(BaseModel):
    text: str
    pending: bool


class Concert(BaseModel):
    id: str
    name: str
    venueName: str
    venueQuery: str
    doorTime: str
    showTime: str
    isOutdoor: bool
    rounds: list[Round]
    prices: list[TicketZone]
    hotels: list[Hotel]
    transit: Transit
    weatherNote: str
    checklistExtra: list[ChecklistItem]


class RecommendRequest(BaseModel):
    concertId: str
    budget: float
    hotelPriorities: list[str]
    needHotel: bool
    hotelNights: int
    transportCost: float
    merchCost: float
    foodCost: float
    otherCost: float


class RankedHotel(BaseModel):
    rank: int
    hotel: Hotel
    score: float
    reasoning: str


class RecommendResponse(BaseModel):
    rankedHotels: list[RankedHotel]

import type { Hotel, RankedHotel, RecommendRequest, RecommendResponse } from "./types";
import { CONCERTS_DATA } from "./concerts";

const HOTEL_PRIORITY_LABELS: Record<string, string> = {
  closest: "ใกล้ฮอลล์ที่สุด",
  value: "คุ้มค่าที่สุด",
  rated: "รีวิวดีที่สุด",
};

function hotelReasoning(hotel: Hotel, priorities: string[]): string {
  const frags: string[] = [];
  if (priorities.includes("closest")) frags.push(`อยู่ห่างจากฮอลล์แค่ ${hotel.dist}`);
  if (priorities.includes("value")) frags.push(`ราคาย่อมเยาที่ ฿${hotel.price.toLocaleString()}/คืน`);
  if (priorities.includes("rated")) frags.push(`คะแนนรีวิวสูงถึง ${hotel.rating}/5`);
  const labels = priorities
    .filter((p) => HOTEL_PRIORITY_LABELS[p])
    .map((p) => HOTEL_PRIORITY_LABELS[p])
    .join(" + ");
  return `เพราะคุณเลือกเน้น "${labels}" — ${hotel.name} ตรงเงื่อนไขคุณ เพราะ${frags.join(" และ")} (${hotel.reason})`;
}

function hotelScore(hotel: Hotel, priorities: string[]): number {
  const scores: number[] = [];
  if (priorities.includes("closest")) {
    const distVal = parseFloat(hotel.dist.replace("~", "").replace(" กม.", "").split(" ")[0]) || 5.0;
    scores.push(Math.max(0, (10.0 - distVal) / 10.0) * 10);
  }
  if (priorities.includes("value")) {
    scores.push(Math.max(0, (5000.0 - hotel.price) / 4000.0) * 10);
  }
  if (priorities.includes("rated")) {
    scores.push(((hotel.rating - 1.0) / 4.0) * 10);
  }
  if (scores.length === 0) return 0;
  return Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
}

export function getRecommendation(req: RecommendRequest): RecommendResponse {
  const concert = CONCERTS_DATA.find((c) => c.id === req.concertId);
  if (!concert) throw new Error("Concert not found");

  const priorities = req.hotelPriorities.length > 0 ? req.hotelPriorities : ["closest"];
  const sorted = [...concert.hotels].sort((a, b) => hotelScore(b, priorities) - hotelScore(a, priorities));

  const rankedHotels: RankedHotel[] = sorted.map((hotel, i) => ({
    rank: i + 1,
    hotel,
    score: hotelScore(hotel, priorities),
    reasoning: hotelReasoning(hotel, priorities),
  }));

  return { rankedHotels };
}

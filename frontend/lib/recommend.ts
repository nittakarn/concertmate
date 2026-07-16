import type { Hotel, RankedHotel, RecommendRequest, RecommendResponse } from "./types";
import { CONCERTS_DATA } from "./concerts";

const HOTEL_PRIORITY_LABELS: Record<string, string> = {
  closest: "ใกล้ฮอลล์ที่สุด",
  value: "คุ้มค่าที่สุด",
  rated: "รีวิวดีที่สุด",
};

function hotelReasoning(hotel: Hotel, priorities: string[], withinBudget: boolean): string {
  const frags: string[] = [];
  if (priorities.includes("closest")) frags.push(`อยู่ห่างจากฮอลล์แค่ ${hotel.dist}`);
  if (priorities.includes("value")) frags.push(`ราคาย่อมเยาที่ ฿${hotel.price.toLocaleString()}/คืน`);
  if (priorities.includes("rated")) frags.push(`คะแนนรีวิวสูงถึง ${hotel.rating}/5`);
  const labels = priorities
    .filter((p) => HOTEL_PRIORITY_LABELS[p])
    .map((p) => HOTEL_PRIORITY_LABELS[p])
    .join(" + ");
  const budgetNote = withinBudget ? "" : " (ราคาเกินงบที่เหลือ)";
  return `เพราะคุณเลือกเน้น "${labels}" — ${hotel.name} ตรงเงื่อนไขคุณ เพราะ${frags.join(" และ")} (${hotel.reason})${budgetNote}`;
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

  // คำนวณงบที่เหลือสำหรับโรงแรม
  const ticketPrice = concert.prices.find((p) => p.zone === req.preselectedZone)?.price ?? 0;
  const otherCosts = req.transportCost + req.merchCost + req.foodCost + req.otherCost;
  const hotelBudgetTotal = req.budget - ticketPrice - otherCosts;
  const hotelBudgetPerNight = req.hotelNights > 0 ? hotelBudgetTotal / req.hotelNights : hotelBudgetTotal;

  // sort: โรงแรมในงบก่อน แล้วค่อย rank ตาม score
  const sorted = [...concert.hotels].sort((a, b) => {
    const aInBudget = a.price <= hotelBudgetPerNight;
    const bInBudget = b.price <= hotelBudgetPerNight;
    if (aInBudget !== bInBudget) return aInBudget ? -1 : 1;
    return hotelScore(b, priorities) - hotelScore(a, priorities);
  });

  const rankedHotels: RankedHotel[] = sorted.map((hotel, i) => {
    const withinBudget = hotel.price <= hotelBudgetPerNight;
    return {
      rank: i + 1,
      hotel,
      score: hotelScore(hotel, priorities),
      reasoning: hotelReasoning(hotel, priorities, withinBudget),
      withinBudget,
    };
  });

  return { rankedHotels };
}

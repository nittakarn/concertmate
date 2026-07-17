from fastapi import APIRouter, HTTPException
from ..data.concerts import CONCERTS_DATA
from ..models.concert import RecommendRequest, RecommendResponse, RankedHotel, Hotel

router = APIRouter(prefix="/api/recommend", tags=["recommend"])

HOTEL_PRIORITY_LABELS = {
    "closest": "ใกล้ฮอลล์ที่สุด",
    "value": "คุ้มค่าที่สุด",
    "rated": "รีวิวดีที่สุด",
}


def _hotel_reasoning(hotel: dict, priorities: list[str], within_budget: bool) -> str:
    frags = []
    if "closest" in priorities:
        frags.append(f"อยู่ห่างจากฮอลล์แค่ {hotel['dist']}")
    if "value" in priorities:
        frags.append(f"ราคาย่อมเยาที่ ฿{hotel['price']:,}/คืน")
    if "rated" in priorities:
        frags.append(f"คะแนนรีวิวสูงถึง {hotel['rating']}/5")
    labels = " + ".join(HOTEL_PRIORITY_LABELS[p] for p in priorities if p in HOTEL_PRIORITY_LABELS)
    budget_note = "" if within_budget else " (ราคาเกินงบที่เหลือ)"
    return f'เพราะคุณเลือกเน้น "{labels}" — {hotel["name"]} ตรงเงื่อนไขคุณ เพราะ{" และ".join(frags)} ({hotel["reason"]}){budget_note}'


@router.post("", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    if req.concertId not in CONCERTS_DATA:
        raise HTTPException(status_code=404, detail="Concert not found")

    hotels = CONCERTS_DATA[req.concertId]["hotels"]
    priorities = req.hotelPriorities if req.hotelPriorities else ["closest"]

    # คำนวณงบที่เหลือสำหรับโรงแรม
    concert_prices = CONCERTS_DATA[req.concertId]["prices"]
    ticket_price = next((p["price"] for p in concert_prices if p["zone"] == req.preselectedZone), 0)
    other_costs = req.transportCost + req.merchCost + req.foodCost + req.otherCost
    hotel_budget_total = req.budget - ticket_price - other_costs
    hotel_budget_per_night = hotel_budget_total / max(req.hotelNights, 1)

    def hotel_score(h: dict) -> float:
        scores: dict[str, float] = {}
        if "closest" in priorities:
            try:
                dist_val = float(h["dist"].replace("~", "").replace(" กม.", "").split()[0])
            except Exception:
                dist_val = 5.0
            scores["closest"] = max(0.0, (10.0 - dist_val) / 10.0) * 10
        if "value" in priorities:
            scores["value"] = max(0.0, (5000.0 - h["price"]) / 4000.0) * 10
        if "rated" in priorities:
            scores["rated"] = ((h["rating"] - 1.0) / 4.0) * 10
        if not scores:
            return 0.0
        return round(sum(scores.values()) / len(scores), 1)

    # sort: โรงแรมในงบก่อน แล้วค่อย rank ตาม score
    def sort_key(h: dict):
        within = h["price"] <= hotel_budget_per_night
        return (0 if within else 1, -hotel_score(h))

    sorted_hotels = sorted(hotels, key=sort_key)

    ranked_hotels = [
        RankedHotel(
            rank=i + 1,
            hotel=Hotel(**h),
            score=hotel_score(h),
            reasoning=_hotel_reasoning(h, priorities, h["price"] <= hotel_budget_per_night),
            withinBudget=h["price"] <= hotel_budget_per_night,
        )
        for i, h in enumerate(sorted_hotels)
    ]

    return RecommendResponse(rankedHotels=ranked_hotels)

from fastapi import APIRouter, HTTPException
from ..data.concerts import CONCERTS_DATA
from ..models.concert import RecommendRequest, RecommendResponse, RankedHotel, Hotel

router = APIRouter(prefix="/api/recommend", tags=["recommend"])

HOTEL_PRIORITY_LABELS = {
    "closest": "ใกล้ฮอลล์ที่สุด",
    "value": "คุ้มค่าที่สุด",
    "rated": "รีวิวดีที่สุด",
}


def _hotel_reasoning(hotel: dict, priorities: list[str]) -> str:
    frags = []
    if "closest" in priorities:
        frags.append(f"อยู่ห่างจากฮอลล์แค่ {hotel['dist']}")
    if "value" in priorities:
        frags.append(f"ราคาย่อมเยาที่ ฿{hotel['price']:,}/คืน")
    if "rated" in priorities:
        frags.append(f"คะแนนรีวิวสูงถึง {hotel['rating']}/5")
    labels = " + ".join(HOTEL_PRIORITY_LABELS[p] for p in priorities if p in HOTEL_PRIORITY_LABELS)
    return f'เพราะคุณเลือกเน้น "{labels}" — {hotel["name"]} ตรงเงื่อนไขคุณ เพราะ{" และ".join(frags)} ({hotel["reason"]})'


@router.post("", response_model=RecommendResponse)
def recommend(req: RecommendRequest):
    if req.concertId not in CONCERTS_DATA:
        raise HTTPException(status_code=404, detail="Concert not found")

    hotels = CONCERTS_DATA[req.concertId]["hotels"]
    priorities = req.hotelPriorities if req.hotelPriorities else ["closest"]

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

    ranked_hotels = [
        RankedHotel(
            rank=i + 1,
            hotel=Hotel(**h),
            score=hotel_score(h),
            reasoning=_hotel_reasoning(h, priorities),
        )
        for i, h in enumerate(sorted(hotels, key=hotel_score, reverse=True))
    ]

    return RecommendResponse(rankedHotels=ranked_hotels)

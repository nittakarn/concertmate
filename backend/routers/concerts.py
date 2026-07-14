from fastapi import APIRouter, HTTPException
from ..data.concerts import CONCERTS_DATA, TICKET_PREF_OPTIONS
from ..models.concert import Concert

router = APIRouter(prefix="/api/concerts", tags=["concerts"])


@router.get("", response_model=list[Concert])
def list_concerts():
    return list(CONCERTS_DATA.values())


@router.get("/{concert_id}", response_model=Concert)
def get_concert(concert_id: str):
    if concert_id not in CONCERTS_DATA:
        raise HTTPException(status_code=404, detail="Concert not found")
    return CONCERTS_DATA[concert_id]


@router.get("/meta/ticket-prefs")
def get_ticket_prefs():
    return TICKET_PREF_OPTIONS

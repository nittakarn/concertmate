from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import concerts, recommend

app = FastAPI(title="ConcertMate AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(concerts.router)
app.include_router(recommend.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "ConcertMate AI API"}

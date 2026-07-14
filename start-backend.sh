#!/bin/bash
cd "$(dirname "$0")"
echo "Starting ConcertMate AI Backend..."
uvicorn backend.main:app --reload --port 8000

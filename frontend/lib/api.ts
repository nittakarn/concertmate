import type { Concert, RecommendRequest, RecommendResponse } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function fetchConcerts(): Promise<Concert[]> {
  const res = await fetch(`${API}/api/concerts`);
  if (!res.ok) throw new Error("Failed to fetch concerts");
  return res.json();
}

export async function fetchRecommendation(req: RecommendRequest): Promise<RecommendResponse> {
  const res = await fetch(`${API}/api/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error("Failed to fetch recommendation");
  return res.json();
}

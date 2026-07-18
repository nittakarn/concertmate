import type { RecommendRequest, RecommendResponse } from "./types";
import type { Concert } from "./types";
import { CONCERTS_DATA } from "./concerts";
import { getRecommendation } from "./recommend";

export async function fetchConcerts(): Promise<Concert[]> {
  return CONCERTS_DATA;
}

export async function fetchRecommendation(req: RecommendRequest): Promise<RecommendResponse> {
  return getRecommendation(req);
}

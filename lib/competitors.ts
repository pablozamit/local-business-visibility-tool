import { QueryResult, Competitor, BusinessInput } from "./types";

export async function analyzeCompetitors(
  queries: QueryResult[],
  business: BusinessInput
): Promise<Competitor[]> {
  const competitorMap = new Map<string, {
    wins: number;
    rating: number;
    reviews: number;
    placeId?: string;
    aiMentions: number;
  }>();

  queries.forEach((q) => {
    if (q.mapPack.competitors) {
      q.mapPack.competitors.forEach((comp) => {
        const stats = competitorMap.get(comp.name) || {
          wins: 0,
          rating: comp.rating || 0,
          reviews: comp.reviews || 0,
          placeId: comp.placeId,
          aiMentions: 0
        };
        stats.wins++;

        // Mantener el rating y reviews si no los teníamos
        if (stats.rating === 0 && comp.rating) stats.rating = comp.rating;
        if (stats.reviews === 0 && comp.reviews) stats.reviews = comp.reviews;
        if (!stats.placeId && comp.placeId) stats.placeId = comp.placeId;

        competitorMap.set(comp.name, stats);
      });
    }
  });

  // Convertir a array y ordenar por victorias en el Map Pack
  const sortedCompetitors = Array.from(competitorMap.entries())
    .map(([name, stats]) => ({
      name,
      placeId: stats.placeId,
      visibilityScore: Math.min(100, stats.wins * 20),
      mapPackWins: stats.wins,
      reviewsCount: stats.reviews,
      rating: stats.rating,
      photosCount: 0,
      aiMentions: stats.aiMentions,
    }))
    .sort((a, b) => b.mapPackWins - a.mapPackWins)
    .slice(0, 5);

  return sortedCompetitors;
}

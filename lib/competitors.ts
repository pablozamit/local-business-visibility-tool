import { QueryResult, Competitor, BusinessInput } from "./types";

export async function analyzeCompetitors(
  queries: QueryResult[],
  business: BusinessInput
): Promise<Competitor[]> {
  const competitorStats = new Map<string, { wins: number; mentions: number }>();

  const brandTerms = business.name.toLowerCase()
    .split(/\s+/)
    .filter(term => term.length > 2);

  queries.forEach((q) => {
    if (q.mapPack.competitors) {
      q.mapPack.competitors.forEach((compName) => {
        const stats = competitorStats.get(compName) || { wins: 0, mentions: 0 };
        stats.wins++;
        competitorStats.set(compName, stats);
      });
    }
  });

  // Convertir a array y ordenar por victorias en el Map Pack
  const sortedCompetitors = Array.from(competitorStats.entries())
    .map(([name, stats]) => ({
      name,
      visibilityScore: Math.min(100, stats.wins * 20), // Score simple basado en presencia
      mapPackWins: stats.wins,
      reviewsCount: 0, // Se llenaría con una llamada adicional opcional
      rating: 0,
      photosCount: 0,
      aiMentions: 0,
    }))
    .sort((a, b) => b.mapPackWins - a.mapPackWins)
    .slice(0, 5);

  return sortedCompetitors;
}

import { SmartRecommendation, GBPData, Competitor, QueryResult } from "./types";

export function generateSmartRecommendations(
  gbpData: GBPData | null,
  competitors: Competitor[],
  queries: QueryResult[]
): SmartRecommendation[] {
  const recommendations: SmartRecommendation[] = [];

  if (!gbpData) {
    return [
      {
        id: "connect-gbp",
        title: "Conecta tu perfil de Google Business",
        description: "No hemos podido encontrar o vincular tu ficha de Google. Esto es crítico para tu visibilidad local.",
        effort: "low",
        impact: 100,
        category: "GBP",
        quickWin: true,
        estimatedPointsGain: 50,
      },
    ];
  }

  // Regla 1: Fotos
  const avgCompetitorPhotos = 30; // Valor de referencia si no tenemos el dato real de todos
  if (gbpData.photosCount < 20) {
    recommendations.push({
      id: "more-photos",
      title: "Sube al menos 15-20 fotos nuevas",
      description: `Actualmente tienes ${gbpData.photosCount} fotos. Tus competidores suelen tener más de 30. Sube fotos de alta calidad del interior, exterior y tu equipo.`,
      effort: "low",
      impact: 85,
      category: "Contenido",
      quickWin: true,
      estimatedPointsGain: 15,
    });
  }

  // Regla 2: Reseñas
  if (gbpData.rating < 4.5) {
    recommendations.push({
      id: "improve-rating",
      title: "Mejora tu calificación promedio",
      description: `Tu rating actual es de ${gbpData.rating}. Un rating por debajo de 4.5 puede disuadir a clientes potenciales frente a competidores con mejores notas.`,
      effort: "medium",
      impact: 90,
      category: "Reputación",
      quickWin: false,
      estimatedPointsGain: 20,
    });
  }

  // Regla 3: Map Pack
  const mapPackWins = queries.filter(q => q.mapPack.position !== null && q.mapPack.position <= 3).length;
  if (mapPackWins < 3) {
    recommendations.push({
      id: "optimize-keywords",
      title: "Optimiza palabras clave en tu ficha",
      description: "Solo apareces en el Map Pack en " + mapPackWins + " de las 6 búsquedas clave. Asegúrate de incluir servicios específicos en tu descripción y categorías.",
      effort: "medium",
      impact: 95,
      category: "SEO Local",
      quickWin: false,
      estimatedPointsGain: 25,
    });
  }

  // Regla 4: Horarios
  if (!gbpData.hours || gbpData.hours.length === 0) {
    recommendations.push({
      id: "add-hours",
      title: "Actualiza tus horarios comerciales",
      description: "No hemos detectado horarios completos en tu ficha. Google prioriza negocios con información completa y actualizada.",
      effort: "low",
      impact: 70,
      category: "GBP",
      quickWin: true,
      estimatedPointsGain: 10,
    });
  }

  // Regla 5: AI Overviews
  const aiMentions = queries.filter(q => q.aiOverview.mentioned).length;
  if (aiMentions < 2) {
    recommendations.push({
      id: "ai-visibility",
      title: "Mejora tu presencia en AI Overviews",
      description: "Apareces en las respuestas de IA en solo " + aiMentions + " de 6 búsquedas. Generar contenido detallado sobre tus servicios en tu web y recibir reseñas con keywords ayuda a que la IA te cite.",
      effort: "high",
      impact: 80,
      category: "IA",
      quickWin: false,
      estimatedPointsGain: 15,
    });
  }

  return recommendations
    .sort((a, b) => (b.impact / (a.effort === 'low' ? 1 : 2)) - (a.impact / (b.effort === 'low' ? 1 : 2)))
    .slice(0, 5);
}

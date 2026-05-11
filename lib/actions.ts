"use server"

import { runSerpQuery, QUERY_TEMPLATES } from "./serpapi"
import { calculateScores, generateInternalReport, generateRecommendations } from "./report"
import { fetchGBPData, extractGBPDataFromSerp } from "./gbp"
import { analyzeCompetitors } from "./competitors"
import { generateSmartRecommendations } from "./recommendations"
import { getCache, setCache, generateCacheKey } from "./cache"
import type { BusinessInput, AnalysisReport } from "./types"

export async function generateReport(business: BusinessInput): Promise<AnalysisReport> {
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    throw new Error("ERROR: La clave SERPAPI_KEY no está configurada en el archivo .env")
  }

  // 0. Caching Check
  const cacheKey = generateCacheKey(business.name, business.location, business.category)
  const cachedReport = await getCache<AnalysisReport>(cacheKey)
  if (cachedReport) {
    console.log(`📦 Devolviendo reporte desde caché para: ${business.name}`)
    return cachedReport
  }

  console.log(`🚀 Iniciando análisis real para: ${business.name} en ${business.location}...`)

  // 1. Eseguiamo le 6 ricerche reali su Google via SerpApi
  const queries = await Promise.all(
    QUERY_TEMPLATES.map(async (template) => {
      const queryText = template.template(business.category, business.location)
      console.log(`🔎 Búsqueda Google: "${queryText}"`)

      return runSerpQuery({
        business,
        queryType: template.type,
        queryText,
        apiKey,
      })
    })
  )

  // 2. Obtener datos reales de GBP
  const hasPlacesKey = !!process.env.GOOGLE_PLACES_API_KEY
  let gbpData = null

  if (hasPlacesKey) {
    gbpData = await fetchGBPData(business)
  }

  const isFreeMode = !gbpData

  if (isFreeMode) {
    console.log("ℹ️ Usando modo gratuito para datos de GBP...");
    gbpData = extractGBPDataFromSerp(queries);
  }

  // 3. Analizar competidores
  const competitors = await analyzeCompetitors(queries, business);

  // 4. Calcular scores
  const baseScores = calculateScores(queries);
  const scores = {
    ...baseScores,
    gbpCompletenessScore: gbpData?.completenessScore || 0,
    isFreeMode
  };

  // 5. Generar informes y recomendaciones
  const internalReport = generateInternalReport(queries, business.name)
  const recommendations = generateRecommendations(baseScores, queries, internalReport) // Compatibilidad
  const smartRecommendations = generateSmartRecommendations(gbpData, competitors, queries)

  console.log(`✅ Análisis completado para ${business.name}`)

  const report: AnalysisReport = {
    business,
    timestamp: new Date().toISOString(),
    queries,
    scores,
    internalReport,
    recommendations,
    smartRecommendations,
    gbpData: gbpData || undefined,
    competitors,
  }

  // 6. Save to cache
  await setCache(cacheKey, report)

  return report
}

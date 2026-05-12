"use server"

import { runSerpQuery, getQueryTemplates } from "./serpapi" // Importamos la nueva función
import { calculateScores, generateInternalReport, generateRecommendations } from "./report"
import { fetchGBPData, extractGBPDataFromSerp } from "./gbp"
import { analyzeCompetitors } from "./competitors"
import { generateSmartRecommendations } from "./recommendations"
import { getCache, setCache, generateCacheKey } from "./cache"
import type { BusinessInput, AnalysisReport } from "./types"

export async function generateReport(business: BusinessInput): Promise<AnalysisReport> {
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    throw new Error("ERROR: La clave SERPAPI_KEY no está configurada")
  }

  const cacheKey = generateCacheKey(business.name, business.location, business.category)
  const cachedReport = await getCache<AnalysisReport>(cacheKey)
  if (cachedReport) return cachedReport

  console.log(`🚀 Analizando: ${business.name} en ${business.location} (${business.countryCode})...`)

  // OBTENEMOS LOS TEMPLATES SEGÚN EL IDIOMA SELECCIONADO
  const templates = getQueryTemplates(business.languageCode || "es")

  // 1. Ejecutamos las 6 búsquedas usando los templates localizados
  const queries = await Promise.all(
    templates.map(async (template) => {
      const queryText = template.template(business.category, business.location)
      
      return runSerpQuery({
        business,
        queryType: template.type,
        queryText,
        apiKey,
      })
    })
  )

  // 2. Datos de GBP (Oficial vs Scraping)
  const hasPlacesKey = !!process.env.GOOGLE_PLACES_API_KEY
  let gbpData = null

  if (hasPlacesKey) {
    gbpData = await fetchGBPData(business)
  }

  const isFreeMode = !gbpData

  if (isFreeMode) {
    gbpData = extractGBPDataFromSerp(queries)
  }

  // 3. Análisis y Scores
  const competitors = await analyzeCompetitors(queries, business)
  const baseScores = calculateScores(queries)
  const scores = {
    ...baseScores,
    gbpCompletenessScore: gbpData?.completenessScore || 0,
    isFreeMode
  }

  const internalReport = generateInternalReport(queries, business.name)
  const recommendations = generateRecommendations(baseScores, queries, internalReport)
  const smartRecommendations = generateSmartRecommendations(gbpData, competitors, queries)

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

  await setCache(cacheKey, report)
  return report
}

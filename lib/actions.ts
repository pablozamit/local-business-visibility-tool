"use server"

import { runSerpQuery, getQueryTemplates } from "./serpapi" // Importamos la nueva función
import { calculateScores, generateInternalReport, generateRecommendations } from "./report"
import { fetchGBPData } from "./gbp"
import { analyzeCompetitors } from "./competitors"
import { generateSmartRecommendations } from "./recommendations"
import { getCache, setCache, generateCacheKey } from "./cache"
import type { BusinessInput, AnalysisReport } from "./types"
import { logger } from "./logger"

export async function generateReport(business: BusinessInput): Promise<AnalysisReport> {
  // === MODO ÚNICO COMPLETO - SIN MODO GRATUITO ===

  // 1. Validación obligatoria de API Keys
  const serpApiKey = process.env.SERPAPI_KEY
  const placesApiKey = process.env.GOOGLE_PLACES_API_KEY

  if (!serpApiKey || !placesApiKey) {
    const missing = []
    if (!serpApiKey) missing.push("SERPAPI_KEY")
    if (!placesApiKey) missing.push("GOOGLE_PLACES_API_KEY")

    throw new Error(
      `CONFIGURACIÓN REQUERIDA: ${missing.join(" y ")} ${missing.length > 1 ? "son obligatorias" : "es obligatoria"}. ` +
      "La herramienta funciona exclusivamente en modo completo con datos oficiales de Google."
    )
  }

  const cacheKey = generateCacheKey(business.name, business.location, business.category)
  const cachedReport = await getCache<AnalysisReport>(cacheKey)
  if (cachedReport) {
    logger.info({ business: business.name }, 'Cargando reporte desde caché')
    return cachedReport
  }

  logger.info({ business: business.name, location: business.location }, 'Iniciando análisis completo')

  // OBTENEMOS LOS TEMPLATES SEGÚN EL IDIOMA SELECCIONADO
  const templates = getQueryTemplates(business.languageCode || "es")

  // 1. Ejecutamos las 6 búsquedas usando los templates localizados
  let queries = []
  try {
    queries = await Promise.all(
      templates.map(async (template) => {
        const queryText = template.template(business.category, business.location)
        logger.debug({ query: queryText, type: template.type }, 'Ejecutando búsqueda SerpAPI')

        return runSerpQuery({
          business,
          queryType: template.type,
          queryText,
          apiKey: serpApiKey,
        })
      })
    )
    logger.info('Búsquedas SerpAPI completadas')
  } catch (error: any) {
    logger.error({ err: error.message }, 'Error en búsquedas SerpAPI')
    throw new Error(`Error en la recopilación de datos de búsqueda: ${error.message}`)
  }

  // 2. Obtener datos oficiales de GBP (siempre)
  let gbpData = null
  try {
    gbpData = await fetchGBPData(business)
    logger.info('GBP Data obtenido correctamente vía Google Places API', {
      completeness: gbpData?.completenessScore
    })
  } catch (error: any) {
    logger.error({ err: error.message }, 'Error obteniendo GBP Data')
    throw new Error(`No se pudo obtener datos del perfil de Google Business: ${error.message}`)
  }

  // 3. Análisis y Scores
  const competitors = await analyzeCompetitors(queries, business)
  const baseScores = calculateScores(queries)

  const scores = {
    ...baseScores,
    gbpCompletenessScore: gbpData?.completenessScore || 0,
    dataQuality: 'official' as const,
    hasActiveGBP: !!gbpData?.placeId,
    visibilityStatus: (baseScores.mapPackScore > 40 ? 'visible' : baseScores.mapPackScore > 0 ? 'low' : 'invisible') as 'visible' | 'low' | 'invisible'
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
    metadata: {
      version: "v3-complete",
      mode: "full-official",
      generatedWith: "Google Places API + SerpAPI"
    }
  }

  await setCache(cacheKey, report)
  logger.info({ business: business.name }, 'Análisis completado y guardado en caché')
  return report
}

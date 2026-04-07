"use server"

import { runSerpQuery } from "./serpapi"
import { calculateScores, generateRecommendations, generateInternalReport, QUERY_TEMPLATES } from "./report"
import type { BusinessInput, AnalysisReport } from "./types"

export async function generateReport(business: BusinessInput): Promise<AnalysisReport> {
  // ORA LA CHIAVE VIENE LETTA DAL FILE .ENV (PRO!)
  const apiKey = process.env.SERPAPI_KEY

  if (!apiKey) {
    throw new Error("ERRORE: La chiave SERPAPI_KEY non è configurata nel file .env")
  }

  console.log(`🚀 Avvio analisi reale per: ${business.name} a ${business.location}...`)

  // Eseguiamo le 6 ricerche reali su Google via SerpApi usando i tuoi template originali
  const queries = await Promise.all(
    QUERY_TEMPLATES.map(async (template) => {
      const queryText = template.template(business.category, business.location)
      console.log(`🔎 Ricerca Google: "${queryText}"`)

      return runSerpQuery({
        business,
        queryType: template.type,
        queryText,
        apiKey, // Qui passa la chiave sicura
      })
    })
  )

  const scores = calculateScores(queries)
  const internalReport = generateInternalReport(queries, business.name)
  const recommendations = generateRecommendations(scores, queries, internalReport)

  console.log(`✅ Analisi completata per ${business.name}`)

  return {
    business,
    timestamp: new Date().toISOString(),
    queries,
    scores,
    internalReport,
    recommendations,
  }
}

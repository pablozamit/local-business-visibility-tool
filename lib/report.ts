import type { QueryResult, Recommendation, InternalReport, InternalInsight } from "./types"

export const QUERY_TEMPLATES = [
  { type: "directa", template: (cat: string, loc: string) => `${cat} ${loc}` },
  { type: "proximidad", template: (cat: string, loc: string) => `${cat} vicino a me a ${loc}` },
  { type: "precios", template: (cat: string, loc: string) => `prezzi ${cat} ${loc}` },
  { type: "opiniones", template: (cat: string, loc: string) => `recensioni ${cat} ${loc}` },
  { type: "horario", template: (cat: string, loc: string) => `orari ${cat} ${loc}` },
  { type: "mejor", template: (cat: string, loc: string) => `miglior ${cat} a ${loc}` },
]

export function calculateScores(queries: QueryResult[]) {
  // 1. Calcolo punteggio PRIMA (Map Pack + Organico)
  let totalBeforePoints = 0

  let mapPackPoints = 0
  let mapPackPossible = 0

  for (const q of queries) {
    let queryPoints = 0

    if (q.mapPack.present) {
      mapPackPossible += 100
      if (q.mapPack.position !== null) {
        const mpScore = q.mapPack.position === 1 ? 100 : q.mapPack.position === 2 ? 80 : 60
        queryPoints += mpScore
        mapPackPoints += mpScore
      }
    } else {
      mapPackPossible += 50
    }

    let organicScore = 0
    if (q.organicPosition !== null && q.organicPosition > 0) {
      organicScore = Math.max(0, 100 - (q.organicPosition - 1) * 10)
    }

    if (queryPoints > 0 && organicScore > 0) {
      queryPoints = Math.max(queryPoints, organicScore) + 10
    } else {
      queryPoints = Math.max(queryPoints, organicScore)
    }

    totalBeforePoints += Math.min(100, queryPoints)
  }

  const beforeScore = Math.round(totalBeforePoints / queries.length)
  const mapPackScore = mapPackPossible > 0 ? Math.round((mapPackPoints / mapPackPossible) * 100) : 0

  // 2. Calcolo punteggio DOPO (Impatto delle AI Overviews)
  let totalAfterPoints = 0
  let aiPoints = 0
  let aiPossible = 0

  for (const q of queries) {
    let currentQueryPoints = Math.min(100,
                                      Math.max(
                                        q.mapPack.position ? (100 - (q.mapPack.position - 1) * 20) : 0,
                                               q.organicPosition ? Math.max(0, 100 - (q.organicPosition - 1) * 10) : 0
                                      )
    )

    if (q.aiOverview.present) {
      aiPossible += 100
      if (q.aiOverview.mentioned) {
        const aScore = q.aiOverview.mentionType === "direct" ? 100 : 70
        aiPoints += aScore
        currentQueryPoints = Math.min(100, currentQueryPoints + 20)
      } else {
        const penaltyMultiplier = q.mapPack.position !== null ? 0.6 : 0.4
        currentQueryPoints = currentQueryPoints * penaltyMultiplier
      }
    }

    totalAfterPoints += currentQueryPoints
  }

  const aiOverviewScore = aiPossible > 0 ? Math.round((aiPoints / aiPossible) * 100) : 0
  const afterScore = Math.round(totalAfterPoints / queries.length)

  const visibilityLoss = beforeScore > afterScore
  ? Math.round(((beforeScore - afterScore) / beforeScore) * 100)
  : 0

  return { mapPackScore, aiOverviewScore, beforeScore, afterScore, visibilityLoss }
}

export function generateInternalReport(queries: QueryResult[], businessName: string): InternalReport {
  const competitorCounts: Record<string, number> = {}
  const lostVisibilityQueries: string[] = []
  const untappedAiQueries: string[] = []
  const organicButNoLocal: string[] = []
  const insights: InternalInsight[] = []

  let hasMapPackPresence = false
  let organicRanks = 0

  for (const q of queries) {
    if (q.mapPack.present && q.mapPack.competitors) {
      for (const comp of q.mapPack.competitors) {
        competitorCounts[comp] = (competitorCounts[comp] || 0) + 1
      }
    }

    if (q.mapPack.position !== null) hasMapPackPresence = true
      if (q.organicPosition !== null && q.organicPosition <= 10) organicRanks++

        if (q.organicPosition !== null && q.organicPosition <= 10 && q.mapPack.present && q.mapPack.position === null) {
          organicButNoLocal.push(q.query)
        }

        if (q.aiOverview.present && !q.aiOverview.mentioned) {
          untappedAiQueries.push(q.query)

          if (q.mapPack.position !== null || (q.organicPosition !== null && q.organicPosition <= 5)) {
            lostVisibilityQueries.push(q.query)
          }
        }
  }

  const topCompetitors = Object.entries(competitorCounts)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count)
  .slice(0, 3)

  if (!hasMapPackPresence) {
    insights.push({
      type: "critical",
      metric: "Emorragia di Clienti Locali",
      message: "I tuoi concorrenti stanno intercettando tutti i clienti che cercano urgenze o servizi in zona perché la tua attività è invisibile sulle mappe."
    })
  }

  if (organicButNoLocal.length > 0) {
    insights.push({
      type: "opportunity",
      metric: "Traffico Web Sprecato",
      message: `Il sito appare nei testi, ma il cliente sceglie la concorrenza cliccando direttamente sulle mappe (Local Pack).`
    })
  }

  if (untappedAiQueries.length > 0) {
    insights.push({
      type: "warning",
      metric: "Fuga di Autorità verso l'AI",
      message: `Google sta consigliando altre attività tramite la sua IA in ${untappedAiQueries.length} ricerche chiave del tuo settore.`
    })
  }

  if (topCompetitors.length > 0) {
    insights.push({
      type: "warning",
      metric: "Concorrenza Aggressiva",
      message: `"${topCompetitors[0].name}" è la barriera principale che ti impedisce di dominare il mercato locale a ${queries[0].query.split(' ').pop()}.`
    })
  }

  return {
    topCompetitors,
    lostVisibilityQueries,
    untappedAiQueries,
    organicButNoLocal,
    insights
  }
}

export function generateRecommendations(
  scores: ReturnType<typeof calculateScores>,
  queries: QueryResult[],
  internalReport: InternalReport
): Recommendation[] {
  const recs: Recommendation[] = []

  if (scores.mapPackScore < 50) {
    recs.push({
      title: "Dominio del Top 3 Google Maps",
      description: "Ristrutturazione completa della scheda Google Business Profile per forzare l'algoritmo a inserirti nel 'pacchetto locale' sopra i concorrenti storici.",
      impact: "high",
      category: "Local SEO",
    })
  }

  if (internalReport.untappedAiQueries.length > 0) {
    recs.push({
      title: "Integrazione Urgente AI Overviews",
      description: "Implementazione di dati strutturati avanzati sul tuo sito per fare in modo che l'intelligenza artificiale di Google ti scelga come fonte ufficiale.",
      impact: "high",
      category: "AI Optimization",
    })
  }

  if (internalReport.organicButNoLocal.length > 0) {
    recs.push({
      title: "Sincronizzazione Entità Digitale",
      description: "Allineamento tecnico tra autorità web e sede fisica per trasferire tutta la forza del tuo sito web direttamente sulla visibilità locale.",
      impact: "high",
      category: "Technical SEO",
    })
  }

  const hasLowReviews = queries.some(q => q.queryType === "opiniones" && !q.mapPack.position)
  if (hasLowReviews || scores.mapPackScore < 80) {
    recs.push({
      title: "Potenziamento Reputazione e Trust",
      description: "Attivazione di un sistema di raccolta feedback per inviare segnali di fiducia costanti a Google e stabilizzare il posizionamento.",
      impact: "medium",
      category: "Reputation",
    })
  }

  recs.push({
    title: "Blindaggio Mercato Locale",
    description: "Creazione di un ecosistema di citazioni strutturate per proteggere la tua posizione dai tentativi di sorpasso della concorrenza.",
    impact: "medium",
    category: "Brand Defense",
  })

  return recs
}

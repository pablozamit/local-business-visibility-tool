export interface BusinessInput {
  name: string
  location: string
  category: string
}

export interface QueryResult {
  query: string
  queryType: string
  mapPack: {
    present: boolean
    position: number | null
    competitors?: string[]
  }
  aiOverview: {
    present: boolean
    mentioned: boolean
    mentionType: "direct" | "citation" | null
  }
  organicPosition: number | null
}

export interface InternalInsight {
  type: "critical" | "warning" | "opportunity"
  metric: string
  message: string
}

export interface InternalReport {
  topCompetitors: { name: string; count: number }[]
  lostVisibilityQueries: string[]
  untappedAiQueries: string[]
  organicButNoLocal: string[]
  insights: InternalInsight[]
}

export interface Recommendation {
  title: string
  description: string
  impact: "high" | "medium" | "low"
  category: string
}

export interface AnalysisReport {
  business: BusinessInput
  timestamp: string
  queries: QueryResult[]
  scores: {
    mapPackScore: number
    aiOverviewScore: number
    beforeScore: number
    afterScore: number
    visibilityLoss: number
  }
  internalReport: InternalReport
  recommendations: Recommendation[]
}

// Alias per compatibilità con alcuni componenti
export type VisibilityReport = AnalysisReport

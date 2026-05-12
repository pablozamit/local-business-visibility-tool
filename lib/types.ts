export interface BusinessInput {
  name: string
  location: string
  category: string
  gbpUrl?: string
  placeId?: string
  countryCode?: string
  languageCode?: string
}

export interface QueryResult {
  query: string
  queryType: string
  mapPack: {
    present: boolean
    position: number | null
    competitors?: {
      name: string
      rating?: number
      reviews?: number
      placeId?: string
    }[]
  }
  aiOverview: {
    present: boolean
    mentioned: boolean
    mentionType: "direct" | "citation" | null
    text?: string // New: to store the AI Overview text
  }
  organicPosition: number | null
  extractedBusinessData?: any
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

export interface Review {
  authorName: string;
  rating: number;
  text: string;
  time: string;                 // relativo o timestamp
  sentiment?: 'positive' | 'neutral' | 'negative';
}

export interface MissingItem {
  label: string;
  impact: 'high' | 'medium' | 'low';
}

export interface GBPData {
  placeId: string;
  businessName: string;
  rating: number;
  userRatingsTotal: number;
  photosCount: number;
  postsCount: number;           // si disponible
  attributesCompleted: number;
  attributesTotal: number;
  lastUpdated: string;
  reviews: Review[];
  completenessScore: number;    // 0-100 calculado
  missingItems: MissingItem[];
  website?: string;
  phoneNumber?: string;
  address?: string;
  hours?: string[];
  isOpenNow?: boolean;
}

export interface Competitor {
  name: string;
  placeId?: string;
  visibilityScore: number;
  mapPackWins: number;
  reviewsCount: number;
  rating: number;
  photosCount: number;
  aiMentions: number;
}

export interface SmartRecommendation {
  id: string;
  title: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: number;               // 1-100 estimado
  category: string;
  quickWin: boolean;
  estimatedPointsGain: number;
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
    gbpCompletenessScore?: number
    dataQuality: 'official'
    hasActiveGBP: boolean
    visibilityStatus: 'visible' | 'low' | 'invisible'
  }
  internalReport: InternalReport
  recommendations: Recommendation[] // Mantener por compatibilidad inicial
  smartRecommendations?: SmartRecommendation[]
  gbpData?: GBPData
  competitors?: Competitor[]
  metadata: {
    version: string
    mode: string
    generatedWith: string
  }
}

// Alias per compatibilità con alcuni componenti
export type VisibilityReport = AnalysisReport

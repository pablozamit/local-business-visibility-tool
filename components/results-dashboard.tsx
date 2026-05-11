"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Brain, TrendingDown, LayoutDashboard, Search, Star, MessageSquare, Zap } from "lucide-react"
import type { AnalysisReport } from "@/lib/types"
import { GBPCompletenessCard } from "./gbp-completeness-card"
import { CompetitorTable } from "./competitor-table"
import { ReviewsAnalysis } from "./reviews-analysis"
import { ActionPlan } from "./action-plan"
import { QueryResultsTable } from "./query-results-table"

export function ResultsDashboard({ report }: { report: AnalysisReport }) {
  const { scores, business, gbpData, competitors, smartRecommendations, queries } = report

  return (
    <div className="space-y-8">
      {/* Resumen Ejecutivo */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-blue-400" />
              Impacto de la Inteligencia Artificial
            </CardTitle>
            <CardDescription className="text-slate-300">
              Análisis de cómo los nuevos resultados de Google AI (SGE) afectan la visibilidad de {business.name} en {business.location}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1 uppercase tracking-tighter">Visibilidad Estándar</div>
                <div className="text-4xl font-bold">{scores.beforeScore}/100</div>
              </div>
              <div className="flex flex-col items-center">
                <TrendingDown className="h-8 w-8 text-red-400 mb-2" />
                <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/50">
                  -{scores.visibilityLoss}% Pérdida
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-sm text-slate-400 mb-1 uppercase tracking-tighter">Visibilidad con AI</div>
                <div className={`text-5xl font-bold ${scores.afterScore > 50 ? "text-green-400" : "text-yellow-400"}`}>
                  {scores.afterScore}/100
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Métricas Clave</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-medium text-sm text-slate-700 uppercase">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  Presencia en Mapas
                </div>
                <span className="font-bold text-slate-900">{scores.mapPackScore}/100</span>
              </div>
              <Progress value={scores.mapPackScore} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-medium text-sm text-slate-700 uppercase">
                  <Brain className="h-4 w-4 text-purple-500" />
                  Autoridad AI
                </div>
                <span className="font-bold text-slate-900">{scores.aiOverviewScore}/100</span>
              </div>
              <Progress value={scores.aiOverviewScore} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 font-medium text-sm text-slate-700 uppercase">
                  <Star className="h-4 w-4 text-orange-500" />
                  Perfil GBP
                </div>
                <span className="font-bold text-slate-900">{scores.gbpCompletenessScore}/100</span>
              </div>
              <Progress value={scores.gbpCompletenessScore} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 1 y 2. Map Pack Position & AI Overviews */}
      <div className="grid gap-6 md:grid-cols-1">
        <Card className="border-slate-200">
           <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Search className="h-5 w-5 text-slate-500" />
                Posicionamiento en Búsquedas Reales
              </CardTitle>
           </CardHeader>
           <CardContent>
              <QueryResultsTable queries={queries} />
           </CardContent>
        </Card>
      </div>

      {/* 3. Google Business Profile Completeness */}
      {gbpData && (
        <div id="gbp-completeness">
          <GBPCompletenessCard data={gbpData} />
        </div>
      )}

      {/* 4. Competitor Benchmark */}
      {competitors && (
        <div id="competitor-benchmark">
          <CompetitorTable competitors={competitors} businessName={business.name} />
        </div>
      )}

      {/* 5. Reviews Analysis */}
      {gbpData && (
        <div id="reviews-analysis">
          <ReviewsAnalysis gbpData={gbpData} />
        </div>
      )}

      {/* 6. Plan de Acción Priorizado */}
      {smartRecommendations && (
        <div id="action-plan">
          <ActionPlan recommendations={smartRecommendations} />
        </div>
      )}
    </div>
  )
}

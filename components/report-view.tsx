"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QueryResultsTable } from "./query-results-table"
import { VisibilityChart } from "./visibility-chart"
import { BeforeAfterChart } from "./before-after-chart"
import { ActionPlan } from "./action-plan"
import { GBPCompletenessCard } from "./gbp-completeness-card"
import { CompetitorTable } from "./competitor-table"
import { ReviewsAnalysis } from "./reviews-analysis"
import { BarChart3, TableProperties, Lightbulb, UserCheck, Users, MessageSquare } from "lucide-react"
import type { VisibilityReport } from "@/lib/types"

export function ReportView({ report }: { report: VisibilityReport }) {
  const { scores, queries, smartRecommendations, gbpData, competitors, business } = report

  return (
    <div className="flex flex-col gap-6">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1 h-auto">
          <TabsTrigger value="overview" className="text-xs md:text-sm py-2">Vista General</TabsTrigger>
          <TabsTrigger value="gbp" className="text-xs md:text-sm py-2">Perfil Google</TabsTrigger>
          <TabsTrigger value="competitors" className="text-xs md:text-sm py-2">Competencia</TabsTrigger>
          <TabsTrigger value="actions" className="text-xs md:text-sm py-2">Plan de Acción</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-600" />
                  Impacto de la IA en Visibilidad
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BeforeAfterChart beforeScore={scores.beforeScore} afterScore={scores.afterScore} visibilityLoss={scores.visibilityLoss} />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <TableProperties className="h-4 w-4 text-blue-600" />
                  Búsquedas en Tiempo Real
                </CardTitle>
              </CardHeader>
              <CardContent>
                <QueryResultsTable queries={queries} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="gbp" className="space-y-4 mt-4">
          {gbpData && (
            <>
              <GBPCompletenessCard data={gbpData} />
              <ReviewsAnalysis gbpData={gbpData} />
            </>
          )}
        </TabsContent>

        <TabsContent value="competitors" className="mt-4">
          {competitors && (
            <CompetitorTable competitors={competitors} businessName={business.name} />
          )}
        </TabsContent>

        <TabsContent value="actions" className="mt-4">
          {smartRecommendations && (
            <ActionPlan recommendations={smartRecommendations} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

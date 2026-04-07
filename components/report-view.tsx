"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { QueryResultsTable } from "./query-results-table"
import { VisibilityChart } from "./visibility-chart"
import { BeforeAfterChart } from "./before-after-chart"
import { RecommendationsList } from "./recommendations-list"
import { BarChart3, TableProperties, Lightbulb } from "lucide-react"
import type { VisibilityReport } from "@/lib/types"

export function ReportView({ report }: { report: VisibilityReport }) {
  const { scores, queries, recommendations } = report

  return (
    <div className="flex flex-col gap-6">
    <Tabs defaultValue="overview" className="w-full">
    <TabsList className="grid w-full grid-cols-3 bg-slate-100 p-1">
    <TabsTrigger value="overview">Panoramica</TabsTrigger>
    <TabsTrigger value="details">Dettaglio Query</TabsTrigger>
    <TabsTrigger value="recommendations">Azioni Consigliate</TabsTrigger>
    </TabsList>

    <TabsContent value="overview" className="space-y-4 mt-4">
    <div className="grid gap-4 md:grid-cols-2">
    <Card>
    <CardHeader className="pb-2">
    <CardTitle className="text-sm font-bold flex items-center gap-2">
    <BarChart3 className="h-4 w-4 text-blue-600" />
    Confronto Visibilità
    </CardTitle>
    </CardHeader>
    <CardContent>
    <BeforeAfterChart beforeScore={scores.beforeScore} afterScore={scores.afterScore} visibilityLoss={scores.visibilityLoss} />
    </CardContent>
    </Card>
    <Card>
    <CardHeader className="pb-2">
    <CardTitle className="text-sm font-bold">Distribuzione per Canale</CardTitle>
    </CardHeader>
    <CardContent>
    <VisibilityChart queries={queries} />
    </CardContent>
    </Card>
    </div>
    </TabsContent>

    <TabsContent value="details" className="mt-4">
    <Card>
    <CardHeader className="pb-2 text-left">
    <CardTitle className="text-base font-bold flex items-center gap-2">
    <TableProperties className="h-4 w-4 text-blue-600" />
    Analisi per Parola Chiave
    </CardTitle>
    <CardDescription>Risultati estratti in tempo reale per la zona di Milano.</CardDescription>
    </CardHeader>
    <CardContent>
    <QueryResultsTable queries={queries} />
    </CardContent>
    </Card>
    </TabsContent>

    <TabsContent value="recommendations" className="mt-4">
    <Card>
    <CardHeader className="pb-2 text-left">
    <CardTitle className="text-base font-bold flex items-center gap-2 text-left">
    <Lightbulb className="h-4 w-4 text-amber-500" />
    Piano d'Azione Strategico
    </CardTitle>
    </CardHeader>
    <CardContent>
    <RecommendationsList recommendations={recommendations} />
    </CardContent>
    </Card>
    </TabsContent>
    </Tabs>
    </div>
  )
}

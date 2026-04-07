"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MapPin, Brain, TrendingDown } from "lucide-react"
import type { AnalysisReport } from "@/lib/types"

export function ResultsDashboard({ report }: { report: AnalysisReport }) {
  const { scores } = report

  return (
    <div className="space-y-8">
    <div className="grid gap-4 md:grid-cols-3">
    <Card className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-xl">
    <CardHeader>
    <CardTitle className="text-2xl font-bold">Impatto dell'Intelligenza Artificiale</CardTitle>
    <CardDescription className="text-slate-300">
    Analisi di come i nuovi risultati Google AI stanno influenzando la tua visibilità a Milano.
    </CardDescription>
    </CardHeader>
    <CardContent>
    <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-4">
    <div className="text-center">
    <div className="text-sm text-slate-400 mb-1 uppercase tracking-tighter">Visibilità Standard</div>
    <div className="text-4xl font-bold">{scores.beforeScore}/100</div>
    </div>
    <div className="flex flex-col items-center">
    <TrendingDown className="h-8 w-8 text-red-400 mb-2" />
    <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/50">
    -{scores.visibilityLoss}% Perdita
    </Badge>
    </div>
    <div className="text-center">
    <div className="text-sm text-slate-400 mb-1 uppercase tracking-tighter">Visibilità con AI</div>
    <div className={`text-5xl font-bold ${scores.afterScore > 50 ? "text-green-400" : "text-yellow-400"}`}>
    {scores.afterScore}/100
    </div>
    </div>
    </div>
    </CardContent>
    </Card>

    <Card className="border-border/50">
    <CardHeader>
    <CardTitle>Metriche Chiave</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
    <div>
    <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2 font-medium text-sm text-slate-700 uppercase">
    <MapPin className="h-4 w-4 text-blue-500" />
    Presenza Mappe
    </div>
    <span className="font-bold text-slate-900">{scores.mapPackScore}/100</span>
    </div>
    <Progress value={scores.mapPackScore} className="h-2" />
    </div>
    <div>
    <div className="flex items-center justify-between mb-2">
    <div className="flex items-center gap-2 font-medium text-sm text-slate-700 uppercase">
    <Brain className="h-4 w-4 text-purple-500" />
    Autorità AI
    </div>
    <span className="font-bold text-slate-900">{scores.aiOverviewScore}/100</span>
    </div>
    <Progress value={scores.aiOverviewScore} className="h-2" />
    </div>
    </CardContent>
    </Card>
    </div>
    </div>
  )
}

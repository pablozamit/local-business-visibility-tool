"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SmartRecommendation } from "@/lib/types"
import { CheckCircle2, Zap, ArrowRight, TrendingUp } from "lucide-react"

interface ActionPlanProps {
  recommendations: SmartRecommendation[]
}

export function ActionPlan({ recommendations }: ActionPlanProps) {
  return (
    <Card className="border-slate-900 border-2 shadow-lg">
      <CardHeader className="bg-slate-900 text-white pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-400 fill-yellow-400" />
          Plan de Acción Priorizado
        </CardTitle>
        <p className="text-slate-400 text-xs font-medium">
          Acciones concretas ordenadas por Impacto × Facilidad de ejecución
        </p>
      </CardHeader>
      <CardContent className="pt-6 space-y-4">
        {recommendations.map((rec, i) => (
          <div
            key={rec.id}
            className={`relative p-5 rounded-xl border-2 transition-all ${
              i === 0 ? 'border-blue-600 bg-blue-50/50' : 'border-slate-100 bg-white hover:border-slate-200'
            }`}
          >
            {i === 0 && (
              <Badge className="absolute -top-3 left-4 bg-blue-600 text-white px-3">
                ACCION #1 - PRIORIDAD MÁXIMA
              </Badge>
            )}

            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="text-base font-black text-slate-900">{rec.title}</h4>
                  {rec.quickWin && (
                    <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 text-[10px] font-bold">
                      QUICK WIN
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                  {rec.description}
                </p>
                <div className="flex flex-wrap gap-3">
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md text-[11px] font-bold text-slate-600">
                    Esfuerzo: <span className={rec.effort === 'low' ? 'text-green-600' : rec.effort === 'medium' ? 'text-orange-600' : 'text-red-600'}>
                      {rec.effort === 'low' ? 'BAJO' : rec.effort === 'medium' ? 'MEDIO' : 'ALTO'}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-md text-[11px] font-bold text-slate-600">
                    Categoría: <span className="text-blue-600">{rec.category}</span>
                  </div>
                </div>
              </div>

              <div className="md:w-48 flex flex-col items-center justify-center border-l border-slate-100 pl-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-blue-700 font-black text-xl">
                    <TrendingUp className="h-5 w-5" />
                    +{rec.estimatedPointsGain}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                    Puntos de Visibilidad
                  </p>
                </div>
                <button className="mt-4 w-full py-2 bg-slate-900 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 hover:bg-blue-600 transition-colors">
                  Cómo hacerlo <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

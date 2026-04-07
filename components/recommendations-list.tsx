"use client"

import { Badge } from "@/components/ui/badge"
import type { Recommendation } from "@/lib/types"
import { cn } from "@/lib/utils"

const IMPACT_CONFIG = {
  high: { label: "Alto", className: "bg-red-500/10 text-red-500 border-red-500/20" },
  medium: { label: "Medio", className: "bg-orange-500/10 text-orange-500 border-orange-500/20" },
  low: { label: "Basso", className: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
}

export function RecommendationsList({ recommendations }: { recommendations: Recommendation[] }) {
  return (
    <div className="space-y-3">
    {recommendations.map((rec, i) => (
      <div key={i} className="p-4 rounded-xl border border-border bg-card">
      <div className="flex items-center gap-2 mb-2">
      <h4 className="font-bold text-sm">{rec.title}</h4>
      <Badge variant="outline" className={cn("text-[10px]", IMPACT_CONFIG[rec.impact].className)}>
      Impatto {IMPACT_CONFIG[rec.impact].label}
      </Badge>
      </div>
      <p className="text-xs text-muted-foreground">{rec.description}</p>
      </div>
    ))}
    </div>
  )
}

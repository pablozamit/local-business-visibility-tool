"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import type { QueryResult } from "@/lib/types"

interface VisibilityChartProps {
  queries: QueryResult[]
}

const QUERY_SHORT: Record<string, string> = {
  directa: "Diretta",
  proximidad: "Vicinanza",
  precios: "Prezzi",
  opiniones: "Recensioni",
  horario: "Orari",
  mejor: "Migliore",
}

export function VisibilityChart({ queries }: VisibilityChartProps) {
  const data = queries.map((q) => ({
    name: QUERY_SHORT[q.queryType] || q.queryType,
    "Map Pack": q.mapPack.present ? (q.mapPack.position === 1 ? 100 : 70) : 0,
                                   "AI Overview": q.aiOverview.present ? (q.aiOverview.mentioned ? 100 : 10) : 0,
  }))

  return (
    <ResponsiveContainer width="100%" height={320}>
    <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" vertical={false} />
    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
    <Tooltip />
    <Legend />
    <Bar dataKey="Map Pack" fill="oklch(0.65 0.19 260)" radius={[4, 4, 0, 0]} />
    <Bar dataKey="AI Overview" fill="oklch(0.6 0.22 30)" radius={[4, 4, 0, 0]} />
    </BarChart>
    </ResponsiveContainer>
  )
}

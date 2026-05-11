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
  brand: "Marca",
  intent: "Intención",
  near_me: "Cerca de mí",
  service_specific: "Servicios",
  expert: "Expertos",
  comparison: "Opiniones",
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
        <Bar dataKey="Map Pack" fill="#2563eb" radius={[4, 4, 0, 0]} />
        <Bar dataKey="AI Overview" fill="#9333ea" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

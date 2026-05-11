"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts"

interface BeforeAfterChartProps {
  beforeScore: number
  afterScore: number
  visibilityLoss: number
}

export function BeforeAfterChart({ beforeScore, afterScore }: BeforeAfterChartProps) {
  const data = [
    { name: "Sin AI (Google Maps)", score: beforeScore },
    { name: "Con AI (Google AI)", score: afterScore },
  ]

  const colors = ["#2563eb", "#9333ea"] // Azul para Maps, Púrpura para AI

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="name"
            width={150}
            tick={{ fill: "#64748b", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip />
          <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
            <LabelList dataKey="score" position="right" style={{ fill: "#1e293b", fontWeight: 700 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

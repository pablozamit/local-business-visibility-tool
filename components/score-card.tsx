"use client"

import { cn } from "@/lib/utils"

interface ScoreCardProps {
  label: string
  score: number
  subtitle?: string
  colorClass?: string
}

export function ScoreCard({ label, score, subtitle, colorClass }: ScoreCardProps) {
  const circumference = 2 * Math.PI * 40
  const offset = circumference - (score / 100) * circumference

  function getScoreColor(s: number) {
    if (colorClass) return colorClass
    if (s >= 70) return "text-success"
    if (s >= 40) return "text-warning"
    return "text-destructive"
  }

  function getStrokeColor(s: number) {
    if (colorClass === "text-primary") return "stroke-primary"
    if (s >= 70) return "stroke-success"
    if (s >= 40) return "stroke-warning"
    return "stroke-destructive"
  }

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl bg-secondary/50 p-5 border border-border/50">
      <div className="relative h-24 w-24">
        <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            className="text-border/40"
          />
          <circle
            cx="48"
            cy="48"
            r="40"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={cn("transition-all duration-1000 ease-out", getStrokeColor(score))}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn("text-2xl font-bold font-mono", getScoreColor(score))}>
            {score}
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

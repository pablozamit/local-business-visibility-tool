"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle, Minus, Brain, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import type { QueryResult } from "@/lib/types"

function StatusIcon({ present, label, colorClass, isUserBusinessInMapPack }: { present: boolean; label: string; colorClass?: string; isUserBusinessInMapPack?: boolean }) {
  if (isUserBusinessInMapPack === false) {
     return (
        <span className="flex items-center gap-1.5 text-orange-500">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-xs font-bold">Fuera del Map Pack</span>
        </span>
      )
  }

  return present ? (
    <span className={`flex items-center gap-1.5 ${colorClass || 'text-green-500'}`}>
      <CheckCircle2 className="h-4 w-4" />
      <span className="text-xs font-bold">{label}</span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-slate-300">
      <XCircle className="h-4 w-4" />
      <span className="text-xs">No hay Map Pack</span>
    </span>
  )
}

export function QueryResultsTable({ queries }: { queries: QueryResult[] }) {
  return (
    <TooltipProvider>
      <div className="rounded-md border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="font-bold text-slate-700">Búsqueda en Google</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Tu Estado en Map Pack</TableHead>
              <TableHead className="text-center font-bold text-slate-700">AI Overview</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Orgánico</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((q, i) => (
              <TableRow key={i} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="font-medium text-slate-900">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{q.query}</span>
                    <span className="text-[10px] text-slate-400 uppercase tracking-tighter">{q.queryType}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <StatusIcon
                        present={q.mapPack.present}
                        isUserBusinessInMapPack={q.mapPack.present ? q.mapPack.position !== null : undefined}
                        label={q.mapPack.position ? `Posición #${q.mapPack.position}` : 'Presente'}
                    />
                    {q.mapPack.position && q.mapPack.position > 3 && (
                      <Badge variant="outline" className="text-[9px] h-4 bg-orange-50 text-orange-600 border-orange-100">Fuera del Top 3</Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    {q.aiOverview.present ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="cursor-help">
                            <StatusIcon
                              present={true}
                              label={q.aiOverview.mentioned ? 'Citado' : 'Presente'}
                              colorClass={q.aiOverview.mentioned ? 'text-purple-600' : 'text-slate-400'}
                            />
                            {q.aiOverview.mentioned && <Brain className="h-3 w-3 text-purple-500 animate-pulse mt-1 mx-auto" />}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs bg-slate-900 text-white border-none p-3">
                          <p className="text-xs font-bold mb-1">{q.aiOverview.mentioned ? '¡Apareces aquí!' : 'No te menciona'}</p>
                          <p className="text-[10px] italic text-slate-300">
                            {q.aiOverview.text || 'La IA de Google muestra un resumen para esta búsqueda.'}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      <StatusIcon present={false} label="No" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  {q.organicPosition ? (
                    <span className="text-sm font-bold text-slate-700">#{q.organicPosition}</span>
                  ) : (
                    <Minus className="h-4 w-4 mx-auto opacity-20" />
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}

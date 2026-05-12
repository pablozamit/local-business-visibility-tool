"use client"

import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle, Minus, Brain, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react"
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
  const [expandedRows, setExpandedRows] = React.useState<Record<number, boolean>>({})

  const toggleRow = (index: number) => {
    setExpandedRows(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  return (
    <TooltipProvider>
      <div className="rounded-md border border-slate-100 overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[40px]"></TableHead>
              <TableHead className="font-bold text-slate-700">Búsqueda en Google</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Tu Estado en Map Pack</TableHead>
              <TableHead className="text-center font-bold text-slate-700">AI Overview</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Orgánico</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queries.map((q, i) => (
              <React.Fragment key={i}>
                <TableRow
                  className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${expandedRows[i] ? 'bg-slate-50/50' : ''}`}
                  onClick={() => toggleRow(i)}
                >
                  <TableCell>
                    {q.aiOverview.present ? (
                      expandedRows[i] ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />
                    ) : null}
                  </TableCell>
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
                        <div className="flex flex-col items-center">
                          <StatusIcon
                            present={true}
                            label={q.aiOverview.mentioned ? 'Citado' : 'Presente'}
                            colorClass={q.aiOverview.mentioned ? 'text-purple-600' : 'text-slate-400'}
                          />
                          {q.aiOverview.mentioned && <Brain className="h-3 w-3 text-purple-500 animate-pulse mt-1 mx-auto" />}
                        </div>
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
                {expandedRows[i] && q.aiOverview.present && (
                  <TableRow className="bg-slate-50/30 border-t-0">
                    <TableCell colSpan={5} className="py-4 px-6">
                      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Resumen de IA de Google</span>
                          {q.aiOverview.mentioned ? (
                            <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100 border-none text-[10px]">¡Apareces aquí!</Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] text-slate-400">No citado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                          "{q.aiOverview.text || 'No hay texto disponible para este resumen.'}"
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </TooltipProvider>
  )
}

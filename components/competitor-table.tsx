"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Competitor, BusinessInput } from "@/lib/types"
import { Trophy, TrendingUp, Users, Camera, Zap } from "lucide-react"

interface CompetitorTableProps {
  competitors: Competitor[]
  businessName: string
}

export function CompetitorTable({ competitors, businessName }: CompetitorTableProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          Benchmark de Competidores
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50">
              <TableHead className="font-bold text-slate-700">Competidor</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Visibilidad</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Map Pack Wins</TableHead>
              <TableHead className="text-center font-bold text-slate-700">Reseñas / Rating</TableHead>
              <TableHead className="text-right font-bold text-slate-700">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Fila del negocio actual (simulada o real) */}
            <TableRow className="bg-blue-50/30">
              <TableCell className="font-bold text-blue-700 flex items-center gap-2">
                {businessName} (Tú)
                <Badge variant="outline" className="text-[10px] bg-blue-100 text-blue-700 border-blue-200">PROPIO</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge className="bg-blue-600">Media</Badge>
              </TableCell>
              <TableCell className="text-center font-medium">Análisis en curso</TableCell>
              <TableCell className="text-center">-</TableCell>
              <TableCell className="text-right">-</TableCell>
            </TableRow>

            {competitors.map((comp, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-slate-900">{comp.name}</TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-slate-700">{comp.visibilityScore}%</span>
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-400"
                        style={{ width: `${comp.visibilityScore}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center font-bold text-slate-700">
                  {comp.mapPackWins}/6
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <span className="text-xs font-medium text-slate-600">{comp.reviewsCount || 'N/A'}</span>
                    <span className="text-[10px] text-orange-500 font-bold">★ {comp.rating || '-'}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className="text-[10px] text-slate-500 hover:bg-slate-100 cursor-help">
                    Superar
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

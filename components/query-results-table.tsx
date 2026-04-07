"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CheckCircle2, XCircle, Minus } from "lucide-react"
import type { QueryResult } from "@/lib/types"

function StatusIcon({ present, label }: { present: boolean; label: string }) {
  return present ? (
    <span className="flex items-center gap-1.5 text-green-500">
    <CheckCircle2 className="h-4 w-4" />
    <span className="text-xs">{label}</span>
    </span>
  ) : (
    <span className="flex items-center gap-1.5 text-muted-foreground">
    <XCircle className="h-4 w-4" />
    <span className="text-xs">No</span>
    </span>
  )
}

export function QueryResultsTable({ queries }: { queries: QueryResult[] }) {
  return (
    <Table>
    <TableHeader>
    <TableRow>
    <TableHead>Ricerca</TableHead>
    <TableHead className="text-center">Nel Map Pack?</TableHead>
    <TableHead className="text-center">Posizione</TableHead>
    <TableHead className="text-center">Nell'AI?</TableHead>
    <TableHead className="text-center">Pos. Organica</TableHead>
    </TableRow>
    </TableHeader>
    <TableBody>
    {queries.map((q, i) => (
      <TableRow key={i}>
      <TableCell className="font-medium">{q.query}</TableCell>
      <TableCell className="text-center">
      <StatusIcon present={q.mapPack.present} label="Sì" />
      </TableCell>
      <TableCell className="text-center">
      {q.mapPack.position ? `#${q.mapPack.position}` : <Minus className="h-4 w-4 mx-auto opacity-20" />}
      </TableCell>
      <TableCell className="text-center">
      <StatusIcon present={q.aiOverview.present} label="Sì" />
      </TableCell>
      <TableCell className="text-center">
      {q.organicPosition ? `#${q.organicPosition}` : <Minus className="h-4 w-4 mx-auto opacity-20" />}
      </TableCell>
      </TableRow>
    ))}
    </TableBody>
    </Table>
  )
}

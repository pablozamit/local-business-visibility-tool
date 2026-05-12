"use client"

import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"
import { exportToPDF } from "@/lib/export-pdf"
import type { AnalysisReport } from "@/lib/types"
import { useState } from "react"
import { toast } from "sonner"

export function ExportPDFButton({ report }: { report: AnalysisReport }) {
  const [isGenerating, setIsGenerating] = useState(false)

  const handleExport = async () => {
    try {
      setIsGenerating(true)
      await exportToPDF(report)
      toast.success("PDF generado correctamente")
    } catch (error) {
      console.error("Error al generar PDF:", error)
      toast.error("Error al generar el PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Button
      onClick={handleExport}
      disabled={isGenerating}
      variant="outline"
      className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 font-bold gap-2"
    >
      <FileDown className="h-4 w-4 text-blue-600" />
      {isGenerating ? "Generando..." : "Exportar a PDF"}
    </Button>
  )
}

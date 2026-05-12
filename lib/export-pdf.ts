import jsPDF from "jspdf"
import "jspdf-autotable"
import type { AnalysisReport } from "./types"

export async function exportToPDF(report: AnalysisReport) {
  const doc = new jsPDF()
  const { business, scores, queries, competitors, gbpData } = report

  // Colores de marca
  const primaryColor = [15, 23, 42] // slate-900
  const accentColor = [37, 99, 235] // blue-600

  // Título y Encabezado
  doc.setFontSize(22)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("REPORTE DE VISIBILIDAD LOCAL AI", 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`Generado para: ${business.name}`, 14, 30)
  doc.text(`Ubicación: ${business.location}`, 14, 35)
  doc.text(`Fecha: ${new Date(report.timestamp).toLocaleDateString()}`, 14, 40)

  // Línea divisoria
  doc.setDrawColor(200)
  doc.line(14, 45, 196, 45)

  // Resumen Ejecutivo
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("Resumen Ejecutivo", 14, 55)

  doc.setFontSize(11)
  doc.setTextColor(50)
  const intro = `Este reporte analiza la presencia de ${business.name} en las búsquedas de Google y el impacto de los nuevos resúmenes de Inteligencia Artificial (SGE).`
  doc.text(doc.splitTextToSize(intro, 180), 14, 62)

  // Puntuaciones
  const scoreData = [
    ["Métrica", "Puntuación"],
    ["Visibilidad Estándar", `${scores.beforeScore}/100`],
    ["Visibilidad con AI", `${scores.afterScore}/100`],
    ["Impacto de Pérdida", `${scores.visibilityLoss}%`],
    ["Presencia en Mapas", `${scores.mapPackScore}/100`],
    ["Autoridad AI", `${scores.aiOverviewScore}/100`],
    ["Perfil de Negocio (GBP)", `${scores.gbpCompletenessScore}/100`]
  ]

  ;(doc as any).autoTable({
    startY: 70,
    head: [scoreData[0]],
    body: scoreData.slice(1),
    theme: "striped",
    headStyles: { fillColor: accentColor },
    margin: { top: 10 }
  })

  // Análisis de Búsquedas
  let finalY = (doc as any).lastAutoTable.finalY + 15
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text("Análisis de Búsquedas Realizadas", 14, finalY)

  const queryData = queries.map(q => [
    q.query,
    q.mapPack.position ? `Posición #${q.mapPack.position}` : (q.mapPack.present ? "Presente" : "No"),
    q.aiOverview.mentioned ? "Citado" : (q.aiOverview.present ? "Presente" : "No"),
    q.organicPosition ? `#${q.organicPosition}` : "-"
  ])

  ;(doc as any).autoTable({
    startY: finalY + 5,
    head: [["Búsqueda", "Map Pack", "AI Overview", "Orgánico"]],
    body: queryData,
    theme: "grid",
    headStyles: { fillColor: primaryColor }
  })

  // Competidores Principales
  finalY = (doc as any).lastAutoTable.finalY + 15
  if (competitors && competitors.length > 0) {
    if (finalY > 240) { doc.addPage(); finalY = 20; }
    doc.setFontSize(16)
    doc.text("Benchmark de Competidores", 14, finalY)

    const compData = competitors.map(c => [
      c.name,
      `${c.visibilityScore}%`,
      c.rating || "N/A",
      c.reviewsCount || "N/A"
    ])

    ;(doc as any).autoTable({
      startY: finalY + 5,
      head: [["Competidor", "Visibilidad", "Rating", "Reseñas"]],
      body: compData,
      theme: "striped",
      headStyles: { fillColor: accentColor }
    })
  }

  // Recomendaciones Clave
  finalY = (doc as any).lastAutoTable.finalY + 15
  if (report.smartRecommendations && report.smartRecommendations.length > 0) {
    if (finalY > 240) { doc.addPage(); finalY = 20; }
    doc.setFontSize(16)
    doc.text("Plan de Acción Recomendado", 14, finalY)

    const recData = report.smartRecommendations.slice(0, 5).map(r => [
      r.title,
      r.category,
      r.impact >= 70 ? "Alto" : (r.impact >= 40 ? "Medio" : "Bajo")
    ])

    ;(doc as any).autoTable({
      startY: finalY + 5,
      head: [["Acción", "Categoría", "Impacto"]],
      body: recData,
      theme: "grid",
      headStyles: { fillColor: primaryColor }
    })
  }

  // Footer en todas las páginas
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Este es un reporte profesional generado por la herramienta de Auditoría AI. ${business.name} - ${business.location}`,
      14,
      285
    )
    doc.text(`Página ${i} de ${pageCount}`, 180, 285)
  }

  doc.save(`Auditoria-AI-${business.name.replace(/\s+/g, "-")}.pdf`)
}

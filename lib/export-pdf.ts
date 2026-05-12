import jsPDF from "jspdf"
import "jspdf-autotable"
import type { AnalysisReport } from "./types"

export async function exportToPDF(report: AnalysisReport) {
  const doc = new jsPDF()
  const { business, scores, queries, competitors, gbpData, internalReport, smartRecommendations } = report

  // Idioma
  const isIt = business.languageCode === "it"
  const lang = {
    title: "REPORTE DE VISIBILIDAD LOCAL AI",
    generatedFor: "Generado para:",
    location: "Ubicación:",
    date: "Fecha:",
    execSummary: "1. Resumen Ejecutivo",
    mainDiagnosis: "2. Diagnóstico Principal",
    detailedScores: "3. Puntuaciones Detalladas",
    searchAnalysis: "4. Análisis de Búsquedas Realizadas",
    strategicInsights: "5. Insights Estratégicos",
    competitorAnalysis: "6. Análisis de Competidores",
    actionPlan: "7. Plan de Acción Priorizado",
    technicalRecs: "8. Recomendaciones Técnicas Específicas",
    metric: "Métrica",
    score: "Puntuación",
    search: "Búsqueda",
    mapPack: "Map Pack",
    aiOverview: "AI Overview",
    organic: "Orgánico",
    competitor: "Competidor",
    visibility: "Visibilidad",
    rating: "Rating",
    reviews: "Reseñas",
    action: "Acción",
    category: "Categoría",
    impact: "Impacto",
    effort: "Esfuerzo",
  }

  // Colores de marca
  const primaryColor = [15, 23, 42] // slate-900
  const accentColor = [37, 99, 235] // blue-600
  const criticalColor = [220, 38, 38] // red-600
  const warningColor = [217, 119, 6] // amber-600
  const successColor = [22, 163, 74] // green-600

  // Título y Encabezado
  doc.setFontSize(22)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(lang.title, 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100)
  doc.text(`${lang.generatedFor} ${business.name}`, 14, 30)
  doc.text(`${lang.location} ${business.location}`, 14, 35)
  doc.text(`${lang.date} ${new Date(report.timestamp).toLocaleDateString()}`, 14, 40)

  // Línea divisoria
  doc.setDrawColor(200)
  doc.line(14, 45, 196, 45)

  let currentY = 55

  // 1. Resumen Ejecutivo
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(lang.execSummary, 14, currentY)
  currentY += 8

  doc.setFontSize(11)
  doc.setTextColor(50)
  let statusMsg = ""
  if (scores.visibilityStatus === 'invisible') {
    statusMsg = `Tu negocio no tiene presencia efectiva actualmente en Google Maps ni en los resúmenes de IA para las búsquedas clave en ${business.location}.`
  } else if (scores.visibilityStatus === 'low') {
    statusMsg = `Tu negocio tiene una visibilidad limitada. Apareces en algunas búsquedas, pero estás perdiendo la mayoría de las oportunidades frente a la competencia.`
  } else {
    statusMsg = `Tu negocio tiene una buena presencia general, aunque existen áreas críticas de optimización para dominar los nuevos resúmenes de IA.`
  }

  const intro = `${statusMsg} Este reporte detalla el impacto de la Inteligencia Artificial de Google (SGE) en tu visibilidad local y proporciona un plan de acción para capturar el tráfico que actualmente se desvía hacia tus competidores.`
  const introLines = doc.splitTextToSize(intro, 180)
  doc.text(introLines, 14, currentY)
  currentY += (introLines.length * 6) + 5

  // 2. Diagnóstico Principal
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(lang.mainDiagnosis, 14, currentY)
  currentY += 8

  doc.setFontSize(11)
  const gbpStatus = scores.hasActiveGBP
    ? "Perfil de Google Business Profile (GBP) detectado y activo."
    : "URGENTE: No se ha detectado un perfil de Google Business Profile activo o verificado.";

  doc.setTextColor(scores.hasActiveGBP ? successColor[0] : criticalColor[0], scores.hasActiveGBP ? successColor[1] : criticalColor[1], scores.hasActiveGBP ? successColor[2] : criticalColor[2])
  doc.text(`• ${gbpStatus}`, 14, currentY)
  currentY += 7

  doc.setTextColor(50)
  const mapPackMissing = queries.filter(q => !q.mapPack.present).length
  doc.text(`• Invisibilidad en Map Pack: No apareces en el Top 3 en ${mapPackMissing} de las ${queries.length} búsquedas analizadas.`, 14, currentY)
  currentY += 7

  const aiNotMentioned = queries.filter(q => q.aiOverview.present && !q.aiOverview.mentioned).length
  doc.text(`• Fuga de tráfico AI: Google muestra resúmenes de IA en ${queries.filter(q => q.aiOverview.present).length} búsquedas, pero no te menciona en ${aiNotMentioned} de ellas.`, 14, currentY)
  currentY += 12

  // 3. Puntuaciones Detalladas
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(lang.detailedScores, 14, currentY)

  const scoreData = [
    [lang.metric, lang.score, "Estado"],
    ["Visibilidad Local Estándar", `${scores.beforeScore}/100`, scores.beforeScore > 70 ? "Buena" : scores.beforeScore > 40 ? "Media" : "Crítica"],
    ["Visibilidad con IA (SGE)", `${scores.afterScore}/100`, scores.afterScore > 70 ? "Protegida" : scores.afterScore > 40 ? "En Riesgo" : "Vulnerable"],
    ["Impacto de Pérdida por IA", `${scores.visibilityLoss}%`, scores.visibilityLoss > 30 ? "Alto" : "Moderado"],
    ["Salud del Perfil GBP", `${scores.gbpCompletenessScore}/100`, scores.gbpCompletenessScore! > 80 ? "Excelente" : "Mejorable"],
    ["Autoridad en IA", `${scores.aiOverviewScore}/100`, scores.aiOverviewScore > 50 ? "Referente" : "Inexistente"]
  ]

  ;(doc as any).autoTable({
    startY: currentY + 5,
    head: [scoreData[0]],
    body: scoreData.slice(1),
    theme: "striped",
    headStyles: { fillColor: accentColor },
    margin: { top: 10 }
  })

  currentY = (doc as any).lastAutoTable.finalY + 15

  // 4. Análisis de Búsquedas Realizadas
  if (currentY > 240) { doc.addPage(); currentY = 20; }
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(lang.searchAnalysis, 14, currentY)

  const queryData = queries.map(q => [
    q.query,
    q.mapPack.position ? `Posición #${q.mapPack.position}` : (q.mapPack.present ? "Presente (Fuera de Top 3)" : "No detectado"),
    q.aiOverview.mentioned ? "Citado" : (q.aiOverview.present ? "Presente (No citado)" : "No"),
    q.organicPosition ? `#${q.organicPosition}` : "Fuera de Top 100"
  ])

  ;(doc as any).autoTable({
    startY: currentY + 5,
    head: [[lang.search, lang.mapPack, lang.aiOverview, lang.organic]],
    body: queryData,
    theme: "grid",
    headStyles: { fillColor: primaryColor }
  })

  currentY = (doc as any).lastAutoTable.finalY + 15

  // 5. Insights Estratégicos
  if (currentY > 240) { doc.addPage(); currentY = 20; }
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(lang.strategicInsights, 14, currentY)
  currentY += 10

  internalReport.insights.forEach(insight => {
    if (currentY > 270) { doc.addPage(); currentY = 20; }

    const color = insight.type === 'critical' ? criticalColor : insight.type === 'warning' ? warningColor : successColor
    doc.setFontSize(12)
    doc.setTextColor(color[0], color[1], color[2])
    doc.text(`[${insight.metric.toUpperCase()}]`, 14, currentY)
    currentY += 6

    doc.setFontSize(11)
    doc.setTextColor(50)
    const msgLines = doc.splitTextToSize(insight.message, 175)
    doc.text(msgLines, 18, currentY)
    currentY += (msgLines.length * 6) + 4
  })

  currentY += 5

  // 6. Análisis de Competidores
  if (competitors && competitors.length > 0) {
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    doc.setFontSize(16)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(lang.competitorAnalysis, 14, currentY)

    const compData = competitors.slice(0, 5).map(c => [
      c.name,
      `${c.visibilityScore}%`,
      c.rating || "N/A",
      c.reviewsCount || "N/A",
      c.aiMentions > 0 ? "Dominante" : "Normal"
    ])

    ;(doc as any).autoTable({
      startY: currentY + 5,
      head: [[lang.competitor, lang.visibility, lang.rating, lang.reviews, "Impacto AI"]],
      body: compData,
      theme: "striped",
      headStyles: { fillColor: accentColor }
    })
    currentY = (doc as any).lastAutoTable.finalY + 15
  }

  // 7. Plan de Acción Priorizado
  if (smartRecommendations && smartRecommendations.length > 0) {
    if (currentY > 230) { doc.addPage(); currentY = 20; }
    doc.setFontSize(16)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.text(lang.actionPlan, 14, currentY)

    const recData = smartRecommendations.sort((a, b) => b.impact - a.impact).slice(0, 5).map(r => [
      r.title,
      r.impact >= 80 ? "Inmediato" : "Alto",
      r.effort === 'low' ? "Bajo (Quick Win)" : r.effort === 'medium' ? "Medio" : "Alto"
    ])

    ;(doc as any).autoTable({
      startY: currentY + 5,
      head: [[lang.action, lang.impact, lang.effort]],
      body: recData,
      theme: "grid",
      headStyles: { fillColor: primaryColor }
    })
    currentY = (doc as any).lastAutoTable.finalY + 15
  }

  // 8. Recomendaciones Técnicas Específicas
  if (currentY > 240) { doc.addPage(); currentY = 20; }
  doc.setFontSize(16)
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
  doc.text(lang.technicalRecs, 14, currentY)
  currentY += 10

  const technicalRecs = [
    { t: "Datos Estructurados (JSON-LD)", d: "Implementar esquema de LocalBusiness y Review en la home para facilitar la lectura de la IA." },
    { t: "Optimización de Entidades", d: "Asegurar que el NAP (Name, Address, Phone) sea 100% consistente en toda la web y directorios." },
    { t: "Contenido Basado en Respuestas", d: "Crear una sección de FAQ optimizada para responder las preguntas que la IA de Google suele resumir." }
  ]

  technicalRecs.forEach(rec => {
    doc.setFontSize(11)
    doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.setFont("helvetica", "bold")
    doc.text(`• ${rec.t}:`, 14, currentY)
    doc.setFont("helvetica", "normal")
    const dLines = doc.splitTextToSize(rec.d, 140)
    doc.text(dLines, 55, currentY)
    currentY += (dLines.length * 6) + 4
  })

  // Footer en todas las páginas
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150)
    doc.text(
      `Reporte Profesional de Visibilidad v3-complete | ${business.name} | ${new Date().toLocaleDateString()}`,
      14,
      285
    )
    doc.text(`Página ${i} de ${pageCount}`, 180, 285)
  }

  doc.save(`Auditoria-AI-${business.name.replace(/\s+/g, "-")}.pdf`)
}

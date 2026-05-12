import { NextResponse } from "next/server"
import { generateReport } from "@/lib/actions"
import { logger } from "@/lib/logger"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, location, category, gbpUrl, placeId, languageCode } = body

    if (!name || !location || !category) {
      logger.warn({ body }, "Petición de análisis con campos faltantes")
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, ubicación, categoría" },
        { status: 400 }
      )
    }

    const business = { name, location, category, gbpUrl, placeId, languageCode }
    const report = await generateReport(business)

    return NextResponse.json(report)
  } catch (error: any) {
    logger.error({ err: error.message, stack: error.stack }, "Error crítico en API /api/analyze")
    return NextResponse.json(
      {
        error: "Error al generar el informe de visibilidad",
        details: error.message,
        code: error.message.includes("CONFIGURACIÓN REQUERIDA") ? "CONFIG_ERROR" : "GENERIC_ERROR"
      },
      { status: 500 }
    )
  }
}

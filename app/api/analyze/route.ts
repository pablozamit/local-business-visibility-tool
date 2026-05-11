import { NextResponse } from "next/server"
import { generateReport } from "@/lib/actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, location, category, gbpUrl, placeId } = body

    if (!name || !location || !category) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, ubicación, categoría" },
        { status: 400 }
      )
    }

    const business = { name, location, category, gbpUrl, placeId }
    const report = await generateReport(business)

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Error al generar el informe de visibilidad", details: error.message },
      { status: 500 }
    )
  }
}

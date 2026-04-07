import { NextResponse } from "next/server"
import { generateReport } from "@/lib/actions"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, location, category } = body

    if (!name || !location || !category) {
      return NextResponse.json(
        { error: "Missing required fields: name, location, category" },
        { status: 400 }
      )
    }

    const business = { name, location, category }
    const report = await generateReport(business)

    return NextResponse.json(report)
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json(
      { error: "Failed to generate visibility report", details: error.message },
      { status: 500 }
    )
  }
}

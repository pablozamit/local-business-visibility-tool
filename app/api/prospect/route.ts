import { NextResponse } from "next/server"
import { TARGET_NEIGHBORHOODS } from "@/lib/neighborhoods"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { neighborhoodId, category } = body

    if (!neighborhoodId || !category) {
      return NextResponse.json(
        { 
          error: "Missing required fields: neighborhoodId and category",
          availableNeighborhoods: TARGET_NEIGHBORHOODS.map(n => ({ id: n.id, city: n.city, name: n.name }))
        },
        { status: 400 }
      )
    }

    const neighborhood = TARGET_NEIGHBORHOODS.find(n => n.id === neighborhoodId)
    if (!neighborhood) {
      return NextResponse.json(
        { 
          error: `Neighborhood '${neighborhoodId}' not found.`,
          availableNeighborhoods: TARGET_NEIGHBORHOODS.map(n => ({ id: n.id, city: n.city, name: n.name }))
        },
        { status: 404 }
      )
    }

    const apiKey = process.env.SERPAPI_KEY
    if (!apiKey) throw new Error("SERPAPI_KEY is not defined")

    const params = new URLSearchParams({
      engine: "google_maps",
      q: category,
      ll: neighborhood.coordinates,
      type: "search",
      api_key: apiKey,
      hl: "es",
      gl: "es",
    })

    const res = await fetch(`https://serpapi.com/search.json?${params.toString()}`, {
      cache: "no-store",
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(text || `SerpAPI request failed (${res.status})`)
    }

    const payload = await res.json()
    const localResults: any[] = payload.local_results || []

    // Top 3: los ganadores del barrio (para usar como contexto en el Cold Email)
    const topCompetitors = localResults.slice(0, 3).map((r: any) => ({
      name: r.title,
      rating: r.rating,
      reviews: r.reviews,
    }))

    // Posiciones 4-20: los vulnerables
    const vulnerable = localResults.slice(3, 20)

    const prospects = vulnerable
      .map((biz: any) => {
        const reviewCount = biz.reviews || 0
        const nameWords = biz.title ? biz.title.trim().split(/\s+/).length : 0

        const redFlags: string[] = []

        if (nameWords <= 2) {
          redFlags.push("Nombre no optimizado en Maps (muy corto, sin palabras clave)")
        }
        if (reviewCount < 50) {
          redFlags.push(`Solo ${reviewCount} reseñas (la media del Top 3 es mucho mayor)`)
        }
        if (!biz.website) {
          redFlags.push("Sin página web")
        }

        return {
          name: biz.title,
          address: biz.address,
          phone: biz.phone || null,
          website: biz.website || null,
          rating: biz.rating || null,
          reviewCount,
          redFlags,
        }
      })
      // Solo los que tienen web (han invertido en marketing, tienen presupuesto)
      // Y tienen al menos 1 red flag (tienen el problema)
      .filter((p: any) => p.website && p.redFlags.length > 0)

    return NextResponse.json({
      neighborhood: {
        id: neighborhood.id,
        name: neighborhood.name,
        city: neighborhood.city,
      },
      category,
      topCompetitors,
      totalProspects: prospects.length,
      prospects,
    })

  } catch (error: any) {
    console.error("Prospect API Error:", error)
    return NextResponse.json(
      { error: "Failed to fetch prospects", details: error.message },
      { status: 500 }
    )
  }
}

import type { BusinessInput, QueryResult } from "./types"

export async function runSerpQuery({
  business,
  queryType,
  queryText,
  apiKey,
}: {
  business: BusinessInput
  queryType: string
  queryText: string
  apiKey: string
}): Promise<QueryResult> {

  const params = new URLSearchParams({
    api_key: apiKey,
    engine: "google",
    q: queryText,
    google_domain: "google.it",
    gl: "it",
    hl: "it",
    num: "20"
  })

  try {
    const response = await fetch(`https://serpapi.com/search?${params.toString()}`)
    const data = await response.json()

    const localResults = data.local_results || []
    const organicResults = data.organic_results || []
    const kg = data.knowledge_graph || {}

    // Pulizia del nome per il matching (es: da "Ristorante Ratana" a "ratana")
    const brandTerm = business.name.toLowerCase()
    .replace(/ristorante|pizzeria|milano|trattoria|osteria/g, "")
    .trim().split(" ")[0]

    let mapPackPosition: number | null = null

    // 1. CONTROLLO MAPPE & SCHEDA (Knowledge Graph)
    // Se Google mostra la scheda "ufficiale" a destra, per noi è POSIZIONE 1 nelle mappe.
    const kgString = JSON.stringify(kg).toLowerCase()
    if (kgString.includes(brandTerm)) {
      mapPackPosition = 1
    }

    // Se non è nel KG, cerchiamo nel "Local Pack" (la cartina con i 3 nomi)
    if (!mapPackPosition) {
      localResults.forEach((res: any, i: number) => {
        if ((res.title || "").toLowerCase().includes(brandTerm)) {
          mapPackPosition = i + 1
        }
      })
    }

    // 2. CONTROLLO ORGANICO
    let organicPosition: number | null = null
    organicResults.forEach((res: any, i: number) => {
      const dump = JSON.stringify(res).toLowerCase()
      if (dump.includes(brandTerm) && organicPosition === null) {
        organicPosition = i + 1
      }
    })

    // 3. CONTROLLO AI
    const ai = data.ai_overview
    const aiMentioned = ai ? JSON.stringify(ai).toLowerCase().includes(brandTerm) : false

    return {
      query: queryText,
      queryType,
      mapPack: {
        present: localResults.length > 0 || !!kg.title || !!kg.entity_type,
        position: mapPackPosition,
        competitors: localResults.slice(0, 3).map((r: any) => r.title).filter((t: string) => !t.toLowerCase().includes(brandTerm))
      },
      aiOverview: {
        present: !!ai,
        mentioned: aiMentioned,
        mentionType: aiMentioned ? "citation" : null
      },
      organicPosition,
    }
  } catch (e) {
    return { query: queryText, queryType, mapPack: { present: false, position: null }, aiOverview: { present: false, mentioned: false, mentionType: null }, organicPosition: null }
  }
}

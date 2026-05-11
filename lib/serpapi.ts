import type { BusinessInput, QueryResult } from "./types"

export const QUERY_TEMPLATES = [
  { type: "brand", template: (cat: string, loc: string) => `${cat} ${loc}` },
  { type: "intent", template: (cat: string, loc: string) => `mejor ${cat} en ${loc}` },
  { type: "near_me", template: (cat: string, loc: string) => `${cat} cerca de mí` },
  { type: "service_specific", template: (cat: string, loc: string) => `servicios de ${cat} en ${loc}` },
  { type: "expert", template: (cat: string, loc: string) => `expertos en ${cat} ${loc}` },
  { type: "comparison", template: (cat: string, loc: string) => `opiniones sobre ${cat} en ${loc}` },
]

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
    google_domain: "google.es",
    gl: "es",
    hl: "es",
    num: "20"
  })

  try {
    const response = await fetch(`https://serpapi.com/search?${params.toString()}`)
    const data = await response.json()

    const localResults = data.local_results || []
    const organicResults = data.organic_results || []
    const kg = data.knowledge_graph || {}

    // Normalización para matching
    const brandTerms = business.name.toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 2 && !["clinica", "dental", "madrid", "restaurante", "pizzeria"].includes(term));

    let mapPackPosition: number | null = null

    // 1. CONTROL DE MAPAS & FICHA (Knowledge Graph)
    const kgTitle = (kg.title || "").toLowerCase();
    if (brandTerms.some(term => kgTitle.includes(term))) {
      mapPackPosition = 1;
    }

    // 2. CONTROL LOCAL PACK
    if (!mapPackPosition) {
      localResults.forEach((res: any, i: number) => {
        const title = (res.title || "").toLowerCase();
        if (brandTerms.some(term => title.includes(term))) {
          mapPackPosition = i + 1;
        }
      });
    }

    // 3. CONTROL ORGANICO
    let organicPosition: number | null = null;
    organicResults.forEach((res: any, i: number) => {
      const title = (res.title || "").toLowerCase();
      const snippet = (res.snippet || "").toLowerCase();
      if ((brandTerms.some(term => title.includes(term)) || brandTerms.some(term => snippet.includes(term))) && organicPosition === null) {
        organicPosition = i + 1;
      }
    });

    // 4. CONTROL AI (AI Overviews)
    const ai = data.ai_overview;
    let aiMentioned = false;
    let aiText = "";

    if (ai) {
      aiText = ai.text || "";
      const aiContent = JSON.stringify(ai).toLowerCase();
      aiMentioned = brandTerms.some(term => aiContent.includes(term));
    }

    return {
      query: queryText,
      queryType,
      mapPack: {
        present: localResults.length > 0 || !!kg.title,
        position: mapPackPosition,
        competitors: localResults
          .slice(0, 5)
          .map((r: any) => r.title)
          .filter((t: string) => !brandTerms.some(term => t.toLowerCase().includes(term)))
      },
      aiOverview: {
        present: !!ai,
        mentioned: aiMentioned,
        mentionType: aiMentioned ? "direct" : null,
        text: aiText
      },
      organicPosition,
    }
  } catch (e) {
    console.error("Error en SerpAPI:", e);
    return {
      query: queryText,
      queryType,
      mapPack: { present: false, position: null },
      aiOverview: { present: false, mentioned: false, mentionType: null },
      organicPosition: null
    }
  }
}

import type { BusinessInput, QueryResult } from "./types"

const SEARCH_TEMPLATES: Record<string, any[]> = {
  es: [
    { type: "directa", template: (cat: string, loc: string) => `${cat} ${loc}` },
    { type: "intent", template: (cat: string, loc: string) => `mejor ${cat} en ${loc}` },
    { type: "near_me", template: (cat: string, loc: string) => `${cat} cerca de mí` },
    { type: "service_specific", template: (cat: string, loc: string) => `servicios de ${cat} en ${loc}` },
    { type: "expert", template: (cat: string, loc: string) => `expertos en ${cat} ${loc}` },
    { type: "comparison", template: (cat: string, loc: string) => `opiniones sobre ${cat} en ${loc}` },
  ],
  it: [
    { type: "directa", template: (cat: string, loc: string) => `${cat} ${loc}` },
    { type: "intent", template: (cat: string, loc: string) => `miglior ${cat} a ${loc}` },
    { type: "near_me", template: (cat: string, loc: string) => `${cat} vicino a me` },
    { type: "service_specific", template: (cat: string, loc: string) => `servizi di ${cat} a ${loc}` },
    { type: "expert", template: (cat: string, loc: string) => `esperti in ${cat} ${loc}` },
    { type: "comparison", template: (cat: string, loc: string) => `opinioni su ${cat} a ${loc}` },
  ]
}

export function getQueryTemplates(lang: string = "es") {
  return SEARCH_TEMPLATES[lang] || SEARCH_TEMPLATES["es"];
}

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
    google_domain: business.countryCode === 'it' ? "google.it" : "google.es",
    gl: business.countryCode || "es",
    hl: business.languageCode || "es",
    num: "20"
  })

  try {
    const response = await fetch(`https://serpapi.com/search?${params.toString()}`)
    const data = await response.json()

    const localResults = data.local_results || []
    const organicResults = data.organic_results || []
    const kg = data.knowledge_graph || {}

    // Lógica de matching robusta: comprobamos si el nombre está incluido de forma parcial
    const normalizedTarget = business.name.toLowerCase().trim();
    const isMyBusiness = (title: string) => {
      if (!title) return false;
      const t = title.toLowerCase();
      return t.includes(normalizedTarget) || normalizedTarget.includes(t);
    };

    let mapPackPosition: number | null = null;
    if (kg.title && isMyBusiness(kg.title)) mapPackPosition = 1;
    if (!mapPackPosition) {
      const idx = localResults.findIndex((r: any) => isMyBusiness(r.title));
      if (idx !== -1) mapPackPosition = idx + 1;
    }

    let organicPosition: number | null = null;
    const orgIdx = organicResults.findIndex((r: any) => isMyBusiness(r.title) || (r.snippet && isMyBusiness(r.snippet)));
    if (orgIdx !== -1) organicPosition = orgIdx + 1;

    const ai = data.ai_overview;
    const aiMentioned = !!(ai && ai.text && (isMyBusiness(ai.text) || JSON.stringify(ai).toLowerCase().includes(normalizedTarget)));

    return {
      query: queryText,
      queryType,
      mapPack: {
        present: localResults.length > 0 || !!kg.title,
        position: mapPackPosition,
        competitors: localResults.slice(0, 5).map((r: any) => r.title).filter((t: string) => !isMyBusiness(t))
      },
      aiOverview: {
        present: !!ai,
        mentioned: aiMentioned,
        text: ai?.text || ""
      },
      organicPosition,
      extractedBusinessData: localResults.find((res: any) => isMyBusiness(res.title)) || (kg.title ? kg : null)
    }
  } catch (e) {
    return {
      query: queryText,
      queryType,
      mapPack: { present: false, position: null },
      aiOverview: { present: false, mentioned: false },
      organicPosition: null
    }
  }
}

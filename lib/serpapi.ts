import type { BusinessInput, QueryResult } from "./types"

/**
 * Diccionario de templates de búsqueda por idioma.
 * Esto asegura que la auditoría use términos naturales para el usuario local.
 */
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
  ],
  en: [
    { type: "directa", template: (cat: string, loc: string) => `${cat} ${loc}` },
    { type: "intent", template: (cat: string, loc: string) => `best ${cat} in ${loc}` },
    { type: "near_me", template: (cat: string, loc: string) => `${cat} near me` },
    { type: "service_specific", template: (cat: string, loc: string) => `${cat} services in ${loc}` },
    { type: "expert", template: (cat: string, loc: string) => `${cat} experts ${loc}` },
    { type: "comparison", template: (cat: string, loc: string) => `reviews about ${cat} in ${loc}` },
  ]
}

/**
 * Retorna los templates correspondientes al idioma del negocio.
 */
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

  // 1. CONFIGURACIÓN DINÁMICA DE GEOLOCALIZACIÓN
  const googleDomain = business.countryCode === 'it' ? "google.it" : 
                       business.countryCode === 'us' ? "google.com" : 
                       business.countryCode === 'mx' ? "google.com.mx" : "google.es";

  const params = new URLSearchParams({
    api_key: apiKey,
    engine: "google",
    q: queryText,
    google_domain: googleDomain,
    gl: business.countryCode || "es", // País real (ej: "it")
    hl: business.languageCode || "es", // Idioma real (ej: "it")
    num: "20"
  })

  try {
    const response = await fetch(`https://serpapi.com/search?${params.toString()}`)
    const data = await response.json()

    const localResults = data.local_results || []
    const organicResults = data.organic_results || []
    const kg = data.knowledge_graph || {}

    // 2. MATCHING INTELIGENTE DE MARCA
    // Eliminamos términos genéricos que causan falsos positivos (ej: que crea que es "tu" negocio solo por ser una "clinica")
    const blacklist = [
      "clinica", "dental", "madrid", "restaurante", "pizzeria", "fiorerie", "milano", 
      "best", "mejor", "miglior", "services", "servicios", "servizi", "near", "cerca", "vicino"
    ];
    
    const brandTerms = business.name.toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 2 && !blacklist.includes(term));

    let mapPackPosition: number | null = null

    // A. Control vía Knowledge Graph (Si aparece el panel lateral derecho de Google)
    const kgTitle = (kg.title || "").toLowerCase();
    if (brandTerms.length > 0 && brandTerms.some(term => kgTitle.includes(term))) {
      mapPackPosition = 1;
    }

    // B. Control vía Local Pack (El mapa de 3 resultados)
    if (!mapPackPosition) {
      localResults.forEach((res: any, i: number) => {
        const title = (res.title || "").toLowerCase();
        if (brandTerms.length > 0 && brandTerms.some(term => title.includes(term))) {
          mapPackPosition = i + 1;
        }
      });
    }

    // C. Control Orgánico
    let organicPosition: number | null = null;
    organicResults.forEach((res: any, i: number) => {
      const title = (res.title || "").toLowerCase();
      const snippet = (res.snippet || "").toLowerCase();
      if (brandTerms.length > 0 && (brandTerms.some(term => title.includes(term)) || brandTerms.some(term => snippet.includes(term))) && organicPosition === null) {
        organicPosition = i + 1;
      }
    });

    // 3. ANÁLISIS DE AI OVERVIEWS (SGE)
    const ai = data.ai_overview;
    let aiMentioned = false;
    let aiText = "";

    if (ai) {
      aiText = ai.text || "";
      const aiContent = JSON.stringify(ai).toLowerCase();
      aiMentioned = brandTerms.length > 0 && brandTerms.some(term => aiContent.includes(term));
    }

    // 4. EXTRACCIÓN DE DATOS PARA "MODO GRATUITO"
    // Si no hay API Key de Google Places, intentamos sacar la info de lo que ve Google Search
    let extractedBusinessData = null;
    if (kg && kg.title && brandTerms.length > 0 && brandTerms.some(term => kg.title.toLowerCase().includes(term))) {
      extractedBusinessData = {
        source: "knowledge_graph",
        title: kg.title,
        type: kg.type,
        rating: kg.rating,
        reviews: kg.reviews,
        reviews_results: kg.reviews_results,
        photos: kg.photos,
        website: kg.website,
        phone: kg.phone,
        address: kg.address,
        hours: kg.hours,
      };
    } else {
      const matchingLocal = localResults.find((res: any) =>
        brandTerms.length > 0 && brandTerms.some(term => (res.title || "").toLowerCase().includes(term))
      );
      if (matchingLocal) {
        extractedBusinessData = {
          source: "local_results",
          ...matchingLocal
        };
      }
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
          .filter((t: string) => brandTerms.length === 0 || !brandTerms.some(term => t.toLowerCase().includes(term)))
      },
      aiOverview: {
        present: !!ai,
        mentioned: aiMentioned,
        mentionType: aiMentioned ? "direct" : null,
        text: aiText
      },
      organicPosition,
      extractedBusinessData
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

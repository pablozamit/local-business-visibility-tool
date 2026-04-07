import type { BusinessInput, QueryResult, VisibilityReport, Recommendation } from "./types"

function seededRandom(seed: string): () => number {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b)
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b)
    h = (h ^ (h >>> 16)) >>> 0
    return h / 4294967296
  }
}

const CATEGORIES_ES: Record<string, string[]> = {
  dentista: ["Clínica Dental Sonrisa", "Centro Odontológico Plus", "Dentistas Asociados", "Dr. García Dental", "Clínica Bucal Avanzada"],
  veterinario: ["Clínica Veterinaria Mascota Feliz", "Centro Veterinario Animal", "Veterinaria El Arca", "Hospital de Animales 24h", "Clínica Vet Express"],
  "clínica estética": ["Centro Estética Belleza", "Clínica Estética Premium", "Beauty Center Pro", "Estética Avanzada", "Clínica Dermatológica"],
  restaurante: ["Restaurante El Sabor", "Casa de Comidas La Buena Mesa", "Taberna Gastro", "Restaurante La Esquina", "Bistró Central"],
  abogado: ["Bufete Jurídico López", "Abogados Asociados García", "Despacho Legal Pro", "Consultoría Jurídica Pérez", "Abogados Martinez & Co"],
  fontanero: ["Fontanería Express", "Fontaneros del Sur", "Servicios de Fontanería ABC", "Fontanería Rápida 24h", "Instalaciones López"],
  electricista: ["Electricidad Express", "Instalaciones Eléctricas Pro", "Electricistas del Centro", "Electro Servicios 24h", "Instalaciones García"],
  peluquería: ["Peluquería Style", "Salón de Belleza Glamour", "Hair Studio Pro", "Peluquería Moderna", "Corte & Estilo"],
  gimnasio: ["Gym Fitness Plus", "Centro Deportivo Activo", "Gimnasio Total Fit", "CrossFit Center", "Wellness Gym"],
  farmacia: ["Farmacia Central", "Farmacia del Barrio", "Parafarmacia Plus", "Farmacia 24 Horas", "Farmacia Moderna"],
}

function getCompetitors(category: string, businessName: string, rng: () => number): string[] {
  const key = Object.keys(CATEGORIES_ES).find(k =>
    category.toLowerCase().includes(k)
  ) || "restaurante"
  const pool = CATEGORIES_ES[key].filter(c => c !== businessName)
  const shuffled = [...pool].sort(() => rng() - 0.5)
  return shuffled.slice(0, 3)
}

const QUERY_TEMPLATES = [
  { type: "directa", template: (cat: string, loc: string) => `${cat} ${loc}` },
  { type: "proximidad", template: (cat: string, loc: string) => `${cat} cerca de mí en ${loc}` },
  { type: "precios", template: (cat: string, loc: string) => `${cat} ${loc} precios` },
  { type: "opiniones", template: (cat: string, loc: string) => `${cat} ${loc} opiniones` },
  { type: "horario", template: (cat: string, loc: string) => `${cat} ${loc} horario` },
  { type: "mejor", template: (cat: string, loc: string) => `mejor ${cat} en ${loc}` },
]

function simulateQuery(
  business: BusinessInput,
  queryType: string,
  queryText: string,
  rng: () => number
): QueryResult {
  const mapPackPresent = rng() > 0.15
  const mapPackPosition = mapPackPresent ? (rng() < 0.45 ? Math.ceil(rng() * 3) : null) : null
  const competitors = getCompetitors(business.category, business.name, rng)

  const aiOverviewPresent = rng() > 0.25
  const aiMentioned = aiOverviewPresent ? rng() < 0.35 : false
  let mentionType: "direct" | "indirect" | "absent" = "absent"
  if (aiMentioned) {
    mentionType = rng() < 0.4 ? "direct" : "indirect"
  }
  const aiPosition = aiMentioned ? Math.ceil(rng() * 5) : null

  const organicPosition = rng() < 0.6 ? Math.ceil(rng() * 20) : null

  return {
    query: queryText,
    queryType,
    mapPack: {
      present: mapPackPresent,
      position: mapPackPosition,
      totalResults: mapPackPresent ? 3 : 0,
      competitors,
    },
    aiOverview: {
      present: aiOverviewPresent,
      mentioned: aiMentioned,
      mentionType,
      position: aiPosition,
    },
    organicPosition,
  }
}

function calculateScores(queries: QueryResult[]) {
  let mapPackTotal = 0
  let mapPackCount = 0
  let aiTotal = 0
  let aiCount = 0

  for (const q of queries) {
    if (q.mapPack.present) {
      mapPackCount++
      if (q.mapPack.position !== null) {
        mapPackTotal += q.mapPack.position === 1 ? 100 : q.mapPack.position === 2 ? 75 : 50
      }
    }
    if (q.aiOverview.present) {
      aiCount++
      if (q.aiOverview.mentioned) {
        aiTotal += q.aiOverview.mentionType === "direct" ? 100 : 60
      }
    }
  }

  const mapPackScore = mapPackCount > 0 ? Math.round(mapPackTotal / mapPackCount) : 0
  const aiOverviewScore = aiCount > 0 ? Math.round(aiTotal / aiCount) : 0

  const beforeScore = Math.min(100, Math.round(
    mapPackScore * 0.6 +
    queries.reduce((acc, q) => acc + (q.organicPosition ? Math.max(0, 100 - q.organicPosition * 5) : 0), 0) / queries.length * 0.4
  ))

  const aiPenalty = queries.filter(q => q.aiOverview.present && !q.aiOverview.mentioned).length / Math.max(1, queries.length)
  const afterScore = Math.max(0, Math.round(beforeScore * (1 - aiPenalty * 0.55)))
  const visibilityLoss = beforeScore > 0 ? Math.round(((beforeScore - afterScore) / beforeScore) * 100) : 0

  return { mapPackScore, aiOverviewScore, beforeScore, afterScore, visibilityLoss }
}

function generateRecommendations(scores: ReturnType<typeof calculateScores>, queries: QueryResult[]): Recommendation[] {
  const recs: Recommendation[] = []

  if (scores.aiOverviewScore < 40) {
    recs.push({
      title: "Optimizar contenido para AI Overviews",
      description: "Crea contenido estructurado con preguntas y respuestas claras. Google AI prioriza fuentes que proporcionan respuestas directas y bien organizadas.",
      impact: "high",
      category: "Contenido",
    })
  }

  if (scores.mapPackScore < 50) {
    recs.push({
      title: "Mejorar perfil de Google Business",
      description: "Completa al 100% tu perfil de Google Business Profile: fotos actualizadas, horarios exactos, descripcion detallada y categorias correctas.",
      impact: "high",
      category: "Google Business",
    })
  }

  recs.push({
    title: "Implementar Schema Markup LocalBusiness",
    description: "Agrega datos estructurados Schema.org de tipo LocalBusiness en tu sitio web. Esto ayuda a Google a entender y mostrar tu negocio en resultados enriquecidos.",
    impact: "high",
    category: "SEO Tecnico",
  })

  const hasLowReviews = queries.some(q => q.queryType === "opiniones" && !q.mapPack.position)
  if (hasLowReviews) {
    recs.push({
      title: "Estrategia de resenas y reputacion",
      description: "Implementa un sistema para solicitar resenas a clientes satisfechos. Responde a todas las resenas, positivas y negativas, de forma profesional.",
      impact: "high",
      category: "Reputacion",
    })
  }

  recs.push({
    title: "Crear contenido E-E-A-T",
    description: "Desarrolla contenido que demuestre Experiencia, Conocimiento, Autoridad y Confianza. Los AI Overviews priorizan fuentes con alto E-E-A-T.",
    impact: "medium",
    category: "Contenido",
  })

  recs.push({
    title: "Optimizar para busquedas conversacionales",
    description: "Adapta tu contenido a preguntas naturales que los usuarios hacen. Las AI Overviews se activan mas con consultas de tipo conversacional.",
    impact: "medium",
    category: "Contenido",
  })

  if (scores.visibilityLoss > 30) {
    recs.push({
      title: "Diversificar canales de adquisicion",
      description: "No dependas solo de Google Search. Desarrolla presencia en redes sociales, directorios locales, y plataformas especificas de tu industria.",
      impact: "medium",
      category: "Estrategia",
    })
  }

  recs.push({
    title: "Monitorear cambios en SERPs",
    description: "Establece un sistema de monitoreo semanal para detectar cambios en como aparece tu negocio en los resultados de busqueda y AI Overviews.",
    impact: "low",
    category: "Monitoreo",
  })

  recs.push({
    title: "Crear FAQPage estructurada",
    description: "Agrega una seccion de preguntas frecuentes con Schema FAQPage. Este formato es altamente compatible con AI Overviews y featured snippets.",
    impact: "medium",
    category: "SEO Tecnico",
  })

  return recs
}

export function generateReport(business: BusinessInput): VisibilityReport {
  const seed = `${business.name}-${business.location}-${business.category}`.toLowerCase()
  const rng = seededRandom(seed)

  const queries = QUERY_TEMPLATES.map(({ type, template }) =>
    simulateQuery(business, type, template(business.category, business.location), rng)
  )

  const scores = calculateScores(queries)
  const recommendations = generateRecommendations(scores, queries)

  return {
    business,
    timestamp: new Date().toISOString(),
    queries,
    scores,
    recommendations,
  }
}

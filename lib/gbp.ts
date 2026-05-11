import { GBPData, Review, MissingItem, BusinessInput } from "./types";

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function fetchGBPData(business: BusinessInput): Promise<GBPData | null> {
  if (!GOOGLE_PLACES_API_KEY) {
    console.warn("GOOGLE_PLACES_API_KEY no configurada");
    return null;
  }

  let placeId = business.placeId;

  if (!placeId && business.gbpUrl) {
    placeId = extractPlaceIdFromUrl(business.gbpUrl);
  }

  if (!placeId) {
    placeId = await searchPlaceId(business.name, business.location);
  }

  if (!placeId) {
    return null;
  }

  try {
    // Usar la New Places API
    const fields = [
      "id",
      "displayName",
      "rating",
      "userRatingCount",
      "photos",
      "reviews",
      "regularOpeningHours",
      "currentOpeningHours",
      "editorialSummary",
      "types",
      "websiteUri",
      "nationalPhoneNumber",
      "formattedAddress",
      "accessibilityOptions",
      "businessStatus",
    ].join(",");

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}?fields=${fields}&key=${GOOGLE_PLACES_API_KEY}`,
      {
        headers: {
          "Accept-Language": "es",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error de Places API: ${response.statusText}`);
    }

    const data = await response.json();
    return transformPlacesData(data);
  } catch (error) {
    console.error("Error al obtener datos de GBP:", error);
    return null;
  }
}

function extractPlaceIdFromUrl(url: string): string | undefined {
  // Regex para intentar extraer Place ID o nombre de la URL
  // Ejemplo: https://www.google.com/maps/place/?q=place_id:ChIJN1t_tDeuEmsRUsoyG83VY1Y
  const placeIdMatch = url.match(/place_id:([a-zA-Z0-9_-]+)/);
  if (placeIdMatch) return placeIdMatch[1];

  // A veces el Place ID está directamente en la URL de Maps tras el !1s
  const mIdMatch = url.match(/!1s(0x[a-fA-F0-9]+:[a-fA-F0-9]+)/);
  if (mIdMatch) return mIdMatch[1];

  return undefined;
}

async function searchPlaceId(name: string, location: string): Promise<string | undefined> {
  try {
    const query = `${name} ${location}`;
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": GOOGLE_PLACES_API_KEY!,
          "X-Goog-FieldMask": "places.id",
        },
        body: JSON.stringify({ textQuery: query }),
      }
    );

    const data = await response.json();
    return data.places?.[0]?.id;
  } catch (error) {
    console.error("Error en searchPlaceId:", error);
    return undefined;
  }
}

function transformPlacesData(data: any): GBPData {
  const reviews: Review[] = (data.reviews || []).map((r: any) => ({
    authorName: r.authorAttribution?.displayName || "Anónimo",
    rating: r.rating,
    text: r.text?.text || "",
    time: r.relativePublishTimeDescription,
    sentiment: analyzeSentiment(r.text?.text || ""),
  }));

  const missingItems: MissingItem[] = [];
  let completedPoints = 0;
  const totalPoints = 7; // Factores clave

  if (data.photos && data.photos.length >= 30) completedPoints++;
  else missingItems.push({ label: "Fotos insuficientes (menos de 30)", impact: "high" });

  if (data.reviews && data.reviews.length > 0) completedPoints++;
  else missingItems.push({ label: "Sin reseñas recientes", impact: "high" });

  if (data.regularOpeningHours) completedPoints++;
  else missingItems.push({ label: "Horarios no configurados", impact: "medium" });

  if (data.websiteUri) completedPoints++;
  else missingItems.push({ label: "Web no vinculada", impact: "medium" });

  if (data.nationalPhoneNumber) completedPoints++;
  else missingItems.push({ label: "Teléfono no configurado", impact: "high" });

  if (data.editorialSummary) completedPoints++;
  else missingItems.push({ label: "Descripción de negocio ausente", impact: "medium" });

  if (data.accessibilityOptions) completedPoints++;
  else missingItems.push({ label: "Atributos de accesibilidad faltantes", impact: "low" });

  const completenessScore = Math.round((completedPoints / totalPoints) * 100);

  return {
    placeId: data.id,
    businessName: data.displayName?.text || "",
    rating: data.rating || 0,
    userRatingsTotal: data.userRatingCount || 0,
    photosCount: data.photos?.length || 0,
    postsCount: 0, // No disponible directamente en Places API v1 de forma sencilla
    attributesCompleted: completedPoints,
    attributesTotal: totalPoints,
    lastUpdated: new Date().toISOString(),
    reviews,
    completenessScore,
    missingItems,
    website: data.websiteUri,
    phoneNumber: data.nationalPhoneNumber,
    address: data.formattedAddress,
    hours: data.regularOpeningHours?.weekdayDescriptions,
    isOpenNow: data.currentOpeningHours?.openNow,
  };
}

export function extractGBPDataFromSerp(queries: any[]): GBPData | null {
  // Buscar el primer resultado que tenga extractedBusinessData, priorizando el tipo "directa"
  const directQuery = queries.find(q => q.queryType === "directa" && q.extractedBusinessData);
  const bestData = directQuery?.extractedBusinessData || queries.find(q => q.extractedBusinessData)?.extractedBusinessData;

  if (!bestData) return null;

  const reviews: Review[] = [];

  // Intentar extraer reseñas de knowledge_graph
  if (bestData.reviews_results) {
    bestData.reviews_results.slice(0, 5).forEach((r: any) => {
      reviews.push({
        authorName: r.author || "Anónimo",
        rating: r.rating || 0,
        text: r.snippet || "",
        time: r.date || "",
        sentiment: analyzeSentiment(r.snippet || ""),
      });
    });
  } else if (bestData.reviews) {
    // A veces solo viene el texto de la reseña en local_results
    // Si SerpAPI no da el desglose, al menos sabemos el rating
  }

  const missingItems: MissingItem[] = [];
  let completedPoints = 0;
  const totalPoints = 7;

  // Rating & Reviews
  if (bestData.rating) completedPoints++;
  else missingItems.push({ label: "Sin calificación visible", impact: "high" });

  if (bestData.reviews || bestData.userRatingCount) completedPoints++;
  else missingItems.push({ label: "Sin reseñas detectadas", impact: "high" });

  // Photos (SerpAPI suele dar un link a fotos o un thumbnail)
  if (bestData.photos || bestData.thumbnail) completedPoints++;
  else missingItems.push({ label: "Sin fotos en el perfil", impact: "high" });

  // Hours
  if (bestData.hours) completedPoints++;
  else missingItems.push({ label: "Horarios no detectados", impact: "medium" });

  // Website
  if (bestData.website || bestData.links?.website) completedPoints++;
  else missingItems.push({ label: "Web no detectada", impact: "medium" });

  // Phone
  if (bestData.phone) completedPoints++;
  else missingItems.push({ label: "Teléfono no detectado", impact: "high" });

  // Address
  if (bestData.address) completedPoints++;
  else missingItems.push({ label: "Dirección no detectada", impact: "medium" });

  const completenessScore = Math.round((completedPoints / totalPoints) * 100);

  return {
    placeId: bestData.place_id || "extracted",
    businessName: bestData.title || "",
    rating: bestData.rating || 0,
    userRatingsTotal: bestData.reviews || bestData.userRatingCount || 0,
    photosCount: bestData.photos?.length || (bestData.thumbnail ? 1 : 0),
    postsCount: 0,
    attributesCompleted: completedPoints,
    attributesTotal: totalPoints,
    lastUpdated: new Date().toISOString(),
    reviews,
    completenessScore,
    missingItems,
    website: bestData.website || bestData.links?.website,
    phoneNumber: bestData.phone,
    address: bestData.address,
    hours: bestData.hours ? [bestData.hours] : undefined,
  };
}

function analyzeSentiment(text: string): "positive" | "neutral" | "negative" {
  if (!text) return "neutral";
  const positiveWords = ["excelente", "bueno", "gran", "mejor", "perfecto", "encantado", "recomendado"];
  const negativeWords = ["mal", "malo", "peor", "terrible", "sucio", "caro", "evitar"];

  const lowerText = text.toLowerCase();
  let score = 0;

  positiveWords.forEach((word) => {
    if (lowerText.includes(word)) score++;
  });
  negativeWords.forEach((word) => {
    if (lowerText.includes(word)) score--;
  });

  if (score > 0) return "positive";
  if (score < 0) return "negative";
  return "neutral";
}

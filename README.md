# v0 Local Business Visibility Tool - v2

Herramienta profesional de auditoría de visibilidad local que integra datos reales de Google Business Profile y SerpAPI para analizar el impacto de la IA y el posicionamiento local.

## Características de la v2

- **Datos Reales:** Integración con Google Places API (New) y SerpAPI.
- **Auditoría de GBP:** Análisis de completitud de la ficha (fotos, reseñas, horarios, etc.).
- **Impacto de IA:** Seguimiento de menciones en AI Overviews (SGE) de Google.
- **Benchmark de Competencia:** Comparativa con los 5 competidores principales en el Map Pack.
- **Plan de Acción:** Recomendaciones inteligentes priorizadas por impacto y esfuerzo.
- **Caché Robusta:** Integración con Upstash Redis para optimizar costes de API.

## Configuración

Copia el archivo `.env.example` a `.env.local` y completa las siguientes variables:

```env
SERPAPI_KEY=tu_clave_de_serpapi
GOOGLE_PLACES_API_KEY=tu_clave_de_google_places
UPSTASH_REDIS_REST_URL=tu_url_de_upstash
UPSTASH_REDIS_REST_TOKEN=tu_token_de_upstash
```

## Instalación

```bash
npm install
npm run dev
```

## Arquitectura

- **Frontend:** Next.js (App Router), Tailwind CSS, shadcn/ui.
- **Backend:** Next.js Server Actions & API Routes.
- **Data:** SerpAPI (Google Search), Google Places API (Business Data).
- **Cache:** Upstash Redis.

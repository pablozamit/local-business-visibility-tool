# v0 Local Business Visibility Tool - v3-complete

Herramienta profesional de nivel agencia para auditoría de visibilidad local que integra datos oficiales de Google Business Profile y SerpAPI para analizar el impacto de la IA y el posicionamiento local.

## Características de la v3

- **Modo Único Completo:** Funcionamiento exclusivo con datos oficiales para máxima precisión.
- **Datos Reales:** Integración obligatoria con Google Places API (New) y SerpAPI.
- **Reporte Rediseñado:** Informe PDF profesional con 8 secciones estratégicas.
- **Logging Profesional:** Sistema de logs exhaustivo con Pino para monitoreo en producción.
- **Auditoría de GBP:** Análisis profundo de completitud de la ficha (fotos, reseñas, horarios, etc.).
- **Impacto de IA:** Seguimiento detallado de menciones en AI Overviews (SGE) de Google.
- **Benchmark de Competencia:** Comparativa avanzada con competidores principales.
- **Plan de Acción:** Recomendaciones inteligentes priorizadas por impacto y esfuerzo.
- **Caché Robusta:** Integración con Upstash Redis para optimizar costes de API.

## Configuración

Copia el archivo `.env.example` a `.env.local`. Esta herramienta requiere configuración completa para funcionar:

### Requisitos Obligatorios
La herramienta funciona exclusivamente en modo completo con ambas claves:
```env
SERPAPI_KEY=tu_clave_de_serpapi
GOOGLE_PLACES_API_KEY=tu_clave_de_google_places
```

### 3. Modo Optimizado (Producción)
Añade Upstash Redis para que los informes se guarden durante 14 días y no gastes créditos de API en consultas repetidas.
```env
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

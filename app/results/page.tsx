import { generateReport } from "@/lib/actions"
import { ResultsDashboard } from "@/components/results-dashboard"
import { ReportView } from "@/components/report-view"
import { AlertCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function Page(props: {
  searchParams: Promise<{ 
    name?: string; 
    location?: string; 
    category?: string; 
    gbpUrl?: string; 
    placeId?: string;
    countryCode?: string;
    languageCode?: string;
  }>
}) {
  const searchParams = await props.searchParams;

  // Extraemos los campos básicos
  const name = searchParams.name || ""
  const location = searchParams.location || ""
  const category = searchParams.category || ""
  const gbpUrl = searchParams.gbpUrl || ""
  const placeId = searchParams.placeId || ""
  
  // NUEVO: Recogemos el país e idioma de la URL (o valores por defecto)
  const countryCode = searchParams.countryCode || "es"
  const languageCode = searchParams.languageCode || "es"

  if (!name || !location || !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-slate-50">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-slate-900">Faltan datos</h2>
        <p className="text-slate-600 max-w-md">
          Por favor, vuelve al inicio y completa todos los campos requeridos.
        </p>
        <Link href="/" className="mt-6 text-blue-600 font-bold flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
        </Link>
      </div>
    )
  }

  // Creamos el objeto de negocio incluyendo la localización internacional
  const business = { 
    name, 
    location, 
    category, 
    gbpUrl, 
    placeId, 
    countryCode, 
    languageCode 
  }

  try {
    const report = await generateReport(business)

    return (
      <div className="min-h-screen bg-slate-50">
        <div className="container py-10 max-w-5xl mx-auto space-y-8 px-4 text-left">
          <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 pb-8 gap-4">
            <div>
              <Link href="/" className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1 mb-4 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-3 w-3" /> Nueva Auditoría
              </Link>
              <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 uppercase">
                Reporte de Visibilidad Profesional
              </h1>
              <p className="text-lg text-slate-600 font-medium">
                Analizando: <span className="text-blue-600">{business.name}</span> • {business.location} ({business.countryCode.toUpperCase()})
              </p>
            </div>
            <div className="flex items-center gap-2">
               <div className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black uppercase">v2 Actualizado</div>
            </div>
          </div>

          <ResultsDashboard report={report} />

          <div className="pt-10">
            <h3 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-tight">Análisis Detallado</h3>
            <ReportView report={report} />
          </div>
        </div>
      </div>
    )
  } catch (error: any) {
    console.error(error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-slate-50">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Error en la Auditoría</h2>
        <p className="text-slate-600">No hemos podido completar el análisis real. Verifica que tus claves de API (SerpAPI y Google Places) estén configuradas correctamente en el archivo .env</p>
        <p className="text-xs text-slate-400 mt-4 font-mono">{error.message}</p>
        <Link href="/" className="mt-8 px-6 py-2 bg-slate-900 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors">
          Intentar de nuevo
        </Link>
      </div>
    )
  }
}

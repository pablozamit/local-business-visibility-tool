import { generateReport } from "@/lib/actions"
import { ResultsDashboard } from "@/components/results-dashboard"
import { AlertCircle } from "lucide-react"

export const dynamic = "force-dynamic"

// NOTA: Abbiamo aggiunto 'Promise' nella definizione del tipo
export default async function Page(props: {
  searchParams: Promise<{ name?: string; location?: string; category?: string }>
}) {
  // QUESTA È LA RIGA CHIAVE: dobbiamo usare 'await'
  const searchParams = await props.searchParams;

  const name = searchParams.name || ""
  const location = searchParams.location || ""
  const category = searchParams.category || ""

  if (!name || !location || !category) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 bg-slate-50">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2 text-slate-900">Dati mancanti</h2>
      <p className="text-slate-600 max-w-md">
      Torna alla Home e completa tutti i campi.
      </p>
      </div>
    )
  }

  const business = { name, location, category }

  try {
    const report = await generateReport(business)

    return (
      <div className="min-h-screen bg-slate-50">
      <div className="container py-10 max-w-5xl mx-auto space-y-8 px-4 text-left">
      <div className="border-b border-slate-200 pb-8">
      <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2 uppercase">
      Report Visibilità AI
      </h1>
      <p className="text-lg text-slate-600 font-medium">
      Analisi per: <span className="text-blue-600">{business.name}</span> • {business.location}
      </p>
      </div>

      <ResultsDashboard report={report} />
      </div>
      </div>
    )
  } catch (error) {
    console.error(error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
      <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Errore API</h2>
      <p className="text-slate-600">C'è stato un problema con la chiamata a SerpApi.</p>
      </div>
    )
  }
}

"use client"

import { BusinessForm } from "@/components/business-form"
import { BarChart3, Globe, MapPin, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handleSearch = (data: { name: string; location: string; category: string; gbpUrl?: string }) => {
    const params = new URLSearchParams(data as any)
    router.push(`/results?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div className="space-y-8">
            <div className="space-y-4 text-left">
              <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
                Auditoría de Visibilidad <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">IA y Local</span>
              </h1>
              <p className="text-xl text-slate-600 max-w-[600px]">
                Descubre cómo las nuevas AI Overviews de Google están afectando a tu negocio.
                No dejes que tu competencia te eclipse en los resultados reales.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex gap-4 items-start text-left">
                <div className="mt-1 bg-blue-50 p-2 rounded-lg shadow-sm shrink-0">
                  <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">Impacto IA</h3>
                  <p className="text-sm text-slate-500 text-left">Medimos cuánto espacio te quita la inteligencia artificial de Google.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start text-left">
                <div className="mt-1 bg-blue-50 p-2 rounded-lg shadow-sm shrink-0">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">Map Pack Profesional</h3>
                  <p className="text-sm text-slate-500 text-left">Verifica tu posición exacta y compárate con tus competidores.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start text-left">
                <div className="mt-1 bg-blue-50 p-2 rounded-lg shadow-sm shrink-0">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">Estado del GBP</h3>
                  <p className="text-sm text-slate-500 text-left">Analizamos la completitud de tu ficha de Google Business Profile.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start text-left">
                <div className="mt-1 bg-blue-50 p-2 rounded-lg shadow-sm shrink-0">
                  <Globe className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-bold">Plan de Acción</h3>
                  <p className="text-sm text-slate-500 text-left">Acciones concretas priorizadas para mejorar tu visibilidad hoy mismo.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-2xl font-bold mb-6 text-center text-slate-900">Generar Auditoría Profesional</h2>
            <BusinessForm onSubmit={handleSearch} isLoading={false} />
            <p className="mt-6 text-[10px] text-center text-slate-400 uppercase tracking-wider">
              Datos en tiempo real vía Google Places & SerpApi • v2 2026
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

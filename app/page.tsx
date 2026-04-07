"use client"

import { BusinessForm } from "@/components/business-form"
import { BarChart3, Globe, MapPin, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handleSearch = (data: { name: string; location: string; category: string }) => {
    const params = new URLSearchParams(data)
    router.push(`/results?${params.toString()}`)
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
    <div className="container mx-auto px-4 py-12 md:py-24">
    <div className="grid gap-12 lg:grid-cols-2 items-center">
    <div className="space-y-8">
    <div className="space-y-4">
    <h1 className="text-4xl font-extrabold tracking-tight lg:text-6xl">
    Analisi Visibilità <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">AI & Local</span>
    </h1>
    <p className="text-xl text-slate-600 max-w-[600px]">
    Scopri come le nuove AI Overviews di Google stanno influenzando il tuo business a Milano.
    Non farti oscurare dai tuoi concorrenti.
    </p>
    </div>

    <div className="grid gap-6 sm:grid-cols-2">
    <div className="flex gap-4 items-start text-left">
    <div className="mt-1 bg-blue-50 p-2 rounded-lg shadow-sm shrink-0">
    <Zap className="h-5 w-5 text-blue-600" />
    </div>
    <div>
    <h3 className="font-bold">Impatto AI</h3>
    <p className="text-sm text-slate-500 text-left">Misuriamo quanto spazio ti toglie l'intelligenza artificiale di Google.</p>
    </div>
    </div>
    <div className="flex gap-4 items-start text-left">
    <div className="mt-1 bg-blue-50 p-2 rounded-lg shadow-sm shrink-0">
    <MapPin className="h-5 w-5 text-blue-600" />
    </div>
    <div>
    <h3 className="font-bold">Local Pack</h3>
    <p className="text-sm text-slate-500 text-left">Verifica la tua posizione reale sulle mappe di Milano.</p>
    </div>
    </div>
    <div className="flex gap-4 items-start text-left">
    <div className="mt-1 bg-blue-50 p-2 rounded-lg shadow-sm shrink-0">
    <BarChart3 className="h-5 w-5 text-blue-600" />
    </div>
    <div>
    <h3 className="font-bold">Report SEO</h3>
    <p className="text-sm text-slate-500 text-left">Analisi tecnica basata su dati reali di SerpApi.</p>
    </div>
    </div>
    <div className="flex gap-4 items-start text-left">
    <div className="mt-1 bg-blue-50 p-2 rounded-lg shadow-sm shrink-0">
    <Globe className="h-5 w-5 text-blue-600" />
    </div>
    <div>
    <h3 className="font-bold">Analisi Keyword</h3>
    <p className="text-sm text-slate-500 text-left">Testiamo diverse intenzioni di ricerca per ogni report.</p>
    </div>
    </div>
    </div>
    </div>

    <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
    <h2 className="text-2xl font-bold mb-6 text-center">Genera Report Professionale</h2>
    <BusinessForm onSubmit={handleSearch} isLoading={false} />
    <p className="mt-6 text-[10px] text-center text-slate-400 uppercase tracking-wider">
    Dati in tempo reale via SerpApi • 2026 AI Local Audit
    </p>
    </div>
    </div>
    </div>
    </main>
  )
}

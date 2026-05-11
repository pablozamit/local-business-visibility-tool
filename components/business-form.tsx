"use client"

import { useState } from "react"
import { MapPin, Building2, Loader2, Target, Link as LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { BusinessInput } from "@/lib/types"

const CATEGORIES = [
  "dentista",
  "abogado",
  "veterinario",
  "clínica estética",
  "gestoría",
  "restaurante",
  "arquitecto",
  "gimnasio",
  "farmacia",
  "fontanero",
  "cerrajero"
]

interface BusinessFormProps {
  onSubmit: (data: BusinessInput) => void
  isLoading: boolean
}

export function BusinessForm({ onSubmit, isLoading }: BusinessFormProps) {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const [gbpUrl, setGbpUrl] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !location.trim() || !category) return
    onSubmit({
      name: name.trim(),
      location: location.trim(),
      category,
      gbpUrl: gbpUrl.trim() || undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-1 text-left">
      {/* Nombre Actividad */}
      <div className="flex flex-col gap-1.5 text-left">
        <Label htmlFor="name" className="text-[13px] font-bold text-slate-900 ml-1">
          Nombre del negocio
        </Label>
        <div className="relative group">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="name"
            placeholder="Ej: Clínica Dental Martínez"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="pl-10 bg-white border-slate-200 border-[1.5px] text-slate-950 placeholder:text-slate-400 h-11 text-sm rounded-lg focus:border-blue-600 focus:ring-0 transition-all"
            required
          />
        </div>
      </div>

      {/* Localidad */}
      <div className="flex flex-col gap-1.5 text-left">
        <Label htmlFor="location" className="text-[13px] font-bold text-slate-900 ml-1">
          Localidad (Ciudad o Zona)
        </Label>
        <div className="relative group">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="location"
            placeholder="Ej: Madrid, Salamanca"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="pl-10 bg-white border-slate-200 border-[1.5px] text-slate-950 placeholder:text-slate-400 h-11 text-sm rounded-lg focus:border-blue-600 focus:ring-0 transition-all"
            required
          />
        </div>
      </div>

      {/* Sector */}
      <div className="flex flex-col gap-1.5 text-left">
        <Label htmlFor="category" className="text-[13px] font-bold text-slate-900 ml-1">
          Sector Profesional
        </Label>
        <Select value={category} onValueChange={setCategory} required>
          <SelectTrigger id="category" className="bg-white border-slate-200 border-[1.5px] text-slate-950 h-11 rounded-lg text-sm">
            <SelectValue placeholder="Elige tu sector" />
          </SelectTrigger>
          <SelectContent className="bg-white border-slate-200">
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat} className="capitalize text-slate-950 text-sm">
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* URL de Google Business Profile (Opcional) */}
      <div className="flex flex-col gap-1.5 text-left">
        <Label htmlFor="gbpUrl" className="text-[13px] font-bold text-slate-900 ml-1">
          URL de Google Business Profile (Opcional)
        </Label>
        <div className="relative group">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="gbpUrl"
            placeholder="https://maps.google.com/..."
            value={gbpUrl}
            onChange={(e) => setGbpUrl(e.target.value)}
            className="pl-10 bg-white border-slate-200 border-[1.5px] text-slate-950 placeholder:text-slate-400 h-11 text-sm rounded-lg focus:border-blue-600 focus:ring-0 transition-all"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isLoading || !name.trim() || !location.trim() || !category}
        className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold h-12 text-sm rounded-lg transition-all duration-200 shadow-md active:scale-[0.98] mt-2 gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Analizando datos reales...
          </>
        ) : (
          <>
            <Target className="h-4 w-4" />
            Iniciar Auditoría Profesional
          </>
        )}
      </Button>
    </form>
  )
}

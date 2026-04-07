"use client"

import { useState } from "react"
import { MapPin, Building2, Loader2, Target } from "lucide-react"
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
"studio legale",
"veterinario",
"clinica estetica",
"commercialista",
"ristorante",
"architetto",
"palestra",
"farmacia",
]

interface BusinessFormProps {
  onSubmit: (data: BusinessInput) => void
  isLoading: boolean
}

export function BusinessForm({ onSubmit, isLoading }: BusinessFormProps) {
  const [name, setName] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !location.trim() || !category) return
      onSubmit({ name: name.trim(), location: location.trim(), category })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-1 text-left">
    {/* Nome Attività */}
    <div className="flex flex-col gap-1.5 text-left">
    <Label htmlFor="name" className="text-[13px] font-bold text-slate-900 ml-1">
    Nome dell'attività
    </Label>
    <div className="relative group">
    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
    <Input
    id="name"
    placeholder="Es: Studio Medico Rossi"
    value={name}
    onChange={(e) => setName(e.target.value)}
    className="pl-10 bg-white border-slate-200 border-[1.5px] text-slate-950 placeholder:text-slate-400 h-11 text-sm rounded-lg focus:border-blue-600 focus:ring-0 transition-all"
    required
    />
    </div>
    </div>

    {/* Località */}
    <div className="flex flex-col gap-1.5 text-left">
    <Label htmlFor="location" className="text-[13px] font-bold text-slate-900 ml-1">
    Località (Città o Zona)
    </Label>
    <div className="relative group">
    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
    <Input
    id="location"
    placeholder="Es: Milano, Brera"
    value={location}
    onChange={(e) => setLocation(e.target.value)}
    className="pl-10 bg-white border-slate-200 border-[1.5px] text-slate-950 placeholder:text-slate-400 h-11 text-sm rounded-lg focus:border-blue-600 focus:ring-0 transition-all"
    required
    />
    </div>
    </div>

    {/* Settore */}
    <div className="flex flex-col gap-1.5 text-left">
    <Label htmlFor="category" className="text-[13px] font-bold text-slate-900 ml-1">
    Settore Professionale
    </Label>
    <Select value={category} onValueChange={setCategory} required>
    <SelectTrigger id="category" className="bg-white border-slate-200 border-[1.5px] text-slate-950 h-11 rounded-lg text-sm">
    <SelectValue placeholder="Scegli il tuo settore" />
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

    {/* Bottone - Potente ma Sottile */}
    <Button
    type="submit"
    disabled={isLoading || !name.trim() || !location.trim() || !category}
    className="w-full bg-slate-900 hover:bg-blue-600 text-white font-bold h-12 text-sm rounded-lg transition-all duration-200 shadow-md active:scale-[0.98] mt-2 gap-2"
    >
    {isLoading ? (
      <>
      <Loader2 className="h-4 w-4 animate-spin" />
      Analisi in corso...
      </>
    ) : (
      <>
      <Target className="h-4 w-4" />
      Avvia Audit Visibilità
      </>
    )}
    </Button>
    </form>
  )
}

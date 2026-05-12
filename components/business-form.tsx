"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Loader2, Globe, Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  location: z.string().min(2, {
    message: "La ubicación debe tener al menos 2 caracteres.",
  }),
  category: z.string().min(2, {
    message: "La categoría debe tener al menos 2 caracteres.",
  }),
  gbpUrl: z.string().optional(),
  countryCode: z.string().min(2).default("es"),
  languageCode: z.string().min(2).default("es"),
})

export function BusinessForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      location: "",
      category: "",
      gbpUrl: "",
      countryCode: "es",
      languageCode: "es",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const params = new URLSearchParams({
      name: values.name,
      location: values.location,
      category: values.category,
      countryCode: values.countryCode,
      languageCode: values.languageCode,
    })
    if (values.gbpUrl) params.append("gbpUrl", values.gbpUrl)
    
    router.push(`/results?${params.toString()}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Negocio</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Floral Architect Milano" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría Principal</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: fiorerie" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ciudad / Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Ej: Milano" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-muted/30">
          <FormField
            control={form.control}
            name="countryCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Globe className="w-4 h-4" /> País de búsqueda
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un país" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="es">España (.es)</SelectItem>
                    <SelectItem value="it">Italia (.it)</SelectItem>
                    <SelectItem value="us">Estados Unidos (.com)</SelectItem>
                    <SelectItem value="mx">México (.com.mx)</SelectItem>
                    <SelectItem value="co">Colombia (.com.co)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="languageCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2">
                  <Languages className="w-4 h-4" /> Idioma de búsqueda
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un idioma" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="it">Italiano</SelectItem>
                    <SelectItem value="en">Inglés</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gbpUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de Google Maps (Opcional)</FormLabel>
              <FormControl>
                <Input placeholder="https://www.google.com/maps/place/..." {...field} />
              </FormControl>
              <FormDescription>
                Ayuda a identificar tu ficha exacta más rápido.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generando Auditoría Profesional...
            </>
          ) : (
            "Analizar Visibilidad Local & AI"
          )}
        </Button>
      </form>
    </Form>
  )
}

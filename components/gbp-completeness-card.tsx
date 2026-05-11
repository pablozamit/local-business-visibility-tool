"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Camera, Clock, Globe, Phone, Info } from "lucide-react"
import { GBPData } from "@/lib/types"

interface GBPCompletenessCardProps {
  data: GBPData
}

export function GBPCompletenessCard({ data }: GBPCompletenessCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Estado de tu Perfil de Google
          </CardTitle>
          <Badge variant={data.completenessScore > 80 ? "default" : data.completenessScore > 50 ? "secondary" : "destructive"}>
            Score: {data.completenessScore}/100
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">Completitud del perfil</span>
            <span className="text-slate-900 font-bold">{data.completenessScore}%</span>
          </div>
          <Progress value={data.completenessScore} className="h-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Checklist Visual</h4>
            <div className="space-y-2">
              <StatusItem icon={<Camera className="h-4 w-4" />} label="Fotos (30+)" value={data.photosCount} total={30} />
              <StatusItem icon={<Clock className="h-4 w-4" />} label="Horarios" active={!!data.hours} />
              <StatusItem icon={<Globe className="h-4 w-4" />} label="Sitio Web" active={!!data.website} />
              <StatusItem icon={<Phone className="h-4 w-4" />} label="Teléfono" active={!!data.phoneNumber} />
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-red-600">Qué añadir esta semana</h4>
            <div className="space-y-2">
              {data.missingItems.length > 0 ? (
                data.missingItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-red-50 rounded-md border border-red-100">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-700">{item.label}</p>
                      <Badge variant="outline" className="text-[10px] h-4 bg-white text-red-600 border-red-200 mt-1">
                        Impacto {item.impact === 'high' ? 'Alto' : item.impact === 'medium' ? 'Medio' : 'Bajo'}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-md border border-green-100">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <p className="text-sm font-medium text-green-700">¡Tu perfil está excelente!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatusItem({ icon, label, value, total, active }: { icon: React.ReactNode, label: string, value?: number, total?: number, active?: boolean }) {
  const isComplete = active !== undefined ? active : (value !== undefined && total !== undefined ? value >= total : false);

  return (
    <div className="flex items-center justify-between text-sm p-1.5 rounded-md hover:bg-slate-50 transition-colors">
      <div className="flex items-center gap-2 text-slate-700">
        <span className="text-slate-400">{icon}</span>
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-1.5">
        {value !== undefined && total !== undefined && (
          <span className="text-xs font-medium text-slate-500 mr-1">{value}/{total}</span>
        )}
        {isComplete ? (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        ) : (
          <AlertCircle className="h-4 w-4 text-slate-300" />
        )}
      </div>
    </div>
  )
}

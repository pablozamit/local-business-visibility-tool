"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GBPData } from "@/lib/types"
import { Star, MessageSquare, ThumbsUp, ThumbsDown, Minus } from "lucide-react"

interface ReviewsAnalysisProps {
  gbpData: GBPData
}

export function ReviewsAnalysis({ gbpData }: ReviewsAnalysisProps) {
  const { rating, userRatingsTotal, reviews } = gbpData;

  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
        <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
          Análisis de Reseñas
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-4xl font-black text-slate-900">{rating}</span>
            <div className="flex gap-0.5 my-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${s <= Math.round(rating) ? 'text-orange-400 fill-orange-400' : 'text-slate-300'}`} />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Rating Promedio</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-4xl font-black text-slate-900">{userRatingsTotal}</span>
            <MessageSquare className="h-4 w-4 text-blue-500 my-1.5" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-tighter">Total Reseñas</span>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-700 leading-tight">Impacto en Visibilidad</p>
              <p className="text-[10px] text-slate-500 mt-1">Estimación basada en el sector</p>
              <Badge variant={rating >= 4.5 ? "default" : "destructive"} className="mt-2">
                {rating >= 4.5 ? "+12 puntos" : "-8 puntos"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Reseñas Recientes y Sentimiento</h4>
          <div className="space-y-3">
            {reviews.slice(0, 5).map((review, i) => (
              <div key={i} className="p-3 bg-white border border-slate-100 rounded-lg shadow-sm hover:border-slate-300 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-slate-900">{review.authorName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400">{review.time}</span>
                    <SentimentBadge sentiment={review.sentiment} />
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className={`h-2.5 w-2.5 ${s <= review.rating ? 'text-orange-400 fill-orange-400' : 'text-slate-200'}`} />
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic line-clamp-2">"{review.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function SentimentBadge({ sentiment }: { sentiment?: 'positive' | 'neutral' | 'negative' }) {
  switch (sentiment) {
    case 'positive':
      return <ThumbsUp className="h-3 w-3 text-green-500" />;
    case 'negative':
      return <ThumbsDown className="h-3 w-3 text-red-500" />;
    default:
      return <Minus className="h-3 w-3 text-slate-300" />;
  }
}

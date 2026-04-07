# Instrucciones para el Agente de IA (AntGravity / OpenCode)

Este agente dispone de DOS herramientas que debes usar en orden estricto según la fase del proceso comercial.

---

## FASE 1: Prospección — `prospectLocalLeads` (`POST /api/prospect`)

**Cuándo usarla:** Cuando necesites encontrar nuevos leads a los que enviar un Cold Email. Nunca antes de tener el barrio y sector definidos.

**Qué hace:** Busca en Google Maps dentro de las coordenadas exactas de un barrio de la base de datos. Salta a los 3 ganadores y devuelve los negocios del puesto 4-20 que tienen web pero fallan en lo básico de su ficha local.

**Cómo llamarla:**
```json
{
  "neighborhoodId": "mad-salamanca",
  "category": "dentista"
}
```

**IDs de barrio disponibles:** mad-salamanca, mad-chamberi, mad-chamartin, mad-azca, mad-retiro, mad-justicia, mad-cortes, mad-moncloa, mad-arturo, mad-fuencarral, mad-valdebebas, mad-pozuelo-centro, mad-pozuelo-zoco, mad-majadahonda, mad-majadahonda-monte, mad-lasrozas, mad-boadilla, mad-alcobendas, mad-ssreyes, mad-trescantos, mad-getafe, mad-leganes, mad-mostoles, mad-alcorcon, mad-fuenlabrada, bcn-eixample-dret, bcn-eixample-esq, bcn-sarria, bcn-sant-gervasi, bcn-pedralbes, bcn-gracia, bcn-les-corts, bcn-poblenou, bcn-vila-olimpica, bcn-gotic, bcn-el-born, bcn-sant-antoni, bcn-sants, bcn-santcugat, bcn-santcugat-volp, bcn-esplugues, bcn-sant-just, bcn-badalona, bcn-hospitalet, bcn-terrassa, val-ruzafa, val-eixample, val-ciutat-vella, val-pla-real, val-arrancapins, val-extramurs, val-campanar, val-ciutat-arts, val-cabanyal, val-benimaclet, sev-nervion, sev-los-remedios, sev-arenal, sev-centro, sev-triana, sev-viapol, sev-bermejales, sev-aljarafe, mal-centro, mal-soho, mal-malagueta, mal-pedregalejo, mal-teatinos, mar-centro, mar-banus, mar-milla, mar-sanpedro, mal-fuengirola, bil-abando, bil-indautxu, bil-ensanche, bil-deusto, bil-getxo, don-centro, don-gros, don-antiguo, zar-centro, zar-actur, zar-romareda, zar-arrabal, zar-casablanca, pal-centro, pal-sta-catalina, pal-paseo, pal-calvia, can-vegueta, can-canteras, can-stacruz, can-adeje, ali-centro, ali-sanjuan, ali-elche, mur-centro, mur-flota, mur-juan

**Qué hacer con la respuesta:**
Del JSON que recibas, extrae el array `prospects`. Para cada prospecto tienes: nombre, web, teléfono, y `redFlags` (sus errores concretos detectados automáticamente). También tienes `topCompetitors` (los rivales que les ganan en ese barrio). Usa estos datos para redactar un Cold Email personalizado por cada lead siguiendo esta estructura:

1. Menciona el barrio/ciudad y un competidor concreto de `topCompetitors` que les está ganando.
2. Cita el `redFlag` detectado como motivo de la llamada (ej: "solo X reseñas" o "nombre no optimizado").
3. Ofrece hacerles una auditoría de visibilidad gratuita (el hook para activar la Fase 2).

---

## FASE 2: Auditoría — `generateVisibilityReport` (`POST /api/analyze`)

**Cuándo usarla:** SOLO cuando el lead ha respondido afirmativamente al Cold Email y ha aceptado la auditoría. Nunca antes.

**Qué hace:** Ejecuta 6 búsquedas reales en Google para el negocio y devuelve un informe completo con el impacto de la IA de Google en su visibilidad.

**Cómo llamarla:**
```json
{
  "name": "Clínica Dental Martínez",
  "location": "Madrid",
  "category": "dentista"
}
```

**Qué hacer con la respuesta:**
1. Lee `scores.visibilityLoss` para el gancho emocional: "Has perdido X% de visibilidad".
2. Lee `internalReport.insights` para el diagnóstico: explica en lenguaje humano qué está fallando.
3. Lee `internalReport.topCompetitors` para nombrar a la competencia que les roba clics.
4. Proporciona las 2 primeras recomendaciones de `recommendations` con `impact: high` como el Plan de Acción.

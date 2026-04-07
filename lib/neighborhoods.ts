export interface Neighborhood {
  id: string
  city: string
  name: string
  tier: "Premium" | "Business" | "High-Density"
  coordinates: string // Format required by SerpAPI: @lat,lng,zoom
}

export const TARGET_NEIGHBORHOODS: Neighborhood[] = [
  // --- MADRID & SURROUNDINGS (25) ---
  { id: "mad-salamanca", city: "Madrid", name: "Barrio de Salamanca", tier: "Premium", coordinates: "@40.4294,-3.6865,15z" },
  { id: "mad-chamberi", city: "Madrid", name: "Chamberí / Almagro", tier: "Premium", coordinates: "@40.4355,-3.7024,15z" },
  { id: "mad-chamartin", city: "Madrid", name: "Chamartín / El Viso", tier: "Business", coordinates: "@40.4578,-3.6826,15z" },
  { id: "mad-azca", city: "Madrid", name: "AZCA / Bernabéu", tier: "Business", coordinates: "@40.4513,-3.6934,16z" },
  { id: "mad-retiro", city: "Madrid", name: "Retiro / Ibiza", tier: "Premium", coordinates: "@40.4137,-3.6766,15z" },
  { id: "mad-justicia", city: "Madrid", name: "Justicia / Chueca", tier: "High-Density", coordinates: "@40.4243,-3.6974,16z" },
  { id: "mad-cortes", city: "Madrid", name: "Cortes / Huertas", tier: "High-Density", coordinates: "@40.4146,-3.6975,16z" },
  { id: "mad-moncloa", city: "Madrid", name: "Moncloa / Argüelles", tier: "High-Density", coordinates: "@40.4326,-3.7174,15z" },
  { id: "mad-arturo", city: "Madrid", name: "Arturo Soria", tier: "Premium", coordinates: "@40.4545,-3.6559,15z" },
  { id: "mad-fuencarral", city: "Madrid", name: "Fuencarral / Mirasierra", tier: "Premium", coordinates: "@40.4905,-3.7063,15z" },
  { id: "mad-valdebebas", city: "Madrid", name: "Valdebebas / Sanchinarro", tier: "Premium", coordinates: "@40.4856,-3.6272,14z" },
  { id: "mad-pozuelo-centro", city: "Pozuelo de Alarcón", name: "Pozuelo Centro / Avenida de Europa", tier: "Premium", coordinates: "@40.4347,-3.8143,15z" },
  { id: "mad-pozuelo-zoco", city: "Pozuelo de Alarcón", name: "Zoco de Pozuelo", tier: "Premium", coordinates: "@40.4431,-3.8016,16z" },
  { id: "mad-majadahonda", city: "Majadahonda", name: "Majadahonda Centro", tier: "Premium", coordinates: "@40.4727,-3.8724,15z" },
  { id: "mad-majadahonda-monte", city: "Majadahonda", name: "Monte del Pilar", tier: "Premium", coordinates: "@40.4636,-3.8569,15z" },
  { id: "mad-lasrozas", city: "Las Rozas", name: "Las Rozas Centro / Európolis", tier: "Premium", coordinates: "@40.4925,-3.8741,14z" },
  { id: "mad-boadilla", city: "Boadilla del Monte", name: "Boadilla Centro / Sector B", tier: "Premium", coordinates: "@40.4072,-3.8756,14z" },
  { id: "mad-alcobendas", city: "Alcobendas", name: "Alcobendas / La Moraleja", tier: "Premium", coordinates: "@40.5186,-3.6457,14z" },
  { id: "mad-ssreyes", city: "San Sebastián de los Reyes", name: "Dehesa Vieja", tier: "High-Density", coordinates: "@40.5516,-3.6163,15z" },
  { id: "mad-trescantos", city: "Tres Cantos", name: "Tres Cantos Centro", tier: "Business", coordinates: "@40.6033,-3.7061,14z" },
  { id: "mad-getafe", city: "Getafe", name: "Getafe Norte / Sector 3", tier: "High-Density", coordinates: "@40.3235,-3.7317,14z" },
  { id: "mad-leganes", city: "Leganés", name: "Zarzaquemada", tier: "High-Density", coordinates: "@40.3340,-3.7554,14z" },
  { id: "mad-mostoles", city: "Móstoles", name: "PAU 4 / Móstoles Sur", tier: "High-Density", coordinates: "@40.3094,-3.8643,15z" },
  { id: "mad-alcorcon", city: "Alcorcón", name: "Ensanche Sur", tier: "High-Density", coordinates: "@40.3333,-3.8333,15z" },
  { id: "mad-fuenlabrada", city: "Fuenlabrada", name: "Loranca", tier: "High-Density", coordinates: "@40.3054,-3.8166,15z" },

  // --- BARCELONA & SURROUNDINGS (20) ---
  { id: "bcn-eixample-dret", city: "Barcelona", name: "L'Eixample Dreta / Passeig de Gràcia", tier: "Business", coordinates: "@41.3934,2.1691,15z" },
  { id: "bcn-eixample-esq", city: "Barcelona", name: "L'Eixample Esquerra", tier: "High-Density", coordinates: "@41.3851,2.1537,15z" },
  { id: "bcn-sarria", city: "Barcelona", name: "Sarrià", tier: "Premium", coordinates: "@41.4011,2.1332,15z" },
  { id: "bcn-sant-gervasi", city: "Barcelona", name: "Sant Gervasi - Galvany", tier: "Premium", coordinates: "@41.3985,2.1422,15z" },
  { id: "bcn-pedralbes", city: "Barcelona", name: "Pedralbes / Zona Alta", tier: "Premium", coordinates: "@41.3929,2.1097,15z" },
  { id: "bcn-gracia", city: "Barcelona", name: "Vila de Gràcia", tier: "High-Density", coordinates: "@41.4035,2.1557,15z" },
  { id: "bcn-les-corts", city: "Barcelona", name: "Les Corts", tier: "Business", coordinates: "@41.3855,2.1326,15z" },
  { id: "bcn-poblenou", city: "Barcelona", name: "El Poblenou / 22@", tier: "Business", coordinates: "@41.3995,2.1994,15z" },
  { id: "bcn-vila-olimpica", city: "Barcelona", name: "La Vila Olímpica", tier: "Premium", coordinates: "@41.3911,2.1969,15z" },
  { id: "bcn-gotic", city: "Barcelona", name: "Barri Gòtic", tier: "High-Density", coordinates: "@41.3828,2.1769,16z" },
  { id: "bcn-el-born", city: "Barcelona", name: "El Born", tier: "High-Density", coordinates: "@41.3854,2.1824,16z" },
  { id: "bcn-sant-antoni", city: "Barcelona", name: "Sant Antoni", tier: "High-Density", coordinates: "@41.3780,2.1584,15z" },
  { id: "bcn-sants", city: "Barcelona", name: "Sants", tier: "High-Density", coordinates: "@41.3768,2.1362,15z" },
  { id: "bcn-santcugat", city: "Sant Cugat del Vallès", name: "Sant Cugat Centro", tier: "Premium", coordinates: "@41.4722,2.0869,14z" },
  { id: "bcn-santcugat-volp", city: "Sant Cugat del Vallès", name: "Volpelleres / Coll Favà", tier: "Premium", coordinates: "@41.4813,2.0658,15z" },
  { id: "bcn-esplugues", city: "Esplugues de Llobregat", name: "Esplugues / Finestrelles", tier: "Premium", coordinates: "@41.3775,2.0877,15z" },
  { id: "bcn-sant-just", city: "Sant Just Desvern", name: "Sant Just Centro", tier: "Premium", coordinates: "@41.3854,2.0772,15z" },
  { id: "bcn-badalona", city: "Badalona", name: "Badalona Centro / Dalt la Vila", tier: "High-Density", coordinates: "@41.4502,2.2474,15z" },
  { id: "bcn-hospitalet", city: "L'Hospitalet", name: "Gran Via / Plaza Europa", tier: "Business", coordinates: "@41.3567,2.1246,15z" },
  { id: "bcn-terrassa", city: "Terrassa", name: "Terrassa Centro", tier: "High-Density", coordinates: "@41.5623,2.0121,14z" },

  // --- VALENCIA (10) ---
  { id: "val-ruzafa", city: "Valencia", name: "Ruzafa", tier: "High-Density", coordinates: "@39.4616,-0.3734,15z" },
  { id: "val-eixample", city: "Valencia", name: "L'Eixample / Colón", tier: "Premium", coordinates: "@39.4665,-0.3667,15z" },
  { id: "val-ciutat-vella", city: "Valencia", name: "Ciutat Vella / El Carmen", tier: "Business", coordinates: "@39.4731,-0.3783,15z" },
  { id: "val-pla-real", city: "Valencia", name: "Pla del Real / Alameda", tier: "Premium", coordinates: "@39.4756,-0.3614,15z" },
  { id: "val-arrancapins", city: "Valencia", name: "Arrancapins", tier: "High-Density", coordinates: "@39.4633,-0.3846,15z" },
  { id: "val-extramurs", city: "Valencia", name: "Extramurs", tier: "High-Density", coordinates: "@39.4716,-0.3888,15z" },
  { id: "val-campanar", city: "Valencia", name: "Campanar", tier: "Business", coordinates: "@39.4851,-0.3952,15z" },
  { id: "val-ciutat-arts", city: "Valencia", name: "Penya-Roja / Av. Francia", tier: "Premium", coordinates: "@39.4628,-0.3486,15z" },
  { id: "val-cabanyal", city: "Valencia", name: "El Cabanyal", tier: "High-Density", coordinates: "@39.4673,-0.3306,15z" },
  { id: "val-benimaclet", city: "Valencia", name: "Benimaclet", tier: "High-Density", coordinates: "@39.4857,-0.3637,15z" },

  // --- SEVILLA (8) ---
  { id: "sev-nervion", city: "Sevilla", name: "Nervión / Buhaira", tier: "Business", coordinates: "@37.3821,-5.9731,15z" },
  { id: "sev-los-remedios", city: "Sevilla", name: "Los Remedios / Asunción", tier: "Premium", coordinates: "@37.3755,-5.9984,15z" },
  { id: "sev-arenal", city: "Sevilla", name: "El Arenal", tier: "High-Density", coordinates: "@37.3853,-5.9961,15z" },
  { id: "sev-centro", city: "Sevilla", name: "Casco Antiguo / Alfalfa", tier: "High-Density", coordinates: "@37.3912,-5.9912,15z" },
  { id: "sev-triana", city: "Sevilla", name: "Triana", tier: "High-Density", coordinates: "@37.3828,-6.0022,15z" },
  { id: "sev-viapol", city: "Sevilla", name: "San Bernardo / Viapol", tier: "Business", coordinates: "@37.3771,-5.9786,16z" },
  { id: "sev-bermejales", city: "Sevilla", name: "Los Bermejales", tier: "High-Density", coordinates: "@37.3551,-5.9863,15z" },
  { id: "sev-aljarafe", city: "Mairena del Aljarafe", name: "Mairena Centro", tier: "Premium", coordinates: "@37.3468,-6.0645,14z" },

  // --- MÁLAGA & COSTA DEL SOL (10) ---
  { id: "mal-centro", city: "Málaga", name: "Centro Histórico", tier: "High-Density", coordinates: "@36.7196,-4.4200,15z" },
  { id: "mal-soho", city: "Málaga", name: "Soho", tier: "Business", coordinates: "@36.7153,-4.4223,16z" },
  { id: "mal-malagueta", city: "Málaga", name: "La Malagueta", tier: "Premium", coordinates: "@36.7206,-4.4087,15z" },
  { id: "mal-pedregalejo", city: "Málaga", name: "Pedregalejo / El Palo", tier: "Premium", coordinates: "@36.7214,-4.3756,15z" },
  { id: "mal-teatinos", city: "Málaga", name: "Teatinos", tier: "High-Density", coordinates: "@36.7188,-4.4719,14z" },
  { id: "mar-centro", city: "Marbella", name: "Marbella Centro", tier: "High-Density", coordinates: "@36.5100,-4.8824,15z" },
  { id: "mar-banus", city: "Marbella", name: "Puerto Banús / Nueva Andalucía", tier: "Premium", coordinates: "@36.4868,-4.9542,15z" },
  { id: "mar-milla", city: "Marbella", name: "Milla de Oro", tier: "Premium", coordinates: "@36.5029,-4.9123,15z" },
  { id: "mar-sanpedro", city: "Marbella", name: "San Pedro de Alcántara", tier: "High-Density", coordinates: "@36.4716,-4.9866,15z" },
  { id: "mal-fuengirola", city: "Fuenigrola", name: "Fuengirola Centro", tier: "High-Density", coordinates: "@36.5411,-4.6247,15z" },

  // --- PAÍS VASCO (8) ---
  { id: "bil-abando", city: "Bilbao", name: "Abando", tier: "Business", coordinates: "@43.2630,-2.9340,15z" },
  { id: "bil-indautxu", city: "Bilbao", name: "Indautxu", tier: "Premium", coordinates: "@43.2599,-2.9416,15z" },
  { id: "bil-ensanche", city: "Bilbao", name: "Ensanche", tier: "High-Density", coordinates: "@43.2642,-2.9304,15z" },
  { id: "bil-deusto", city: "Bilbao", name: "Deusto", tier: "High-Density", coordinates: "@43.2711,-2.9472,15z" },
  { id: "bil-getxo", city: "Getxo", name: "Las Arenas", tier: "Premium", coordinates: "@43.3261,-3.0152,15z" },
  { id: "don-centro", city: "San Sebastián", name: "Centro / Parte Vieja", tier: "Premium", coordinates: "@43.3214,-1.9837,15z" },
  { id: "don-gros", city: "San Sebastián", name: "Gros", tier: "High-Density", coordinates: "@43.3256,-1.9754,15z" },
  { id: "don-antiguo", city: "San Sebastián", name: "El Antiguo", tier: "Premium", coordinates: "@43.3152,-2.0031,15z" },

  // --- ZARAGOZA (5) ---
  { id: "zar-centro", city: "Zaragoza", name: "Centro / Independencia", tier: "Business", coordinates: "@41.6496,-0.8845,15z" },
  { id: "zar-actur", city: "Zaragoza", name: "Actur / Rey Fernando", tier: "High-Density", coordinates: "@41.6702,-0.8875,15z" },
  { id: "zar-romareda", city: "Zaragoza", name: "Universidad / Romareda", tier: "Premium", coordinates: "@41.6366,-0.9004,15z" },
  { id: "zar-arrabal", city: "Zaragoza", name: "Arrabal / Margen Izquierda", tier: "High-Density", coordinates: "@41.6599,-0.8752,15z" },
  { id: "zar-casablanca", city: "Zaragoza", name: "Casablanca", tier: "Premium", coordinates: "@41.6247,-0.9084,15z" },

  // --- ISLAS BALEARES Y CANARIAS (8) ---
  { id: "pal-centro", city: "Palma de Mallorca", name: "Centro / Jaume III", tier: "Business", coordinates: "@39.5716,-2.6483,15z" },
  { id: "pal-sta-catalina", city: "Palma de Mallorca", name: "Santa Catalina", tier: "Premium", coordinates: "@39.5714,-2.6361,15z" },
  { id: "pal-paseo", city: "Palma de Mallorca", name: "Paseo Marítimo", tier: "Premium", coordinates: "@39.5629,-2.6322,15z" },
  { id: "pal-calviá", city: "Calvià", name: "Portals Nous / Illetas", tier: "Premium", coordinates: "@39.5312,-2.5712,14z" },
  { id: "can-vegueta", city: "Las Palmas", name: "Vegueta / Triana", tier: "High-Density", coordinates: "@28.1011,-15.4150,15z" },
  { id: "can-canteras", city: "Las Palmas", name: "Las Canteras / Mesa y López", tier: "Business", coordinates: "@28.1368,-15.4357,15z" },
  { id: "can-stacruz", city: "Santa Cruz de Tenerife", name: "Centro Histórico", tier: "High-Density", coordinates: "@28.4682,-16.2497,15z" },
  { id: "can-adeje", city: "Adeje", name: "Costa Adeje", tier: "Premium", coordinates: "@28.0833,-16.7333,14z" },

  // --- ALICANTE & MURCIA (6) ---
  { id: "ali-centro", city: "Alicante", name: "Centro / Ensanche", tier: "Business", coordinates: "@38.3444,-0.4879,15z" },
  { id: "ali-sanjuan", city: "Alicante", name: "Playa de San Juan", tier: "Premium", coordinates: "@38.3697,-0.4192,14z" },
  { id: "ali-elche", city: "Elche", name: "Elche Centro", tier: "High-Density", coordinates: "@38.2669,-0.6983,15z" },
  { id: "mur-centro", city: "Murcia", name: "Centro / Platería", tier: "High-Density", coordinates: "@37.9861,-1.1306,15z" },
  { id: "mur-flota", city: "Murcia", name: "La Flota", tier: "Premium", coordinates: "@37.9942,-1.1214,15z" },
  { id: "mur-juan", city: "Murcia", name: "Juan Carlos I", tier: "Business", coordinates: "@38.0028,-1.1416,15z" },
]

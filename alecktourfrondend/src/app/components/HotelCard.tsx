import { Link } from "react-router";
import {
  Star, ArrowRight, MapPin, Phone, Mail,
  Waves, Dumbbell, Sparkles, UtensilsCrossed,
  Car, PawPrint, Dice5, Baby, PlaneTakeoff, Wine,
} from "lucide-react";
import { HotelDetailResponse } from "../services/hotel.service";
import { motion } from "motion/react";

interface HotelCardProps {
  hotel: HotelDetailResponse;
  index?: number;
}

// ── Mapa de íconos por nombre exacto de característica en la BD ──────────────
const CARACTERISTICA_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  "Piscina al aire libre":   { icon: Waves,           color: "text-blue-500" },
  "Gimnasio":                { icon: Dumbbell,         color: "text-green-500" },
  "Spa y masajes":           { icon: Sparkles,         color: "text-purple-500" },
  "Restaurante buffet":      { icon: UtensilsCrossed,  color: "text-orange-500" },
  "Parqueadero gratuito":    { icon: Car,              color: "text-gray-600" },
  "Pet Friendly":            { icon: PawPrint,         color: "text-amber-500" },
  "Casino":                  { icon: Dice5,            color: "text-red-500" },
  "Guardería":               { icon: Baby,             color: "text-pink-500" },
  "Traslado al aeropuerto":  { icon: PlaneTakeoff,     color: "text-sky-500" },
  "Bar en la azotea":        { icon: Wine,             color: "text-rose-500" },
};

// ── Imágenes reales por ciudad ────────────────────────────────────────────────
const CITY_IMAGES: Record<string, string> = {
  cartagena:        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "santa marta":    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
  medellín:         "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
  medellin:         "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
  bogotá:           "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=800&q=80",
  bogota:           "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=800&q=80",
  cali:             "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
  salento:          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  "villa de leyva": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80",
  barranquilla:     "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=800&q=80",
  bucaramanga:      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  pereira:          "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  manizales:        "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  "san andrés":     "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  "san andres":     "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80";

function getHotelImage(ciudad: string): string {
  return CITY_IMAGES[ciudad?.toLowerCase().trim()] ?? DEFAULT_IMAGE;
}

function getPrecioMinimo(hotel: HotelDetailResponse): number | null {
  const disponibles = hotel.habitaciones?.filter(h => h.estado === "disponible");
  if (!disponibles?.length) return null;
  return Math.min(...disponibles.map(h => h.precio_noche));
}

function getDisponibilidad(hotel: HotelDetailResponse) {
  const total = hotel.habitaciones?.length ?? 0;
  const disponibles = hotel.habitaciones?.filter(h => h.estado === "disponible").length ?? 0;
  return { total, disponibles };
}

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  const imagen    = getHotelImage(hotel.ciudad ?? "");
  const precioMin = getPrecioMinimo(hotel);
  const { total, disponibles } = getDisponibilidad(hotel);

  const caracteristicas = (hotel.hotel_caracteristicas ?? [])
    .filter(hc => hc.disponible && hc.caracteristica)
    .slice(0, 4);

  const totalDisponibles = (hotel.hotel_caracteristicas ?? []).filter(hc => hc.disponible).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Link
        to={`/hotel/${hotel.id_hotel}`}
        className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100"
      >
        {/* ── Imagen ── */}
        <div className="relative h-52 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
            src={imagen}
            alt={hotel.nombre_hotel}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Badge estrellas */}
          <div className="absolute top-3 right-3">
            <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
              {Array.from({ length: hotel.calificacion ?? 0 }, (_, i) => (
                <Star key={i} className="w-3 h-3 fill-[#F7931E] text-[#F7931E]" />
              ))}
            </div>
          </div>

          {/* Badge disponibilidad */}
          {total > 0 && (
            <div className="absolute top-3 left-3">
              <div className={`px-2.5 py-1 rounded-full text-xs font-bold shadow ${
                disponibles > 0 ? "bg-green-500 text-white" : "bg-red-500 text-white"
              }`}>
                {disponibles > 0 ? `${disponibles}/${total} hab. disponibles` : "Sin disponibilidad"}
              </div>
            </div>
          )}

          {/* Nombre sobre imagen */}
          <div className="absolute bottom-3 left-4 right-4">
            <div className="flex items-center gap-1.5 text-white/75 text-xs mb-0.5">
              <MapPin className="w-3 h-3" />
              <span>{hotel.ciudad}, {hotel.pais}</span>
            </div>
            <h2 className="text-lg font-bold text-white drop-shadow-lg line-clamp-1 group-hover:text-[#F7931E] transition-colors duration-300">
              {hotel.nombre_hotel}
            </h2>
          </div>
        </div>

        {/* ── Contenido ── */}
        <div className="p-5">

          {/* Características reales de la BD */}
          {caracteristicas.length > 0 ? (
            <div className="flex flex-wrap gap-2 mb-4">
              {caracteristicas.map((hc) => {
                const nombre = hc.caracteristica!.nombre_caracteristica;
                const entry  = CARACTERISTICA_ICONS[nombre];
                const Icon   = entry?.icon;
                const color  = entry?.color ?? "text-gray-500";
                return (
                  <span
                    key={hc.id_caracteristica}
                    className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {Icon && <Icon className={`w-3 h-3 ${color}`} />}
                    {nombre}
                  </span>
                );
              })}
              {totalDisponibles > 4 && (
                <span className="flex items-center bg-orange-50 text-[#FF6B35] text-xs font-medium px-2.5 py-1 rounded-full border border-orange-100">
                  +{totalDisponibles - 4} más
                </span>
              )}
            </div>
          ) : (
            <div className="mb-4">
              <span className="text-xs text-gray-400 italic">Sin características registradas</span>
            </div>
          )}

          {/* Contacto */}
          <div className="space-y-1 mb-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Mail className="w-3.5 h-3.5 flex-shrink-0 text-[#FF6B35]" />
              <span className="text-xs truncate">{hotel.correo_electronico}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500">
              <Phone className="w-3.5 h-3.5 flex-shrink-0 text-[#FF6B35]" />
              <span className="text-xs">{hotel.telefono}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between pt-4 border-t border-gray-100">
            <div>
              {precioMin ? (
                <>
                  <p className="text-xs text-gray-400 mb-0.5">Desde</p>
                  <p className="text-xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                    ${precioMin.toLocaleString("es-CO")}
                  </p>
                  <p className="text-xs text-gray-400">por noche</p>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">Sin habitaciones</p>
              )}
            </div>

            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-1.5 text-[#FF6B35] font-semibold text-sm group-hover:gap-2.5 transition-all duration-300"
            >
              <span>Ver hotel</span>
              <ArrowRight className="w-4 h-4" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
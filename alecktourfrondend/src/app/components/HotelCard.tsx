import {
  Baby,
  Car,
  Dice5,
  Dumbbell,
  PawPrint,
  PlaneTakeoff,
  Sparkles,
  Star,
  UtensilsCrossed,
  Waves,
  Wine
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { HotelDetailResponse } from "../services/hotel.service";

interface HotelCardProps {
  hotel: HotelDetailResponse;
  index?: number;
}

const CARACTERISTICA_ICONS: Record<string, React.ElementType> = {
  "Piscina al aire libre": Waves,
  "Gimnasio": Dumbbell,
  "Spa y masajes": Sparkles,
  "Restaurante buffet": UtensilsCrossed,
  "Parqueadero gratuito": Car,
  "Pet Friendly": PawPrint,
  "Casino": Dice5,
  "Guardería": Baby,
  "Traslado al aeropuerto": PlaneTakeoff,
  "Bar en la azotea": Wine,
};

const CITY_IMAGES: Record<string, string> = {
  cartagena: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "santa marta": "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=800&q=80",
  medellín: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
  medellin: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
  bogotá: "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=800&q=80",
  bogota: "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=800&q=80",
  cali: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
  "san andrés": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  "san andres": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
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

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  const imagen = getHotelImage(hotel.ciudad ?? "");
  const precioMin = getPrecioMinimo(hotel);

  // Simulamos un precio base sin descuento para la visualización calcada
  const precioFalsoOriginal = precioMin ? Math.round(precioMin * 1.3) : null;

  const caracteristicas = (hotel.hotel_caracteristicas ?? [])
    .filter(hc => hc.disponible && hc.caracteristica)
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="w-full bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex flex-col justify-between h-[540px]"
    >
      <Link to={`/hotel/${hotel.id_hotel}`} className="group flex flex-col flex-grow">

        {/* 1. IMAGEN */}
        <div className="relative h-44 w-full overflow-hidden bg-gray-100">
          <img
            src={imagen}
            alt={hotel.nombre_hotel}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
          />
        </div>

        {/* 2. CUERPO DE INFORMACIÓN */}
        <div className="p-4 flex flex-col flex-grow text-left">
          <span className="text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-0.5">
            ALOJAMIENTO
          </span>

          <h3 className="text-base font-bold text-gray-800 line-clamp-2 leading-tight min-h-[42px] mb-1">
            {hotel.nombre_hotel}
          </h3>

          <p className="text-xs text-gray-500 mb-0.5">
            A escasos minutos del centro
          </p>

          <p className="text-xs text-gray-500 font-medium mb-3">
            Estadía en {hotel.ciudad}
          </p>

          {/* Calificación y Amenities estilo Despegar */}
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-[#0f748e] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              {(hotel.calificacion ? (hotel.calificacion * 2).toFixed(1) : "8.0")}
            </span>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: hotel.calificacion ?? 4 }, (_, i) => (
                <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
              ))}
            </div>

            {/* Íconos de características limpios al lado */}
            <div className="flex items-center gap-1.5 ml-1 border-l border-gray-200 pl-2">
              {caracteristicas.map((hc) => {
                const nombre = hc.caracteristica!.nombre_caracteristica;
                const Icon = CARACTERISTICA_ICONS[nombre];
                return Icon ? <Icon key={hc.id_caracteristica} className="w-3.5 h-3.5 text-gray-500" title={nombre} /> : null;
              })}
            </div>
          </div>

          {/* Tag de oferta opcional */}
          {precioMin && (
            <div className="mt-auto mb-2">
              <span className="bg-[#eaf5f2] text-[#0f748e] text-[11px] font-semibold px-2 py-0.5 rounded">
                Mejor precio en Aleck Tours
              </span>
            </div>
          )}
        </div>

        {/* 3. BLOQUE DE PRECIOS DIVIDIDO */}
        <div className="border-t border-gray-100 p-4 text-left bg-white mt-auto">
          {precioMin && precioFalsoOriginal ? (
            <div className="relative">
              <p className="text-xs text-gray-500">1 noche, 2 personas desde</p>
              <p className="text-xs text-gray-400 line-through mb-0.5">
                ${precioFalsoOriginal.toLocaleString("es-CO")}
              </p>

              <div className="flex items-baseline justify-between">
                <p className="text-2xl font-bold text-gray-800 tracking-tight">
                  <span className="text-base font-normal mr-1">$</span>
                  {precioMin.toLocaleString("es-CO")}
                </p>

                {/* Descuento Badge */}
                <span className="bg-[#00a680] text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
                  -23%
                </span>
              </div>

              <p className="text-[10px] text-gray-400 mt-1">
                Fecha de ref: 29 de junio 2026
              </p>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic py-4">Sin habitaciones disponibles</p>
          )}
        </div>
      </Link>

      {/* 4. FOOTER DE PUNTOS FIDELIDAD */}
      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2.5 flex items-center gap-2 text-left">
        <div className="w-4 h-4 rounded bg-red-100 flex items-center justify-center shrink-0">
          <span className="text-[9px] font-bold text-red-600">A</span>
        </div>
        <p className="text-[11px] text-gray-500 leading-tight">
          <span className="font-semibold text-red-600 block">Pasaporte Aleck Tours</span>
          Sumarías <span className="font-bold text-gray-700">125 puntos</span>
        </p>
      </div>
    </motion.div>
  );
}
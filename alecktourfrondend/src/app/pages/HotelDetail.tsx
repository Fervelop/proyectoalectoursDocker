import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Navbar from "../components/Navbar";
import { hotelService, HotelDetailResponse } from "../services/hotel.service";
import {
  Star, MapPin, Phone, Mail, ArrowLeft, Bed, Users,
  CheckCircle, XCircle, Waves, Dumbbell, Sparkles,
  UtensilsCrossed, Car, PawPrint, Dice5, Baby, PlaneTakeoff, Wine,
} from "lucide-react";
import { motion } from "motion/react";

// ── Mapa íconos características (mismo que HotelCard) ────────────────────────
const CARACTERISTICA_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  "Piscina al aire libre":  { icon: Waves,          color: "text-blue-500" },
  "Gimnasio":               { icon: Dumbbell,        color: "text-green-500" },
  "Spa y masajes":          { icon: Sparkles,        color: "text-purple-500" },
  "Restaurante buffet":     { icon: UtensilsCrossed, color: "text-orange-500" },
  "Parqueadero gratuito":   { icon: Car,             color: "text-gray-600" },
  "Pet Friendly":           { icon: PawPrint,        color: "text-amber-500" },
  "Casino":                 { icon: Dice5,           color: "text-red-500" },
  "Guardería":              { icon: Baby,            color: "text-pink-500" },
  "Traslado al aeropuerto": { icon: PlaneTakeoff,    color: "text-sky-500" },
  "Bar en la azotea":       { icon: Wine,            color: "text-rose-500" },
};

const CITY_IMAGES: Record<string, string> = {
  cartagena:        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  "santa marta":    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80",
  medellín:         "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80",
  medellin:         "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80",
  bogotá:           "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=1200&q=80",
  bogota:           "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=1200&q=80",
  cali:             "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=80",
  salento:          "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80",
  "villa de leyva": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  barranquilla:     "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1200&q=80",
  "san andrés":     "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
  "san andres":     "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";

function getImage(ciudad: string) {
  return CITY_IMAGES[ciudad?.toLowerCase().trim()] ?? DEFAULT_IMAGE;
}

const ESTADO_STYLES: Record<string, string> = {
  disponible:   "bg-green-100 text-green-700 border-green-200",
  ocupada:      "bg-red-100 text-red-700 border-red-200",
  mantenimiento:"bg-yellow-100 text-yellow-700 border-yellow-200",
};

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<HotelDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    hotelService.getById(parseInt(id))
      .then(setHotel)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-5 w-32 bg-gray-200 rounded mb-6" />
        <div className="h-96 bg-gray-200 rounded-3xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 space-y-4">
              <div className="h-6 w-48 bg-gray-200 rounded" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="h-64 bg-white rounded-2xl shadow" />
        </div>
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hotel no encontrado</h1>
        <Link to="/search" className="text-[#FF6B35] hover:underline">← Volver a hoteles</Link>
      </div>
    </div>
  );

  const imagen = getImage(hotel.ciudad ?? "");
  const habitacionesDisponibles = hotel.habitaciones?.filter(h => h.estado === "disponible") ?? [];
  const precioMin = habitacionesDisponibles.length
    ? Math.min(...habitacionesDisponibles.map(h => h.precio_noche))
    : null;
  const caracteristicas = hotel.hotel_caracteristicas ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          to="/search"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B35] mb-6 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a hoteles
        </Link>

        {/* Hero imagen */}
        <div className="relative h-96 rounded-3xl overflow-hidden mb-8">
          <img
            src={imagen}
            alt={hotel.nombre_hotel}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-2 text-white/80">
              <MapPin className="w-4 h-4" />
              <span>{hotel.ciudad}, {hotel.pais}</span>
            </div>
            <h1 className="text-5xl font-bold mb-3">{hotel.nombre_hotel}</h1>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < (hotel.calificacion ?? 0) ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-400 text-gray-400"}`} />
              ))}
              <span className="text-lg font-semibold ml-1">{hotel.calificacion} estrellas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Columna principal ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Información básica */}
            <section className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información del hotel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { icon: MapPin, label: "Ciudad",    value: hotel.ciudad },
                  { icon: MapPin, label: "País",      value: hotel.pais },
                  { icon: MapPin, label: "Dirección", value: hotel.direccion },
                  { icon: Mail,   label: "Correo",    value: hotel.correo_electronico },
                  { icon: Phone,  label: "Teléfono",  value: hotel.telefono },
                ].filter(i => i.value).map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                    <Icon className="w-5 h-5 text-[#FF6B35] flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="font-semibold text-gray-900 truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Características */}
            {caracteristicas.length > 0 && (
              <section className="bg-white rounded-2xl shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Servicios y amenidades</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {caracteristicas.map((hc) => {
                    const nombre = hc.caracteristica?.nombre_caracteristica ?? "";
                    const entry  = CARACTERISTICA_ICONS[nombre];
                    const Icon   = entry?.icon;
                    const color  = entry?.color ?? "text-gray-500";
                    return (
                      <div
                        key={hc.id_caracteristica}
                        className={`flex items-center gap-3 p-4 rounded-xl border ${
                          hc.disponible
                            ? "bg-white border-gray-100"
                            : "bg-gray-50 border-gray-100 opacity-50"
                        }`}
                      >
                        {Icon
                          ? <Icon className={`w-5 h-5 flex-shrink-0 ${hc.disponible ? color : "text-gray-400"}`} />
                          : <div className="w-5 h-5 rounded-full bg-gray-200 flex-shrink-0" />
                        }
                        <span className={`text-sm font-medium ${hc.disponible ? "text-gray-800" : "text-gray-400 line-through"}`}>
                          {nombre}
                        </span>
                        {hc.disponible
                          ? <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                          : <XCircle    className="w-4 h-4 text-gray-300 ml-auto flex-shrink-0" />
                        }
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Habitaciones */}
            {hotel.habitaciones?.length > 0 && (
              <section className="bg-white rounded-2xl shadow-md p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Habitaciones</h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {habitacionesDisponibles.length} de {hotel.habitaciones.length} disponibles
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hotel.habitaciones.map((hab) => (
                    <motion.div
                      key={hab.id_habitacion}
                      whileHover={{ y: -3 }}
                      className="border border-gray-100 rounded-xl p-5 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Bed className="w-5 h-5 text-[#FF6B35]" />
                          <span className="font-bold text-gray-900">
                            {hab.tipo_habitacion?.nombre_tipo ?? "Habitación"}
                          </span>
                        </div>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${ESTADO_STYLES[hab.estado] ?? "bg-gray-100 text-gray-600"}`}>
                          {hab.estado.charAt(0).toUpperCase() + hab.estado.slice(1)}
                        </span>
                      </div>

                      {hab.tipo_habitacion?.descripcion && (
                        <p className="text-sm text-gray-500 mb-3">{hab.tipo_habitacion.descripcion}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                          <Users className="w-4 h-4" />
                          <span>Hasta {hab.tipo_habitacion?.capacidad_personas ?? "?"} personas</span>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Por noche</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                            ${Number(hab.precio_noche).toLocaleString("es-CO")}
                          </p>
                        </div>
                      </div>

                      <p className="text-xs text-gray-400 mt-1">Hab. #{hab.numero_habitacion}</p>
                    </motion.div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < (hotel.calificacion ?? 0) ? "fill-[#F59E0B] text-[#F59E0B]" : "fill-gray-200 text-gray-200"}`} />
                ))}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-5">{hotel.nombre_hotel}</h2>

              <div className="space-y-3 mb-5 pb-5 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Ciudad</span>
                  <span className="font-semibold">{hotel.ciudad}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">País</span>
                  <span className="font-semibold">{hotel.pais}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Calificación</span>
                  <span className="font-semibold">{hotel.calificacion} estrellas</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Habitaciones</span>
                  <span className="font-semibold">{hotel.habitaciones?.length ?? 0} en total</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Disponibles</span>
                  <span className={`font-semibold ${habitacionesDisponibles.length > 0 ? "text-green-600" : "text-red-500"}`}>
                    {habitacionesDisponibles.length}
                  </span>
                </div>
              </div>

              {/* Precio mínimo */}
              {precioMin && (
                <div className="bg-orange-50 rounded-xl p-4 mb-5 text-center border border-orange-100">
                  <p className="text-xs text-gray-500 mb-1">Desde</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                    ${precioMin.toLocaleString("es-CO")}
                  </p>
                  <p className="text-xs text-gray-400">por noche</p>
                </div>
              )}

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={`/checkout/${hotel.id_hotel}`}
                  className={`block w-full py-4 text-white text-center font-semibold rounded-xl transition-all duration-300 mb-3 ${
                    habitacionesDisponibles.length > 0
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#F7931E] hover:shadow-2xl"
                      : "bg-gray-300 cursor-not-allowed pointer-events-none"
                  }`}
                >
                  {habitacionesDisponibles.length > 0 ? "Reservar ahora" : "Sin disponibilidad"}
                </Link>
              </motion.div>
              <p className="text-xs text-gray-400 text-center">
                Pago 100% seguro • Cancela gratis hasta 48h antes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
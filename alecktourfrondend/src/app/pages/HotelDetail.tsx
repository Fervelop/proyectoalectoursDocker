import {
  ArrowLeft,
  Baby,
  Bed,
  Car,
  CheckCircle,
  Dice5,
  Dumbbell,
  Mail,
  MapPin,
  PawPrint,
  Phone,
  PlaneTakeoff,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Waves,
  Wine,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { HabitacionResponse, HotelDetailResponse, hotelService } from "../services/hotel.service";
// ── Mapa de íconos de características con colores semánticos basados en tu tema ──
const CARACTERISTICA_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  "Piscina al aire libre": { icon: Waves, color: "text-primary" },
  "Gimnasio": { icon: Dumbbell, color: "text-chart-1" },
  "Spa y masajes": { icon: Sparkles, color: "text-chart-5" },
  "Restaurante buffet": { icon: UtensilsCrossed, color: "text-chart-2" },
  "Parqueadero gratuito": { icon: Car, color: "text-muted-foreground" },
  "Pet Friendly": { icon: PawPrint, color: "text-chart-2" },
  "Casino": { icon: Dice5, color: "text-destructive" },
  "Guardería": { icon: Baby, color: "text-chart-5" },
  "Traslado al aeropuerto": { icon: PlaneTakeoff, color: "text-primary" },
  "Bar en la azotea": { icon: Wine, color: "text-destructive" },
};

const CITY_IMAGES: Record<string, string> = {
  cartagena: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  "santa marta": "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1200&q=80",
  medellín: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80",
  medellin: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80",
  bogotá: "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=1200&q=80",
  bogota: "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=1200&q=80",
  cali: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1200&q=80",
  salento: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80",
  "villa de leyva": "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
  barranquilla: "https://images.unsplash.com/photo-1519451241324-20b4ea2c4220?w=1200&q=80",
  "san andrés": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
  "san andres": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
};
const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80";

function getImage(ciudad: string) {
  return CITY_IMAGES[ciudad?.toLowerCase().trim()] ?? DEFAULT_IMAGE;
}

// Estados mapeados usando opacidades de tus tokens globales o semánticos
const ESTADO_STYLES: Record<string, string> = {
  disponible: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  ocupada: "bg-destructive/10 text-destructive border-destructive/20",
  mantenimiento: "bg-chart-2/10 text-chart-2 border-chart-2/20",
};

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<HotelDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  // NUEVO: habitación que el usuario selecciona antes de ir a Checkout
  const [selectedHabitacion, setSelectedHabitacion] = useState<HabitacionResponse | null>(null);

  useEffect(() => {
    if (!id) return;
    hotelService.getById(parseInt(id))
      .then(setHotel)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading skeleton adaptado al fondo ──
  if (loading) return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse">
        <div className="h-5 w-32 bg-muted rounded mb-6" />
        <div className="h-96 bg-muted rounded-xl mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-xl p-8 space-y-4 border border-border">
              <div className="h-6 w-48 bg-muted rounded" />
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded-xl" />
                ))}
              </div>
            </div>
          </div>
          <div className="h-64 bg-card rounded-xl border border-border shadow-sm" />
        </div>
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-medium text-foreground mb-4">Hotel no encontrado</h1>
        <Link to="/search" className="text-primary hover:underline font-medium">← Volver a hoteles</Link>
      </div>
    </div>
  );

  const imagen = getImage(hotel.ciudad ?? "");
  const habitacionesDisponibles = hotel.habitaciones?.filter(h => h.estado === "disponible") ?? [];
  const precioMin = habitacionesDisponibles.length
    ? Math.min(...habitacionesDisponibles.map(h => h.precio_noche))
    : null;
  const caracteristicas = hotel.hotel_caracteristicas ?? [];

  // NUEVO: el link de checkout ahora lleva la habitación elegida como query param.
  // Checkout usará esta habitación real (con su precio real) en vez de un precio inventado.
  const checkoutHref = selectedHabitacion
    ? `/checkout/${hotel.id_hotel}?habitacion=${selectedHabitacion.id_habitacion}`
    : "#";

  return (
    <>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Botón Volver */}
          <Link
            to="/search"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors font-medium text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver a hoteles
          </Link>

          {/* Hero Banner del Hotel */}
          <div className="relative h-96 rounded-xl overflow-hidden mb-8 border border-border shadow-md">
            <img
              src={imagen}
              alt={hotel.nombre_hotel}
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = DEFAULT_IMAGE; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <div className="flex items-center gap-2 mb-2 text-white/90 text-sm">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{hotel.ciudad}, {hotel.pais}</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight">{hotel.nombre_hotel}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < (hotel.calificacion ?? 0) ? "fill-chart-2 text-chart-2" : "fill-white/20 text-white/20"}`} />
                  ))}
                </div>
                <span className="text-sm font-medium opacity-90 ml-1">{hotel.calificacion} estrellas</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Columna Principal de Contenido ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Ficha técnica e Información básica */}
              <section className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm transition-colors">
                <h2 className="text-xl font-medium text-foreground mb-6">Información del hotel</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { icon: MapPin, label: "Ciudad", value: hotel.ciudad },
                    { icon: MapPin, label: "País", value: hotel.pais },
                    { icon: MapPin, label: "Dirección", value: hotel.direccion },
                    { icon: Mail, label: "Correo", value: hotel.correo_electronico },
                    { icon: Phone, label: "Teléfono", value: hotel.telefono },
                  ].filter(i => i.value).map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 p-4 bg-input-background rounded-xl border border-border/40">
                      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider">{label}</p>
                        <p className="font-medium text-foreground truncate text-sm md:text-base">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Sección Amenidades */}
              {caracteristicas.length > 0 && (
                <section className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm transition-colors">
                  <h2 className="text-xl font-medium text-foreground mb-6">Servicios y amenidades</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {caracteristicas.map((hc) => {
                      const nombre = hc.caracteristica?.nombre_caracteristica ?? "";
                      const entry = CARACTERISTICA_ICONS[nombre];
                      const Icon = entry?.icon;
                      const color = entry?.color ?? "text-muted-foreground";
                      return (
                        <div
                          key={hc.id_caracteristica}
                          className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${hc.disponible
                            ? "bg-card border-border shadow-xs"
                            : "bg-muted/40 border-border/50 opacity-40 select-none"
                            }`}
                        >
                          {Icon
                            ? <Icon className={`w-5 h-5 flex-shrink-0 ${hc.disponible ? color : "text-muted-foreground/60"}`} />
                            : <div className="w-5 h-5 rounded-full bg-muted flex-shrink-0" />
                          }
                          <span className={`text-sm font-medium ${hc.disponible ? "text-foreground" : "text-muted-foreground line-through"}`}>
                            {nombre}
                          </span>
                          {hc.disponible
                            ? <CheckCircle className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />
                            : <XCircle className="w-4 h-4 text-muted-foreground/50 ml-auto flex-shrink-0" />
                          }
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Listado de Habitaciones — AHORA SELECCIONABLES */}
              {hotel.habitaciones?.length > 0 && (
                <section className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm transition-colors">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-medium text-foreground">Elige tu habitación</h2>
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full border border-border">
                      {habitacionesDisponibles.length} de {hotel.habitaciones.length} libres
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {hotel.habitaciones.map((hab) => {
                      const disponible = hab.estado === "disponible";
                      const seleccionada = selectedHabitacion?.id_habitacion === hab.id_habitacion;
                      return (
                        <motion.button
                          key={hab.id_habitacion}
                          type="button"
                          disabled={!disponible}
                          onClick={() => setSelectedHabitacion(hab)}
                          whileHover={disponible ? { y: -2 } : {}}
                          className={`text-left border rounded-xl p-5 bg-card/50 transition-all duration-300 flex flex-col justify-between ${!disponible
                              ? "opacity-50 cursor-not-allowed border-border"
                              : seleccionada
                                ? "border-primary ring-2 ring-primary/30 shadow-md"
                                : "border-border hover:shadow-md hover:border-primary/30"
                            }`}
                        >
                          <div>
                            <div className="flex items-start justify-between mb-3 gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Bed className="w-4 h-4 text-primary shrink-0" />
                                <span className="font-bold text-foreground truncate text-sm md:text-base">
                                  {hab.tipo_habitacion?.nombre_tipo ?? "Habitación"}
                                </span>
                              </div>
                              <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border whitespace-nowrap ${ESTADO_STYLES[hab.estado] ?? "bg-muted text-muted-foreground"}`}>
                                {hab.estado.charAt(0).toUpperCase() + hab.estado.slice(1)}
                              </span>
                            </div>

                            {hab.tipo_habitacion?.descripcion && (
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-4">{hab.tipo_habitacion.descripcion}</p>
                            )}
                          </div>

                          <div className="mt-auto pt-2 border-t border-border/40">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                                <Users className="w-3.5 h-3.5" />
                                <span>Capacidad: {hab.tipo_habitacion?.capacidad_personas ?? "?"} pers.</span>
                              </div>
                              <div className="text-right">
                                <p className="text-[10px] text-muted-foreground">Por noche</p>
                                <p className="text-base font-bold text-primary">
                                  ${Number(hab.precio_noche).toLocaleString("es-CO")}
                                </p>
                              </div>
                            </div>
                            <p className="text-[10px] text-muted-foreground/60 mt-2">Habitación #{hab.numero_habitacion}</p>
                          </div>

                          {seleccionada && (
                            <div className="mt-3 flex items-center gap-1.5 text-xs font-semibold text-primary">
                              <CheckCircle className="w-3.5 h-3.5" />
                              Seleccionada
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            {/* ── Sidebar de Reserva (Sticky) ── */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl border border-border p-6 md:p-8 sticky top-24 shadow-sm transition-colors">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < (hotel.calificacion ?? 0) ? "fill-chart-2 text-chart-2" : "fill-muted border-muted text-muted"}`} />
                  ))}
                </div>
                <h2 className="text-lg font-medium text-foreground mb-4 leading-snug">{hotel.nombre_hotel}</h2>

                <div className="space-y-3 mb-6 pb-5 border-b border-border text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Destino</span>
                    <span className="font-medium text-foreground">{hotel.ciudad}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calificación</span>
                    <span className="font-medium text-foreground">{hotel.calificacion} estrellas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total unidades</span>
                    <span className="font-medium text-foreground">{hotel.habitaciones?.length ?? 0} habs.</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Disponibilidad hoy</span>
                    <span className={`font-semibold ${habitacionesDisponibles.length > 0 ? "text-green-500" : "text-destructive"}`}>
                      {habitacionesDisponibles.length > 0 ? `${habitacionesDisponibles.length} disponibles` : "Completo"}
                    </span>
                  </div>
                </div>

                {/* Caja de precio: si ya eligió habitación, muestra ESA tarifa; si no, la tarifa mínima */}
                {(selectedHabitacion || precioMin) && (
                  <div className="bg-accent text-accent-foreground rounded-xl p-4 mb-6 text-center border border-border">
                    <p className="text-[11px] text-muted-foreground uppercase font-bold tracking-wider mb-0.5">
                      {selectedHabitacion ? "Tarifa de tu habitación" : "Mejor tarifa desde"}
                    </p>
                    <p className="text-3xl font-bold text-primary tracking-tight">
                      ${(selectedHabitacion?.precio_noche ?? precioMin!).toLocaleString("es-CO")}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-0.5">COP por noche</p>
                  </div>
                )}

                {!selectedHabitacion && habitacionesDisponibles.length > 0 && (
                  <p className="text-xs text-center text-muted-foreground mb-4">
                    👆 Elige una habitación arriba para continuar
                  </p>
                )}

                {/* Botón de acción */}
                <motion.div whileHover={selectedHabitacion ? { scale: 1.01 } : {}} whileTap={selectedHabitacion ? { scale: 0.99 } : {}}>
                  <Link
                    to={checkoutHref}
                    aria-disabled={!selectedHabitacion}
                    onClick={(e) => { if (!selectedHabitacion) e.preventDefault(); }}
                    className={`block w-full py-3.5 text-center font-medium rounded-xl transition-all duration-200 text-sm border shadow-xs ${selectedHabitacion
                        ? "bg-primary text-primary-foreground border-transparent hover:opacity-95"
                        : "bg-muted text-muted-foreground border-border cursor-not-allowed pointer-events-none"
                      }`}
                  >
                    {habitacionesDisponibles.length === 0
                      ? "Sin disponibilidad"
                      : selectedHabitacion
                        ? "Reservar esta habitación"
                        : "Selecciona una habitación"}
                  </Link>
                </motion.div>
                <p className="text-[11px] text-muted-foreground text-center mt-4">
                  🔒 Pago 100% protegido • Cancelación flexible
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
import {
  Baby,
  Car,
  Check,
  ChevronRight,
  Dice5,
  Dumbbell,
  Heart,
  MapPin,
  PawPrint,
  PlaneTakeoff,
  Sparkles,
  Star,
  Users,
  UtensilsCrossed,
  Waves,
  Wine,
} from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { HotelDetailResponse } from "../services/hotel.service";

interface HotelCardProps {
  hotel?: HotelDetailResponse;
  index?: number;
}

const CARACTERISTICA_ICONS: Record<string, React.ElementType> = {
  "Piscina al aire libre": Waves,
  Gimnasio: Dumbbell,
  "Spa y masajes": Sparkles,
  "Restaurante buffet": UtensilsCrossed,
  "Parqueadero gratuito": Car,
  "Pet Friendly": PawPrint,
  Casino: Dice5,
  Guardería: Baby,
  "Traslado al aeropuerto": PlaneTakeoff,
  "Bar en la azotea": Wine,
};

const CITY_IMAGES: Record<string, string> = {
  cartagena:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1000&q=85",

  "santa marta":
    "https://images.unsplash.com/photo-1596402184320-417e7178b2cd?w=1000&q=85",

  medellín:
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1000&q=85",

  medellin:
    "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1000&q=85",

  bogotá:
    "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=1000&q=85",

  bogota:
    "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=1000&q=85",

  cali:
    "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1000&q=85",

  "san andrés":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&q=85",

  "san andres":
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000&q=85",
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&q=85";

function getHotelImage(ciudad?: string): string {
  return (
    CITY_IMAGES[ciudad?.toLowerCase().trim() ?? ""] ??
    DEFAULT_IMAGE
  );
}

function getPrecioMinimo(
  hotel: HotelDetailResponse
): number | null {
  const disponibles =
    hotel.habitaciones?.filter(
      (habitacion) =>
        habitacion.estado?.toLowerCase() ===
        "disponible"
    ) ?? [];

  if (!disponibles.length) {
    return null;
  }

  return Math.min(
    ...disponibles.map(
      (habitacion) => habitacion.precio_noche
    )
  );
}

export default function HotelCard({
  hotel,
  index = 0,
}: HotelCardProps) {

  /*
   * Protección importante:
   * mientras la información del hotel todavía está
   * llegando desde la API, no intentamos acceder a
   * hotel.ciudad, hotel.habitaciones, etc.
   */
  if (!hotel) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="h-[235px] animate-pulse bg-gray-100" />

        <div className="space-y-4 p-5">
          <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />

          <div className="h-6 w-3/4 animate-pulse rounded bg-gray-100" />

          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />

          <div className="h-20 animate-pulse rounded-xl bg-gray-100" />

          <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  const imagen = getHotelImage(hotel.ciudad);

  const precioMin = getPrecioMinimo(hotel);

  const precioOriginal = precioMin
    ? Math.round(precioMin * 1.3)
    : null;

  const habitacionesDisponibles =
    hotel.habitaciones?.filter(
      (habitacion) =>
        habitacion.estado?.toLowerCase() ===
        "disponible"
    ) ?? [];

  const habitacionDestacada =
    habitacionesDisponibles.length > 0
      ? habitacionesDisponibles.reduce(
        (prev, current) =>
          current.precio_noche <
            prev.precio_noche
            ? current
            : prev
      )
      : null;

  const caracteristicas =
    hotel.hotel_caracteristicas
      ?.filter(
        (hc) =>
          hc.disponible &&
          hc.caracteristica
      )
      .slice(0, 5) ?? [];

  const rating =
    hotel.calificacion
      ? hotel.calificacion * 2
      : 8;

  const estrellas = Math.min(
    Math.max(
      Math.round(hotel.calificacion || 4),
      1
    ),
    5
  );

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        margin: "-50px",
      }}
      transition={{
        duration: 0.45,
        delay: index * 0.06,
      }}
      whileHover={{
        y: -5,
        transition: {
          duration: 0.25,
        },
      }}
      className="
        group
        w-full
        overflow-hidden
        rounded-2xl
        border
        border-gray-200
        bg-white
        shadow-[0_4px_20px_rgba(0,0,0,0.06)]
        transition-shadow
        hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]
      "
    >
      <Link
        to={`/hotel/${hotel.id_hotel}`}
        className="block"
      >
        {/* ============================================ */}
        {/* IMAGEN */}
        {/* ============================================ */}

        <div className="relative h-[235px] overflow-hidden bg-gray-100">

          <motion.img
            src={imagen}
            alt={hotel.nombre_hotel}
            whileHover={{
              scale: 1.06,
            }}
            transition={{
              duration: 0.6,
            }}
            className="
              h-full
              w-full
              object-cover
            "
            onError={(e) => {
              (
                e.target as HTMLImageElement
              ).src = DEFAULT_IMAGE;
            }}
          />

          {/* Overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/70
              via-black/15
              to-transparent
            "
          />

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">

            <span
              className="
                rounded-full
                bg-white/95
                px-3
                py-1.5
                text-[10px]
                font-bold
                uppercase
                tracking-wide
                text-[#8B1E3F]
                shadow-sm
                backdrop-blur
              "
            >
              Hotel
            </span>

            {precioMin && (
              <span
                className="
                  rounded-full
                  bg-[#008f6b]
                  px-3
                  py-1.5
                  text-[10px]
                  font-bold
                  text-white
                  shadow-sm
                "
              >
                Mejor precio
              </span>
            )}
          </div>

          {/* Favorito */}
          <button
            type="button"
            onClick={(e) =>
              e.preventDefault()
            }
            className="
              absolute
              right-4
              top-4
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-white/90
              text-gray-600
              shadow-md
              backdrop-blur
              transition
              hover:bg-white
              hover:text-[#8B1E3F]
            "
            aria-label="Agregar a favoritos"
          >
            <Heart className="h-4 w-4" />
          </button>

          {/* Información sobre la imagen */}
          <div
            className="
              absolute
              bottom-4
              left-4
              right-4
              text-white
            "
          >
            <div className="mb-1 flex items-center gap-1.5">

              <MapPin className="h-3.5 w-3.5" />

              <span className="text-xs font-medium">
                {hotel.ciudad}
                {hotel.pais
                  ? `, ${hotel.pais}`
                  : ""}
              </span>
            </div>

            <h3
              className="
                text-xl
                font-bold
                leading-tight
                drop-shadow-md
              "
            >
              {hotel.nombre_hotel}
            </h3>
          </div>
        </div>

        {/* ============================================ */}
        {/* CONTENIDO */}
        {/* ============================================ */}

        <div className="p-5">

          {/* Rating */}
          <div className="mb-4 flex items-center justify-between">

            <div className="flex items-center gap-2">

              <span
                className="
                  rounded-md
                  bg-[#8B1E3F]
                  px-2
                  py-1
                  text-xs
                  font-bold
                  text-white
                "
              >
                {rating.toFixed(1)}
              </span>

              <div>

                <div className="flex items-center gap-0.5">

                  {Array.from(
                    {
                      length: estrellas,
                    },
                    (_, i) => (
                      <Star
                        key={i}
                        className="
                          h-3.5
                          w-3.5
                          fill-[#C9A227]
                          text-[#C9A227]
                        "
                      />
                    )
                  )}
                </div>

                <span className="text-[10px] text-gray-500">
                  Excelente alojamiento
                </span>
              </div>
            </div>

            <span className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
              Alojamiento
            </span>
          </div>

          {/* Dirección */}
          {hotel.direccion && (
            <div className="mb-4 flex items-start gap-2">

              <MapPin
                className="
                  mt-0.5
                  h-4
                  w-4
                  shrink-0
                  text-[#8B1E3F]
                "
              />

              <div>

                <p className="text-xs font-medium text-gray-700">
                  {hotel.direccion}
                </p>

                {hotel.codigo_postal && (
                  <p className="mt-0.5 text-[10px] text-gray-400">
                    C.P.{" "}
                    {hotel.codigo_postal}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* HABITACIÓN */}
          {/* ======================================== */}

          {habitacionDestacada && (
            <div
              className="
                mb-4
                rounded-xl
                border
                border-gray-100
                bg-gray-50
                p-3
              "
            >

              <div className="mb-2 flex items-center justify-between">

                <span
                  className="
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wide
                    text-gray-400
                  "
                >
                  Habitación disponible
                </span>

                <span
                  className="
                    flex
                    items-center
                    gap-1
                    text-[10px]
                    font-semibold
                    text-[#008f6b]
                  "
                >
                  <Check className="h-3 w-3" />

                  Disponible
                </span>
              </div>

              <p className="mb-2 text-sm font-bold text-gray-800">
                {habitacionDestacada
                  .tipo_habitacion
                  ?.nombre_tipo ??
                  "Habitación estándar"}
              </p>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-gray-500">

                <span className="flex items-center gap-1">

                  <Users className="h-3.5 w-3.5" />

                  Hasta{" "}
                  {habitacionDestacada
                    .tipo_habitacion
                    ?.capacidad_personas ??
                    2}{" "}
                  personas
                </span>

                <span>
                  {habitacionesDisponibles.length}{" "}
                  {habitacionesDisponibles.length ===
                    1
                    ? "habitación"
                    : "habitaciones"}{" "}
                  disponible
                  {habitacionesDisponibles.length ===
                    1
                    ? ""
                    : "s"}
                </span>
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* CARACTERÍSTICAS */}
          {/* ======================================== */}

          {caracteristicas.length > 0 && (
            <div className="mb-4">

              <p
                className="
                  mb-2
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-wide
                  text-gray-400
                "
              >
                Lo que ofrece este hotel
              </p>

              <div className="flex flex-wrap gap-2">

                {caracteristicas.map(
                  (hc) => {
                    const nombre =
                      hc.caracteristica!
                        .nombre_caracteristica;

                    const Icon =
                      CARACTERISTICA_ICONS[
                      nombre
                      ];

                    return (
                      <span
                        key={
                          hc.id_caracteristica
                        }
                        className="
                          flex
                          items-center
                          gap-1.5
                          rounded-full
                          bg-gray-50
                          px-2.5
                          py-1.5
                          text-[10px]
                          font-medium
                          text-gray-600
                        "
                      >
                        {Icon ? (
                          <Icon
                            className="
                              h-3
                              w-3
                              text-[#8B1E3F]
                            "
                          />
                        ) : (
                          <Check
                            className="
                              h-3
                              w-3
                              text-[#008f6b]
                            "
                          />
                        )}

                        {nombre}
                      </span>
                    );
                  }
                )}
              </div>
            </div>
          )}

          {/* ======================================== */}
          {/* PRECIO */}
          {/* ======================================== */}

          <div className="border-t border-gray-100 pt-4">

            {precioMin ? (
              <div className="flex items-end justify-between">

                <div>

                  <p className="mb-1 text-[10px] text-gray-400">
                    Desde · 1 noche
                  </p>

                  {precioOriginal && (
                    <p className="text-xs text-gray-400 line-through">
                      $
                      {precioOriginal.toLocaleString(
                        "es-CO"
                      )}
                    </p>
                  )}

                  <div className="flex items-baseline gap-1">

                    <span className="text-sm font-medium text-gray-700">
                      $
                    </span>

                    <span
                      className="
                        text-2xl
                        font-extrabold
                        tracking-tight
                        text-[#8B1E3F]
                      "
                    >
                      {precioMin.toLocaleString(
                        "es-CO"
                      )}
                    </span>
                  </div>

                  <p className="mt-0.5 text-[10px] text-gray-400">
                    Por noche · por habitación
                  </p>
                </div>

                <div className="text-right">

                  {precioOriginal && (
                    <span
                      className="
                        mb-2
                        inline-block
                        rounded-md
                        bg-[#e8f7f1]
                        px-2
                        py-1
                        text-[10px]
                        font-bold
                        text-[#008f6b]
                      "
                    >
                      -23%
                    </span>
                  )}

                  <div
                    className="
                      flex
                      items-center
                      justify-end
                      gap-1
                      text-xs
                      font-bold
                      text-[#8B1E3F]
                      transition-all
                      group-hover:gap-2
                    "
                  >
                    Ver hotel

                    <ChevronRight className="h-4 w-4" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-xl bg-gray-50 p-3">

                <p className="text-sm font-medium text-gray-500">
                  No hay habitaciones disponibles
                </p>

                <p className="mt-1 text-[10px] text-gray-400">
                  Consulta otras fechas u otros alojamientos.
                </p>
              </div>
            )}
          </div>
        </div>
      </Link>

      {/* ============================================ */}
      {/* FOOTER */}
      {/* ============================================ */}

      <div
        className="
          flex
          items-center
          justify-between
          border-t
          border-gray-100
          bg-[#fafafa]
          px-5
          py-3
        "
      >

        <div className="flex items-center gap-2">

          <div
            className="
              flex
              h-7
              w-7
              items-center
              justify-center
              rounded-lg
              bg-[#8B1E3F]
            "
          >
            <span className="text-[11px] font-black text-white">
              A
            </span>
          </div>

          <div>

            <p className="text-[10px] font-bold text-[#8B1E3F]">
              Pasaporte Aleck Tours
            </p>

            <p className="text-[9px] text-gray-500">
              Acumula puntos en tu reserva
            </p>
          </div>
        </div>

        <span className="text-[10px] font-bold text-gray-700">
          +125 pts
        </span>
      </div>
    </motion.article>
  );
}
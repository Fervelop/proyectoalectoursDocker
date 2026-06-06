import { useParams, Link } from "react-router";
import Navbar from "../components/Navbar";
import { packages } from "../data/packages";
import {
  Star,
  MapPin,
  Clock,
  Plane,
  Bus,
  Hotel,
  CheckCircle,
  Sparkles,
} from "lucide-react";

export default function PackageDetail() {
  const { id } = useParams();
  const pkg = packages.find((p) => p.id === id);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Paquete no encontrado</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Image */}
        <div className="relative h-96 md:h-[500px] rounded-3xl overflow-hidden mb-8">
          <img
            src={pkg.image}
            alt={pkg.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">Colombia</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">{pkg.destination}</h1>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
                <span className="text-lg font-semibold">{pkg.rating}</span>
                <span className="text-gray-300">({pkg.reviews} reseñas)</span>
              </div>
              <div className="flex items-center gap-2">
                {pkg.transport === "vuelo" ? (
                  <>
                    <Plane className="w-5 h-5" />
                    <span>Vuelo incluido</span>
                  </>
                ) : (
                  <>
                    <Bus className="w-5 h-5" />
                    <span>Bus turístico</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{pkg.duration}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <section className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Descripción del viaje
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">{pkg.description}</p>
            </section>

            {/* What's Included */}
            <section className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                ¿Qué incluye?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pkg.included.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-[#06B6D4] flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Accommodation */}
            <section className="bg-white rounded-2xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <Hotel className="w-7 h-7 text-[#2563EB]" />
                <h2 className="text-2xl font-bold text-gray-900">Hospedaje</h2>
              </div>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">{pkg.hotel.name}</h3>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: pkg.hotel.stars }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]"
                    />
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                {pkg.hotel.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </section>

            {/* Transportation */}
            <section className="bg-white rounded-2xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                {pkg.transport === "vuelo" ? (
                  <Plane className="w-7 h-7 text-[#2563EB]" />
                ) : (
                  <Bus className="w-7 h-7 text-[#2563EB]" />
                )}
                <h2 className="text-2xl font-bold text-gray-900">Transporte</h2>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {pkg.transportation.type}
                </h3>
                <p className="text-gray-700">{pkg.transportation.details}</p>
              </div>
            </section>

            {/* Entertainment */}
            <section className="bg-white rounded-2xl shadow-md p-8">
              <div className="flex items-center gap-3 mb-6">
                <Sparkles className="w-7 h-7 text-[#2563EB]" />
                <h2 className="text-2xl font-bold text-gray-900">
                  Entretenimiento disponible
                </h2>
              </div>
              <p className="text-gray-600 mb-6">
                Personaliza tu experiencia seleccionando actividades de diferentes
                categorías después de reservar
              </p>
              <Link
                to={`/personalize/${pkg.id}`}
                className="inline-block px-6 py-3 bg-[#F59E0B] text-white rounded-lg hover:bg-[#d97706] transition-colors"
              >
                Ver opciones de entretenimiento
              </Link>
            </section>
          </div>

          {/* Sidebar - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              <div className="mb-6">
                <p className="text-gray-600 mb-2">Precio por persona</p>
                <div className="flex items-end gap-2">
                  <span className="text-4xl font-bold text-[#2563EB]">
                    ${pkg.price.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duración</span>
                  <span className="font-medium">{pkg.duration}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Transporte</span>
                  <span className="font-medium capitalize">{pkg.transport}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Hotel</span>
                  <span className="font-medium">{pkg.hotel.stars} estrellas</span>
                </div>
              </div>

              <Link
                to={`/checkout/${pkg.id}`}
                className="block w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-center font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 mb-4"
              >
                Reservar ahora
              </Link>

              <p className="text-sm text-gray-500 text-center">
                Pago 100% seguro • Cancela gratis hasta 48h antes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import Navbar from "../components/Navbar";
import { hotelService, HotelResponse } from "../services/hotel.service";
import { Star, MapPin, Phone, Mail, ArrowLeft } from "lucide-react";
import { motion } from "motion/react";

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState<HotelResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    hotelService.getById(parseInt(id))
      .then(setHotel)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Cargando hotel...</p>
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Hotel no encontrado</h1>
        <Link to="/search" className="mt-4 inline-block text-[#FF6B35] hover:underline">
          ← Volver a hoteles
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back */}
        <Link to="/search" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#FF6B35] mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Volver a hoteles
        </Link>

        {/* Header */}
        <div className="relative h-96 md:h-[400px] rounded-3xl overflow-hidden mb-8 bg-gradient-to-br from-orange-400 to-orange-600">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-5 h-5" />
              <span className="text-lg">{hotel.ciudad}, {hotel.pais}</span>
            </div>
            <h1 className="text-5xl font-bold mb-4">{hotel.nombre_hotel}</h1>
            <div className="flex items-center gap-2">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className={`w-5 h-5 ${i < hotel.calificacion ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-gray-400 text-gray-400'}`} />
              ))}
              <span className="text-lg font-semibold ml-1">{hotel.calificacion} estrellas</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-2xl shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Información del hotel</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  <div>
                    <p className="text-xs text-gray-500">Ciudad</p>
                    <p className="font-semibold text-gray-900">{hotel.ciudad}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-[#FF6B35]" />
                  <div>
                    <p className="text-xs text-gray-500">País</p>
                    <p className="font-semibold text-gray-900">{hotel.pais}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-[#FF6B35]" />
                  <div>
                    <p className="text-xs text-gray-500">Correo</p>
                    <p className="font-semibold text-gray-900 truncate">{hotel.correo_electronico}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-[#FF6B35]" />
                  <div>
                    <p className="text-xs text-gray-500">Teléfono</p>
                    <p className="font-semibold text-gray-900">{hotel.telefono}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < hotel.calificacion ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-gray-200 text-gray-200'}`} />
                ))}
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">{hotel.nombre_hotel}</h2>
              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Ciudad</span>
                  <span className="font-medium">{hotel.ciudad}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">País</span>
                  <span className="font-medium">{hotel.pais}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Calificación</span>
                  <span className="font-medium">{hotel.calificacion} estrellas</span>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to={`/checkout/${hotel.id_hotel}`}
                  className="block w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white text-center font-semibold rounded-xl hover:shadow-2xl transition-all duration-300 mb-4"
                >
                  Reservar ahora
                </Link>
              </motion.div>
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
import { Link } from "react-router";
import { Star, ArrowRight, MapPin, Phone, Mail } from "lucide-react";
import { HotelResponse } from "../services/hotel.service";
import { motion } from "motion/react";

interface HotelCardProps {
  hotel: HotelResponse;
  index?: number;
}

export default function HotelCard({ hotel, index = 0 }: HotelCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Link
        to={`/hotel/${hotel.id_hotel}`}
        className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        {/* Image placeholder con gradiente */}
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600">
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Estrellas badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="absolute top-4 right-4"
          >
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-1">
              <Star className="w-4 h-4 fill-[#F7931E] text-[#F7931E]" />
              <span className="text-sm font-semibold text-gray-900">
                {hotel.calificacion}
              </span>
            </div>
          </motion.div>

          {/* Nombre del hotel */}
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-2 text-white mb-1">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{hotel.ciudad}, {hotel.pais}</span>
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-lg line-clamp-1">
              {hotel.nombre_hotel}
            </h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Estrellas visuales */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-0.5 bg-orange-50 px-3 py-1 rounded-full">
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < hotel.calificacion
                      ? "fill-[#F7931E] text-[#F7931E]"
                      : "fill-gray-200 text-gray-200"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">
              {hotel.calificacion} estrellas
            </span>
          </div>

          {/* Contacto */}
          <div className="space-y-1.5 mb-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Mail className="w-4 h-4 flex-shrink-0 text-[#FF6B35]" />
              <span className="truncate">{hotel.correo_electronico}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Phone className="w-4 h-4 flex-shrink-0 text-[#FF6B35]" />
              <span>{hotel.telefono}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-end justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">Ubicación</p>
              <p className="text-lg font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                {hotel.ciudad}
              </p>
              <p className="text-xs text-gray-400">{hotel.pais}</p>
            </div>
            <motion.div
              whileHover={{ x: 5 }}
              className="flex items-center gap-2 text-[#FF6B35] font-semibold group-hover:gap-3 transition-all duration-300"
            >
              <span>Ver más</span>
              <ArrowRight className="w-5 h-5" />
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
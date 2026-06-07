import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import HotelCard from "../components/HotelCard";
import { SlidersHorizontal, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { hotelService, HotelResponse } from "../services/hotel.service";

export default function SearchResults() {
  const [hoteles, setHoteles] = useState<HotelResponse[]>([]);
  const [filtrados, setFiltrados] = useState<HotelResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [calificacionFilter, setCalificacionFilter] = useState<string>("all");
  const [paisFilter, setPaisFilter] = useState<string>("all");
  const [ciudadFilter, setCiudadFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    hotelService.getAll()
      .then((data) => { setHoteles(data); setFiltrados(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltrados(
      hoteles.filter((h) => {
        const matchesCal = calificacionFilter === "all" || h.calificacion === parseInt(calificacionFilter);
        const matchesPais = paisFilter === "all" || h.pais === paisFilter;
        const matchesCiudad = ciudadFilter === "all" || h.ciudad === ciudadFilter;
        return matchesCal && matchesPais && matchesCiudad;
      })
    );
  }, [calificacionFilter, paisFilter, ciudadFilter, hoteles]);

  function limpiarFiltros() {
    setCalificacionFilter("all");
    setPaisFilter("all");
    setCiudadFilter("all");
  }

  const paises = [...new Set(hoteles.map((h) => h.pais))].sort();
  const ciudades = [...new Set(hoteles.map((h) => h.ciudad))].sort();

  const FilterContent = () => (
    <>
      {/* Calificación */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4 text-gray-900">Calificación</h3>
        <div className="space-y-3">
          <motion.label whileHover={{ x: 5 }} className="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="cal" checked={calificacionFilter === "all"}
              onChange={() => setCalificacionFilter("all")}
              className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer" />
            <span className="text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">Todas</span>
          </motion.label>
          {[5, 4, 3, 2, 1].map((n) => (
            <motion.label key={n} whileHover={{ x: 5 }} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="cal" checked={calificacionFilter === String(n)}
                onChange={() => setCalificacionFilter(String(n))}
                className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer" />
              <span className="flex items-center gap-1 text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">
                {Array.from({ length: n }, (_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#F7931E] text-[#F7931E]" />
                ))}
                {Array.from({ length: 5 - n }, (_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-gray-200 text-gray-200" />
                ))}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* País */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4 text-gray-900">País</h3>
        <div className="space-y-3">
          <motion.label whileHover={{ x: 5 }} className="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="pais" checked={paisFilter === "all"}
              onChange={() => setPaisFilter("all")}
              className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer" />
            <span className="text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">Todos</span>
          </motion.label>
          {paises.map((pais) => (
            <motion.label key={pais} whileHover={{ x: 5 }} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="pais" checked={paisFilter === pais}
                onChange={() => setPaisFilter(pais)}
                className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer" />
              <span className="text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">{pais}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Ciudad */}
      <div className="mb-6">
        <h3 className="font-semibold mb-4 text-gray-900">Ciudad</h3>
        <div className="space-y-3">
          <motion.label whileHover={{ x: 5 }} className="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="ciudad" checked={ciudadFilter === "all"}
              onChange={() => setCiudadFilter("all")}
              className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer" />
            <span className="text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">Todas</span>
          </motion.label>
          {ciudades.map((ciudad) => (
            <motion.label key={ciudad} whileHover={{ x: 5 }} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="ciudad" checked={ciudadFilter === ciudad}
                onChange={() => setCiudadFilter(ciudad)}
                className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer" />
              <span className="text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">{ciudad}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Limpiar */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={limpiarFiltros}
        className="w-full py-2.5 border border-[#FF6B35] text-[#FF6B35] rounded-xl text-sm font-semibold hover:bg-orange-50 transition-colors"
      >
        Limpiar filtros
      </motion.button>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent mb-3">
            Hoteles disponibles
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-lg">
              {filtrados.length} hoteles encontrados
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtros
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg p-6 sticky top-24 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Filtros</h2>
              </div>
              <FilterContent />
            </motion.div>
          </aside>

          {/* Mobile filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Filtros</h2>
                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  <FilterContent />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          <main className="flex-1">
            {loading ? (
              <div className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100">
                <p className="text-gray-500 text-lg">Cargando hoteles...</p>
              </div>
            ) : filtrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtrados.map((hotel, index) => (
                  <HotelCard key={hotel.id_hotel} hotel={hotel} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SlidersHorizontal className="w-12 h-12 text-[#FF6B35]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No encontramos hoteles</h3>
                <p className="text-gray-600 mb-6">Intenta ajustar los filtros para ver más opciones</p>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={limpiarFiltros}
                  className="px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-xl font-semibold hover:shadow-xl transition-all"
                >
                  Limpiar filtros
                </motion.button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
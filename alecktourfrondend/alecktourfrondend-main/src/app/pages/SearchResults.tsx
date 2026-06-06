import Navbar from "../components/Navbar";
import PackageCard from "../components/PackageCard";
import { packages } from "../data/packages";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function SearchResults() {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 3000000]);
  const [transportFilter, setTransportFilter] = useState<string>("all");
  const [durationFilter, setDurationFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredPackages = packages.filter((pkg) => {
    const matchesPrice = pkg.price >= priceRange[0] && pkg.price <= priceRange[1];
    const matchesTransport = transportFilter === "all" || pkg.transport === transportFilter;
    const matchesDuration =
      durationFilter === "all" ||
      (durationFilter === "short" && pkg.duration.includes("2 días")) ||
      (durationFilter === "medium" && (pkg.duration.includes("3 días") || pkg.duration.includes("4 días"))) ||
      (durationFilter === "long" && pkg.duration.includes("5 días"));

    return matchesPrice && matchesTransport && matchesDuration;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent mb-3">
            Resultados de búsqueda
          </h1>
          <div className="flex items-center justify-between">
            <p className="text-gray-600 text-lg">
              {filteredPackages.length} paquetes increíbles disponibles
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#FF6B35] text-white rounded-xl font-medium"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtros
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Desktop */}
          <aside className="hidden lg:block lg:w-80 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-lg p-6 sticky top-24 border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Filtros</h2>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4 text-gray-900">Precio</h3>
                <div className="space-y-3">
                  {[
                    { label: "Todos los precios", range: [0, 3000000] },
                    { label: "Menos de $1.000.000", range: [0, 1000000] },
                    { label: "$1.000.000 - $2.000.000", range: [1000000, 2000000] },
                    { label: "Más de $2.000.000", range: [2000000, 3000000] },
                  ].map((option, index) => (
                    <motion.label
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="price"
                        checked={priceRange[0] === option.range[0] && priceRange[1] === option.range[1]}
                        onChange={() => setPriceRange(option.range as [number, number])}
                        className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">
                        {option.label}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Transport Filter */}
              <div className="mb-6">
                <h3 className="font-semibold mb-4 text-gray-900">Transporte</h3>
                <div className="space-y-3">
                  {[
                    { value: "all", label: "Todos" },
                    { value: "vuelo", label: "Vuelo" },
                    { value: "bus", label: "Bus" },
                  ].map((option, index) => (
                    <motion.label
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="transport"
                        checked={transportFilter === option.value}
                        onChange={() => setTransportFilter(option.value)}
                        className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">
                        {option.label}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>

              {/* Duration Filter */}
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">Duración</h3>
                <div className="space-y-3">
                  {[
                    { value: "all", label: "Todas" },
                    { value: "short", label: "Corta (1-2 días)" },
                    { value: "medium", label: "Media (3-4 días)" },
                    { value: "long", label: "Larga (5+ días)" },
                  ].map((option, index) => (
                    <motion.label
                      key={index}
                      whileHover={{ x: 5 }}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name="duration"
                        checked={durationFilter === option.value}
                        onChange={() => setDurationFilter(option.value)}
                        className="w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35] cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 group-hover:text-[#FF6B35] transition-colors">
                        {option.label}
                      </span>
                    </motion.label>
                  ))}
                </div>
              </div>
            </motion.div>
          </aside>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-white p-6 overflow-y-auto"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">Filtros</h2>
                    <button
                      onClick={() => setShowFilters(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>
                  {/* Same filter content as desktop */}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results Grid */}
          <main className="flex-1">
            {filteredPackages.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredPackages.map((pkg, index) => (
                  <PackageCard key={pkg.id} package={pkg} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl shadow-lg p-16 text-center border border-gray-100"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <SlidersHorizontal className="w-12 h-12 text-[#FF6B35]" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  No encontramos paquetes
                </h3>
                <p className="text-gray-600 mb-6">
                  Intenta ajustar los filtros para ver más opciones
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setPriceRange([0, 3000000]);
                    setTransportFilter("all");
                    setDurationFilter("all");
                  }}
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

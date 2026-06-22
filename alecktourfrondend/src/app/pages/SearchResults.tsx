import { SlidersHorizontal, Star, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import HotelCard from "../components/HotelCard";
import Navbar from "../components/Navbar";
import { HotelResponse, hotelService } from "../services/hotel.service";

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
        <h3 className="font-semibold mb-3 text-foreground text-sm uppercase tracking-wider text-muted-foreground/80">Calificación</h3>
        <div className="space-y-2.5">
          <motion.label whileHover={{ x: 3 }} className="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="cal" checked={calificacionFilter === "all"}
              onChange={() => setCalificacionFilter("all")}
              className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background cursor-pointer" />
            <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">Todas las estrellas</span>
          </motion.label>
          {[5, 4, 3, 2, 1].map((n) => (
            <motion.label key={n} whileHover={{ x: 3 }} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="cal" checked={calificacionFilter === String(n)}
                onChange={() => setCalificacionFilter(String(n))}
                className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background cursor-pointer" />
              <span className="flex items-center gap-0.5 text-sm text-foreground/90 group-hover:text-primary transition-colors">
                {Array.from({ length: n }, (_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
                {Array.from({ length: 5 - n }, (_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-muted text-muted/40" />
                ))}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* País */}
      <div className="mb-6 border-t border-border/60 pt-5">
        <h3 className="font-semibold mb-3 text-foreground text-sm uppercase tracking-wider text-muted-foreground/80">País</h3>
        <div className="space-y-2.5">
          <motion.label whileHover={{ x: 3 }} className="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="pais" checked={paisFilter === "all"}
              onChange={() => setPaisFilter("all")}
              className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background cursor-pointer" />
            <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">Todos los destinos</span>
          </motion.label>
          {paises.map((pais) => (
            <motion.label key={pais} whileHover={{ x: 3 }} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="pais" checked={paisFilter === pais}
                onChange={() => setPaisFilter(pais)}
                className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background cursor-pointer" />
              <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">{pais}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Ciudad */}
      <div className="mb-6 border-t border-border/60 pt-5">
        <h3 className="font-semibold mb-3 text-foreground text-sm uppercase tracking-wider text-muted-foreground/80">Ciudad</h3>
        <div className="space-y-2.5">
          <motion.label whileHover={{ x: 3 }} className="flex items-center gap-3 cursor-pointer group">
            <input type="radio" name="ciudad" checked={ciudadFilter === "all"}
              onChange={() => setCiudadFilter("all")}
              className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background cursor-pointer" />
            <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">Todas las ciudades</span>
          </motion.label>
          {ciudades.map((ciudad) => (
            <motion.label key={ciudad} whileHover={{ x: 3 }} className="flex items-center gap-3 cursor-pointer group">
              <input type="radio" name="ciudad" checked={ciudadFilter === ciudad}
                onChange={() => setCiudadFilter(ciudad)}
                className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background cursor-pointer" />
              <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">{ciudad}</span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* Limpiar */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={limpiarFiltros}
        className="w-full mt-2 py-2.5 border border-border bg-card text-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors"
      >
        Limpiar filtros
      </motion.button>
    </>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl mb-2">
            Complejos e instalaciones
          </h1>
          <div className="flex items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm md:text-base font-medium">
              Se encontraron {filtrados.length} {filtrados.length === 1 ? 'opción disponible' : 'opciones disponibles'}
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold shadow-xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filtrar
            </motion.button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Sidebar desktop */}
          <aside className="hidden lg:block lg:col-span-1 sticky top-24">
            <motion.div
              initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
              className="bg-card rounded-2xl border border-border p-6 shadow-xs"
            >
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
                  <SlidersHorizontal className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-lg font-bold text-foreground">Filtros avanzados</h2>
              </div>
              <FilterContent />
            </motion.div>
          </aside>

          {/* Mobile filters drawer */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 200 }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-0 bottom-0 w-80 bg-card p-6 overflow-y-auto border-l border-border shadow-2xl"
                >
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-primary" />
                      <h2 className="text-lg font-bold text-foreground">Filtros</h2>
                    </div>
                    <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-muted text-muted-foreground rounded-xl transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <FilterContent />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid de resultados */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="bg-card rounded-2xl border border-border p-16 text-center shadow-xs">
                <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent align-[-0.125em]" />
                <p className="text-muted-foreground text-sm mt-3 font-medium">Buscando alojamientos disponibles...</p>
              </div>
            ) : filtrados.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtrados.map((hotel, index) => (
                  <HotelCard key={hotel.id_hotel} hotel={hotel} index={index} />
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-card rounded-2xl border border-border p-12 md:p-16 text-center shadow-xs"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-primary/20">
                  <SlidersHorizontal className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">Sin coincidencias exactas</h3>
                <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">Reajusta la calificación, ciudades o el país seleccionado para expandir la exploración.</p>
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={limpiarFiltros}
                  className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs"
                >
                  Restablecer parámetros
                </motion.button>
              </motion.div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
import {
  Building2,
  MapPin,
  Search,
  SlidersHorizontal,
  Star,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Footer from "../components/Footer";
import HotelCard from "../components/HotelCard";
import Navbar from "../components/Navbar";
import { HotelResponse, hotelService } from "../services/hotel.service";

export default function SearchResults() {
  const [searchParams] = useSearchParams();

  const [hoteles, setHoteles] = useState<HotelResponse[]>([]);
  const [filtrados, setFiltrados] = useState<HotelResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const [calificacionFilter, setCalificacionFilter] =
    useState<string>("all");

  const [paisFilter, setPaisFilter] =
    useState<string>("all");

  const [ciudadFilter, setCiudadFilter] =
    useState<string>("all");

  const [ciudadSearch, setCiudadSearch] =
    useState<string>("");

  const [showFilters, setShowFilters] =
    useState(false);

  const [startDate, setStartDate] =
    useState<string>("");

  const [endDate, setEndDate] =
    useState<string>("");

  const [people, setPeople] =
    useState<string>("");

  /*
   * IMPORTANTE:
   * Este es el destino enviado desde SearchBar.
   *
   * Ejemplo:
   * /search?destination=Cartagena
   */
  const destinationSearch =
    searchParams.get("destination")?.trim() ?? "";

  /*
   * CARGAR HOTELES
   */
  useEffect(() => {
    setLoading(true);

    hotelService
      .getAll()
      .then((data) => {
        setHoteles(data);

        const start = searchParams.get("start");
        const end = searchParams.get("end");
        const ppl = searchParams.get("people");

        if (start) setStartDate(start);
        if (end) setEndDate(end);
        if (ppl) setPeople(ppl);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [searchParams]);

  /*
   * FILTRADO
   *
   * Esta es la lógica que conecta SearchBar
   * con los hoteles.
   */
  useEffect(() => {
    const destination =
      destinationSearch.toLowerCase();

    const resultado = hoteles.filter((h) => {
      /*
       * DESTINO DESDE EL SEARCHBAR
       */
      const matchesDestination =
        !destination ||
        h.ciudad
          ?.toLowerCase()
          .includes(destination) ||
        h.pais
          ?.toLowerCase()
          .includes(destination) ||
        h.nombre_hotel
          ?.toLowerCase()
          .includes(destination);

      /*
       * FILTRO CALIFICACIÓN
       */
      const matchesCal =
        calificacionFilter === "all" ||
        h.calificacion ===
        parseInt(calificacionFilter);

      /*
       * FILTRO PAÍS
       */
      const matchesPais =
        paisFilter === "all" ||
        h.pais === paisFilter;

      /*
       * FILTRO CIUDAD
       */
      const matchesCiudad =
        ciudadFilter === "all" ||
        h.ciudad === ciudadFilter;

      return (
        matchesDestination &&
        matchesCal &&
        matchesPais &&
        matchesCiudad
      );
    });

    setFiltrados(resultado);
  }, [
    hoteles,
    destinationSearch,
    calificacionFilter,
    paisFilter,
    ciudadFilter,
  ]);

  /*
   * LIMPIAR FILTROS
   */
  function limpiarFiltros() {
    setCalificacionFilter("all");
    setPaisFilter("all");
    setCiudadFilter("all");
    setCiudadSearch("");
  }

  /*
   * DATOS PARA FILTROS
   */
  const paises = [
    ...new Set(
      hoteles
        .map((h) => h.pais)
        .filter(Boolean)
    ),
  ].sort();

  const ciudades = [
    ...new Set(
      hoteles
        .map((h) => h.ciudad)
        .filter(Boolean)
    ),
  ].sort();

  const ciudadesFiltradas =
    ciudades.filter((c) =>
      c.toLowerCase().includes(
        ciudadSearch.toLowerCase()
      )
    );

  /*
   * FILTROS
   */
  const FilterContent = () => (
    <>
      {/* CALIFICACIÓN */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground/80">
          Calificación
        </h3>

        <div className="space-y-2.5">
          <motion.label
            whileHover={{ x: 3 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="cal"
              checked={
                calificacionFilter === "all"
              }
              onChange={() =>
                setCalificacionFilter("all")
              }
              className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background cursor-pointer"
            />

            <span className="text-sm text-foreground/90 group-hover:text-primary transition-colors">
              Todas las estrellas
            </span>
          </motion.label>

          {[5, 4, 3, 2, 1].map((n) => (
            <motion.label
              key={n}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="cal"
                checked={
                  calificacionFilter ===
                  String(n)
                }
                onChange={() =>
                  setCalificacionFilter(
                    String(n)
                  )
                }
                className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background cursor-pointer"
              />

              <span className="flex items-center gap-0.5 text-sm">
                {Array.from(
                  { length: n },
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-amber-400 text-amber-400"
                    />
                  )
                )}

                {Array.from(
                  { length: 5 - n },
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-3.5 h-3.5 fill-muted text-muted/40"
                    />
                  )
                )}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* PAÍS */}
      <div className="mb-6 border-t border-border/60 pt-5">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground/80">
          País
        </h3>

        <div className="space-y-2.5">
          <motion.label
            whileHover={{ x: 3 }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <input
              type="radio"
              name="pais"
              checked={
                paisFilter === "all"
              }
              onChange={() =>
                setPaisFilter("all")
              }
              className="w-4 h-4 text-primary"
            />

            <span className="text-sm text-foreground/90">
              Todos los destinos
            </span>
          </motion.label>

          {paises.map((pais) => (
            <motion.label
              key={pais}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="radio"
                name="pais"
                checked={
                  paisFilter === pais
                }
                onChange={() =>
                  setPaisFilter(pais)
                }
                className="w-4 h-4 text-primary"
              />

              <span className="text-sm text-foreground/90">
                {pais}
              </span>
            </motion.label>
          ))}
        </div>
      </div>

      {/* CIUDAD */}
      <div className="mb-6 border-t border-border/60 pt-5">
        <h3 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground/80">
          Ciudad
        </h3>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />

          <input
            type="text"
            value={ciudadSearch}
            onChange={(e) =>
              setCiudadSearch(e.target.value)
            }
            placeholder="Buscar ciudad..."
            className="w-full pl-9 pr-8 py-2 text-sm rounded-lg border border-border bg-input-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />

          {ciudadSearch && (
            <button
              type="button"
              onClick={() =>
                setCiudadSearch("")
              }
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
          <motion.label
            whileHover={{ x: 3 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <input
              type="radio"
              name="ciudad"
              checked={
                ciudadFilter === "all"
              }
              onChange={() =>
                setCiudadFilter("all")
              }
              className="w-4 h-4 text-primary"
            />

            <span className="text-sm">
              Todas las ciudades
            </span>
          </motion.label>

          <AnimatePresence>
            {ciudadesFiltradas.map(
              (ciudad) => (
                <motion.label
                  key={ciudad}
                  initial={{
                    opacity: 0,
                    x: -6,
                  }}
                  animate={{
                    opacity: 1,
                    x: 0,
                  }}
                  exit={{
                    opacity: 0,
                    x: -6,
                  }}
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="ciudad"
                    checked={
                      ciudadFilter ===
                      ciudad
                    }
                    onChange={() =>
                      setCiudadFilter(
                        ciudad
                      )
                    }
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-sm">
                    {ciudad}
                  </span>
                </motion.label>
              )
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* LIMPIAR */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="button"
        onClick={limpiarFiltros}
        className="w-full mt-2 py-2.5 border border-border bg-card text-foreground rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-muted transition-colors"
      >
        Limpiar filtros
      </motion.button>
    </>
  );

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* HEADER */}
          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="mb-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>

                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Resultados de búsqueda
                  </span>
                </div>

                <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl mb-2">
                  {destinationSearch
                    ? `Hoteles en ${destinationSearch}`
                    : "Encuentra tu alojamiento"}
                </h1>

                <p className="text-muted-foreground text-sm md:text-base font-medium">
                  {loading
                    ? "Buscando las mejores opciones..."
                    : `${filtrados.length} ${filtrados.length === 1
                      ? "alojamiento encontrado"
                      : "alojamientos encontrados"
                    }`}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-3">
                  {startDate && (
                    <span className="px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                      {startDate}
                    </span>
                  )}

                  {endDate && (
                    <span className="px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                      {endDate}
                    </span>
                  )}

                  {people && (
                    <span className="px-2.5 py-1 rounded-full bg-muted text-xs text-muted-foreground">
                      {people}{" "}
                      {people === "1"
                        ? "persona"
                        : "personas"}
                    </span>
                  )}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() =>
                  setShowFilters(
                    !showFilters
                  )
                }
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filtrar
              </motion.button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">

            {/* SIDEBAR */}
            <aside className="hidden lg:block lg:col-span-1 sticky top-24">
              <motion.div
                initial={{
                  opacity: 0,
                  x: -15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                className="bg-card rounded-2xl border border-border p-6 shadow-xs"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
                  <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                  </div>

                  <h2 className="text-lg font-bold">
                    Filtros avanzados
                  </h2>
                </div>

                <FilterContent />
              </motion.div>
            </aside>

            {/* MOBILE FILTER */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 lg:hidden"
                  onClick={() =>
                    setShowFilters(false)
                  }
                >
                  <motion.div
                    initial={{
                      x: "100%",
                    }}
                    animate={{
                      x: 0,
                    }}
                    exit={{
                      x: "100%",
                    }}
                    transition={{
                      type: "spring",
                      damping: 25,
                      stiffness: 200,
                    }}
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    className="absolute right-0 top-0 bottom-0 w-80 bg-card p-6 overflow-y-auto border-l border-border shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                      <div className="flex items-center gap-2">
                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                        <h2 className="text-lg font-bold">
                          Filtros
                        </h2>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          setShowFilters(
                            false
                          )
                        }
                        className="p-2 hover:bg-muted rounded-xl"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <FilterContent />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RESULTADOS */}
            <main className="lg:col-span-3">
              {loading ? (
                <div className="bg-card rounded-2xl border border-border p-16 text-center">
                  <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-primary border-r-transparent" />

                  <p className="text-muted-foreground text-sm mt-3">
                    Buscando alojamientos...
                  </p>
                </div>
              ) : filtrados.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtrados.map(
                    (hotel, index) => (
                      <HotelCard
                        key={hotel.id_hotel}
                        hotel={hotel}
                        index={index}
                      />
                    )
                  )}
                </div>
              ) : (
                <motion.div
                  initial={{
                    opacity: 0,
                    scale: 0.98,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                  }}
                  className="bg-card rounded-2xl border border-border p-12 md:p-16 text-center"
                >
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">
                    No encontramos hoteles
                  </h3>

                  <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
                    No encontramos alojamientos
                    para{" "}
                    <strong>
                      {destinationSearch ||
                        "este destino"}
                    </strong>
                    . Prueba con otra ciudad,
                    país o elimina algunos
                    filtros.
                  </p>

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}
                    whileTap={{
                      scale: 0.98,
                    }}
                    type="button"
                    onClick={
                      limpiarFiltros
                    }
                    className="px-5 py-2.5 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider rounded-xl"
                  >
                    Restablecer filtros
                  </motion.button>
                </motion.div>
              )}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
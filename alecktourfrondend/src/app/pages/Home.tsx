import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import { TrendingUp, Shield, Headphones, Star, Globe, Award, Sparkles, Clock, MapPin, Plane, Bus, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";
import { paqueteService, PaquetePopular } from "../services/paquete.service";

// Imágenes por destino — se asignan según palabras clave del nombre del paquete
const DESTINATION_IMAGES: Record<string, string> = {
  caribe:    "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?w=800&q=80",
  cartagena: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  medellin:  "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
  paisa:     "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80",
  bogota:    "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=800&q=80",
  cultural:  "https://images.unsplash.com/photo-1605723517503-3cadb5818a0c?w=800&q=80",
  cafetero:  "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  eje:       "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  tatacoa:   "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  macarena:  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&q=80",
  "san andres": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  premium:   "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
  sur:       "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
  lajas:     "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800&q=80",
  romantica: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800&q=80",
  adrenalina:"https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  default:   "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=800&q=80",
};

function getImageForPackage(nombre: string): string {
  const lower = nombre.toLowerCase();
  for (const [key, url] of Object.entries(DESTINATION_IMAGES)) {
    if (lower.includes(key)) return url;
  }
  return DESTINATION_IMAGES.default;
}

function getTransport(nombre: string): "vuelo" | "bus" {
  const lower = nombre.toLowerCase();
  if (lower.includes("caribe") || lower.includes("san andres") || lower.includes("premium")) return "vuelo";
  return "bus";
}

// ─── Tarjeta de paquete inline (sin depender de TravelPackage) ───────────────
function PaqueteCard({ pkg, index }: { pkg: PaquetePopular; index: number }) {
  const imagen = getImageForPackage(pkg.nombre_paquete);
  const transporte = getTransport(pkg.nombre_paquete);
  const rating = pkg.calificacion_estimada > 0 ? pkg.calificacion_estimada : 4.5;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <Link
        to={`/package/${pkg.id_paquete}`}
        className="group block bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden"
      >
        {/* Imagen */}
        <div className="relative h-64 overflow-hidden">
          <motion.img
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6 }}
            src={imagen}
            alt={pkg.nombre_paquete}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Badge transporte */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 + index * 0.1 }}
            className="absolute top-4 right-4"
          >
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
              {transporte === "vuelo"
                ? <><Plane className="w-4 h-4 text-[#FF6B35]" /><span className="text-sm font-semibold text-gray-900">Vuelo</span></>
                : <><Bus  className="w-4 h-4 text-[#FF6B35]" /><span className="text-sm font-semibold text-gray-900">Bus</span></>
              }
            </div>
          </motion.div>

          {/* Badge popularidad */}
          {pkg.total_reservas > 0 && (
            <div className="absolute top-4 left-4">
              <div className="bg-[#FF6B35]/90 backdrop-blur-sm px-3 py-1 rounded-full">
                <span className="text-xs font-bold text-white">🔥 {pkg.total_reservas} reservas</span>
              </div>
            </div>
          )}

          {/* Nombre destino */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-white">
            <MapPin className="w-5 h-5" />
            <span className="text-xl font-bold drop-shadow-lg">{pkg.nombre_paquete}</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 fill-[#F7931E] text-[#F7931E]" />
                <span className="text-sm font-bold text-gray-900">{rating}</span>
              </div>
              <span className="text-sm text-gray-500">({pkg.total_reservas} viajeros)</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{pkg.duracion_dias} días</span>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{pkg.descripcion}</p>

          <div className="flex items-end justify-between pt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 mb-1">Desde</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                ${Number(pkg.precio_base).toLocaleString("es-CO")}
              </p>
              <p className="text-xs text-gray-400">por persona</p>
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

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function PackageSkeleton() {
  return (
    <div className="bg-white rounded-3xl shadow-lg overflow-hidden animate-pulse">
      <div className="h-64 bg-gray-200" />
      <div className="p-6 space-y-3">
        <div className="flex justify-between">
          <div className="h-6 w-20 bg-gray-200 rounded-full" />
          <div className="h-6 w-16 bg-gray-200 rounded-full" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
          <div className="space-y-1">
            <div className="h-3 w-10 bg-gray-200 rounded" />
            <div className="h-8 w-28 bg-gray-200 rounded" />
          </div>
          <div className="h-5 w-16 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────
export default function Home() {
  const [popularPackages, setPopularPackages] = useState<PaquetePopular[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    paqueteService.getPopulares(6)
      .then(setPopularPackages)
      .catch(() => setPopularPackages([]))
      .finally(() => setLoading(false));
  }, []);

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* ── Hero ── */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1765978372751-aa89dc6d30e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0cm9waWNhbCUyMHZhY2F0aW9uJTIwYmVhY2glMjByZXNvcnR8ZW58MXx8fHwxNzc0MDUwNjMyfDA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-[#FF6B35]/30" />
          <motion.div animate={floatingAnimation} className="absolute top-20 right-20 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full" />
          <motion.div
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
            className="absolute bottom-40 left-20 w-16 h-16 bg-[#FF6B35]/20 backdrop-blur-sm rounded-full"
          />
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 border border-white/20"
            >
              <Star className="w-5 h-5 text-[#F7931E] fill-[#F7931E]" />
              <span className="text-white font-medium">Tu próxima aventura comienza aquí</span>
            </motion.div>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Descubre Colombia
              <motion.span
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="block mt-3 bg-gradient-to-r from-[#FF6B35] via-[#FF8E53] to-[#F7931E] bg-clip-text text-transparent"
              >
                Vive experiencias únicas
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto"
            >
              Explora los destinos más increíbles de Colombia con paquetes todo incluido
              diseñados para hacer de tu viaje una experiencia inolvidable
            </motion.p>
          </motion.div>
        </div>

        <div className="absolute bottom-20 left-0 right-0 px-4 z-20">
          <SearchBar />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="mt-32 py-12 bg-gradient-to-r from-[#FF6B35] to-[#F7931E]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Globe, value: "50+",  label: "Destinos" },
              { icon: Star,  value: "4.9",  label: "Calificación" },
              { icon: Award, value: "10K+", label: "Viajeros felices" },
              { icon: Shield,value: "100%", label: "Seguro" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center text-white"
              >
                <motion.div whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.6 }}>
                  <stat.icon className="w-12 h-12 mx-auto mb-3" />
                </motion.div>
                <p className="text-4xl font-bold mb-1">{stat.value}</p>
                <p className="text-white/90">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Beneficios ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">¿Por qué elegir AleckTours?</h2>
            <p className="text-xl text-gray-600">La mejor experiencia de viaje al mejor precio</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: TrendingUp, title: "Mejores precios",   description: "Garantizamos las tarifas más competitivas del mercado con ofertas exclusivas",        gradient: "from-[#FF6B35] to-[#FF8E53]" },
              { icon: Shield,     title: "Pago 100% seguro", description: "Tus datos están protegidos con encriptación de nivel bancario",                         gradient: "from-[#FF8E53] to-[#F7931E]" },
              { icon: Headphones, title: "Soporte 24/7",     description: "Estamos disponibles en todo momento para ayudarte con lo que necesites",                 gradient: "from-[#F7931E] to-[#FF6B35]" },
            ].map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className={`w-16 h-16 bg-gradient-to-br ${b.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                    <b.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{b.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{b.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Paquetes Populares (desde vista_paquetes_populares) ── */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }} className="inline-flex items-center gap-2 bg-orange-100 px-6 py-3 rounded-full mb-6">
              <Star className="w-5 h-5 text-[#FF6B35] fill-[#FF6B35]" />
              <span className="text-[#FF6B35] font-semibold">Los más reservados</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Paquetes Populares</h2>
            <p className="text-xl text-gray-600">Ordenados por reservas reales de nuestros viajeros</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <PackageSkeleton key={i} />)
              : popularPackages.length > 0
                ? popularPackages.map((pkg, i) => <PaqueteCard key={pkg.id_paquete} pkg={pkg} index={i} />)
                : (
                  <div className="col-span-3 text-center py-16 text-gray-400">
                    <Globe className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p className="text-lg">No hay paquetes disponibles por el momento.</p>
                  </div>
                )
            }
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mt-12">
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/search"
              className="inline-block px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-full font-semibold text-lg hover:shadow-2xl transition-all duration-300"
            >
              Ver todos los paquetes
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ── Testimonios ── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Lo que dicen nuestros viajeros</h2>
            <p className="text-xl text-gray-600">Miles de experiencias inolvidables</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "María González", location: "Bogotá",   text: "Increíble experiencia en Cartagena. Todo perfectamente organizado, desde el vuelo hasta el hotel. ¡100% recomendado!", rating: 5, image: "👩‍💼" },
              { name: "Carlos Ramírez", location: "Medellín", text: "El Eje Cafetero fue mágico. El servicio al cliente de AleckTours fue excepcional en todo momento.",                 rating: 5, image: "👨‍💻" },
              { name: "Ana Martínez",   location: "Cali",     text: "San Andrés superó todas mis expectativas. Los precios son muy competitivos y la calidad excelente.",               rating: 5, image: "👩‍🎓" },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-5 h-5 fill-[#F7931E] text-[#F7931E]" />)}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center text-2xl">{t.image}</div>
                  <div>
                    <p className="font-bold text-gray-900">{t.name}</p>
                    <p className="text-sm text-gray-500">{t.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Banner corporativo ── */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="text-white flex-1">
              <h2 className="text-4xl font-bold mb-4">¿Tu empresa busca beneficios de viaje?</h2>
              <p className="text-xl text-white/90 mb-6">Descuentos exclusivos y servicios personalizados para empresas</p>
              <div className="flex items-center gap-4 text-white/80 mb-2"><Award className="w-5 h-5" /><span>Más de 500 empresas confían en nosotros</span></div>
              <div className="flex items-center gap-4 text-white/80"><TrendingUp className="w-5 h-5" /><span>Hasta 25% de descuento corporativo</span></div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="/corporate"
                className="inline-block px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all">
                Ver convenios empresariales
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Newsletter ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 shadow-2xl text-center border border-gray-100">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-[#FF6B35]" />
              <span className="text-[#FF6B35] font-semibold">Ofertas exclusivas</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Suscríbete a nuestro newsletter</h2>
            <p className="text-xl text-gray-600 mb-8">Recibe ofertas especiales, tips de viaje y descuentos exclusivos</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input type="email" placeholder="tu@email.com"
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none" />
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-xl font-semibold hover:shadow-xl transition-all">
                Suscribirme
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl flex items-center justify-center">
                  <Globe className="w-7 h-7 text-white" />
                </div>
                <span className="text-2xl font-bold">AleckTours</span>
              </div>
              <p className="text-gray-400">Tu compañero de viajes favorito desde 2020</p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Destinos</h4>
              <ul className="space-y-2 text-gray-400">
                {["Cartagena","San Andrés","Eje Cafetero","Santa Marta"].map(d => (
                  <li key={d}><a href="/search" className="hover:text-white transition-colors">{d}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/benefits"    className="hover:text-white transition-colors">Programa de puntos</a></li>
                <li><a href="/corporate"   className="hover:text-white transition-colors">Convenios empresariales</a></li>
                <li><a href="/travel-info" className="hover:text-white transition-colors">Info para tu viaje</a></li>
                <li><a href="/contact"     className="hover:text-white transition-colors">Contáctanos</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contacto</h4>
              <ul className="space-y-2 text-gray-400">
                <li>📞 +57 (1) 800-ALECK</li>
                <li>📧 info@alecktours.com</li>
                <li>🕐 Lun - Vie: 8am - 8pm</li>
                <li>🕐 Sáb - Dom: 9am - 5pm</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-gray-400 text-center">© 2026 AleckTours - Todos los derechos reservados</p>
              <div className="flex items-center gap-6 text-gray-400">
                {["Términos","Privacidad","Cookies"].map(l => <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>)}
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">Hecho con ❤️ en Colombia</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
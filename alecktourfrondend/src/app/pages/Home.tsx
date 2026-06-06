import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import PackageCard from "../components/PackageCard";
import { packages } from "../data/packages";
import { TrendingUp, Shield, Headphones, Star, Globe, Award, Sparkles } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const recommendedPackages = packages.slice(0, 6);

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[700px] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
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
          
          {/* Floating elements */}
          <motion.div
            animate={floatingAnimation}
            className="absolute top-20 right-20 w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full"
          />
          <motion.div
            animate={{ ...floatingAnimation, transition: { ...floatingAnimation.transition, delay: 0.5 } }}
            className="absolute bottom-40 left-20 w-16 h-16 bg-[#FF6B35]/20 backdrop-blur-sm rounded-full"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
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

        {/* Search Bar */}
        <div className="absolute -bottom-20 left-0 right-0 px-4 z-20">
          <SearchBar />
        </div>
      </section>

      {/* Stats Section */}
      <section className="mt-32 py-12 bg-gradient-to-r from-[#FF6B35] to-[#F7931E]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Globe, value: "50+", label: "Destinos" },
              { icon: Star, value: "4.9", label: "Calificación" },
              { icon: Award, value: "10K+", label: "Viajeros felices" },
              { icon: Shield, value: "100%", label: "Seguro" },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
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

      {/* Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              ¿Por qué elegir AleckTours?
            </h2>
            <p className="text-xl text-gray-600">
              La mejor experiencia de viaje al mejor precio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: TrendingUp,
                title: "Mejores precios",
                description: "Garantizamos las tarifas más competitivas del mercado con ofertas exclusivas",
                gradient: "from-[#FF6B35] to-[#FF8E53]",
              },
              {
                icon: Shield,
                title: "Pago 100% seguro",
                description: "Tus datos están protegidos con encriptación de nivel bancario",
                gradient: "from-[#FF8E53] to-[#F7931E]",
              },
              {
                icon: Headphones,
                title: "Soporte 24/7",
                description: "Estamos disponibles en todo momento para ayudarte con lo que necesites",
                gradient: "from-[#F7931E] to-[#FF6B35]",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <benefit.icon className="w-8 h-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recommended Packages */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-orange-100 px-6 py-3 rounded-full mb-6"
            >
              <Star className="w-5 h-5 text-[#FF6B35] fill-[#FF6B35]" />
              <span className="text-[#FF6B35] font-semibold">Los más populares</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Paquetes Recomendados
            </h2>
            <p className="text-xl text-gray-600">
              Los destinos más increíbles de Colombia te esperan
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recommendedPackages.map((pkg, index) => (
              <PackageCard key={pkg.id} package={pkg} index={index} />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mt-12"
          >
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

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Lo que dicen nuestros viajeros
            </h2>
            <p className="text-xl text-gray-600">
              Miles de experiencias inolvidables
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "María González",
                location: "Bogotá",
                text: "Increíble experiencia en Cartagena. Todo perfectamente organizado, desde el vuelo hasta el hotel. ¡100% recomendado!",
                rating: 5,
                image: "👩‍💼",
              },
              {
                name: "Carlos Ramírez",
                location: "Medellín",
                text: "El Eje Cafetero fue mágico. El servicio al cliente de AleckTours fue excepcional en todo momento.",
                rating: 5,
                image: "👨‍💻",
              },
              {
                name: "Ana Martínez",
                location: "Cali",
                text: "San Andrés superó todas mis expectativas. Los precios son muy competitivos y la calidad excelente.",
                rating: 5,
                image: "👩‍🎓",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ y: -10 }}
                className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-[#F7931E] text-[#F7931E]" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center text-2xl">
                    {testimonial.image}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Partners Banner */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-white flex-1"
            >
              <h2 className="text-4xl font-bold mb-4">
                ¿Tu empresa busca beneficios de viaje?
              </h2>
              <p className="text-xl text-white/90 mb-6">
                Descuentos exclusivos y servicios personalizados para empresas
              </p>
              <div className="flex items-center gap-4 text-white/80 mb-2">
                <Award className="w-5 h-5" />
                <span>Más de 500 empresas confían en nosotros</span>
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <TrendingUp className="w-5 h-5" />
                <span>Hasta 25% de descuento corporativo</span>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="/corporate"
                className="inline-block px-10 py-5 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all"
              >
                Ver convenios empresariales
              </motion.a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-12 shadow-2xl text-center border border-gray-100"
          >
            <div className="inline-flex items-center gap-2 bg-orange-100 px-6 py-3 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-[#FF6B35]" />
              <span className="text-[#FF6B35] font-semibold">Ofertas exclusivas</span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Suscríbete a nuestro newsletter
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Recibe ofertas especiales, tips de viaje y descuentos exclusivos
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <input
                type="email"
                placeholder="tu@email.com"
                className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-xl font-semibold hover:shadow-xl transition-all"
              >
                Suscribirme
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
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
              <p className="text-gray-400">
                Tu compañero de viajes favorito desde 2020
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Destinos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/search" className="hover:text-white transition-colors">Cartagena</a></li>
                <li><a href="/search" className="hover:text-white transition-colors">San Andrés</a></li>
                <li><a href="/search" className="hover:text-white transition-colors">Eje Cafetero</a></li>
                <li><a href="/search" className="hover:text-white transition-colors">Santa Marta</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/benefits" className="hover:text-white transition-colors">Programa de puntos</a></li>
                <li><a href="/corporate" className="hover:text-white transition-colors">Convenios empresariales</a></li>
                <li><a href="/travel-info" className="hover:text-white transition-colors">Info para tu viaje</a></li>
                <li><a href="/contact" className="hover:text-white transition-colors">Contáctanos</a></li>
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
              <p className="text-gray-400 text-center">
                © 2026 AleckTours - Todos los derechos reservados
              </p>
              <div className="flex items-center gap-6 text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Términos</a>
                <a href="#" className="hover:text-white transition-colors">Privacidad</a>
                <a href="#" className="hover:text-white transition-colors">Cookies</a>
              </div>
            </div>
            <p className="text-sm text-gray-500 text-center mt-4">
              Hecho con ❤️ en Colombia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
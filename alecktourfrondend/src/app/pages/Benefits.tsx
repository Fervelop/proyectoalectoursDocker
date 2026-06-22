import { Award, Crown, Gift, Plane, Sparkles, Star, TrendingUp, Zap } from "lucide-react";
import { motion } from "motion/react";
import Navbar from "../components/Navbar";

export default function Benefits() {
  const benefits = [
    {
      icon: Star,
      title: "Gana puntos en cada viaje",
      description: "Acumula 10 puntos por cada $100.000 gastados en tus reservas",
      gradient: "from-[#7B1E3A] to-[#A13B55]",
    },
    {
      icon: Gift,
      title: "Redime tus puntos",
      description: "Canjea puntos por descuentos, upgrades gratis y beneficios exclusivos",
      gradient: "from-[#C9A227] to-[#E5C158]",
    },
    {
      icon: TrendingUp,
      title: "Niveles de membresía",
      description: "Sube de nivel y desbloquea beneficios premium a medida que viajas",
      gradient: "from-[#7B1E3A] to-[#C9A227]",
    },
    {
      icon: Zap,
      title: "Ofertas exclusivas",
      description: "Acceso anticipado a ofertas especiales y descuentos de temporada",
      gradient: "from-[#A13B55] to-[#7B1E3A]",
    },
  ];

  const tiers = [
    {
      name: "Explorador",
      icon: Plane,
      points: "0 - 999 puntos",
      color: "from-gray-600 to-gray-800",
      benefits: [
        "10 puntos por cada $100.000",
        "Descuentos especiales en temporadas bajas",
        "Newsletter con ofertas exclusivas",
      ],
    },
    {
      name: "Viajero",
      icon: Star,
      points: "1.000 - 4.999 puntos",
      color: "from-[#7B1E3A] to-[#A13B55]",
      benefits: [
        "15 puntos por cada $100.000",
        "5% descuento adicional en todos los paquetes",
        "Check-in prioritario",
        "Cambios de fecha sin costo (1 vez al año)",
      ],
    },
    {
      name: "Elite",
      icon: Crown,
      points: "5.000+ puntos",
      color: "from-[#7B1E3A] to-[#C9A227]",
      benefits: [
        "20 puntos por cada $100.000",
        "10% descuento en todos los paquetes",
        "Upgrade gratuito sujeto a disponibilidad",
        "Asistente personal de viajes",
        "Acceso a sala VIP",
        "Cancelación gratuita hasta 24h antes",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#7B1E3A] to-[#A13B55]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-white"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6"
            >
              <Sparkles className="w-5 h-5 text-[#C9A227]" />
              <span className="font-semibold">Programa de fidelidad</span>
            </motion.div>

            <h1 className="text-6xl font-bold mb-6 tracking-tight">
              AlecTours Rewards
            </h1>
            <p className="text-2xl text-white/90 max-w-3xl mx-auto font-light">
              Viaja más, ahorra más. Gana puntos en cada viaje y disfruta de beneficios exclusivos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              ¿Cómo funciona?
            </h2>
            <p className="text-xl text-gray-600">
              Es fácil empezar a ganar recompensas
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership Tiers */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Niveles de membresía
            </h2>
            <p className="text-xl text-gray-600">
              Sube de nivel y desbloquea más beneficios
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="relative"
              >
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 overflow-hidden h-full">
                  <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${tier.color}`} />

                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <tier.icon className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2 text-gray-900">{tier.name}</h3>
                    <p className="text-sm font-semibold bg-gray-100 text-gray-600 px-3 py-1 rounded-full inline-block">
                      {tier.points}
                    </p>
                  </div>

                  <ul className="space-y-4">
                    {tier.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className={`w-6 h-6 bg-gradient-to-br ${tier.color} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm`}>
                          <Award className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-gray-700 text-sm leading-snug">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#7B1E3A] to-[#A13B55] rounded-3xl p-12 text-center text-white shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10" />
            <h2 className="text-4xl font-bold mb-6">
              ¿Listo para empezar a ganar?
            </h2>
            <p className="text-xl mb-8 text-white/90 font-light max-w-2xl mx-auto">
              Regístrate hoy y comienza a acumular puntos en tu próximo viaje con AlecTours.
            </p>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="/register"
              className="inline-block px-10 py-4 bg-white text-[#7B1E3A] rounded-full font-bold text-lg shadow-md hover:shadow-2xl transition-all cursor-pointer"
            >
              Únete ahora gratis
            </motion.a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
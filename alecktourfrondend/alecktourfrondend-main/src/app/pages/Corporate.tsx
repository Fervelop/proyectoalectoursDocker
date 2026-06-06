import Navbar from "../components/Navbar";
import { Building2, Users, TrendingDown, Calendar, Shield, Headphones, Sparkles, Check } from "lucide-react";
import { motion } from "motion/react";

export default function Corporate() {
  const partners = [
    { name: "Bancolombia", logo: "🏦" },
    { name: "Éxito", logo: "🛒" },
    { name: "Falabella", logo: "🏬" },
    { name: "Avianca", logo: "✈️" },
    { name: "EPM", logo: "⚡" },
    { name: "Grupo Nutresa", logo: "🍫" },
    { name: "Bavaria", logo: "🍺" },
    { name: "Cementos Argos", logo: "🏗️" },
  ];

  const benefits = [
    {
      icon: TrendingDown,
      title: "Descuentos corporativos",
      description: "Hasta 25% de descuento en paquetes para grupos empresariales",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Gestión centralizada",
      description: "Administra todas las reservas de tu empresa desde un solo panel",
      gradient: "from-purple-500 to-indigo-500",
    },
    {
      icon: Shield,
      title: "Facturación especial",
      description: "Facturación electrónica y reportes detallados para tu contabilidad",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Headphones,
      title: "Ejecutivo dedicado",
      description: "Asesor personal para resolver todas las necesidades de tu empresa",
      gradient: "from-orange-500 to-red-500",
    },
  ];

  const plans = [
    {
      name: "Básico",
      employees: "1 - 50 empleados",
      discount: "10% descuento",
      features: [
        "Descuento del 10% en todos los paquetes",
        "Facturación electrónica",
        "Soporte por email",
        "Reportes mensuales",
      ],
    },
    {
      name: "Profesional",
      employees: "51 - 200 empleados",
      discount: "15% descuento",
      features: [
        "Descuento del 15% en todos los paquetes",
        "Facturación electrónica personalizada",
        "Ejecutivo de cuenta dedicado",
        "Reportes semanales",
        "Política de cancelación flexible",
        "Prioridad en reservas grupales",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      employees: "200+ empleados",
      discount: "25% descuento",
      features: [
        "Descuento del 25% en todos los paquetes",
        "Integración con sistemas corporativos",
        "Gerente de cuenta senior",
        "Reportes personalizados en tiempo real",
        "Política de cancelación premium",
        "Eventos corporativos exclusivos",
        "Capacitación para equipo de RRHH",
        "API personalizada",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
        <div className="absolute inset-0">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
            }}
            className="absolute top-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
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
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full mb-6"
            >
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Soluciones corporativas</span>
            </motion.div>

            <h1 className="text-6xl font-bold mb-6">
              Convenios Empresariales
            </h1>
            <p className="text-2xl text-white/90 max-w-3xl mx-auto mb-12">
              Beneficios exclusivos para empresas que cuidan el bienestar de sus colaboradores
            </p>

            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href="#contact"
              className="inline-block px-10 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:shadow-2xl transition-all"
            >
              Solicita una cotización
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Empresas que confían en nosotros
            </h2>
            <p className="text-xl text-gray-600">
              Más de 500 empresas en Colombia ya son parte de AleckTours
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.1 }}
                className="bg-gray-50 rounded-2xl p-8 flex flex-col items-center justify-center hover:shadow-lg transition-all border border-gray-200"
              >
                <div className="text-5xl mb-3">{partner.logo}</div>
                <p className="text-center font-semibold text-gray-700">{partner.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Beneficios corporativos
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo que tu empresa necesita en un solo lugar
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
                className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                  <benefit.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes corporativos
            </h2>
            <p className="text-xl text-gray-600">
              Escoge el plan perfecto para tu empresa
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                whileHover={{ scale: plan.popular ? 1.05 : 1.02, y: -10 }}
                className={`relative bg-white rounded-3xl p-8 shadow-xl ${
                  plan.popular ? "border-4 border-[#FF6B35]" : "border-2 border-gray-200"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <div className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-6 py-2 rounded-full font-bold shadow-lg flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Más popular
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.employees}</p>
                  <div className="text-4xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                    {plan.discount}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`w-full py-4 rounded-xl font-bold transition-all ${
                    plan.popular
                      ? "bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white shadow-lg hover:shadow-2xl"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  Contactar ventas
                </motion.button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section id="contact" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-10 shadow-2xl"
          >
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Solicita una cotización
              </h2>
              <p className="text-xl text-gray-600">
                Nuestro equipo te contactará en menos de 24 horas
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre empresa
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all"
                    placeholder="Tu Empresa S.A.S"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Número de empleados
                  </label>
                  <select className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all">
                    <option>1 - 50</option>
                    <option>51 - 200</option>
                    <option>200+</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre contacto
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email corporativo
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Mensaje (opcional)
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all resize-none"
                  placeholder="Cuéntanos más sobre tus necesidades..."
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-5 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all"
              >
                Enviar solicitud
              </motion.button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

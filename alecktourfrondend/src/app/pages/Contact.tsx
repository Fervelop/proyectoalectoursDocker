import { useState, FormEvent } from "react";
import Navbar from "../components/Navbar";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function Contact() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulación de envío al backend de AlecTours
    setTimeout(() => {
      setLoading(false);
      setEnviado(true);
      // Limpiar formulario
      setNombre("");
      setCorreo("");
      setAsunto("");
      setMensaje("");
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Encabezado Principal */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent mb-4">
            Ponte en Contacto
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            ¿Planeando tu próxima escapada o necesitas asistencia con un paquete personalizado? Nuestro equipo experto está a un mensaje de distancia.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* COLUMNA IZQUIERDA: Tarjetas de Información */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Tarjeta Informativa Principal */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl -mr-10 -mt-10" />
              
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <MessageSquare className="text-[#FF6B35] w-6 h-6" />
                Atención Inmediata
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B35] flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Llámanos o WhatsApp</h3>
                    <p className="text-gray-900 font-bold text-lg mt-0.5">+57 (300) 123-4567</p>
                    <p className="text-gray-500 text-sm">Línea de atención nacional</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B35] flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Correos Electrónicos</h3>
                    <p className="text-gray-900 font-bold text-base mt-0.5">soporte@alectours.com</p>
                    <p className="text-gray-500 text-sm">reservas@alectours.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#FF6B35] flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-500 text-xs uppercase tracking-wider">Oficina Central</h3>
                    <p className="text-gray-900 font-medium text-sm mt-0.5">Av. El Dorado #68b-45, Edificio C</p>
                    <p className="text-gray-500 text-sm">Bogotá, Colombia</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tarjeta de Horarios */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-[#FF6B35] to-[#F7931E] p-6 rounded-3xl text-white shadow-xl flex items-center gap-5"
            >
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Horario de Operaciones</h3>
                <p className="text-white/90 text-sm mt-0.5">Lunes a Viernes: 8:00 AM - 7:00 PM</p>
                <p className="text-white/90 text-sm">Sábados y Domingos: 9:00 AM - 4:00 PM</p>
              </div>
            </motion.div>

          </div>

          {/* COLUMNA DERECHA: Formulario de Contacto */}
          <div className="lg:col-span-7">
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white p-8 md:p-10 rounded-3xl shadow-lg border border-gray-100"
            >
              <AnimatePresence mode="wait">
                {!enviado ? (
                  /* Formulario Activo */
                  <motion.form 
                    key="contact-form"
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Tu nombre completo</label>
                        <input
                          type="text"
                          required
                          value={nombre}
                          onChange={(e) => setNombre(e.target.value)}
                          placeholder="Ej. Alejandro Pérez"
                          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-gray-800"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
                        <input
                          type="email"
                          required
                          value={correo}
                          onChange={(e) => setCorreo(e.target.value)}
                          placeholder="ejemplo@correo.com"
                          className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-gray-800"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Asunto del mensaje</label>
                      <input
                        type="text"
                        required
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        placeholder="Ej. Cotización paquete Cancún / Problema con mi reserva"
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-gray-800"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">¿En qué podemos ayudarte?</label>
                      <textarea
                        rows={5}
                        required
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        placeholder="Escribe detalladamente tus dudas, fechas tentativas o requerimientos especiales..."
                        className="w-full px-4 py-3 bg-gray-50/50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:bg-white transition-all text-gray-800 resize-none"
                      />
                    </div>

                    {/* Botón de Envío Animado */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-xl font-bold text-base shadow-md hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          Enviar Mensaje de Consulta
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                ) : (
                  /* Vista de Éxito Post-Envío */
                  <motion.div 
                    key="success-message"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12 px-4"
                  >
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                      <CheckCircle2 className="w-12 h-12" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">¡Mensaje enviado con éxito!</h3>
                    <p className="text-gray-600 max-w-md mx-auto mb-8">
                      Gracias por escribirnos. Hemos registrado tu solicitud en el sistema de AlecTours y un asesor te responderá al correo electrónico en menos de 2 horas.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setEnviado(false)}
                      className="px-6 py-3 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Enviar otro mensaje
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
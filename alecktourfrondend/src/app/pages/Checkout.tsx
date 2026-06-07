import { useParams, useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { CreditCard, Lock, Users, Sparkles, Shield, CheckCircle2, Zap, Calendar } from "lucide-react";
import { motion } from "motion/react";
import { toast, Toaster } from "sonner";
import { useAuth } from "../context/AuthContext";
import { reservaService, pagoService, MetodoPago } from "../services/reserva.service";
import { hotelService, HotelResponse } from "../services/hotel.service";

export default function Checkout() {
  const { id } = useParams(); // id_hotel
  const navigate = useNavigate();
  const { usuario, isAuthenticated } = useAuth();

  const [hotel, setHotel] = useState<HotelResponse | null>(null);
  const [metodos, setMetodos] = useState<MetodoPago[]>([]);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  const [people, setPeople] = useState(2);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [metodoPago, setMetodoPago] = useState<number>(1);
  const [paymentOption, setPaymentOption] = useState<'full' | 'partial'>('full');

  // Precio base por persona por noche (simulado)
  const precioPorPersona = 500000;
  const nights = fechaInicio && fechaFin
    ? Math.max(1, Math.ceil((new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalPrice = precioPorPersona * people * nights;
  const paymentAmount = paymentOption === 'full' ? totalPrice : totalPrice * 0.5;

  useEffect(() => {
    if (!isAuthenticated) { navigate('/login'); return; }
    if (!id) return;

    Promise.all([
      hotelService.getById(parseInt(id)),
      pagoService.getMetodos(),
    ]).then(([h, m]) => {
      setHotel(h);
      setMetodos(m);
      if (m.length > 0) setMetodoPago(m[0].id_metodo);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [id, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaInicio || !fechaFin) {
      toast.error('Selecciona las fechas de tu estadía');
      return;
    }
    if (new Date(fechaFin) <= new Date(fechaInicio)) {
      toast.error('La fecha de salida debe ser después de la entrada');
      return;
    }
    if (!usuario?.id_cliente) {
      toast.error('No se encontró tu perfil de cliente. Contacta soporte.');
      return;
    }

    setIsProcessing(true);
    toast.loading('Creando reserva...', { id: 'checkout' });

    try {
      // 1. Crear reserva
      const reserva = await reservaService.create({
        id_cliente: usuario.id_cliente,
        id_empleado: 1, // empleado por defecto
        id_paquete: 1,  // paquete por defecto hasta conectar paquetes
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        numero_personas: people,
        estado: 'pendiente',
      });

      toast.loading('Procesando pago...', { id: 'checkout' });

      // 2. Crear pago
      const referencia = `REF-${Date.now()}`;
      await pagoService.create({
        id_reserva: reserva.id_reserva,
        id_metodo_pago: metodoPago,
        monto: paymentAmount,
        referencia,
      });

      toast.success('¡Reserva confirmada!', { id: 'checkout' });

      setTimeout(() => {
        navigate('/confirmation', {
          state: {
            reserva,
            hotel,
            people,
            totalPrice,
            paymentAmount,
            paymentOption,
            referencia,
          },
        });
      }, 500);

    } catch (err: any) {
      toast.error(err.message || 'Error al procesar la reserva', { id: 'checkout' });
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 text-lg">Cargando...</p>
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Hotel no encontrado</h1>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <Toaster position="top-center" richColors />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Completa tu reserva</h1>
              <p className="text-gray-600">¡Estás a un paso de tu aventura!</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Fechas */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Fechas de estadía</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-in</label>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Check-out</label>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)}
                      min={fechaInicio || new Date().toISOString().split('T')[0]} required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none" />
                  </div>
                </div>
              </motion.section>

              {/* Personas */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Cantidad de viajeros</h2>
                </div>
                <div className="flex items-center justify-center gap-8 py-4">
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button"
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    className="w-14 h-14 rounded-full border-2 border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white text-[#FF6B35] text-2xl font-bold transition-all shadow-lg">
                    -
                  </motion.button>
                  <div className="text-center min-w-[120px]">
                    <motion.span key={people} initial={{ scale: 1.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                      {people}
                    </motion.span>
                    <p className="text-gray-600 mt-2">{people === 1 ? 'persona' : 'personas'}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} type="button"
                    onClick={() => setPeople(Math.min(8, people + 1))}
                    className="w-14 h-14 rounded-full border-2 border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white text-[#FF6B35] text-2xl font-bold transition-all shadow-lg">
                    +
                  </motion.button>
                </div>
              </motion.section>

              {/* Método de pago */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Método de pago</h2>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {metodos.map(m => (
                    <motion.label key={m.id_metodo} whileHover={{ scale: 1.02 }}
                      className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer border-2 transition-all ${
                        metodoPago === m.id_metodo
                          ? 'border-[#FF6B35] bg-orange-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <input type="radio" name="metodo" checked={metodoPago === m.id_metodo}
                        onChange={() => setMetodoPago(m.id_metodo)}
                        className="w-4 h-4 text-[#FF6B35] focus:ring-[#FF6B35]" />
                      <span className="text-sm font-medium text-gray-800">{m.nombre_metodo}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.section>

              {/* Opciones de pago */}
              <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Opciones de pago</h2>
                </div>
                <div className="space-y-4">
                  <motion.label whileHover={{ scale: 1.02 }}
                    className={`flex items-start gap-4 p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                      paymentOption === 'full' ? 'border-[#FF6B35] bg-orange-50 shadow-lg' : 'border-gray-200'
                    }`}>
                    <input type="radio" name="payment" checked={paymentOption === 'full'}
                      onChange={() => setPaymentOption('full')}
                      className="mt-1 w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35]" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Pago completo</span>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                          ${totalPrice.toLocaleString('es-CO')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Paga el 100% ahora y asegura tu viaje</p>
                    </div>
                  </motion.label>

                  <motion.label whileHover={{ scale: 1.02 }}
                    className={`flex items-start gap-4 p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                      paymentOption === 'partial' ? 'border-[#FF6B35] bg-orange-50 shadow-lg' : 'border-gray-200'
                    }`}>
                    <input type="radio" name="payment" checked={paymentOption === 'partial'}
                      onChange={() => setPaymentOption('partial')}
                      className="mt-1 w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35]" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Pago parcial (50%)</span>
                          <Sparkles className="w-5 h-5 text-[#F7931E]" />
                        </div>
                        <span className="text-2xl font-bold text-[#F7931E]">
                          ${(totalPrice * 0.5).toLocaleString('es-CO')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500">Paga 50% ahora, resto 15 días antes del viaje</p>
                    </div>
                  </motion.label>
                </div>
              </motion.section>

              {/* Seguridad */}
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">Pago 100% seguro con encriptación SSL</span>
              </div>

              {/* Submit */}
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                type="submit" disabled={isProcessing}
                className="w-full py-5 bg-gradient-to-r from-[#FF6B35] via-[#FF8E53] to-[#F7931E] text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden">
                <motion.div className="absolute inset-0 bg-white/20" initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }} transition={{ duration: 0.6 }} />
                <span className="relative flex items-center justify-center gap-3">
                  {isProcessing ? 'Procesando...' : (
                    <><Lock className="w-6 h-6" />Confirmar y pagar ${paymentAmount.toLocaleString('es-CO')}</>
                  )}
                </span>
              </motion.button>
            </form>
          </div>

          {/* Resumen */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-6 sticky top-24 border border-gray-100">
              <h2 className="text-2xl font-bold mb-6">Resumen</h2>

              <div className="mb-6 p-4 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl text-white">
                <p className="text-lg font-bold">{hotel.nombre_hotel}</p>
                <p className="text-sm opacity-80">{hotel.ciudad}, {hotel.pais}</p>
                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: hotel.calificacion }, (_, i) => (
                    <span key={i} className="text-yellow-300">★</span>
                  ))}
                </div>
              </div>

              <div className="space-y-3 pb-4 border-b border-gray-200 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio por persona/noche</span>
                  <span className="font-semibold">${precioPorPersona.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Personas</span>
                  <span className="font-semibold">{people}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Noches</span>
                  <span className="font-semibold">{nights}</span>
                </div>
                <div className="flex justify-between text-base pt-2">
                  <span className="font-bold">Total</span>
                  <span className="text-xl font-bold">${totalPrice.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <div className="mt-4 p-4 bg-orange-50 rounded-2xl border border-orange-200">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">A pagar ahora</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                    ${paymentAmount.toLocaleString('es-CO')}
                  </span>
                </div>
                {paymentOption === 'partial' && (
                  <p className="text-xs text-gray-500 mt-2">
                    Pagarás ${(totalPrice * 0.5).toLocaleString('es-CO')} restantes antes del viaje
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
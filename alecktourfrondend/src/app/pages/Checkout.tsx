import { Calendar, CheckCircle2, CreditCard, Lock, Shield, Sparkles, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast, Toaster } from "sonner";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { HotelResponse, hotelService } from "../services/hotel.service";
import { MetodoPago, pagoService, reservaService } from "../services/reserva.service";

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
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" />
        <p className="text-muted-foreground text-sm mt-4 font-medium animate-pulse">Sincronizando pasarela de pagos...</p>
      </div>
    </div>
  );

  if (!hotel) return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-medium text-foreground">El complejo u hotel no se encuentra disponible</h1>
        <button onClick={() => navigate(-1)} className="mt-4 text-primary font-medium hover:underline">← Regresar</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />
      <Toaster position="top-center" richColors />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Encabezado */}
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20 shrink-0">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">Completa tu reserva</h1>
              <p className="text-muted-foreground text-sm">Estás a un paso de confirmar tu próxima estadía.</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Fechas de estadía */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                className="bg-card rounded-xl border border-border p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center border border-primary/20">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground">Fechas de estadía</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Check-in</label>
                    <input type="date" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)}
                      min={new Date().toISOString().split('T')[0]} required
                      className="w-full px-4 py-3 border border-border bg-input-background rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Check-out</label>
                    <input type="date" value={fechaFin} onChange={e => setFechaFin(e.target.value)}
                      min={fechaInicio || new Date().toISOString().split('T')[0]} required
                      className="w-full px-4 py-3 border border-border bg-input-background rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                  </div>
                </div>
              </motion.section>

              {/* Selector de Viajeros */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card rounded-xl border border-border p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-chart-5/10 rounded-lg flex items-center justify-center border border-chart-5/20">
                    <Users className="w-4 h-4 text-chart-5" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground">Cantidad de viajeros</h2>
                </div>
                <div className="flex items-center justify-center gap-8 py-2">
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button"
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    className="w-12 h-12 rounded-full border border-border bg-card text-foreground hover:bg-muted font-semibold text-lg transition-colors flex items-center justify-center shadow-xs">
                    -
                  </motion.button>
                  <div className="text-center min-w-[100px]">
                    <motion.span key={people} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="text-5xl font-bold tracking-tight text-foreground block">
                      {people}
                    </motion.span>
                    <p className="text-xs font-medium text-muted-foreground mt-1">{people === 1 ? 'viajero' : 'viajeros'}</p>
                  </div>
                  <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button"
                    onClick={() => setPeople(Math.min(8, people + 1))}
                    className="w-12 h-12 rounded-full border border-border bg-card text-foreground hover:bg-muted font-semibold text-lg transition-colors flex items-center justify-center shadow-xs">
                    +
                  </motion.button>
                </div>
              </motion.section>

              {/* Pasarela/Métodos de pago */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                className="bg-card rounded-xl border border-border p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-green-500/10 rounded-lg flex items-center justify-center border border-green-500/20">
                    <CreditCard className="w-4 h-4 text-green-500" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground">Método de pago</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {metodos.map(m => (
                    <motion.label key={m.id_metodo} whileHover={{ y: -1 }}
                      className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all ${metodoPago === m.id_metodo
                          ? 'border-primary bg-primary/5 shadow-xs'
                          : 'border-border bg-card hover:border-border/80'
                        }`}>
                      <input type="radio" name="metodo" checked={metodoPago === m.id_metodo}
                        onChange={() => setMetodoPago(m.id_metodo)}
                        className="w-4 h-4 text-primary focus:ring-primary border-border bg-input-background" />
                      <span className="text-sm font-medium text-foreground">{m.nombre_metodo}</span>
                    </motion.label>
                  ))}
                </div>
              </motion.section>

              {/* Fraccionamiento de Pago */}
              <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-card rounded-xl border border-border p-6 shadow-xs">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-9 h-9 bg-chart-2/10 rounded-lg flex items-center justify-center border border-chart-2/20">
                    <Zap className="w-4 h-4 text-chart-2" />
                  </div>
                  <h2 className="text-lg font-medium text-foreground">Opciones de financiamiento</h2>
                </div>
                <div className="space-y-3">
                  <motion.label whileHover={{ y: -1 }}
                    className={`flex items-start gap-4 p-5 rounded-xl cursor-pointer border transition-all ${paymentOption === 'full' ? 'border-primary bg-primary/5 shadow-xs' : 'border-border bg-card'
                      }`}>
                    <input type="radio" name="payment" checked={paymentOption === 'full'}
                      onChange={() => setPaymentOption('full')}
                      className="mt-1 w-4 h-4 text-primary focus:ring-primary border-border bg-input-background" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm md:text-base text-foreground">Pago de contado</span>
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        </div>
                        <span className="text-base md:text-lg font-bold text-foreground">
                          ${totalPrice.toLocaleString('es-CO')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Liquida el 100% del monto hoy y olvídate de cargos posteriores.</p>
                    </div>
                  </motion.label>

                  <motion.label whileHover={{ y: -1 }}
                    className={`flex items-start gap-4 p-5 rounded-xl cursor-pointer border transition-all ${paymentOption === 'partial' ? 'border-primary bg-primary/5 shadow-xs' : 'border-border bg-card'
                      }`}>
                    <input type="radio" name="payment" checked={paymentOption === 'partial'}
                      onChange={() => setPaymentOption('partial')}
                      className="mt-1 w-4 h-4 text-primary focus:ring-primary border-border bg-input-background" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm md:text-base text-foreground">Pago diferido (50% anticipo)</span>
                          <Sparkles className="w-4 h-4 text-chart-2" />
                        </div>
                        <span className="text-base md:text-lg font-bold text-primary">
                          ${(totalPrice * 0.5).toLocaleString('es-CO')}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Asegura tu cupo con la mitad y cubre el saldo restante 15 días antes de tu viaje.</p>
                    </div>
                  </motion.label>
                </div>
              </motion.section>

              {/* Badge SSL */}
              <div className="flex items-center gap-3 p-4 bg-green-500/5 rounded-xl border border-green-500/10 transition-colors">
                <Shield className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span className="text-xs text-muted-foreground font-medium">Transacción protegida mediante encriptación SSL de 256 bits</span>
              </div>

              {/* Botón de Confirmación final */}
              <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                type="submit" disabled={isProcessing}
                className="w-full py-4 bg-primary text-primary-foreground text-base font-semibold rounded-xl border border-transparent shadow-md hover:opacity-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden">
                <motion.div className="absolute inset-0 bg-white/10" initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }} transition={{ duration: 0.5 }} />
                <span className="relative flex items-center justify-center gap-2.5">
                  {isProcessing ? 'Garantizando transacciones...' : (
                    <><Lock className="w-4 h-4" />Confirmar y autorizar ${paymentAmount.toLocaleString('es-CO')}</>
                  )}
                </span>
              </motion.button>
            </form>
          </div>

          {/* Sidebar Resumen Desglose */}
          <div className="lg:col-span-1">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
              className="bg-card rounded-xl border border-border p-6 sticky top-24 shadow-xs">
              <h2 className="text-lg font-medium text-foreground mb-4">Resumen de itinerario</h2>

              {/* Mini card del hotel seleccionado */}
              <div className="mb-6 p-4 bg-muted/60 border border-border rounded-xl">
                <p className="font-bold text-foreground text-base leading-tight">{hotel.nombre_hotel}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{hotel.ciudad}, {hotel.pais}</p>
                <div className="flex gap-0.5 mt-2">
                  {Array.from({ length: hotel.calificacion || 5 }, (_, i) => (
                    <span key={i} className="text-chart-2 text-xs">★</span>
                  ))}
                </div>
              </div>

              {/* Desglose matemático */}
              <div className="space-y-3 pb-4 border-b border-border text-xs md:text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarifa base por noche</span>
                  <span className="font-medium text-foreground">${precioPorPersona.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pasajeros inscritos</span>
                  <span className="font-medium text-foreground">{people}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Noches de hospedaje</span>
                  <span className="font-medium text-foreground">{nights}</span>
                </div>
                <div className="flex justify-between text-sm md:text-base pt-2 border-t border-dashed border-border mt-2">
                  <span className="font-semibold text-foreground">Total bruto</span>
                  <span className="font-bold text-foreground">${totalPrice.toLocaleString('es-CO')}</span>
                </div>
              </div>

              {/* Total final a pagar ahora */}
              <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex justify-between items-center gap-2">
                  <span className="font-semibold text-xs md:text-sm text-foreground">Cargos actuales</span>
                  <span className="text-xl md:text-2xl font-bold text-primary tracking-tight">
                    ${paymentAmount.toLocaleString('es-CO')}
                  </span>
                </div>
                {paymentOption === 'partial' && (
                  <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                    Un saldo de ${(totalPrice * 0.5).toLocaleString('es-CO')} quedará pendiente en tu panel para liquidarse previo al arribo.
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
import { Link } from "react-router";
import { Plane, Calendar, Wallet, ChevronRight, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ClienteResponse } from "../../services/cliente.service";
import ComprobantePDF from "./ComprobantePDF";
const estadoConfig: Record<string, { color: string; icon: any; label: string }> = {
  confirmada: { color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle, label: "Confirmada" },
  pendiente:  { color: "bg-orange-100 text-orange-700 border-orange-200", icon: AlertCircle, label: "Pendiente" },
  cancelada:  { color: "bg-red-100 text-red-700 border-red-200", icon: XCircle, label: "Cancelada" },
  finalizada: { color: "bg-gray-100 text-gray-700 border-gray-200", icon: CheckCircle, label: "Finalizada" },
};

const nights = (inicio: string, fin: string) =>
  Math.max(1, Math.ceil((new Date(fin).getTime() - new Date(inicio).getTime()) / (1000 * 60 * 60 * 24)));

interface Props {
  reservas: any[];
  loading: boolean;
  reservaExpandida: number | null;
  setReservaExpandida: (id: number | null) => void;
    clienteData: ClienteResponse | null;  // agrega esto
}

export default function TabReservas({ reservas, loading, reservaExpandida, setReservaExpandida, clienteData }: Props) {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
        <p className="text-gray-500 mt-1">Gestiona todos tus viajes reservados</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow">
          <div className="w-10 h-10 border-4 border-blue-200 border-t-[#2563EB] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Cargando reservas...</p>
        </div>
      ) : reservas.length === 0 ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <Plane className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No tienes reservas aún</h3>
          <p className="text-gray-500 mb-6">¡Es hora de planear tu próxima aventura!</p>
          <Link to="/search" className="inline-block px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-xl hover:shadow-xl transition-all">
            Explorar hoteles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => {
            const config = estadoConfig[reserva.estado] ?? estadoConfig.pendiente;
            const Icon = config.icon;
            const expanded = reservaExpandida === reserva.id_reserva;
            const noches = nights(reserva.fecha_inicio, reserva.fecha_fin);

            return (
              <motion.div key={reserva.id_reserva} layout
                className="bg-white rounded-2xl shadow hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Plane className="w-5 h-5 text-[#2563EB]" />
                        <h3 className="text-lg font-bold text-gray-900">Reserva #{reserva.id_reserva}</h3>
                      </div>
                      <p className="text-sm text-gray-500">Paquete #{reserva.id_paquete}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                      {config.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: "Check-in", value: new Date(reserva.fecha_inicio).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) },
                      { label: "Check-out", value: new Date(reserva.fecha_fin).toLocaleDateString('es-CO', { day: 'numeric', month: 'short' }) },
                      { label: "Noches", value: noches },
                      { label: "Personas", value: reserva.numero_personas },
                    ].map(item => (
                      <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => setReservaExpandida(expanded ? null : reserva.id_reserva)}
                    className="mt-4 w-full py-2 text-sm text-[#2563EB] font-medium hover:bg-blue-50 rounded-xl transition-all flex items-center justify-center gap-2">
                    {expanded ? "Ver menos" : "Ver más detalles"}
                    <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`} />
                  </button>
                </div>

                <AnimatePresence>
                  {expanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="border-t border-gray-100 bg-gradient-to-br from-blue-50 to-cyan-50 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-[#2563EB]" /> Información del viaje
                          </h4>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Fecha de reserva:</span>
                              <span className="font-medium">{new Date(reserva.fecha_reserva).toLocaleDateString('es-CO')}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Duración:</span>
                              <span className="font-medium">{noches} noches</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Viajeros:</span>
                              <span className="font-medium">{reserva.numero_personas} persona(s)</span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-[#2563EB]" /> Acciones
                          </h4>
                          <div className="space-y-2">
                            {reserva.estado === 'pendiente' && (
                              <button className="w-full py-2 bg-[#F59E0B] text-white rounded-xl text-sm font-medium hover:shadow-md transition-all">
                                Completar pago
                              </button>
                            )}
                            {reserva.estado !== 'cancelada' && (
                              <button className="w-full py-2 border border-red-300 text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-all">
                                Cancelar reserva
                              </button>
                            )}


    <ComprobantePDF reservaId={reserva.id_reserva} clienteData={clienteData} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </>
  );
}
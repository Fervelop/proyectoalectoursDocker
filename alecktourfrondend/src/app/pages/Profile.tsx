import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { User, Mail, Calendar, MapPin, Clock, DollarSign, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/v1/api";
import { ReservaResponse } from "../data/reservaTypes";

const estadoColors: Record<string, string> = {
  confirmada: "bg-green-100 text-green-700",
  pendiente: "bg-orange-100 text-orange-700",
  cancelada: "bg-red-100 text-red-700",
  finalizada: "bg-gray-100 text-gray-700",
};

const estadoLabels: Record<string, string> = {
  confirmada: "Confirmada",
  pendiente: "Pendiente",
  cancelada: "Cancelada",
  finalizada: "Finalizada",
};

export default function Profile() {
  const { usuario, token, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [loading, setLoading] = useState(true);

  // Protección de ruta
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);

  // Cargar reservas del cliente
  useEffect(() => {
    if (!isAuthenticated || !usuario?.id_cliente) {
      setLoading(false);
      return;
    }
    apiFetch<ReservaResponse[]>(`/reservas/cliente/${usuario.id_cliente}`)
      .then(setReservas)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [usuario]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {usuario?.username}
                </h2>
                <p className="text-gray-600">Viajero frecuente</p>
              </div>

              <div className="space-y-4 pb-6 border-b">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-sm">{usuario?.username}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={handleLogout}
                  className="w-full py-2 text-left px-4 rounded-lg hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          </aside>

          {/* Reservas */}
          <main className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Reservas</h1>
              <p className="text-gray-600">Gestiona y revisa todos tus viajes reservados</p>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <p className="text-gray-500">Cargando reservas...</p>
              </div>
            ) : reservas.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No tienes reservas aún
                </h3>
                <p className="text-gray-600 mb-6">¡Es hora de planear tu próxima aventura!</p>
                <Link to="/search"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-lg hover:shadow-xl transition-all duration-300">
                  Explorar hoteles
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {reservas.map((reserva) => (
                  <div key={reserva.id_reserva}
                    className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            Reserva #{reserva.id_reserva}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Paquete: {reserva.id_paquete} · Empleado: {reserva.id_empleado}
                          </p>
                        </div>
                        <span className={`px-4 py-1 rounded-full text-sm font-medium ${estadoColors[reserva.estado] ?? 'bg-gray-100 text-gray-700'}`}>
                          {estadoLabels[reserva.estado] ?? reserva.estado}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="text-xs text-gray-500">Fecha inicio</p>
                            <p className="text-sm font-medium">
                              {new Date(reserva.fecha_inicio).toLocaleDateString("es-CO", {
                                year: "numeric", month: "long", day: "numeric"
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="text-xs text-gray-500">Fecha fin</p>
                            <p className="text-sm font-medium">
                              {new Date(reserva.fecha_fin).toLocaleDateString("es-CO", {
                                year: "numeric", month: "long", day: "numeric"
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="text-xs text-gray-500">Personas</p>
                            <p className="text-sm font-medium">{reserva.numero_personas}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="text-xs text-gray-500">Fecha reserva</p>
                            <p className="text-sm font-medium">
                              {new Date(reserva.fecha_reserva).toLocaleDateString("es-CO")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
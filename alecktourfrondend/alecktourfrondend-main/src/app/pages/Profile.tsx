import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { User, Mail, Phone, Calendar, MapPin, Clock, DollarSign } from "lucide-react";
import { packages } from "../data/packages";

// Mock user data
const mockUser = {
  name: "Juan Pérez",
  email: "juan.perez@email.com",
  phone: "+57 300 123 4567",
};

// Mock reservations
const mockReservations = [
  {
    id: "R001",
    code: "COL-A8F9K2L4M",
    package: packages[0], // Cartagena
    date: "2026-04-15",
    people: 2,
    totalPrice: 3700000,
    status: "pagado",
    paymentType: "completo",
  },
  {
    id: "R002",
    code: "COL-B7G3H1N5P",
    package: packages[2], // Eje Cafetero
    date: "2026-05-20",
    people: 4,
    totalPrice: 3920000,
    status: "reservado",
    paymentType: "parcial",
    paid: 1960000,
  },
  {
    id: "R003",
    code: "COL-C6D2J8K4Q",
    package: packages[5], // Medellín
    date: "2026-03-10",
    people: 1,
    totalPrice: 1350000,
    status: "pendiente",
    paymentType: "parcial",
    paid: 675000,
  },
];

const statusColors = {
  pagado: "bg-green-100 text-green-700",
  reservado: "bg-blue-100 text-blue-700",
  pendiente: "bg-orange-100 text-orange-700",
};

const statusLabels = {
  pagado: "Pagado",
  reservado: "Reservado",
  pendiente: "Pago pendiente",
};

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-8">
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {mockUser.name}
                </h2>
                <p className="text-gray-600">Viajero frecuente</p>
              </div>

              <div className="space-y-4 pb-6 border-b">
                <div className="flex items-center gap-3 text-gray-700">
                  <Mail className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-sm">{mockUser.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-700">
                  <Phone className="w-5 h-5 text-[#2563EB]" />
                  <span className="text-sm">{mockUser.phone}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button className="w-full py-2 text-left px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  Editar perfil
                </button>
                <button className="w-full py-2 text-left px-4 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors">
                  Cambiar contraseña
                </button>
                <button className="w-full py-2 text-left px-4 rounded-lg hover:bg-gray-50 text-red-600 transition-colors">
                  Cerrar sesión
                </button>
              </div>
            </div>
          </aside>

          {/* Reservations */}
          <main className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Mis Reservas
              </h1>
              <p className="text-gray-600">
                Gestiona y revisa todos tus viajes reservados
              </p>
            </div>

            <div className="space-y-6">
              {mockReservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
                    {/* Image */}
                    <div className="md:col-span-1">
                      <img
                        src={reservation.package.image}
                        alt={reservation.package.destination}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>

                    {/* Details */}
                    <div className="md:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {reservation.package.destination}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            Código: {reservation.code}
                          </p>
                        </div>
                        <span
                          className={`px-4 py-1 rounded-full text-sm font-medium ${
                            statusColors[reservation.status]
                          }`}
                        >
                          {statusLabels[reservation.status]}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="text-xs text-gray-500">Fecha de viaje</p>
                            <p className="text-sm font-medium">
                              {new Date(reservation.date).toLocaleDateString(
                                "es-CO",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="text-xs text-gray-500">Duración</p>
                            <p className="text-sm font-medium">
                              {reservation.package.duration}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <User className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="text-xs text-gray-500">Personas</p>
                            <p className="text-sm font-medium">
                              {reservation.people}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-700">
                          <DollarSign className="w-4 h-4 text-[#2563EB]" />
                          <div>
                            <p className="text-xs text-gray-500">Precio total</p>
                            <p className="text-sm font-medium">
                              ${reservation.totalPrice.toLocaleString("es-CO")}
                            </p>
                          </div>
                        </div>
                      </div>

                      {reservation.status === "pendiente" && (
                        <div className="bg-orange-50 rounded-lg p-3">
                          <p className="text-sm text-orange-700">
                            <strong>Saldo pendiente:</strong> $
                            {(
                              reservation.totalPrice - reservation.paid!
                            ).toLocaleString("es-CO")}
                          </p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Link
                          to={`/package/${reservation.package.id}`}
                          className="px-4 py-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1d4ed8] transition-colors text-sm font-medium"
                        >
                          Ver detalles
                        </Link>
                        {reservation.status === "reservado" && (
                          <Link
                            to={`/personalize/${reservation.package.id}`}
                            className="px-4 py-2 border border-[#2563EB] text-[#2563EB] rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                          >
                            Personalizar
                          </Link>
                        )}
                        {reservation.status === "pendiente" && (
                          <button className="px-4 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#d97706] transition-colors text-sm font-medium">
                            Completar pago
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {mockReservations.length === 0 && (
              <div className="bg-white rounded-2xl shadow-md p-12 text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No tienes reservas aún
                </h3>
                <p className="text-gray-600 mb-6">
                  ¡Es hora de planear tu próxima aventura!
                </p>
                <Link
                  to="/search"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-lg hover:shadow-xl transition-all duration-300"
                >
                  Explorar paquetes
                </Link>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

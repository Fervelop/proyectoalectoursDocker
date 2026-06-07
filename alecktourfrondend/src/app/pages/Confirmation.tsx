import { useLocation, Link } from "react-router";
import Navbar from "../components/Navbar";
import { CheckCircle, Calendar, MapPin, Users, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";

export default function Confirmation() {
  const location = useLocation();
  const { reserva, hotel, people, totalPrice, paymentAmount, paymentOption, referencia } =
    location.state || {};
  const [reservationCode, setReservationCode] = useState("");

  useEffect(() => {
    const code = `COL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setReservationCode(code);
  }, []);

  if (!reserva || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">No se encontró información de reserva</h1>
          <Link to="/" className="inline-block mt-8 px-6 py-3 bg-[#2563EB] text-white rounded-lg">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-16">

        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">¡Reserva confirmada!</h1>
          <p className="text-xl text-gray-600">Tu viaje ha sido reservado exitosamente</p>
        </div>

        {/* Reservation Code */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-2xl p-8 mb-8 text-center">
          <p className="text-white text-lg mb-2">Código de reserva</p>
          <p className="text-4xl font-bold text-white tracking-wider">{reservationCode}</p>
          <p className="text-white/80 text-sm mt-2">Referencia de pago: {referencia}</p>
        </div>

        {/* Trip Details */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detalles del viaje</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-gray-700">
              <MapPin className="w-5 h-5 text-[#2563EB]" />
              <div>
                <p className="font-bold text-lg">{hotel.nombre_hotel}</p>
                <p className="text-gray-500">{hotel.ciudad}, {hotel.pais}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Users className="w-5 h-5 text-[#2563EB]" />
              <span>{people} {people === 1 ? 'persona' : 'personas'}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <Calendar className="w-5 h-5 text-[#2563EB]" />
              <span>
                {new Date(reserva.fecha_inicio).toLocaleDateString('es-CO')} → {new Date(reserva.fecha_fin).toLocaleDateString('es-CO')}
              </span>
            </div>
            <div className="flex items-center gap-3 text-gray-700">
              <DollarSign className="w-5 h-5 text-[#2563EB]" />
              <span>Reserva #{reserva.id_reserva} · Estado: <span className="font-semibold capitalize">{reserva.estado}</span></span>
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumen de pago</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Precio total</span>
              <span className="font-semibold">${totalPrice.toLocaleString('es-CO')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pagado ahora</span>
              <span className="font-semibold text-green-600">${paymentAmount.toLocaleString('es-CO')}</span>
            </div>
            {paymentOption === 'partial' && (
              <div className="flex justify-between">
                <span className="text-gray-600">Saldo pendiente</span>
                <span className="font-semibold text-[#F59E0B]">${(totalPrice - paymentAmount).toLocaleString('es-CO')}</span>
              </div>
            )}
          </div>
          {paymentOption === 'partial' && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-[#F59E0B]">
                <strong>Nota:</strong> El saldo restante debe pagarse al menos 15 días antes del viaje.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link to="/profile"
            className="flex-1 py-4 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-center font-semibold rounded-xl hover:shadow-xl transition-all duration-300">
            Ver mis reservas
          </Link>
          <Link to="/"
            className="flex-1 py-4 border-2 border-[#2563EB] text-[#2563EB] text-center font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300">
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
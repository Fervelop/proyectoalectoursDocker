import { useLocation, Link } from "react-router";
import Navbar from "../components/Navbar";
import { CheckCircle, Download, Calendar, MapPin, Users } from "lucide-react";
import { useEffect, useState } from "react";

export default function Confirmation() {
  const location = useLocation();
  const { package: pkg, people, totalPrice, paymentAmount, paymentOption } =
    location.state || {};
  const [reservationCode, setReservationCode] = useState("");

  useEffect(() => {
    // Generate random reservation code
    const code = `COL-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setReservationCode(code);
  }, []);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            No se encontró información de reserva
          </h1>
          <Link
            to="/"
            className="inline-block mt-8 px-6 py-3 bg-[#2563EB] text-white rounded-lg"
          >
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
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            ¡Reserva confirmada!
          </h1>
          <p className="text-xl text-gray-600">
            Tu viaje ha sido reservado exitosamente
          </p>
        </div>

        {/* Reservation Code */}
        <div className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-2xl p-8 mb-8 text-center">
          <p className="text-white text-lg mb-2">Código de reserva</p>
          <p className="text-4xl font-bold text-white tracking-wider">
            {reservationCode}
          </p>
          <p className="text-white/80 text-sm mt-2">
            Guarda este código para consultar tu reserva
          </p>
        </div>

        {/* Trip Details */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Detalles del viaje
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <img
                src={pkg.image}
                alt={pkg.destination}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {pkg.destination}
                </h3>
                <p className="text-gray-600">{pkg.duration}</p>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5" />
                <span>
                  {people} {people === 1 ? "persona" : "personas"}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <MapPin className="w-5 h-5" />
                <span>{pkg.hotel.name}</span>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-4">Lo que incluye tu paquete:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pkg.included.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Resumen de pago
          </h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Precio total del viaje</span>
              <span className="font-semibold">
                ${totalPrice.toLocaleString("es-CO")}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pagado ahora</span>
              <span className="font-semibold text-green-600">
                ${paymentAmount.toLocaleString("es-CO")}
              </span>
            </div>
            {paymentOption === "partial" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Saldo pendiente</span>
                <span className="font-semibold text-[#F59E0B]">
                  ${(totalPrice - paymentAmount).toLocaleString("es-CO")}
                </span>
              </div>
            )}
          </div>

          {paymentOption === "partial" && (
            <div className="mt-6 p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-[#F59E0B]">
                <strong>Nota:</strong> El saldo restante debe pagarse al menos 15
                días antes de la fecha del viaje.
              </p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            ¿Qué sigue ahora?
          </h2>
          <div className="space-y-3 text-gray-700">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium">
                  Recibirás un correo de confirmación
                </p>
                <p className="text-sm text-gray-600">
                  Con todos los detalles de tu reserva y vouchers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium">Personaliza tu experiencia</p>
                <p className="text-sm text-gray-600">
                  Selecciona actividades de entretenimiento desde tu perfil
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#2563EB] text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium">Prepara tu viaje</p>
                <p className="text-sm text-gray-600">
                  Te contactaremos 7 días antes con información importante
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/profile"
            className="flex-1 py-4 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white text-center font-semibold rounded-xl hover:shadow-xl transition-all duration-300"
          >
            Ver mis reservas
          </Link>
          <button className="flex-1 py-4 border-2 border-[#2563EB] text-[#2563EB] text-center font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            Descargar confirmación
          </button>
        </div>
      </div>
    </div>
  );
}

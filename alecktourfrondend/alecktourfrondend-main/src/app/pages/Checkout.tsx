import { useParams, useNavigate } from "react-router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { packages } from "../data/packages";
import { CreditCard, Lock, Users, Sparkles, Shield, CheckCircle2, Zap } from "lucide-react";
import { motion } from "motion/react";
import { toast, Toaster } from "sonner";

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const pkg = packages.find((p) => p.id === id);
  const [people, setPeople] = useState(2);
  const [paymentOption, setPaymentOption] = useState<"full" | "partial">("full");
  const [cardData, setCardData] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Paquete no encontrado</h1>
        </div>
      </div>
    );
  }

  const totalPrice = pkg.price * people;
  const paymentAmount = paymentOption === "full" ? totalPrice : totalPrice * 0.5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    toast.loading("Procesando pago...", { id: "payment" });

    setTimeout(() => {
      toast.success("¡Pago exitoso!", { id: "payment" });
      setTimeout(() => {
        navigate("/confirmation", {
          state: {
            package: pkg,
            people,
            totalPrice,
            paymentAmount,
            paymentOption,
          },
        });
      }, 500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <Toaster position="top-center" richColors />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Completa tu reserva
              </h1>
              <p className="text-gray-600">¡Estás a un paso de tu aventura!</p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Number of People */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Cantidad de viajeros</h2>
                </div>
                <div className="flex items-center justify-center gap-8 py-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setPeople(Math.max(1, people - 1))}
                    className="w-14 h-14 rounded-full border-2 border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white text-[#FF6B35] text-2xl font-bold transition-all shadow-lg"
                  >
                    -
                  </motion.button>
                  <div className="text-center min-w-[120px]">
                    <motion.span
                      key={people}
                      initial={{ scale: 1.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-6xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent"
                    >
                      {people}
                    </motion.span>
                    <p className="text-gray-600 mt-2">
                      {people === 1 ? "persona" : "personas"}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={() => setPeople(Math.min(8, people + 1))}
                    className="w-14 h-14 rounded-full border-2 border-[#FF6B35] hover:bg-[#FF6B35] hover:text-white text-[#FF6B35] text-2xl font-bold transition-all shadow-lg"
                  >
                    +
                  </motion.button>
                </div>
              </motion.section>

              {/* Payment Option */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <Zap className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Opciones de pago</h2>
                </div>
                <div className="space-y-4">
                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-start gap-4 p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                      paymentOption === "full"
                        ? "border-[#FF6B35] bg-gradient-to-r from-orange-50 to-orange-100 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentOption === "full"}
                      onChange={() => setPaymentOption("full")}
                      className="mt-1 w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Pago completo</span>
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                        <span className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                          ${totalPrice.toLocaleString("es-CO")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Paga el 100% ahora y asegura tu viaje con descuento adicional
                      </p>
                    </div>
                  </motion.label>

                  <motion.label
                    whileHover={{ scale: 1.02 }}
                    className={`flex items-start gap-4 p-6 rounded-2xl cursor-pointer border-2 transition-all ${
                      paymentOption === "partial"
                        ? "border-[#FF6B35] bg-gradient-to-r from-orange-50 to-orange-100 shadow-lg"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentOption === "partial"}
                      onChange={() => setPaymentOption("partial")}
                      className="mt-1 w-5 h-5 text-[#FF6B35] focus:ring-[#FF6B35]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Pago parcial (50%)</span>
                          <Sparkles className="w-5 h-5 text-[#F7931E]" />
                        </div>
                        <span className="text-3xl font-bold text-[#F7931E]">
                          ${(totalPrice * 0.5).toLocaleString("es-CO")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Paga 50% ahora, resto 15 días antes del viaje
                      </p>
                    </div>
                  </motion.label>
                </div>
              </motion.section>

              {/* Card Details */}
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold">Información de pago</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardData.number}
                      onChange={(e) =>
                        setCardData({ ...cardData, number: e.target.value })
                      }
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre en la tarjeta
                    </label>
                    <input
                      type="text"
                      value={cardData.name}
                      onChange={(e) =>
                        setCardData({ ...cardData, name: e.target.value })
                      }
                      placeholder="JUAN PEREZ"
                      required
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vencimiento
                      </label>
                      <input
                        type="text"
                        value={cardData.expiry}
                        onChange={(e) =>
                          setCardData({ ...cardData, expiry: e.target.value })
                        }
                        placeholder="MM/AA"
                        maxLength={5}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={cardData.cvv}
                        onChange={(e) =>
                          setCardData({ ...cardData, cvv: e.target.value })
                        }
                        placeholder="123"
                        maxLength={3}
                        required
                        className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <Shield className="w-5 h-5 text-green-600" />
                  <span className="text-sm text-gray-700 font-medium">
                    Pago 100% seguro con encriptación SSL
                  </span>
                </div>
              </motion.section>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isProcessing}
                className="w-full py-5 bg-gradient-to-r from-[#FF6B35] via-[#FF8E53] to-[#F7931E] text-white text-xl font-bold rounded-2xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
              >
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative flex items-center justify-center gap-3">
                  {isProcessing ? (
                    "Procesando..."
                  ) : (
                    <>
                      <Lock className="w-6 h-6" />
                      Confirmar y pagar ${paymentAmount.toLocaleString("es-CO")}
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-3xl shadow-xl p-6 sticky top-24 border border-gray-100"
            >
              <h2 className="text-2xl font-bold mb-6">Resumen</h2>

              <div className="mb-6">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={pkg.image}
                  alt={pkg.destination}
                  className="w-full h-48 object-cover rounded-2xl mb-4 shadow-md"
                />
                <h3 className="text-xl font-bold text-gray-900">{pkg.destination}</h3>
                <p className="text-gray-600">{pkg.duration}</p>
              </div>

              <div className="space-y-4 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Precio por persona</span>
                  <span className="font-semibold">
                    ${pkg.price.toLocaleString("es-CO")}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Cantidad</span>
                  <span className="font-semibold">{people} {people === 1 ? "persona" : "personas"}</span>
                </div>
                <div className="flex justify-between text-lg pt-2">
                  <span className="font-bold">Total</span>
                  <span className="text-2xl font-bold text-gray-900">
                    ${totalPrice.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border border-orange-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-gray-900">A pagar ahora</span>
                  <span className="text-3xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                    ${paymentAmount.toLocaleString("es-CO")}
                  </span>
                </div>
                {paymentOption === "partial" && (
                  <p className="text-xs text-gray-600 mt-2">
                    Pagarás ${(totalPrice * 0.5).toLocaleString("es-CO")} restantes antes del viaje
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

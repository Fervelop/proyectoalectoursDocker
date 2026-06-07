import { useState } from "react";
import { useNavigate } from "react-router";
import { User, CreditCard, Phone, MapPin, Calendar, Plane } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/v1/api";
import { toast, Toaster } from "sonner";

export default function CompleteProfile() {
  const { usuario, login, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "", apellido: "", cedula: "", correo: "",
    celular: "", direccion: "", ciudad: "", pais: "Colombia",
    fecha_nacimiento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const cliente = await apiFetch<{ id_cliente: number }>('/clientes', {
      method: 'POST',
      body: formData,
    });
    // Guarda en localStorage para que persista entre sesiones
    localStorage.setItem('id_cliente_username', String(cliente.id_cliente));
    toast.success("¡Perfil completado! Ahora inicia sesión.");
    setTimeout(() => navigate("/login"), 500);
  } catch (err: any) {
    toast.error(err.message || "Error al guardar el perfil");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#06B6D4] to-[#F59E0B] flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Plane className="w-7 h-7 text-[#2563EB]" />
          </div>
          <span className="text-3xl font-bold text-white">AlecTours</span>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Completa tu perfil</h1>
            <p className="text-gray-600">Necesitamos estos datos para gestionar tus reservas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                    placeholder="Juan" required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" name="apellido" value={formData.apellido} onChange={handleChange}
                    placeholder="Pérez" required
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cédula</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="cedula" value={formData.cedula} onChange={handleChange}
                  placeholder="1000111222" required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" name="correo" value={formData.correo} onChange={handleChange}
                  placeholder="tu@email.com" required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Celular</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="tel" name="celular" value={formData.celular} onChange={handleChange}
                    placeholder="3001234567"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange}
                    placeholder="Bogotá"
                    className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" name="direccion" value={formData.direccion} onChange={handleChange}
                  placeholder="Calle 10 # 20-30"
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de nacimiento</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50 mt-2">
              {loading ? "Guardando..." : "Guardar perfil"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
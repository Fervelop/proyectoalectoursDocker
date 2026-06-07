import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, User, Plane, CheckCircle } from "lucide-react";
import { authService } from "../services/auth.service";
import { toast, Toaster } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    correo_electronico: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    try {
      await authService.register({
        username: formData.username,
        correo_electronico: formData.correo_electronico,
        password: formData.password,
      });
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#06B6D4] to-[#F59E0B] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Revisa tu correo!</h2>
        <p className="text-gray-600 mb-6">
          Te enviamos un email de verificación a <span className="font-semibold text-[#2563EB]">{formData.correo_electronico}</span>. 
          Debes verificar tu cuenta antes de iniciar sesión.
        </p>
        <button onClick={() => navigate('/login')}
          className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all">
          Ir a iniciar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#06B6D4] to-[#F59E0B] flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
            <Plane className="w-7 h-7 text-[#2563EB]" />
          </div>
          <span className="text-3xl font-bold text-white">AlecTours</span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Crea tu cuenta</h1>
            <p className="text-gray-600">Únete y descubre el mundo</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" name="username" value={formData.username}
                  onChange={handleChange} placeholder="juanperez123" required minLength={3} maxLength={50}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="email" name="correo_electronico" value={formData.correo_electronico}
                  onChange={handleChange} placeholder="tu@email.com" required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••" required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="password" name="confirmPassword" value={formData.confirmPassword}
                  onChange={handleChange} placeholder="••••••••" required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
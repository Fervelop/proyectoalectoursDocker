import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Lock, User, Plane } from "lucide-react";
import { authService } from "../services/auth.service";
import { useAuth } from "../context/AuthContext";
import { toast, Toaster } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  try {
    const res = await authService.login(formData);
    login(res.access_token, {
      username: res.username ?? formData.username,
      user_id: res.user_id,
      id_cliente: res.id_cliente,
      roles: res.roles ?? [],
    });
    toast.success(`¡Bienvenido, ${res.username ?? formData.username}!`);
    
    // Redirige según el rol
    const roles = res.roles ?? [];
    setTimeout(() => {
      if (roles.includes('admin')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }, 500);
  } catch (err: any) {
    toast.error(err.message || 'Usuario o contraseña incorrectos');
  } finally {
    setLoading(false);
  }
};
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido de nuevo</h1>
            <p className="text-gray-600">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Usuario</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text" name="username" value={formData.username}
                  onChange={handleChange} placeholder="juanperez123" required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password" name="password" value={formData.password}
                  onChange={handleChange} placeholder="••••••••" required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none"
                />
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            ¿No tienes cuenta?{" "}
            <Link to="/register" className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
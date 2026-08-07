import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Mail, Lock, User, Plane, CheckCircle, Phone, MapPin, Calendar, CreditCard } from "lucide-react";
import { authService } from "../services/auth.service";
import { apiFetch } from "../api/v1/api";
import { toast, Toaster } from "sonner";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [success, setSuccess] = useState(false);
  const [verificationToken, setVerificationToken] = useState('');
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState('');

  const [formData, setFormData] = useState({
    // cuenta
    username: "", correo_electronico: "", password: "", confirmPassword: "",
    // perfil
    nombre: "", apellido: "", cedula: "", celular: "",
    direccion: "", ciudad: "", pais: "Colombia", fecha_nacimiento: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword)
      return toast.error("Las contraseñas no coinciden");

    setLoading(true);
    try {
      // 1. Registrar usuario
      const res = await authService.register({
        username: formData.username,
        correo_electronico: formData.correo_electronico,
        password: formData.password,
      });

      // 2. Crear cliente
      const cliente = await apiFetch<{ id_cliente: number }>('/clientes', {
        method: 'POST',
        body: {
          nombre: formData.nombre,
          apellido: formData.apellido,
          cedula: formData.cedula,
          correo: formData.correo_electronico,
          celular: formData.celular,
          direccion: formData.direccion,
          ciudad: formData.ciudad,
          pais: formData.pais,
          fecha_nacimiento: formData.fecha_nacimiento,
        },
      });

      // 3. Vincular cliente al usuario
      await apiFetch(`/api/usuarios/${res.user_id}/vincular-cliente`, {
        method: 'PUT',
        body: { id_cliente: cliente.id_cliente },
      });

      setVerificationToken(res.verification_token);
      setEmail(res.email);
      setUserId(res.user_id);
      setSuccess(true);
    } catch (err: any) {
      toast.error(err.message || "Error al crear la cuenta");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    try {
      await authService.verifyEmail(verificationToken);
      toast.success("¡Cuenta verificada! Ya puedes iniciar sesión.");
      setTimeout(() => navigate('/login'), 1000);
    } catch (err: any) {
      toast.error(err.message || "Error al verificar");
    } finally {
      setVerifying(false);
    }
  };

  if (success) return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#06B6D4] to-[#F59E0B] flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Cuenta creada!</h2>
        <p className="text-gray-500 text-sm mb-6">
          Registrado como <span className="font-semibold text-gray-700">{email}</span>
        </p>
        <button onClick={handleVerify} disabled={verifying}
          className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
          {verifying ? "Verificando..." : "✓ Verificar mi cuenta"}
        </button>
        <p className="text-xs text-gray-400 mt-3">En producción esto llegaría por email</p>
        <Link to="/login" className="block text-sm text-gray-500 hover:text-[#2563EB] mt-4">
          Ir a iniciar sesión →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#06B6D4] to-[#F59E0B] flex items-center justify-center p-4">
      <Toaster position="top-center" richColors />
      <div className="w-full max-w-2xl">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SECCIÓN CUENTA */}
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Datos de acceso</h2>
              <div className="space-y-3">
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" name="username" value={formData.username} onChange={handleChange}
                    placeholder="Nombre de usuario" required minLength={3} maxLength={50}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" name="correo_electronico" value={formData.correo_electronico} onChange={handleChange}
                    placeholder="Correo electrónico" required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" name="password" value={formData.password} onChange={handleChange}
                      placeholder="Contraseña" required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                      placeholder="Confirmar contraseña" required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN PERFIL */}
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Datos personales</h2>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" name="nombre" value={formData.nombre} onChange={handleChange}
                      placeholder="Nombre" required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                  </div>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" name="apellido" value={formData.apellido} onChange={handleChange}
                      placeholder="Apellido" required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" name="cedula" value={formData.cedula} onChange={handleChange}
                      placeholder="Cédula" required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" name="celular" value={formData.celular} onChange={handleChange}
                      placeholder="Celular"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange}
                      placeholder="Ciudad"
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                  </div>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento} onChange={handleChange}
                      required
                      className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                  </div>
                </div>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="text" name="direccion" value={formData.direccion} onChange={handleChange}
                    placeholder="Dirección"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#2563EB] outline-none text-sm" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-50">
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
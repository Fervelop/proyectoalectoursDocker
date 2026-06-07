import { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { apiFetch } from "../../api/v1/api";

interface Props { clienteData: any; }

export default function TabCuenta({ clienteData }: Props) {
  const [form, setForm] = useState({ actual: "", nueva: "", confirmar: "" });
  const [show, setShow] = useState({ actual: false, nueva: false, confirmar: false });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const toggle = (field: keyof typeof show) => setShow(p => ({ ...p, [field]: !p[field] }));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [e.target.name]: e.target.value }));

 const handleSubmit = async () => {
  setStatus(null);
  if (!form.actual || !form.nueva || !form.confirmar)
    return setStatus({ type: "error", msg: "Completa todos los campos." });
  if (form.nueva.length < 8)
    return setStatus({ type: "error", msg: "La nueva contraseña debe tener al menos 8 caracteres." });
  if (form.nueva !== form.confirmar)
    return setStatus({ type: "error", msg: "Las contraseñas no coinciden." });

  setLoading(true);
  try {
    await apiFetch(`/clientes/${clienteData.id_cliente}/cambiar-contrasena`, {
      method: "PUT",
      body: { contrasena_actual: form.actual, nueva_contrasena: form.nueva },
    });
    setStatus({ type: "success", msg: "Contraseña actualizada correctamente." });
    setForm({ actual: "", nueva: "", confirmar: "" });
  } catch (err: any) {
    setStatus({ type: "error", msg: err?.message ?? "Error al cambiar la contraseña." });
  } finally {
    setLoading(false);
  }
};

  const fields: { name: keyof typeof form; label: string; key: keyof typeof show }[] = [
    { name: "actual",    label: "Contraseña actual",       key: "actual"    },
    { name: "nueva",     label: "Nueva contraseña",         key: "nueva"     },
    { name: "confirmar", label: "Confirmar nueva contraseña", key: "confirmar" },
  ];

  return (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Mi Cuenta</h1>
        <p className="text-gray-500 mt-1">Información de tu perfil</p>
      </div>

      {/* Datos del perfil */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        {clienteData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Nombre completo", value: `${clienteData.nombre} ${clienteData.apellido}` },
              { label: "Cédula",           value: clienteData.cedula },
              { label: "Correo",           value: clienteData.correo },
              { label: "Celular",          value: clienteData.celular },
              { label: "Ciudad",           value: clienteData.ciudad },
              { label: "País",             value: clienteData.pais },
              { label: "Dirección",        value: clienteData.direccion },
              { label: "Fecha de nacimiento", value: clienteData.fecha_nacimiento
                  ? new Date(clienteData.fecha_nacimiento).toLocaleDateString("es-CO") : null },
            ].filter(item => item.value).map(item => (
              <div key={item.label} className="p-4 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="font-semibold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">No se encontró información del perfil.</p>
        )}
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-white rounded-2xl shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Lock className="w-5 h-5 text-[#2563EB]" /> Cambiar contraseña
        </h2>
        <p className="text-gray-500 text-sm mb-6">Actualiza tu contraseña de acceso</p>

        <div className="space-y-4 max-w-md">
          {fields.map(({ name, label, key }) => (
            <div key={name}>
              <label className="text-xs text-gray-500 mb-1 block">{label}</label>
              <div className="relative">
                <input
                  type={show[key] ? "text" : "password"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                />
                <button type="button" onClick={() => toggle(key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {status && (
            <div className={`flex items-center gap-2 text-sm px-4 py-3 rounded-xl ${
              status.type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {status.type === "success"
                ? <CheckCircle className="w-4 h-4 shrink-0" />
                : <AlertCircle className="w-4 h-4 shrink-0" />}
              {status.msg}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all disabled:opacity-50">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? "Guardando..." : "Actualizar contraseña"}
          </button>
        </div>
      </div>
    </>
  );
}
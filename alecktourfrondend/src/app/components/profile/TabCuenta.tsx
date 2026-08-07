import { AlertCircle, CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useState } from "react";
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
    { name: "actual", label: "Contraseña actual", key: "actual" },
    { name: "nueva", label: "Nueva contraseña", key: "nueva" },
    { name: "confirmar", label: "Confirmar nueva contraseña", key: "confirmar" },
  ];

  return (
    <>
      {/* Título de la pestaña */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground  text-white tracking-tight">Mi Cuenta</h1>
        <p className="text-muted-foreground text-sm mt-0.5">Información de tu perfil y configuración de seguridad</p>
      </div>

      {/* Datos del perfil */}
      <div className="bg-card text-card-foreground rounded-xl shadow-md border border-border p-6 mb-6 transition-colors duration-200">
        {clienteData ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: "Nombre completo", value: `${clienteData.nombre} ${clienteData.apellido}` },
              { label: "Documento de Identidad / Cédula", value: clienteData.cedula },
              { label: "Correo electrónico", value: clienteData.correo },
              { label: "Teléfono Celular", value: clienteData.celular },
              { label: "Ciudad", value: clienteData.ciudad },
              { label: "País", value: clienteData.pais },
              { label: "Dirección de residencia", value: clienteData.direccion },
              {
                label: "Fecha de nacimiento", value: clienteData.fecha_nacimiento
                  ? new Date(clienteData.fecha_nacimiento).toLocaleDateString("es-CO", { day: 'numeric', month: 'long', year: 'numeric' }) : null
              },
            ].filter(item => item.value).map(item => (
              <div key={item.label} className="p-3.5 bg-muted/40 rounded-lg border border-border/40">
                <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 mb-0.5">{item.label}</p>
                <p className="font-semibold text-foreground text-sm">{item.value}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8 text-sm">No se encontró información del perfil.</p>
        )}
      </div>

      {/* Cambiar contraseña */}
      <div className="bg-card text-card-foreground rounded-xl shadow-md border border-border p-6 transition-colors duration-200">
        <h2 className="text-lg font-bold text-foreground tracking-tight mb-0.5 flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" /> Seguridad de la cuenta
        </h2>
        <p className="text-muted-foreground text-xs mb-6">Actualiza tu contraseña de acceso para mantener la cuenta protegida</p>

        <div className="space-y-4 max-w-md">
          {fields.map(({ name, label, key }) => (
            <div key={name} className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">{label}</label>
              <div className="relative">
                <input
                  type={show[key] ? "text" : "password"}
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2 pr-10 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-muted/30 text-foreground placeholder:text-muted-foreground/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => toggle(key)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-foreground transition-colors"
                >
                  {show[key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          ))}

          {status && (
            <div className={`flex items-start gap-2.5 text-xs px-4 py-3 rounded-lg border transition-all ${status.type === "success"
              ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
              : "bg-destructive/10 text-destructive border-destructive/20"
              }`}>
              {status.type === "success"
                ? <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
              <span className="font-medium">{status.msg}</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-all duration-200 hover:opacity-95 active:scale-95 disabled:opacity-50 shadow-sm"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
            {loading ? "Guardando cambios..." : "Actualizar contraseña"}
          </button>
        </div>
      </div>
    </>
  );
}
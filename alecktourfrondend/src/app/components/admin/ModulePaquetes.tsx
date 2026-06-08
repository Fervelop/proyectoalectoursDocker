import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Paquete, inputCls, labelCls } from "./types";

interface Props {
  paquetes: Paquete[];
  onDelete: (id: number) => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function ModulePaquetes({ paquetes, onDelete, onSubmit, loading }: Props) {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    nombre_paquete: "", descripcion: "", duracion_dias: "1", precio_base: "", activo: true
  });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const filtered = paquetes.filter(p =>
    p.nombre_paquete.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      await onSubmit({ ...form, duracion_dias: parseInt(form.duracion_dias), precio_base: parseFloat(form.precio_base) });
      setMsg({ type: "ok", text: "Paquete creado exitosamente" });
      setForm({ nombre_paquete: "", descripcion: "", duracion_dias: "1", precio_base: "", activo: true });
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Error al crear paquete" });
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900">Paquetes</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Crear paquete</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {msg && (
              <div className={`p-3 rounded-xl text-sm font-medium ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {msg.text}
              </div>
            )}
            <div>
              <label className={labelCls}>Nombre del paquete</label>
              <input value={form.nombre_paquete} onChange={e => setForm({ ...form, nombre_paquete: e.target.value })}
                className={inputCls} required placeholder="Magia del Caribe" />
            </div>
            <div>
              <label className={labelCls}>Descripción</label>
              <textarea value={form.descripcion} onChange={e => setForm({ ...form, descripcion: e.target.value })}
                className={inputCls + " resize-none"} rows={3} placeholder="Descripción del paquete..." />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Duración (días)</label>
                <input type="number" min="1" value={form.duracion_dias}
                  onChange={e => setForm({ ...form, duracion_dias: e.target.value })}
                  className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Precio base ($)</label>
                <input type="number" min="0" step="1000" value={form.precio_base}
                  onChange={e => setForm({ ...form, precio_base: e.target.value })}
                  className={inputCls} required placeholder="1200000" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
              {loading ? "Guardando..." : "Crear Paquete"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Paquetes activos</h3>
            <span className="text-xs text-gray-500">{paquetes.length} total</span>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filtered.map(p => (
              <div key={p.id_paquete} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{p.nombre_paquete}</p>
                  <p className="text-xs text-gray-500">{p.duracion_dias} días · ${p.precio_base?.toLocaleString()}</p>
                </div>
                <button onClick={() => onDelete(p.id_paquete)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
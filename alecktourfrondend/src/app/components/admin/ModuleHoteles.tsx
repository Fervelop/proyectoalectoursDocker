import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { HotelData, inputCls, labelCls } from "./types";

interface Props {
  hoteles: HotelData[];
  onDelete: (id: number) => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function ModuleHoteles({ hoteles, onDelete, onSubmit, loading }: Props) {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    nombre_hotel: "", calificacion: "3", ciudad: "",
    pais: "", correo_electronico: "", telefono: ""
  });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const filtered = hoteles.filter(h =>
    h.nombre_hotel.toLowerCase().includes(search.toLowerCase()) ||
    h.ciudad.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      await onSubmit({ ...form, calificacion: parseInt(form.calificacion) });
      setMsg({ type: "ok", text: "Hotel creado exitosamente" });
      setForm({ nombre_hotel: "", calificacion: "3", ciudad: "", pais: "", correo_electronico: "", telefono: "" });
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Error al crear hotel" });
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900">Hoteles</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Registrar hotel</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {msg && (
              <div className={`p-3 rounded-xl text-sm font-medium ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {msg.text}
              </div>
            )}
            <div>
              <label className={labelCls}>Nombre</label>
              <input value={form.nombre_hotel} onChange={e => setForm({ ...form, nombre_hotel: e.target.value })}
                className={inputCls} required placeholder="Hotel Paraíso" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Ciudad</label>
                <input value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })}
                  className={inputCls} required placeholder="Bogotá" />
              </div>
              <div>
                <label className={labelCls}>País</label>
                <input value={form.pais} onChange={e => setForm({ ...form, pais: e.target.value })}
                  className={inputCls} required placeholder="Colombia" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Calificación</label>
                <select value={form.calificacion} onChange={e => setForm({ ...form, calificacion: e.target.value })} className={inputCls}>
                  {[1,2,3,4,5].map(n => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Teléfono</label>
                <input value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })}
                  className={inputCls} placeholder="+57..." />
              </div>
            </div>
            <div>
              <label className={labelCls}>Correo</label>
              <input type="email" value={form.correo_electronico}
                onChange={e => setForm({ ...form, correo_electronico: e.target.value })}
                className={inputCls} placeholder="info@hotel.com" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
              {loading ? "Guardando..." : "Registrar Hotel"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Hoteles registrados</h3>
            <span className="text-xs text-gray-500">{hoteles.length} total</span>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filtered.map(h => (
              <div key={h.id_hotel} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{h.nombre_hotel}</p>
                  <p className="text-xs text-gray-500">{h.ciudad}, {h.pais} · {"★".repeat(h.calificacion)}</p>
                </div>
                <button onClick={() => onDelete(h.id_hotel)}
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
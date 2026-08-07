import { useState } from "react";
import { Search, Trash2 } from "lucide-react";
import { Cliente, inputCls, labelCls } from "./types";

interface Props {
  clientes: Cliente[];
  onDelete: (id: number) => void;
  onSubmit: (data: any) => Promise<void>;
  loading: boolean;
}

export default function ModuleClientes({ clientes, onDelete, onSubmit, loading }: Props) {
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    nombre: "", apellido: "", cedula: "", correo: "",
    celular: "", direccion: "", ciudad: "", pais: "", fecha_nacimiento: ""
  });
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const filtered = clientes.filter(c =>
    `${c.nombre} ${c.apellido} ${c.cedula} ${c.correo}`.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    try {
      await onSubmit(form);
      setMsg({ type: "ok", text: "Cliente registrado exitosamente" });
      setForm({ nombre: "", apellido: "", cedula: "", correo: "", celular: "", direccion: "", ciudad: "", pais: "", fecha_nacimiento: "" });
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Error al registrar cliente" });
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-4">Registrar cliente</h3>
          <form onSubmit={handleSubmit} className="space-y-3">
            {msg && (
              <div className={`p-3 rounded-xl text-sm font-medium ${msg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                {msg.text}
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Nombre</label>
                <input value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}
                  className={inputCls} required placeholder="Juan" />
              </div>
              <div>
                <label className={labelCls}>Apellido</label>
                <input value={form.apellido} onChange={e => setForm({ ...form, apellido: e.target.value })}
                  className={inputCls} required placeholder="Pérez" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Cédula</label>
                <input value={form.cedula} onChange={e => setForm({ ...form, cedula: e.target.value })}
                  className={inputCls} required placeholder="1000111222" />
              </div>
              <div>
                <label className={labelCls}>Celular</label>
                <input value={form.celular} onChange={e => setForm({ ...form, celular: e.target.value })}
                  className={inputCls} placeholder="+57..." />
              </div>
            </div>
            <div>
              <label className={labelCls}>Correo</label>
              <input type="email" value={form.correo} onChange={e => setForm({ ...form, correo: e.target.value })}
                className={inputCls} placeholder="juan@email.com" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Ciudad</label>
                <input value={form.ciudad} onChange={e => setForm({ ...form, ciudad: e.target.value })}
                  className={inputCls} placeholder="Bogotá" />
              </div>
              <div>
                <label className={labelCls}>País</label>
                <input value={form.pais} onChange={e => setForm({ ...form, pais: e.target.value })}
                  className={inputCls} placeholder="Colombia" />
              </div>
            </div>
            <div>
              <label className={labelCls}>Fecha de nacimiento</label>
              <input type="date" value={form.fecha_nacimiento}
                onChange={e => setForm({ ...form, fecha_nacimiento: e.target.value })}
                className={inputCls} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
              {loading ? "Guardando..." : "Registrar Cliente"}
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Clientes registrados</h3>
            <span className="text-xs text-gray-500">{clientes.length} total</span>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Nombre, cédula, correo..."
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
          </div>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {filtered.map(c => (
              <div key={c.id_cliente} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                <div>
                  <p className="text-sm font-medium text-gray-900">{c.nombre} {c.apellido}</p>
                  <p className="text-xs text-gray-500">{c.cedula} · {c.ciudad}</p>
                </div>
                <button onClick={() => onDelete(c.id_cliente)}
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
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  LayoutDashboard, CalendarDays, PlusCircle, Hotel, Package,
  Users, UserPlus, LogOut, Plane, ChevronRight, Menu, X,
  TrendingUp, Clock, CheckCircle, XCircle, Edit, Trash2,
  Search, Filter, Eye
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/v1/api";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Reserva {
  id_reserva: number;
  id_cliente: number;
  id_paquete: number;
  fecha_inicio: string;
  fecha_fin: string;
  numero_personas: number;
  estado: string;
}
interface HotelData {
  id_hotel: number;
  nombre_hotel: string;
  calificacion: number;
  ciudad: string;
  pais: string;
  correo_electronico: string;
  telefono: string;
}
interface Paquete {
  id_paquete: number;
  nombre_paquete: string;
  descripcion: string;
  duracion_dias: number;
  precio_base: number;
  activo: boolean;
}
interface Cliente {
  id_cliente: number;
  nombre: string;
  apellido: string;
  cedula: string;
  correo: string;
  celular: string;
  ciudad: string;
  pais: string;
}

type Module = "dashboard" | "reservas" | "crear-reserva" | "hoteles" | "paquetes" | "clientes" | "usuarios";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "reservas", label: "Reservas", icon: CalendarDays },
  { id: "crear-reserva", label: "Crear Reserva", icon: PlusCircle },
  { id: "hoteles", label: "Hoteles", icon: Hotel },
  { id: "paquetes", label: "Paquetes", icon: Package },
  { id: "clientes", label: "Clientes", icon: Users },
  { id: "usuarios", label: "Usuarios", icon: UserPlus },
] as const;

const ESTADO_COLOR: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-700",
  confirmada: "bg-green-100 text-green-700",
  cancelada: "bg-red-100 text-red-700",
  finalizada: "bg-blue-100 text-blue-700",
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const { usuario, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<Module>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Data states
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [hoteles, setHoteles] = useState<HotelData[]>([]);
  const [paquetes, setPaquetes] = useState<Paquete[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Form states
  const [reservaForm, setReservaForm] = useState({
    id_cliente: "", id_paquete: "", fecha_inicio: "",
    fecha_fin: "", numero_personas: "1", estado: "pendiente"
  });
  const [hotelForm, setHotelForm] = useState({
    nombre_hotel: "", calificacion: "3", ciudad: "",
    pais: "", correo_electronico: "", telefono: ""
  });
  const [paqueteForm, setPaqueteForm] = useState({
    nombre_paquete: "", descripcion: "", duracion_dias: "1",
    precio_base: "", activo: true
  });
  const [clienteForm, setClienteForm] = useState({
    nombre: "", apellido: "", cedula: "", correo: "",
    celular: "", direccion: "", ciudad: "", pais: "", fecha_nacimiento: ""
  });
  const [formMsg, setFormMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => { if (!isAdmin) navigate("/"); }, [isAdmin]);

  useEffect(() => {
    setSearch("");
    setFormMsg(null);
    if (activeModule === "reservas" || activeModule === "dashboard") fetchReservas();
    if (activeModule === "hoteles" || activeModule === "dashboard") fetchHoteles();
    if (activeModule === "paquetes" || activeModule === "crear-reserva") fetchPaquetes();
    if (activeModule === "clientes" || activeModule === "crear-reserva") fetchClientes();
  }, [activeModule]);

  async function fetchReservas() {
    try { setReservas(await apiFetch<Reserva[]>("/reservas?limit=100")); } catch {}
  }
  async function fetchHoteles() {
    try { setHoteles(await apiFetch<HotelData[]>("/hoteles/?limit=100")); } catch {}
  }
  async function fetchPaquetes() {
    try { setPaquetes(await apiFetch<Paquete[]>("/paquetes?limit=100")); } catch {}
  }
  async function fetchClientes() {
    try { setClientes(await apiFetch<Cliente[]>("/clientes?limit=100")); } catch {}
  }

  async function deleteReserva(id: number) {
    if (!confirm("¿Eliminar esta reserva?")) return;
    try { await apiFetch(`/reservas/${id}`, { method: "DELETE" }); fetchReservas(); } catch {}
  }
  async function deleteHotel(id: number) {
    if (!confirm("¿Eliminar este hotel?")) return;
    try { await apiFetch(`/hoteles/${id}`, { method: "DELETE" }); fetchHoteles(); } catch {}
  }
  async function deletePaquete(id: number) {
    if (!confirm("¿Eliminar este paquete?")) return;
    try { await apiFetch(`/paquetes/${id}`, { method: "DELETE" }); fetchPaquetes(); } catch {}
  }
  async function deleteCliente(id: number) {
    if (!confirm("¿Eliminar este cliente?")) return;
    try { await apiFetch(`/clientes/${id}`, { method: "DELETE" }); fetchClientes(); } catch {}
  }

  async function submitReserva(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setFormMsg(null);
    try {
      await apiFetch("/reservas", {
        method: "POST",
        body: {
          ...reservaForm,
          id_cliente: parseInt(reservaForm.id_cliente),
          id_paquete: parseInt(reservaForm.id_paquete),
          numero_personas: parseInt(reservaForm.numero_personas),
        }
      });
      setFormMsg({ type: "ok", text: "Reserva creada exitosamente" });
      setReservaForm({ id_cliente: "", id_paquete: "", fecha_inicio: "", fecha_fin: "", numero_personas: "1", estado: "pendiente" });
      fetchReservas();
    } catch (err: any) {
      setFormMsg({ type: "err", text: err.message || "Error al crear reserva" });
    } finally { setLoading(false); }
  }

  async function submitHotel(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setFormMsg(null);
    try {
      await apiFetch("/hoteles/", { method: "POST", body: { ...hotelForm, calificacion: parseInt(hotelForm.calificacion) } });
      setFormMsg({ type: "ok", text: "Hotel creado exitosamente" });
      setHotelForm({ nombre_hotel: "", calificacion: "3", ciudad: "", pais: "", correo_electronico: "", telefono: "" });
      fetchHoteles();
    } catch (err: any) {
      setFormMsg({ type: "err", text: err.message || "Error al crear hotel" });
    } finally { setLoading(false); }
  }

  async function submitPaquete(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setFormMsg(null);
    try {
      await apiFetch("/paquetes", { method: "POST", body: { ...paqueteForm, duracion_dias: parseInt(paqueteForm.duracion_dias), precio_base: parseFloat(paqueteForm.precio_base) } });
      setFormMsg({ type: "ok", text: "Paquete creado exitosamente" });
      setPaqueteForm({ nombre_paquete: "", descripcion: "", duracion_dias: "1", precio_base: "", activo: true });
      fetchPaquetes();
    } catch (err: any) {
      setFormMsg({ type: "err", text: err.message || "Error al crear paquete" });
    } finally { setLoading(false); }
  }

  async function submitCliente(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setFormMsg(null);
    try {
      await apiFetch("/clientes", { method: "POST", body: clienteForm });
      setFormMsg({ type: "ok", text: "Cliente registrado exitosamente" });
      setClienteForm({ nombre: "", apellido: "", cedula: "", correo: "", celular: "", direccion: "", ciudad: "", pais: "", fecha_nacimiento: "" });
      fetchClientes();
    } catch (err: any) {
      setFormMsg({ type: "err", text: err.message || "Error al registrar cliente" });
    } finally { setLoading(false); }
  }

  const handleLogout = () => { logout(); navigate("/"); };

  // ─── Sub-components ─────────────────────────────────────────────────────────

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );

  const FormMessage = () => formMsg ? (
    <div className={`p-3 rounded-xl text-sm font-medium ${formMsg.type === "ok" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
      {formMsg.text}
    </div>
  ) : null;

  const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none text-sm";
  const labelCls = "block text-sm font-medium text-gray-700 mb-1";

  // ─── Module: Dashboard ───────────────────────────────────────────────────────
  const ModuleDashboard = () => {
    const pendientes = reservas.filter(r => r.estado === "pendiente").length;
    const confirmadas = reservas.filter(r => r.estado === "confirmada").length;
    const canceladas = reservas.filter(r => r.estado === "cancelada").length;
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Resumen general del sistema</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Reservas" value={reservas.length} icon={CalendarDays} color="bg-gradient-to-br from-[#2563EB] to-[#06B6D4]" />
          <StatCard label="Pendientes" value={pendientes} icon={Clock} color="bg-gradient-to-br from-amber-400 to-orange-500" />
          <StatCard label="Confirmadas" value={confirmadas} icon={CheckCircle} color="bg-gradient-to-br from-green-400 to-emerald-600" />
          <StatCard label="Hoteles" value={hoteles.length} icon={Hotel} color="bg-gradient-to-br from-purple-400 to-indigo-600" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Últimas reservas</h3>
            <div className="space-y-3">
              {reservas.slice(0, 5).map(r => (
                <div key={r.id_reserva} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Reserva #{r.id_reserva}</p>
                    <p className="text-xs text-gray-500">{r.fecha_inicio} → {r.fecha_fin}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${ESTADO_COLOR[r.estado] || "bg-gray-100 text-gray-600"}`}>
                    {r.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Accesos rápidos</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Nueva Reserva", mod: "crear-reserva", icon: PlusCircle, color: "from-[#2563EB] to-[#06B6D4]" },
                { label: "Ver Hoteles", mod: "hoteles", icon: Hotel, color: "from-purple-500 to-indigo-600" },
                { label: "Paquetes", mod: "paquetes", icon: Package, color: "from-amber-400 to-orange-500" },
                { label: "Clientes", mod: "clientes", icon: Users, color: "from-green-400 to-emerald-600" },
              ].map(({ label, mod, icon: Icon, color }) => (
                <button key={mod} onClick={() => setActiveModule(mod as Module)}
                  className={`flex items-center gap-2 p-3 bg-gradient-to-r ${color} text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all`}>
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Module: Reservas ────────────────────────────────────────────────────────
  const ModuleReservas = () => {
    const filtered = reservas.filter(r =>
      String(r.id_reserva).includes(search) ||
      String(r.id_cliente).includes(search) ||
      r.estado.includes(search.toLowerCase())
    );
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Reservas</h2>
            <p className="text-gray-500 text-sm">{reservas.length} reservas en total</p>
          </div>
          <button onClick={() => setActiveModule("crear-reserva")}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
            <PlusCircle className="w-4 h-4" /> Nueva
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por ID, cliente o estado..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#2563EB]" />
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["ID", "Cliente", "Paquete", "Check-in", "Check-out", "Personas", "Estado", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(r => (
                <tr key={r.id_reserva} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">#{r.id_reserva}</td>
                  <td className="px-4 py-3 text-gray-600">#{r.id_cliente}</td>
                  <td className="px-4 py-3 text-gray-600">#{r.id_paquete}</td>
                  <td className="px-4 py-3 text-gray-600">{r.fecha_inicio}</td>
                  <td className="px-4 py-3 text-gray-600">{r.fecha_fin}</td>
                  <td className="px-4 py-3 text-gray-600">{r.numero_personas}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${ESTADO_COLOR[r.estado] || "bg-gray-100 text-gray-600"}`}>
                      {r.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => deleteReserva(r.id_reserva)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400 text-sm">No se encontraron reservas</div>
          )}
        </div>
      </div>
    );
  };

  // ─── Module: Crear Reserva ───────────────────────────────────────────────────
  const ModuleCrearReserva = () => (
    <div className="space-y-5 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Crear Reserva</h2>
        <p className="text-gray-500 text-sm">Registra una nueva reserva para un cliente</p>
      </div>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <form onSubmit={submitReserva} className="space-y-4">
          <FormMessage />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Cliente</label>
              <select value={reservaForm.id_cliente}
                onChange={e => setReservaForm({ ...reservaForm, id_cliente: e.target.value })}
                className={inputCls} required>
                <option value="">Seleccionar cliente...</option>
                {clientes.map(c => (
                  <option key={c.id_cliente} value={c.id_cliente}>
                    {c.nombre} {c.apellido} — {c.cedula}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelCls}>Paquete</label>
              <select value={reservaForm.id_paquete}
                onChange={e => setReservaForm({ ...reservaForm, id_paquete: e.target.value })}
                className={inputCls} required>
                <option value="">Seleccionar paquete...</option>
                {paquetes.map(p => (
                  <option key={p.id_paquete} value={p.id_paquete}>
                    {p.nombre_paquete} — ${p.precio_base?.toLocaleString()} ({p.duracion_dias}d)
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Fecha inicio</label>
              <input type="date" value={reservaForm.fecha_inicio}
                onChange={e => setReservaForm({ ...reservaForm, fecha_inicio: e.target.value })}
                className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Fecha fin</label>
              <input type="date" value={reservaForm.fecha_fin}
                onChange={e => setReservaForm({ ...reservaForm, fecha_fin: e.target.value })}
                className={inputCls} required />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Número de personas</label>
              <input type="number" min="1" value={reservaForm.numero_personas}
                onChange={e => setReservaForm({ ...reservaForm, numero_personas: e.target.value })}
                className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Estado</label>
              <select value={reservaForm.estado}
                onChange={e => setReservaForm({ ...reservaForm, estado: e.target.value })}
                className={inputCls}>
                {["pendiente", "confirmada", "cancelada", "finalizada"].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Precio estimado */}
          {reservaForm.id_paquete && (
            <div className="bg-blue-50 rounded-xl p-4 text-sm">
              {(() => {
                const p = paquetes.find(p => p.id_paquete === parseInt(reservaForm.id_paquete));
                const c = clientes.find(c => c.id_cliente === parseInt(reservaForm.id_cliente));
                if (!p) return null;
                const total = p.precio_base * parseInt(reservaForm.numero_personas || "1");
                return (
                  <div className="space-y-1">
                    <p className="font-semibold text-blue-800">Resumen de reserva</p>
                    {c && <p className="text-blue-700">Cliente: {c.nombre} {c.apellido}</p>}
                    <p className="text-blue-700">Paquete: {p.nombre_paquete}</p>
                    <p className="text-blue-700">Duración: {p.duracion_dias} días</p>
                    <p className="font-bold text-blue-900 text-base">
                      Total estimado: ${total.toLocaleString()}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
            {loading ? "Creando..." : "Crear Reserva"}
          </button>
        </form>
      </div>
    </div>
  );

  // ─── Module: Hoteles ─────────────────────────────────────────────────────────
  const ModuleHoteles = () => {
    const filtered = hoteles.filter(h =>
      h.nombre_hotel.toLowerCase().includes(search.toLowerCase()) ||
      h.ciudad.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">Hoteles</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Registrar hotel</h3>
            <form onSubmit={submitHotel} className="space-y-3">
              <FormMessage />
              <div>
                <label className={labelCls}>Nombre</label>
                <input value={hotelForm.nombre_hotel} onChange={e => setHotelForm({ ...hotelForm, nombre_hotel: e.target.value })} className={inputCls} required placeholder="Hotel Paraíso" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Ciudad</label>
                  <input value={hotelForm.ciudad} onChange={e => setHotelForm({ ...hotelForm, ciudad: e.target.value })} className={inputCls} required placeholder="Bogotá" />
                </div>
                <div>
                  <label className={labelCls}>País</label>
                  <input value={hotelForm.pais} onChange={e => setHotelForm({ ...hotelForm, pais: e.target.value })} className={inputCls} required placeholder="Colombia" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Calificación</label>
                  <select value={hotelForm.calificacion} onChange={e => setHotelForm({ ...hotelForm, calificacion: e.target.value })} className={inputCls}>
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{"★".repeat(n)} ({n})</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Teléfono</label>
                  <input value={hotelForm.telefono} onChange={e => setHotelForm({ ...hotelForm, telefono: e.target.value })} className={inputCls} placeholder="+57..." />
                </div>
              </div>
              <div>
                <label className={labelCls}>Correo</label>
                <input type="email" value={hotelForm.correo_electronico} onChange={e => setHotelForm({ ...hotelForm, correo_electronico: e.target.value })} className={inputCls} placeholder="info@hotel.com" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 text-sm">
                {loading ? "Guardando..." : "Registrar Hotel"}
              </button>
            </form>
          </div>
          {/* List */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Hoteles registrados</h3>
              <span className="text-xs text-gray-500">{hoteles.length} total</span>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filtered.map(h => (
                <div key={h.id_hotel} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{h.nombre_hotel}</p>
                    <p className="text-xs text-gray-500">{h.ciudad}, {h.pais} · {"★".repeat(h.calificacion)}</p>
                  </div>
                  <button onClick={() => deleteHotel(h.id_hotel)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Module: Paquetes ────────────────────────────────────────────────────────
  const ModulePaquetes = () => {
    const filtered = paquetes.filter(p =>
      p.nombre_paquete.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">Paquetes</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Crear paquete</h3>
            <form onSubmit={submitPaquete} className="space-y-3">
              <FormMessage />
              <div>
                <label className={labelCls}>Nombre del paquete</label>
                <input value={paqueteForm.nombre_paquete} onChange={e => setPaqueteForm({ ...paqueteForm, nombre_paquete: e.target.value })} className={inputCls} required placeholder="Magia del Caribe" />
              </div>
              <div>
                <label className={labelCls}>Descripción</label>
                <textarea value={paqueteForm.descripcion} onChange={e => setPaqueteForm({ ...paqueteForm, descripcion: e.target.value })} className={inputCls + " resize-none"} rows={3} placeholder="Descripción del paquete..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Duración (días)</label>
                  <input type="number" min="1" value={paqueteForm.duracion_dias} onChange={e => setPaqueteForm({ ...paqueteForm, duracion_dias: e.target.value })} className={inputCls} required />
                </div>
                <div>
                  <label className={labelCls}>Precio base ($)</label>
                  <input type="number" min="0" step="1000" value={paqueteForm.precio_base} onChange={e => setPaqueteForm({ ...paqueteForm, precio_base: e.target.value })} className={inputCls} required placeholder="1200000" />
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filtered.map(p => (
                <div key={p.id_paquete} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{p.nombre_paquete}</p>
                    <p className="text-xs text-gray-500">{p.duracion_dias} días · ${p.precio_base?.toLocaleString()}</p>
                  </div>
                  <button onClick={() => deletePaquete(p.id_paquete)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ─── Module: Clientes ────────────────────────────────────────────────────────
  const ModuleClientes = () => {
    const filtered = clientes.filter(c =>
      `${c.nombre} ${c.apellido} ${c.cedula} ${c.correo}`.toLowerCase().includes(search.toLowerCase())
    );
    return (
      <div className="space-y-5">
        <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Registrar cliente</h3>
            <form onSubmit={submitCliente} className="space-y-3">
              <FormMessage />
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Nombre</label>
                  <input value={clienteForm.nombre} onChange={e => setClienteForm({ ...clienteForm, nombre: e.target.value })} className={inputCls} required placeholder="Juan" />
                </div>
                <div>
                  <label className={labelCls}>Apellido</label>
                  <input value={clienteForm.apellido} onChange={e => setClienteForm({ ...clienteForm, apellido: e.target.value })} className={inputCls} required placeholder="Pérez" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Cédula</label>
                  <input value={clienteForm.cedula} onChange={e => setClienteForm({ ...clienteForm, cedula: e.target.value })} className={inputCls} required placeholder="1000111222" />
                </div>
                <div>
                  <label className={labelCls}>Celular</label>
                  <input value={clienteForm.celular} onChange={e => setClienteForm({ ...clienteForm, celular: e.target.value })} className={inputCls} placeholder="+57..." />
                </div>
              </div>
              <div>
                <label className={labelCls}>Correo</label>
                <input type="email" value={clienteForm.correo} onChange={e => setClienteForm({ ...clienteForm, correo: e.target.value })} className={inputCls} placeholder="juan@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Ciudad</label>
                  <input value={clienteForm.ciudad} onChange={e => setClienteForm({ ...clienteForm, ciudad: e.target.value })} className={inputCls} placeholder="Bogotá" />
                </div>
                <div>
                  <label className={labelCls}>País</label>
                  <input value={clienteForm.pais} onChange={e => setClienteForm({ ...clienteForm, pais: e.target.value })} className={inputCls} placeholder="Colombia" />
                </div>
              </div>
              <div>
                <label className={labelCls}>Fecha de nacimiento</label>
                <input type="date" value={clienteForm.fecha_nacimiento} onChange={e => setClienteForm({ ...clienteForm, fecha_nacimiento: e.target.value })} className={inputCls} />
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
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nombre, cédula, correo..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm outline-none" />
            </div>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {filtered.map(c => (
                <div key={c.id_cliente} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{c.nombre} {c.apellido}</p>
                    <p className="text-xs text-gray-500">{c.cedula} · {c.ciudad}</p>
                  </div>
                  <button onClick={() => deleteCliente(c.id_cliente)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const MODULES: Record<Module, React.ReactNode> = {
    dashboard: <ModuleDashboard />,
    reservas: <ModuleReservas />,
    "crear-reserva": <ModuleCrearReserva />,
    hoteles: <ModuleHoteles />,
    paquetes: <ModulePaquetes />,
    clientes: <ModuleClientes />,
    usuarios: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Usuarios</h2>
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center text-gray-500">
          <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Módulo de usuarios en construcción</p>
          <p className="text-sm mt-1">Usa el endpoint <code className="bg-gray-100 px-1 rounded">/auth/register</code> para crear usuarios</p>
        </div>
      </div>
    ),
  };

  // ─── Layout ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="h-16 bg-gradient-to-r from-[#1e3a8a] via-[#0e7490] to-[#b45309] flex items-center px-6 gap-4 sticky top-0 z-40 shadow-lg">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-white/80 hover:text-white transition-colors lg:hidden">
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-lg hidden sm:block">AlecTours</span>
          <span className="text-white/60 text-sm hidden sm:block">/ Admin</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-white text-sm font-medium">{usuario?.username}</p>
            <p className="text-white/60 text-xs">Administrador</p>
          </div>
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <button onClick={handleLogout} title="Cerrar sesión"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen) && (
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-64 bg-white border-r border-gray-100 shadow-sm flex-shrink-0 flex flex-col"
            >
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
                  <button key={id} onClick={() => setActiveModule(id as Module)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      activeModule === id
                        ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}>
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {label}
                    {activeModule === id && <ChevronRight className="w-4 h-4 ml-auto" />}
                  </button>
                ))}
              </nav>
              <div className="p-4 border-t border-gray-100">
                <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-all">
                  <Plane className="w-4 h-4" />
                  Ir al sitio
                </Link>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div key={activeModule}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}>
              {MODULES[activeModule]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
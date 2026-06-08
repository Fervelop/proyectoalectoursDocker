import { useEffect, useState } from "react";
import {
  CalendarDays, Clock, CheckCircle, Hotel,
  PlusCircle, Package, Users, TrendingUp,
  DollarSign, ArrowUpRight, AlertCircle, XCircle
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  AreaChart, Area
} from "recharts";
import { Reserva, HotelData, Paquete, Cliente } from "./types";
import { apiFetch } from "../../api/v1/api";

interface Pago {
  id_pago: number;
  id_reserva: number;
  monto: number;
  estado: string;
  fecha_pago: string;
  metodo_pago: { id_metodo: number; nombre_metodo: string };
}

interface Props {
  reservas: Reserva[];
  hoteles: HotelData[];
  paquetes: Paquete[];
  clientes: Cliente[];
  setActiveModule: (m: any) => void;
}

const COLORS = ["#6366F1", "#06B6D4", "#F59E0B", "#10B981", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs shadow-xl">
        <p className="font-semibold mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 10000 ? `$${p.value.toLocaleString("es-CO")}` : p.value}</p>
        ))}
      </div>
    );
  }
  return null;
};

export default function ModuleDashboard({ reservas, hoteles, paquetes, clientes, setActiveModule }: Props) {
  const [pagos, setPagos] = useState<Pago[]>([]);

  useEffect(() => {
    apiFetch<Pago[]>("/pagos?limit=100").then(setPagos).catch(() => {});
  }, []);

  // --- KPIs ---
  const totalIngresos = pagos.reduce((a, p) => a + p.monto, 0);
  const pagosPendientes = pagos.filter(p => p.estado === "pendiente").length;
  const confirmadas = reservas.filter(r => r.estado === "confirmada").length;
  const pendientes = reservas.filter(r => r.estado === "pendiente").length;
  const canceladas = reservas.filter(r => r.estado === "cancelada").length;
  const finalizadas = reservas.filter(r => r.estado === "finalizada").length;

  // --- Reservas por estado para pie ---
  const estadoData = [
    { name: "Pendiente", value: pendientes, color: "#F59E0B" },
    { name: "Confirmada", value: confirmadas, color: "#10B981" },
    { name: "Cancelada", value: canceladas, color: "#EF4444" },
    { name: "Finalizada", value: finalizadas, color: "#6366F1" },
  ].filter(d => d.value > 0);

  // --- Paquetes más reservados ---
  const paqueteCount: Record<number, number> = {};
  reservas.forEach(r => {
    if (r.id_paquete) paqueteCount[r.id_paquete] = (paqueteCount[r.id_paquete] || 0) + 1;
  });
  const paquetesData = Object.entries(paqueteCount)
    .map(([id, count]) => ({
      name: paquetes.find(p => p.id_paquete === parseInt(id))?.nombre_paquete?.split(" ").slice(0, 3).join(" ") || `Paquete #${id}`,
      reservas: count,
      ingresos: pagos.filter(p => reservas.find(r => r.id_reserva === p.id_reserva && r.id_paquete === parseInt(id)))
        .reduce((a, p) => a + p.monto, 0),
    }))
    .sort((a, b) => b.reservas - a.reservas);

  // --- Pagos por método ---
  const metodoData: Record<string, number> = {};
  pagos.forEach(p => {
    const nombre = p.metodo_pago?.nombre_metodo || "Otro";
    metodoData[nombre] = (metodoData[nombre] || 0) + p.monto;
  });
  const metodosChart = Object.entries(metodoData)
    .map(([name, monto]) => ({ name, monto }))
    .sort((a, b) => b.monto - a.monto);

  // --- Actividad reciente (últimos 7 días simulado con fecha_reserva) ---
  const actividadDias: Record<string, number> = {};
  reservas.forEach(r => {
    if (r.fecha_inicio) {
      const dia = new Date(r.fecha_inicio).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
      actividadDias[dia] = (actividadDias[dia] || 0) + 1;
    }
  });
  const actividadData = Object.entries(actividadDias).map(([dia, total]) => ({ dia, total }));

  // --- Personas totales viajando ---
  const totalPersonas = reservas.reduce((a, r) => a + r.numero_personas, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-400 text-sm mt-0.5">Análisis en tiempo real · AlecTours</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-medium text-green-700">Sistema activo</span>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Reservas", value: reservas.length, icon: CalendarDays,
            bg: "from-indigo-500 to-purple-600", light: "bg-indigo-50", text: "text-indigo-600",
            sub: `${totalPersonas} personas viajando`
          },
          {
            label: "Pendientes", value: pendientes, icon: Clock,
            bg: "from-amber-400 to-orange-500", light: "bg-amber-50", text: "text-amber-600",
            sub: `${pagosPendientes} pagos por confirmar`
          },
          {
            label: "Ingresos totales", value: `$${(totalIngresos / 1000000).toFixed(1)}M`, icon: DollarSign,
            bg: "from-emerald-400 to-teal-600", light: "bg-emerald-50", text: "text-emerald-600",
            sub: `${pagos.length} transacciones`
          },
          {
            label: "Tasa ocupación", value: `${reservas.length ? Math.round(((confirmadas + finalizadas) / reservas.length) * 100) : 0}%`,
            icon: TrendingUp, bg: "from-cyan-400 to-blue-600", light: "bg-cyan-50", text: "text-cyan-600",
            sub: "Confirmadas + finalizadas"
          },
        ].map(({ label, value, icon: Icon, bg, light, text, sub }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-sm`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300" />
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-0.5">{value}</p>
            <p className="text-sm font-medium text-gray-600">{label}</p>
            <p className={`text-xs mt-1 font-medium ${text}`}>{sub}</p>
          </div>
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Hoteles activos", value: hoteles.length, icon: Hotel, color: "from-pink-500 to-rose-600" },
          { label: "Paquetes activos", value: paquetes.filter(p => p.activo).length, icon: Package, color: "from-violet-500 to-purple-600" },
          { label: "Clientes", value: clientes.length, icon: Users, color: "from-blue-500 to-indigo-600" },
          { label: "Confirmadas", value: confirmadas, icon: CheckCircle, color: "from-green-500 to-emerald-600" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center flex-shrink-0 shadow-sm`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie estado */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Estado de reservas</h3>
              <p className="text-xs text-gray-400">Distribución actual</p>
            </div>
            <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-full font-medium">
              {reservas.length} total
            </span>
          </div>
          {estadoData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={estadoData} cx="50%" cy="45%" outerRadius={75} innerRadius={40} dataKey="value" paddingAngle={3}>
                  {estadoData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-300 flex-col gap-2">
              <AlertCircle className="w-8 h-8" />
              <p className="text-sm">Sin datos</p>
            </div>
          )}
        </div>

        {/* Area actividad */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Actividad de reservas</h3>
              <p className="text-xs text-gray-400">Por fecha de check-in</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={actividadData}>
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="total" name="Reservas" stroke="#6366F1"
                strokeWidth={2.5} fill="url(#colorTotal)" dot={{ fill: "#6366F1", r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar paquetes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Paquetes más reservados</h3>
              <p className="text-xs text-gray-400">Por número de reservas</p>
            </div>
          </div>
          {paquetesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={paquetesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="reservas" name="Reservas" radius={[0, 6, 6, 0]}>
                  {paquetesData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-300 flex-col gap-2">
              <Package className="w-8 h-8" />
              <p className="text-sm">Sin datos</p>
            </div>
          )}
        </div>

        {/* Bar métodos pago */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-gray-900">Ingresos por método de pago</h3>
              <p className="text-xs text-gray-400">Monto total en COP</p>
            </div>
          </div>
          {metodosChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={metodosChart}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="monto" name="Monto" radius={[6, 6, 0, 0]}>
                  {metodosChart.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-gray-300 flex-col gap-2">
              <DollarSign className="w-8 h-8" />
              <p className="text-sm">Sin pagos registrados</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Últimas reservas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Últimas reservas</h3>
            <button onClick={() => setActiveModule("reservas")}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1">
              Ver todas <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-2">
            {reservas.slice(-5).reverse().map(r => {
              const pago = pagos.find(p => p.id_reserva === r.id_reserva);
              return (
                <div key={r.id_reserva} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${
                      r.estado === "confirmada" ? "bg-emerald-500" :
                      r.estado === "pendiente" ? "bg-amber-500" :
                      r.estado === "cancelada" ? "bg-red-500" : "bg-indigo-500"
                    }`}>
                      #{r.id_reserva}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Cliente #{r.id_cliente} · Paquete #{r.id_paquete}</p>
                      <p className="text-xs text-gray-400">{r.fecha_inicio} → {r.fecha_fin} · {r.numero_personas} personas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {pago && <p className="text-sm font-semibold text-gray-900">${pago.monto.toLocaleString("es-CO")}</p>}
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      r.estado === "confirmada" ? "bg-emerald-100 text-emerald-700" :
                      r.estado === "pendiente" ? "bg-amber-100 text-amber-700" :
                      r.estado === "cancelada" ? "bg-red-100 text-red-700" :
                      "bg-indigo-100 text-indigo-700"
                    }`}>
                      {r.estado}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Accesos rápidos */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-4">Acciones rápidas</h3>
            <div className="space-y-2">
              {[
                { label: "Nueva Reserva", mod: "crear-reserva", icon: PlusCircle, color: "from-indigo-500 to-purple-600" },
                { label: "Gestionar Hoteles", mod: "hoteles", icon: Hotel, color: "from-pink-500 to-rose-600" },
                { label: "Ver Paquetes", mod: "paquetes", icon: Package, color: "from-amber-400 to-orange-500" },
                { label: "Ver Clientes", mod: "clientes", icon: Users, color: "from-emerald-400 to-teal-600" },
              ].map(({ label, mod, icon: Icon, color }) => (
                <button key={mod} onClick={() => setActiveModule(mod)}
                  className={`w-full flex items-center gap-3 p-3 bg-gradient-to-r ${color} text-white rounded-xl text-sm font-medium hover:shadow-lg hover:scale-[1.02] transition-all`}>
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  {label}
                  <ArrowUpRight className="w-3 h-3 ml-auto opacity-70" />
                </button>
              ))}
            </div>
          </div>

          {/* Alertas */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Alertas</h3>
            <div className="space-y-2">
              {pagosPendientes > 0 && (
                <div className="flex items-center gap-2 p-2.5 bg-amber-50 rounded-lg">
                  <Clock className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <p className="text-xs text-amber-700 font-medium">{pagosPendientes} pago{pagosPendientes > 1 ? "s" : ""} pendiente{pagosPendientes > 1 ? "s" : ""}</p>
                </div>
              )}
              {canceladas > 0 && (
                <div className="flex items-center gap-2 p-2.5 bg-red-50 rounded-lg">
                  <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <p className="text-xs text-red-700 font-medium">{canceladas} reserva{canceladas > 1 ? "s" : ""} cancelada{canceladas > 1 ? "s" : ""}</p>
                </div>
              )}
              {pagosPendientes === 0 && canceladas === 0 && (
                <div className="flex items-center gap-2 p-2.5 bg-green-50 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <p className="text-xs text-green-700 font-medium">Todo en orden</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
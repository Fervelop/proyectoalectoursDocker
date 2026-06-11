import { useState } from "react";
import {
  PlusCircle, Search, Trash2, X, User, Package,
  CreditCard, Calendar, Users, Phone, Mail, MapPin,
  Globe, UserCheck, PhoneCall, ChevronRight, AlertCircle,
  CheckCircle, Clock, XCircle, FileText
} from "lucide-react";
import { Reserva, Cliente, Paquete, ESTADO_COLOR, inputCls, labelCls } from "./types";
import { reservaDetailService } from "../../services/reserva.service";

// ─── Extended types ────────────────────────────────────────────────────────────

export interface Empleado {
  id_empleado: number;
  nombre: string;
  apellido: string;
  correo_electronico: string;
  celular?: string;
}

export interface Pago {
  id_pago: number;
  id_reserva: number;
  monto: number;
  estado: "pendiente" | "pagado" | "rechazado";
  referencia?: string;
  metodo_pago?: { id_metodo: number; nombre_metodo: string };
}

export type CanalOrigen = "web" | "empleado" | "telefono";

export interface ReservaExtended extends Reserva {
  id_empleado?: number;
  canal_origen?: CanalOrigen;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function EstadoBadge({ estado }: { estado: string }) {
  const icons: Record<string, React.ReactNode> = {
    pendiente: <Clock className="w-3 h-3" />,
    confirmada: <CheckCircle className="w-3 h-3" />,
    cancelada: <XCircle className="w-3 h-3" />,
    finalizada: <FileText className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${ESTADO_COLOR[estado] ?? "bg-gray-100 text-gray-600"}`}>
      {icons[estado]}
      {estado}
    </span>
  );
}

function CanalBadge({ canal }: { canal?: CanalOrigen }) {
  const map: Record<CanalOrigen, { label: string; Icon: React.FC<{ className?: string }> }> = {
    web: { label: "Web", Icon: Globe },
    empleado: { label: "Presencial", Icon: UserCheck },
    telefono: { label: "Teléfono", Icon: PhoneCall },
  };
  const entry = canal ? map[canal] : map.web;
  const { label, Icon } = entry;
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function Avatar({ name, apellido, color = "blue" }: { name: string; apellido?: string; color?: "blue" | "green" }) {
  const initials = `${name[0] ?? ""}${apellido?.[0] ?? ""}`.toUpperCase();
  const cls = color === "blue"
    ? "bg-blue-100 text-blue-700"
    : "bg-emerald-100 text-emerald-700";
  return (
    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${cls}`}>
      {initials}
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
      <span className="text-xs text-gray-500 min-w-[100px]">{label}</span>
      <span className="text-xs font-medium text-gray-800 text-right ml-auto">{value ?? "—"}</span>
    </div>
  );
}

function MetricCard({ label, value, color = "default" }: {
  label: string; value: number; color?: "default" | "green" | "amber" | "red" | "blue";
}) {
  const colorCls: Record<string, string> = {
    default: "text-gray-900",
    green: "text-emerald-700",
    amber: "text-amber-700",
    red: "text-red-600",
    blue: "text-blue-700",
  };
  return (
    <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
      <p className="text-[11px] text-gray-400 mb-1">{label}</p>
      <p className={`text-xl font-semibold ${colorCls[color]}`}>{value}</p>
    </div>
  );
}

// ─── Side Panel ───────────────────────────────────────────────────────────────

interface SidePanelProps {
  reserva: ReservaExtended | null;
  cliente?: Cliente;
  empleado?: Empleado;
  paquete?: Paquete;
  pago?: Pago;
  onClose: () => void;
  onDelete: (id: number) => void;
}

function SidePanel({ reserva, cliente, empleado, paquete, pago, onClose, onDelete }: SidePanelProps) {
  if (!reserva) return null;

  const totalEstimado = paquete
    ? paquete.precio_base * reserva.numero_personas
    : 0;
  const montoPagado = pago?.monto ?? 0;
  const pct = totalEstimado > 0 ? Math.min(100, Math.round((montoPagado / totalEstimado) * 100)) : 0;

  const pagoColor: Record<string, string> = {
    pagado: "text-emerald-700",
    pendiente: "text-amber-700",
    rechazado: "text-red-600",
  };

  // ─── Estado para detalles extra ───────────────────────────────────────────
  const [habitaciones, setHabitaciones] = useState<any[]>([]);
  const [servicios, setServicios] = useState<any[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailError, setDetailError] = useState("");

  async function loadDetail() {
    setLoadingDetail(true);
    setDetailError("");
    try {
      const [h, s, hist] = await Promise.all([
        reservaDetailService.getHabitaciones(reserva.id_reserva),
        reservaDetailService.getServicios(reserva.id_reserva),
        reservaDetailService.getHistorial(reserva.id_reserva),
      ]);
      setHabitaciones(h);
      setServicios(s);
      setHistorial(hist);
      setShowDetail(true);
    } catch (e: any) {
      setDetailError("No se pudieron cargar los detalles");
    } finally {
      setLoadingDetail(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-[380px] bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <span className="text-base font-semibold text-gray-900">Reserva #{reserva.id_reserva}</span>
            <EstadoBadge estado={reserva.estado} />
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Canal */}
        <div className="px-5 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
          <span className="text-[11px] text-gray-400 uppercase tracking-wide font-medium">Canal de origen</span>
          <CanalBadge canal={reserva.canal_origen} />
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">

          {/* Cliente */}
          <section>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Cliente
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              {cliente ? (
                <>
                  <div className="flex items-center gap-2.5 mb-3">
                    <Avatar name={cliente.nombre} apellido={cliente.apellido} color="blue" />
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{cliente.nombre} {cliente.apellido}</p>
                      <p className="text-[11px] text-gray-400">CC {cliente.cedula}</p>
                    </div>
                  </div>
                  <DetailRow icon={Mail} label="Correo" value={cliente.correo} />
                  <DetailRow icon={Phone} label="Celular" value={cliente.celular} />
                  <DetailRow icon={MapPin} label="Ciudad" value={`${cliente.ciudad}, ${cliente.pais}`} />
                </>
              ) : (
                <p className="text-xs text-gray-400">Cliente #{reserva.id_cliente}</p>
              )}
            </div>
          </section>

          {/* Paquete */}
          <section>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Paquete
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              {paquete ? (
                <>
                  <p className="text-sm font-semibold text-gray-900 mb-3">{paquete.nombre_paquete}</p>
                  <DetailRow icon={Calendar} label="Check-in" value={reserva.fecha_inicio} />
                  <DetailRow icon={Calendar} label="Check-out" value={reserva.fecha_fin} />
                  <DetailRow icon={Clock} label="Duración" value={`${paquete.duracion_dias} días`} />
                  <DetailRow icon={Users} label="Viajeros" value={`${reserva.numero_personas} personas`} />
                </>
              ) : (
                <>
                  <DetailRow icon={Calendar} label="Check-in" value={reserva.fecha_inicio} />
                  <DetailRow icon={Calendar} label="Check-out" value={reserva.fecha_fin} />
                  <DetailRow icon={Users} label="Viajeros" value={`${reserva.numero_personas} personas`} />
                </>
              )}
            </div>
          </section>

          {/* Financiero */}
          <section>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Pago
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              {totalEstimado > 0 && (
                <div className="mb-3">
                  <div className="flex justify-between items-baseline mb-1.5">
                    <span className="text-xs text-gray-500">Total estimado</span>
                    <span className="text-base font-semibold text-gray-900">
                      ${totalEstimado.toLocaleString("es-CO")}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1">{pct}% pagado</p>
                </div>
              )}
              {pago ? (
                <>
                  <DetailRow icon={CreditCard} label="Método" value={pago.metodo_pago?.nombre_metodo} />
                  <DetailRow icon={FileText} label="Referencia" value={pago.referencia} />
                  <DetailRow
                    icon={CheckCircle}
                    label="Estado pago"
                    value={
                      <span className={`font-semibold ${pagoColor[pago.estado] ?? "text-gray-700"}`}>
                        {pago.estado}
                      </span>
                    }
                  />
                  <DetailRow
                    icon={CreditCard}
                    label="Monto pagado"
                    value={`$${pago.monto.toLocaleString("es-CO")}`}
                  />
                </>
              ) : (
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  Sin información de pago registrada
                </p>
              )}
            </div>
          </section>

          {/* Asesor */}
          <section>
            <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" /> Asesor responsable
            </h3>
            <div className="bg-white rounded-xl border border-gray-100 p-3">
              {empleado ? (
                <div className="flex items-center gap-2.5">
                  <Avatar name={empleado.nombre} apellido={empleado.apellido} color="green" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{empleado.nombre} {empleado.apellido}</p>
                    <p className="text-[11px] text-gray-400 truncate">{empleado.correo_electronico}</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-gray-400 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-blue-400" />
                  Reserva realizada directamente por el cliente (web)
                </p>
              )}
            </div>
          </section>

          {/* ─── Detalles extra (habitaciones, servicios, historial) ─── */}
          {detailError && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              {detailError}
            </div>
          )}

          {showDetail && (
            <>
              {habitaciones.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    🛏 Habitaciones
                  </h3>
                  <div className="space-y-2">
                    {habitaciones.map((h, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 text-xs">
                        <p className="font-semibold text-gray-800">{h.nombre_hotel} — Hab. {h.numero_habitacion}</p>
                        <p className="text-gray-500">{h.nombre_tipo} · ${h.precio_acordado?.toLocaleString("es-CO")}</p>
                        <p className="text-gray-400">{h.fecha_checkin} → {h.fecha_checkout}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {servicios.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    🎯 Servicios
                  </h3>
                  <div className="space-y-2">
                    {servicios.map((s, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 text-xs">
                        <p className="font-semibold text-gray-800">{s.nombre_servicio}</p>
                        <p className="text-gray-500">{s.nombre_categoria} · {s.duracion_horas}h</p>
                        <p className="text-gray-400">{s.fecha_servicio} · {s.numero_personas} personas</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {historial.length > 0 && (
                <section>
                  <h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide mb-2">
                    📋 Historial
                  </h3>
                  <div className="space-y-2">
                    {historial.map((h, i) => (
                      <div key={i} className="bg-white rounded-xl border border-gray-100 p-3 text-xs">
                        <p className="font-semibold text-gray-800">{h.estado_anterior} → {h.estado_nuevo}</p>
                        <p className="text-gray-500">{h.nombre_empleado}</p>
                        <p className="text-gray-400">{h.fecha_cambio}</p>
                        {h.comentarios && (
                          <p className="text-gray-600 mt-1 italic">"{h.comentarios}"</p>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {habitaciones.length === 0 && servicios.length === 0 && historial.length === 0 && (
                <p className="text-xs text-gray-400 text-center py-2">
                  No hay detalles adicionales registrados
                </p>
              )}
            </>
          )}

        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
          <button
            onClick={() => onDelete(reserva.id_reserva)}
            className="flex items-center gap-1.5 px-3 py-2 text-red-500 border border-red-200 hover:bg-red-50 rounded-lg text-xs font-medium transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> Eliminar
          </button>
          <button
            onClick={loadDetail}
            disabled={loadingDetail}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-xs font-semibold hover:shadow-md transition-all disabled:opacity-60"
          >
            <ChevronRight className="w-3.5 h-3.5" />
            {loadingDetail ? "Cargando..." : showDetail ? "Actualizar detalles" : "Ver detalle completo"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main Module ──────────────────────────────────────────────────────────────

const ESTADOS = ["todos", "pendiente", "confirmada", "cancelada", "finalizada"] as const;
type EstadoFilter = typeof ESTADOS[number];

interface Props {
  reservas: ReservaExtended[];
  clientes?: Cliente[];
  empleados?: Empleado[];
  paquetes?: Paquete[];
  pagos?: Pago[];
  onDelete: (id: number) => void;
  onNueva: () => void;
}

export default function ModuleReservas({
  reservas,
  clientes = [],
  empleados = [],
  paquetes = [],
  pagos = [],
  onDelete,
  onNueva,
}: Props) {
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<EstadoFilter>("todos");
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Lookup maps
  const clienteMap = Object.fromEntries(clientes.map(c => [c.id_cliente, c]));
  const empleadoMap = Object.fromEntries(empleados.map(e => [e.id_empleado, e]));
  const paqueteMap = Object.fromEntries(paquetes.map(p => [p.id_paquete, p]));
  const pagoMap = Object.fromEntries(pagos.map(p => [p.id_reserva, p]));

  const selectedReserva = reservas.find(r => r.id_reserva === selectedId) ?? null;

  const filtered = reservas.filter(r => {
    const cl = clienteMap[r.id_cliente];
    const pk = paqueteMap[r.id_paquete];
    const q = search.toLowerCase();
    const matchEstado = estadoFilter === "todos" || r.estado === estadoFilter;
    const matchSearch = !q
      || String(r.id_reserva).includes(q)
      || (cl && `${cl.nombre} ${cl.apellido}`.toLowerCase().includes(q))
      || (pk && pk.nombre_paquete.toLowerCase().includes(q))
      || r.estado.includes(q);
    return matchEstado && matchSearch;
  });

  // Metrics
  const counts = reservas.reduce((acc, r) => {
    acc[r.estado] = (acc[r.estado] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const CANAL_ICON: Record<CanalOrigen, React.ReactNode> = {
    web: <Globe className="w-3.5 h-3.5 text-blue-400" />,
    empleado: <UserCheck className="w-3.5 h-3.5 text-emerald-500" />,
    telefono: <PhoneCall className="w-3.5 h-3.5 text-purple-400" />,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reservas</h2>
          <p className="text-gray-500 text-sm">{reservas.length} reservas en total</p>
        </div>
        <button
          onClick={onNueva}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all"
        >
          <PlusCircle className="w-4 h-4" /> Nueva
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-4 gap-3">
        <MetricCard label="Total" value={reservas.length} />
        <MetricCard label="Confirmadas" value={counts.confirmada ?? 0} color="green" />
        <MetricCard label="Pendientes" value={counts.pendiente ?? 0} color="amber" />
        <MetricCard label="Canceladas" value={counts.cancelada ?? 0} color="red" />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por cliente, paquete o ID..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {ESTADOS.map(e => (
            <button
              key={e}
              onClick={() => setEstadoFilter(e)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all ${
                estadoFilter === e
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["ID", "Cliente", "Paquete", "Check-in", "Check-out", "Pax", "Canal", "Estado", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(r => {
              const cl = clienteMap[r.id_cliente];
              const pk = paqueteMap[r.id_paquete];
              return (
                <tr
                  key={r.id_reserva}
                  onClick={() => setSelectedId(r.id_reserva)}
                  className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                >
                  <td className="px-4 py-3 font-semibold text-gray-700">#{r.id_reserva}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-0">
                      {cl ? (
                        <>
                          <Avatar name={cl.nombre} apellido={cl.apellido} color="blue" />
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">{cl.nombre} {cl.apellido}</p>
                            <p className="text-[11px] text-gray-400 truncate">{cl.correo}</p>
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">#{r.id_cliente}</span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    {pk ? (
                      <div>
                        <p className="text-xs font-medium text-gray-700 truncate max-w-[140px]">{pk.nombre_paquete}</p>
                        <p className="text-[11px] text-gray-400">{pk.duracion_dias}d · ${pk.precio_base.toLocaleString("es-CO")}</p>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">#{r.id_paquete}</span>
                    )}
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{r.fecha_inicio}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">{r.fecha_fin}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{r.numero_personas}</td>

                  <td className="px-4 py-3">
                    <span title={r.canal_origen ?? "web"}>
                      {CANAL_ICON[r.canal_origen ?? "web"]}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <EstadoBadge estado={r.estado} />
                  </td>

                  <td className="px-4 py-3">
                    <button
                      onClick={e => { e.stopPropagation(); onDelete(r.id_reserva); }}
                      className="p-1.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-14 text-gray-400 text-sm">
            <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            No se encontraron reservas
          </div>
        )}
      </div>

      {/* Side Panel */}
      {selectedReserva && (
        <SidePanel
          reserva={selectedReserva}
          cliente={clienteMap[selectedReserva.id_cliente]}
          empleado={selectedReserva.id_empleado != null ? empleadoMap[selectedReserva.id_empleado] : undefined}
          paquete={paqueteMap[selectedReserva.id_paquete]}
          pago={pagoMap[selectedReserva.id_reserva]}
          onClose={() => setSelectedId(null)}
          onDelete={(id) => { onDelete(id); setSelectedId(null); }}
        />
      )}
    </div>
  );
}
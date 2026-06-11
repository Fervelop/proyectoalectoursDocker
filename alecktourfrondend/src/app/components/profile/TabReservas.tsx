import { Link } from "react-router";
import {
  Plane, Calendar, Wallet, ChevronRight, CheckCircle,
  XCircle, AlertCircle, Clock, Users, Moon,
  TrendingUp, CreditCard, Ban, SendHorizonal, MessageSquare,
  Sunrise, Sunset, Timer, Filter, Search,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { ClienteResponse } from "../../services/cliente.service";
import ComprobantePDF from "./ComprobantePDF";

// ── Helpers ────────────────────────────────────────────────────────────────
const estadoConfig: Record<string, { color: string; bg: string; icon: any; label: string }> = {
  confirmada:             { color: "text-green-700",  bg: "bg-green-50 border-green-200",   icon: CheckCircle, label: "Confirmada"              },
  pendiente:              { color: "text-orange-700", bg: "bg-orange-50 border-orange-200", icon: AlertCircle, label: "Pendiente"               },
  cancelada:              { color: "text-red-700",    bg: "bg-red-50 border-red-200",       icon: XCircle,     label: "Cancelada"               },
  finalizada:             { color: "text-gray-600",   bg: "bg-gray-50 border-gray-200",     icon: CheckCircle, label: "Finalizada"              },
  cancelacion_solicitada: { color: "text-purple-700", bg: "bg-purple-50 border-purple-200", icon: Clock,       label: "Cancelación solicitada"  },
};

const MOTIVOS = [
  "Cambio de planes personales",
  "Problema económico",
  "Emergencia médica o familiar",
  "Error al hacer la reserva",
  "Encontré una mejor opción",
  "Otro motivo",
];

const nights = (a: string, b: string) =>
  Math.max(1, Math.ceil((new Date(b).getTime() - new Date(a).getTime()) / 86400000));

const fmt = (d: string, opts?: Intl.DateTimeFormatOptions) =>
  new Date(d).toLocaleDateString("es-CO", opts ?? { day: "numeric", month: "short", year: "numeric" });

// ── Tokens ─────────────────────────────────────────────────────────────────
const tk = {
  white:        "#ffffff",
  surface:      "#f8fafc",
  surfaceHov:   "#f1f5f9",
  border:       "#e5e7eb",
  borderLight:  "#f1f5f9",
  text:         "#111827",
  textSub:      "#6b7280",
  textMuted:    "#9ca3af",
  textHint:     "#d1d5db",
  blue:         "#2563EB",
  blueLight:    "#eff6ff",
  blueBorder:   "#bfdbfe",
  blueText:     "#1d4ed8",
  cyan:         "#0ea5e9",
  green:        "#16a34a",
  greenLight:   "#f0fdf4",
  greenBorder:  "#bbf7d0",
  orange:       "#f97316",
  orangeLight:  "#fff7ed",
  orangeBorder: "#fed7aa",
  orangeText:   "#c2410c",
  red:          "#dc2626",
  redLight:     "#fef2f2",
  redBorder:    "#fecaca",
  purple:       "#7e22ce",
  purpleLight:  "#faf5ff",
  purpleBorder: "#e9d5ff",
};

// ── Modal cancelación ──────────────────────────────────────────────────────
interface ModalProps { reserva: any; onClose: () => void; onConfirm: (id: number, motivo: string) => void; }

function ModalCancelacion({ reserva, onClose, onConfirm }: ModalProps) {
  const [motivo, setMotivo]             = useState("");
  const [motivoCustom, setMotivoCustom] = useState("");
  const [enviando, setEnviando]         = useState(false);
  const [enviado, setEnviado]           = useState(false);
  const motivoFinal = motivo === "Otro motivo" ? motivoCustom : motivo;

  const handleEnviar = async () => {
    if (!motivoFinal.trim()) return;
    setEnviando(true);
    await new Promise(r => setTimeout(r, 1200));
    setEnviando(false);
    setEnviado(true);
    setTimeout(() => { onConfirm(reserva.id_reserva, motivoFinal); onClose(); }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-rose-500 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Solicitar cancelación</h3>
              <p className="text-red-100 text-sm">Reserva #{reserva.id_reserva}</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          {!enviado ? (
            <>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5 text-sm text-amber-800">
                <p className="font-semibold mb-1">⚠️ Ten en cuenta</p>
                <p>Tu solicitud será revisada por nuestro equipo. Te notificaremos por correo cuando sea procesada.</p>
              </div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <MessageSquare className="w-4 h-4" /> Motivo de cancelación
              </label>
              <div className="space-y-2 mb-4">
                {MOTIVOS.map(m => (
                  <label key={m} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all
                    ${motivo === m ? "border-red-400 bg-red-50" : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"}`}>
                    <input type="radio" name="motivo" value={m} checked={motivo === m}
                      onChange={() => setMotivo(m)} className="accent-red-500" />
                    <span className="text-sm text-gray-700">{m}</span>
                  </label>
                ))}
              </div>
              <AnimatePresence>
                {motivo === "Otro motivo" && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-4">
                    <textarea value={motivoCustom} onChange={e => setMotivoCustom(e.target.value)}
                      placeholder="Cuéntanos más..." rows={3}
                      className="w-full border border-gray-200 rounded-xl p-3 text-sm text-gray-700 focus:outline-none focus:border-red-400 resize-none" />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex gap-3">
                <button onClick={onClose}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-all">
                  Volver
                </button>
                <button onClick={handleEnviar} disabled={!motivoFinal.trim() || enviando}
                  className="flex-1 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {enviando
                    ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Enviando...</>
                    : <><SendHorizonal className="w-4 h-4" />Enviar solicitud</>}
                </button>
              </div>
            </>
          ) : (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">¡Solicitud enviada!</h4>
              <p className="text-gray-500 text-sm">Nuestro equipo la procesará pronto y te avisará por correo.</p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

// ── Calendario visual ──────────────────────────────────────────────────────
function CalendarioViaje({ proxima, diasRestantes }: { proxima: any; diasRestantes: number }) {
  const ini          = new Date(proxima.fecha_inicio);
  const fin          = new Date(proxima.fecha_fin);
  const year         = ini.getFullYear();
  const month        = ini.getMonth();
  const firstDay     = new Date(year, month, 1).getDay();
  const daysInMonth  = new Date(year, month + 1, 0).getDate();
  const checkIn      = ini.getDate();
  const checkOut     = fin.getDate();
  const monthName    = ini.toLocaleDateString("es-CO", { month: "long", year: "numeric" });
  const noches       = nights(proxima.fecha_inicio, proxima.fecha_fin);
  const ahora        = new Date();
  const hoyDia       = ahora.getDate();
  const hoyMes       = ahora.getMonth();
  const esEsteMes    = hoyMes === month;

  const urgencia =
    diasRestantes === 0 ? { label: "¡Tu viaje es hoy! Buen vuelo ✈️",  color: tk.green,  bg: tk.greenLight,  border: tk.greenBorder  } :
    diasRestantes <= 3  ? { label: `¡Solo faltan ${diasRestantes} días!`, color: tk.orange, bg: tk.orangeLight, border: tk.orangeBorder } :
    diasRestantes <= 14 ? { label: `Faltan ${diasRestantes} días para tu viaje`, color: tk.blue,   bg: tk.blueLight,   border: tk.blueBorder   } :
                          { label: `${diasRestantes} días para el viaje`,         color: tk.textSub, bg: tk.surface,     border: tk.border       };

  return (
    <div style={{ background: tk.white, borderRadius: 20, border: `0.5px solid ${tk.border}`, overflow: "hidden", boxShadow: "0 1px 6px rgba(0,0,0,0.06)" }}>

      {/* Header azul */}
      <div style={{ background: tk.blue, padding: "20px 22px 18px", color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 10, fontWeight: 600, opacity: 0.65, textTransform: "uppercase", letterSpacing: "0.09em", marginBottom: 4 }}>
              Próximo viaje
            </div>
            <div style={{ fontSize: 20, fontWeight: 800, lineHeight: 1 }}>Paquete #{proxima.id_paquete}</div>
            <div style={{ fontSize: 12, opacity: 0.65, marginTop: 4 }}>Reserva #{proxima.id_reserva}</div>
          </div>
          <div style={{ textAlign: "center", background: "rgba(255,255,255,0.12)", borderRadius: 14, padding: "10px 14px" }}>
            <div style={{ fontSize: 42, fontWeight: 900, lineHeight: 1 }}>{diasRestantes}</div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3 }}>días restantes</div>
          </div>
        </div>

        {/* Barra vuelo */}
        <div style={{ display: "flex", alignItems: "center", background: "rgba(255,255,255,0.1)", borderRadius: 14, padding: "12px 16px" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, opacity: 0.65, marginBottom: 4 }}>
              <Sunrise style={{ width: 12, height: 12 }} />
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Check-in</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {fmt(proxima.fecha_inicio, { weekday: "short", day: "numeric", month: "short" })}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "0 14px", gap: 4 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.35)" }} />
              <Plane style={{ width: 16, height: 16, opacity: 0.9 }} />
              <div style={{ width: 28, height: 1, background: "rgba(255,255,255,0.35)" }} />
            </div>
            <span style={{ fontSize: 10, opacity: 0.6 }}>{noches} noche{noches !== 1 ? "s" : ""}</span>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5, opacity: 0.65, marginBottom: 4 }}>
              <Sunset style={{ width: 12, height: 12 }} />
              <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Check-out</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 700 }}>
              {fmt(proxima.fecha_fin, { weekday: "short", day: "numeric", month: "short" })}
            </div>
          </div>
        </div>
      </div>

      {/* Countdown badge */}
      <div style={{ padding: "14px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, background: urgencia.bg, border: `0.5px solid ${urgencia.border}`, borderRadius: 12, padding: "10px 16px" }}>
          <Timer style={{ width: 14, height: 14, color: urgencia.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: urgencia.color }}>{urgencia.label}</span>
        </div>
      </div>

      {/* Calendario */}
      <div style={{ padding: "18px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: tk.text, textTransform: "capitalize" }}>{monthName}</span>
          <div style={{ display: "flex", gap: 10 }}>
            {[
              { dot: tk.blue,       label: "Entrada"  },
              { dot: tk.cyan,       label: "Salida"   },
              { dot: tk.blueLight,  label: "Estancia", border: tk.blueBorder },
            ].map(l => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: l.label === "Estancia" ? 12 : 8, height: l.label === "Estancia" ? 8 : 8, borderRadius: l.label === "Estancia" ? 3 : "50%", background: l.dot, border: l.border ? `0.5px solid ${l.border}` : "none", display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 10, color: tk.textMuted }}>{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Días semana */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", textAlign: "center", marginBottom: 6 }}>
          {["D","L","M","X","J","V","S"].map(d => (
            <span key={d} style={{ fontSize: 10, fontWeight: 600, color: tk.textHint }}>{d}</span>
          ))}
        </div>

        {/* Celdas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "4px 0" }}>
          {Array.from({ length: firstDay }).map((_, i) => <span key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day     = i + 1;
            const isIn    = day === checkIn;
            const isOut   = day === checkOut;
            const inRange = day > checkIn && day < checkOut;
            const isHoy   = esEsteMes && day === hoyDia && !isIn && !isOut && !inRange;

            const cellStyle: React.CSSProperties = {
              fontSize: 11,
              display: "flex", alignItems: "center", justifyContent: "center",
              width: 30, height: 30, margin: "0 auto",
              borderRadius: "50%",
              fontWeight: 400,
              color: tk.textSub,
              position: "relative",
              transition: "all 0.1s",
            };

            if (isIn)    Object.assign(cellStyle, { background: tk.blue,      color: "#fff",        fontWeight: 700 });
            if (isOut)   Object.assign(cellStyle, { background: tk.cyan,      color: "#fff",        fontWeight: 700 });
            if (inRange) Object.assign(cellStyle, { background: tk.blueLight, color: tk.blueText,   fontWeight: 500, borderRadius: "6px" });
            if (isHoy)   Object.assign(cellStyle, { boxShadow: `0 0 0 2px ${tk.blue}`,              color: tk.blue,  fontWeight: 600 });

            return (
              <span key={day} style={cellStyle}>
                {day}
                {(isIn || isOut) && (
                  <span style={{
                    position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)",
                    width: 4, height: 4, borderRadius: "50%",
                    background: "#fff", opacity: 0.7,
                  }} />
                )}
              </span>
            );
          })}
        </div>

        {/* Mini stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 16 }}>
          {[
            { icon: Moon,  label: "Noches",    value: noches,                           color: tk.blue   },
            { icon: Users, label: "Personas",  value: proxima.numero_personas ?? "–",   color: tk.cyan   },
            { icon: Timer, label: "Días faltan", value: diasRestantes,                  color: diasRestantes <= 3 ? tk.orange : tk.green },
          ].map(s => (
            <div key={s.label} style={{ background: tk.surface, border: `0.5px solid ${tk.border}`, borderRadius: 12, padding: "10px 6px", textAlign: "center" }}>
              <s.icon style={{ width: 14, height: 14, color: s.color, margin: "0 auto 4px" }} />
              <p style={{ fontSize: 18, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 10, color: tk.textMuted, margin: "3px 0 0" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────
function SectionHeader({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon: any }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: tk.blueLight, border: `0.5px solid ${tk.blueBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon style={{ width: 17, height: 17, color: tk.blue }} />
      </div>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: tk.text, margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: tk.textMuted, margin: 0 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

// ── Filtro de reservas ─────────────────────────────────────────────────────
type FiltroEstado = "todas" | "confirmada" | "pendiente" | "finalizada" | "cancelada";

const filtroOpciones: { value: FiltroEstado; label: string; icon: any; color: string; activeBg: string; activeBorder: string; activeColor: string }[] = [
  { value: "todas",      label: "Todas",       icon: Filter,       color: tk.textSub,    activeBg: tk.blue,         activeBorder: tk.blue,         activeColor: "#fff"        },
  { value: "confirmada", label: "Confirmadas", icon: CheckCircle,  color: tk.green,      activeBg: tk.greenLight,   activeBorder: tk.greenBorder,  activeColor: tk.green      },
  { value: "pendiente",  label: "Pendientes",  icon: AlertCircle,  color: tk.orangeText, activeBg: tk.orangeLight,  activeBorder: tk.orangeBorder, activeColor: tk.orangeText },
  { value: "finalizada", label: "Finalizadas", icon: Plane,        color: tk.textSub,    activeBg: tk.surface,      activeBorder: tk.border,       activeColor: tk.textSub    },
  { value: "cancelada",  label: "Canceladas",  icon: XCircle,      color: tk.red,        activeBg: tk.redLight,     activeBorder: tk.redBorder,    activeColor: tk.red        },
];

function FiltroBar({
  filtro, setFiltro, busqueda, setBusqueda, counts,
}: {
  filtro: FiltroEstado;
  setFiltro: (f: FiltroEstado) => void;
  busqueda: string;
  setBusqueda: (s: string) => void;
  counts: Record<FiltroEstado, number>;
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      {/* Buscador */}
      <div style={{ position: "relative", marginBottom: 10 }}>
        <Search style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15, color: tk.textMuted, pointerEvents: "none" }} />
        <input
          type="text"
          placeholder="Buscar por paquete, reserva o fecha..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{
            width: "100%", boxSizing: "border-box",
            padding: "10px 14px 10px 36px",
            fontSize: 13, color: tk.text,
            background: tk.white, border: `0.5px solid ${tk.border}`,
            borderRadius: 12, outline: "none",
          }}
          onFocus={e  => (e.target.style.borderColor = tk.blue)}
          onBlur={e   => (e.target.style.borderColor = tk.border)}
        />
      </div>

      {/* Pills de estado */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {filtroOpciones.map(op => {
          const active = filtro === op.value;
          const count  = counts[op.value];
          return (
            <button key={op.value} onClick={() => setFiltro(op.value)}
              style={{
                display: "flex", alignItems: "center", gap: 5,
                padding: "6px 12px", borderRadius: 20, border: `0.5px solid`,
                fontSize: 12, fontWeight: 500, cursor: "pointer",
                transition: "all 0.15s",
                background:   active ? op.activeBg     : tk.white,
                borderColor:  active ? op.activeBorder : tk.border,
                color:        active ? op.activeColor  : tk.textSub,
              }}>
              <op.icon style={{ width: 12, height: 12 }} />
              {op.label}
              <span style={{
                fontSize: 10, fontWeight: 700,
                background: active ? "rgba(0,0,0,0.1)" : tk.surface,
                borderRadius: 20, padding: "1px 6px",
                color: active ? "inherit" : tk.textMuted,
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Componente principal ───────────────────────────────────────────────────
interface Props {
  reservas: any[];
  loading: boolean;
  reservaExpandida: number | null;
  setReservaExpandida: (id: number | null) => void;
  clienteData: ClienteResponse | null;
}

export default function TabReservas({ reservas, loading, reservaExpandida, setReservaExpandida, clienteData }: Props) {
  const [modalReserva, setModalReserva]     = useState<any | null>(null);
  const [solicitadas, setSolicitadas]       = useState<Record<number, string>>({});
  const [filtro, setFiltro]                 = useState<FiltroEstado>("todas");
  const [busqueda, setBusqueda]             = useState("");

  const handleCancelacionConfirmada = (id: number, motivo: string) =>
    setSolicitadas(prev => ({ ...prev, [id]: motivo }));

  // ── Fix fecha: comparar sin horas ──────────────────────────────────────
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const proxima = useMemo(() =>
    reservas
      .filter(r => r.estado !== "cancelada" && new Date(r.fecha_inicio) >= hoy)
      .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())[0]
  , [reservas]);

  const diasRestantes = proxima
    ? Math.ceil((new Date(proxima.fecha_inicio).getTime() - hoy.getTime()) / 86400000)
    : null;

  // ── Stats ──────────────────────────────────────────────────────────────
  const counts: Record<FiltroEstado, number> = useMemo(() => ({
    todas:      reservas.length,
    confirmada: reservas.filter(r => r.estado === "confirmada").length,
    pendiente:  reservas.filter(r => r.estado === "pendiente").length,
    finalizada: reservas.filter(r => r.estado === "finalizada").length,
    cancelada:  reservas.filter(r => r.estado === "cancelada").length,
  }), [reservas]);

  // ── Filtrado + búsqueda ────────────────────────────────────────────────
  const reservasFiltradas = useMemo(() => {
    let lista = filtro === "todas" ? reservas : reservas.filter(r => r.estado === filtro);
    if (busqueda.trim()) {
      const q = busqueda.toLowerCase();
      lista = lista.filter(r =>
        String(r.id_reserva).includes(q) ||
        String(r.id_paquete).includes(q) ||
        fmt(r.fecha_inicio).toLowerCase().includes(q) ||
        fmt(r.fecha_fin).toLowerCase().includes(q)
      );
    }
    return lista;
  }, [reservas, filtro, busqueda]);

  return (
    <>
      <AnimatePresence>
        {modalReserva && (
          <ModalCancelacion reserva={modalReserva} onClose={() => setModalReserva(null)}
            onConfirm={handleCancelacionConfirmada} />
        )}
      </AnimatePresence>

      {/* Título */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, color: tk.text, margin: "0 0 4px" }}>Mis Reservas</h1>
        <p style={{ fontSize: 14, color: tk.textMuted, margin: 0 }}>Gestiona todos tus viajes reservados</p>
      </div>

      {loading ? (
        <div style={{ background: tk.white, borderRadius: 20, padding: 48, textAlign: "center", border: `0.5px solid ${tk.border}` }}>
          <div className="w-10 h-10 border-4 border-blue-200 border-t-[#2563EB] rounded-full animate-spin mx-auto mb-4" />
          <p style={{ color: tk.textMuted }}>Cargando reservas...</p>
        </div>
      ) : reservas.length === 0 ? (
        <div style={{ background: tk.white, borderRadius: 20, padding: 48, textAlign: "center", border: `0.5px solid ${tk.border}` }}>
          <Plane style={{ width: 56, height: 56, color: tk.textHint, margin: "0 auto 16px" }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, color: tk.text, margin: "0 0 8px" }}>No tienes reservas aún</h3>
          <p style={{ color: tk.textMuted, margin: "0 0 20px" }}>¡Es hora de planear tu próxima aventura!</p>
          <Link to="/search" className="inline-block px-6 py-3 bg-[#2563EB] text-white rounded-xl text-sm font-semibold hover:shadow-xl transition-all">
            Explorar destinos
          </Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

          {/* ══ 1. Resumen ══ */}
          <section>
            <SectionHeader title="Resumen" subtitle="Vista general de tus reservas" icon={TrendingUp} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
              {[
                { label: "Total",       value: counts.todas,      color: tk.blue,   bg: tk.blueLight,   border: tk.blueBorder,   icon: TrendingUp  },
                { label: "Confirmadas", value: counts.confirmada, color: tk.green,  bg: tk.greenLight,  border: tk.greenBorder,  icon: CheckCircle },
                { label: "Pendientes",  value: counts.pendiente,  color: tk.orange, bg: tk.orangeLight, border: tk.orangeBorder, icon: Clock       },
                { label: "Canceladas",  value: counts.cancelada,  color: tk.red,    bg: tk.redLight,    border: tk.redBorder,    icon: Ban         },
              ].map(s => (
                <motion.div key={s.label} whileHover={{ y: -2 }}
                  style={{ background: s.bg, border: `0.5px solid ${s.border}`, borderRadius: 16, padding: "16px 12px", textAlign: "center", cursor: "default" }}>
                  <s.icon style={{ width: 18, height: 18, color: s.color, margin: "0 auto 8px" }} />
                  <p style={{ fontSize: 30, fontWeight: 800, color: s.color, margin: 0, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: s.color, opacity: 0.75, margin: "5px 0 0" }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </section>

          {/* ══ 2. Próximo viaje + calendario ══ */}
          {proxima && diasRestantes !== null && (
            <section>
              <SectionHeader title="Próximo viaje" subtitle="Tu aventura más cercana" icon={Plane} />
              <CalendarioViaje proxima={proxima} diasRestantes={diasRestantes} />
            </section>
          )}

          {/* ══ 3. Lista con filtro ══ */}
          <section>
            <SectionHeader
              title="Todas las reservas"
              subtitle={`${counts.todas} reserva${counts.todas !== 1 ? "s" : ""} en total`}
              icon={Calendar}
            />

            <FiltroBar
              filtro={filtro} setFiltro={setFiltro}
              busqueda={busqueda} setBusqueda={setBusqueda}
              counts={counts}
            />

            {reservasFiltradas.length === 0 ? (
              <div style={{ background: tk.white, border: `0.5px solid ${tk.border}`, borderRadius: 16, padding: "32px 20px", textAlign: "center" }}>
                <Search style={{ width: 36, height: 36, color: tk.textHint, margin: "0 auto 12px" }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: tk.textSub, margin: "0 0 4px" }}>Sin resultados</p>
                <p style={{ fontSize: 12, color: tk.textMuted, margin: 0 }}>Prueba cambiando el filtro o la búsqueda</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <AnimatePresence mode="popLayout">
                  {reservasFiltradas.map((reserva) => {
                    const estadoMostrar = solicitadas[reserva.id_reserva] ? "cancelacion_solicitada" : reserva.estado;
                    const config    = estadoConfig[estadoMostrar] ?? estadoConfig.pendiente;
                    const Icon      = config.icon;
                    const expanded  = reservaExpandida === reserva.id_reserva;
                    const noches    = nights(reserva.fecha_inicio, reserva.fecha_fin);
                    const yaSolicitada = !!solicitadas[reserva.id_reserva];

                    return (
                      <motion.div key={reserva.id_reserva}
                        layout
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        style={{ background: tk.white, borderRadius: 18, border: `0.5px solid ${tk.border}`, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>

                        <div style={{ padding: "18px 20px" }}>
                          {/* Header tarjeta */}
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                              <div style={{ width: 42, height: 42, background: tk.blueLight, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", border: `0.5px solid ${tk.blueBorder}`, flexShrink: 0 }}>
                                <Plane style={{ width: 19, height: 19, color: tk.blue }} />
                              </div>
                              <div>
                                <h3 style={{ fontSize: 15, fontWeight: 700, color: tk.text, margin: "0 0 2px" }}>
                                  Reserva #{reserva.id_reserva}
                                </h3>
                                <p style={{ fontSize: 11, color: tk.textMuted, margin: 0 }}>
                                  Paquete #{reserva.id_paquete} · {fmt(reserva.fecha_reserva)}
                                </p>
                              </div>
                            </div>
                            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${config.bg} ${config.color}`}>
                              <Icon className="w-3.5 h-3.5" />
                              {config.label}
                            </span>
                          </div>

                          {/* Chips */}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
                            {[
                              { icon: Calendar, text: `${fmt(reserva.fecha_inicio, { day: "numeric", month: "short" })} → ${fmt(reserva.fecha_fin, { day: "numeric", month: "short" })}` },
                              { icon: Moon,     text: `${noches} noche${noches !== 1 ? "s" : ""}` },
                              { icon: Users,    text: `${reserva.numero_personas} persona${reserva.numero_personas !== 1 ? "s" : ""}` },
                            ].map(({ icon: Ic, text }) => (
                              <div key={text} style={{ display: "flex", alignItems: "center", gap: 6, background: tk.surface, border: `0.5px solid ${tk.border}`, borderRadius: 8, padding: "5px 10px", fontSize: 12, color: tk.textSub }}>
                                <Ic style={{ width: 12, height: 12, color: tk.blue }} />{text}
                              </div>
                            ))}
                          </div>

                          {/* Toggle */}
                          <button
                            onClick={() => setReservaExpandida(expanded ? null : reserva.id_reserva)}
                            style={{ width: "100%", padding: "8px 0", fontSize: 12, color: tk.blue, fontWeight: 500, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 4, borderRadius: 10 }}
                            onMouseEnter={e => (e.currentTarget.style.background = tk.blueLight)}
                            onMouseLeave={e => (e.currentTarget.style.background = "none")}>
                            {expanded ? "Ocultar detalles" : "Ver detalles completos"}
                            <ChevronRight style={{ width: 14, height: 14, transform: expanded ? "rotate(90deg)" : "none", transition: "transform 0.15s" }} />
                          </button>
                        </div>

                        {/* Panel expandido */}
                        <AnimatePresence>
                          {expanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              style={{ overflow: "hidden", borderTop: `0.5px solid ${tk.borderLight}` }}>
                              <div style={{ background: tk.surface, padding: "20px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

                                {/* Detalles */}
                                <div>
                                  <h4 style={{ fontSize: 13, fontWeight: 600, color: tk.text, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
                                    <Calendar style={{ width: 14, height: 14, color: tk.blue }} /> Detalles del viaje
                                  </h4>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                                    {[
                                      ["Fecha de reserva", fmt(reserva.fecha_reserva)],
                                      ["Check-in",  fmt(reserva.fecha_inicio, { weekday: "long", day: "numeric", month: "long" })],
                                      ["Check-out", fmt(reserva.fecha_fin,    { weekday: "long", day: "numeric", month: "long" })],
                                      ["Duración",  `${noches} noches`],
                                      ["Viajeros",  `${reserva.numero_personas} persona(s)`],
                                      ["Estado",    config.label],
                                    ].map(([k, v]) => (
                                      <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: tk.white, borderRadius: 9, padding: "7px 11px", border: `0.5px solid ${tk.border}` }}>
                                        <span style={{ fontSize: 12, color: tk.textMuted }}>{k}</span>
                                        <span style={{ fontSize: 12, fontWeight: 600, color: tk.text }}>{v}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Acciones */}
                                <div>
                                  <h4 style={{ fontSize: 13, fontWeight: 600, color: tk.text, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 6 }}>
                                    <CreditCard style={{ width: 14, height: 14, color: tk.blue }} /> Acciones
                                  </h4>
                                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    {reserva.estado === "pendiente" && (
                                      <button style={{ width: "100%", padding: "10px 0", background: tk.orange, color: "#fff", border: "none", borderRadius: 12, fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                                        <Wallet style={{ width: 15, height: 15 }} /> Completar pago
                                      </button>
                                    )}
                                    {reserva.estado !== "cancelada" && reserva.estado !== "finalizada" && (
                                      yaSolicitada ? (
                                        <div style={{ padding: "10px 14px", background: tk.purpleLight, border: `0.5px solid ${tk.purpleBorder}`, borderRadius: 12, fontSize: 12, fontWeight: 600, color: tk.purple, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                                          <Clock style={{ width: 14, height: 14 }} /> Solicitud enviada — en revisión
                                        </div>
                                      ) : (
                                        <button onClick={() => setModalReserva(reserva)}
                                          style={{ width: "100%", padding: "10px 0", background: tk.redLight, border: `0.5px solid ${tk.redBorder}`, borderRadius: 12, fontSize: 13, fontWeight: 600, color: tk.red, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                                          <XCircle style={{ width: 15, height: 15 }} /> Solicitar cancelación
                                        </button>
                                      )
                                    )}
                                    <ComprobantePDF reservaId={reserva.id_reserva} clienteData={clienteData} />
                                  </div>
                                  {yaSolicitada && (
                                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                                      style={{ marginTop: 10, background: tk.purpleLight, border: `0.5px solid ${tk.purpleBorder}`, borderRadius: 12, padding: "12px 14px" }}>
                                      <p style={{ fontSize: 12, fontWeight: 600, color: tk.purple, margin: "0 0 3px", display: "flex", alignItems: "center", gap: 6 }}>
                                        <SendHorizonal style={{ width: 13, height: 13 }} /> Solicitud de cancelación enviada
                                      </p>
                                      <p style={{ fontSize: 11, color: tk.purple, margin: 0, opacity: 0.8 }}>
                                        Motivo: <strong>{solicitadas[reserva.id_reserva]}</strong>
                                      </p>
                                    </motion.div>
                                  )}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </section>
        </div>
      )}
    </>
  );
}
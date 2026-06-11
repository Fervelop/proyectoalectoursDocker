import { Link } from "react-router";
import {
  User, Mail, Phone, MapPin, Star, LogOut, Calendar,
  Heart, Settings, ChevronRight, CheckCircle, AlertCircle,
  XCircle, Clock, Plane, TrendingUp
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const tabs = [
  { id: "reservas",     label: "Mis Reservas",  icon: Calendar },
  { id: "preferencias", label: "Preferencias",  icon: Heart    },
  { id: "cuenta",       label: "Mi Cuenta",     icon: Settings },
];

// ── Mini calendario de reservas ────────────────────────────────────────────
function MiniCalendario({ reservas }: { reservas: any[] }) {
  const hoy     = new Date();
  const [año, setAño]   = useState(hoy.getFullYear());
  const [mes, setMes]   = useState(hoy.getMonth());

  const primerDia   = new Date(año, mes, 1).getDay();
  const diasEnMes   = new Date(año, mes + 1, 0).getDate();
  const nombreMes   = new Date(año, mes).toLocaleDateString("es-CO", { month: "long" });

  const prev = () => { if (mes === 0) { setMes(11); setAño(a => a - 1); } else setMes(m => m - 1); };
  const next = () => { if (mes === 11) { setMes(0); setAño(a => a + 1); } else setMes(m => m + 1); };

  // Días que tienen reserva en este mes
  const marcados: Record<number, string> = {};
  reservas.forEach(r => {
    const ini = new Date(r.fecha_inicio);
    const fin = new Date(r.fecha_fin);
    if (ini.getFullYear() === año && ini.getMonth() === mes)
      marcados[ini.getDate()] = r.estado;
    if (fin.getFullYear() === año && fin.getMonth() === mes)
      marcados[fin.getDate()] = r.estado;
    // rango intermedio
    const cur = new Date(ini);
    cur.setDate(cur.getDate() + 1);
    while (cur < fin) {
      if (cur.getFullYear() === año && cur.getMonth() === mes)
        marcados[cur.getDate()] = marcados[cur.getDate()] ?? r.estado + "_range";
      cur.setDate(cur.getDate() + 1);
    }
  });

  const colorDia = (estado: string) => {
    if (!estado) return "";
    if (estado.includes("confirmada")) return estado.includes("_range") ? "bg-green-100 text-green-700" : "bg-green-500 text-white rounded-full";
    if (estado.includes("pendiente"))  return estado.includes("_range") ? "bg-orange-100 text-orange-700" : "bg-orange-400 text-white rounded-full";
    if (estado.includes("cancelada"))  return estado.includes("_range") ? "bg-red-100 text-red-400 line-through" : "bg-red-400 text-white rounded-full";
    return "bg-blue-100 text-blue-700";
  };

  const esHoy = (d: number) => d === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear();

  return (
    <div className="pt-4 pb-2">
      {/* Cabecera mes */}
      <div className="flex items-center justify-between mb-3 px-1">
        <button onClick={prev} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-sm font-bold transition-all">‹</button>
        <span className="text-xs font-semibold text-gray-700 capitalize">{nombreMes} {año}</span>
        <button onClick={next} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 text-sm font-bold transition-all">›</button>
      </div>

      {/* Días semana */}
      <div className="grid grid-cols-7 text-center mb-1">
        {["D","L","M","X","J","V","S"].map(d => (
          <span key={d} className="text-[10px] font-semibold text-gray-400">{d}</span>
        ))}
      </div>

      {/* Días */}
      <div className="grid grid-cols-7 text-center gap-y-0.5">
        {Array.from({ length: primerDia }).map((_, i) => <span key={`e-${i}`} />)}
        {Array.from({ length: diasEnMes }).map((_, i) => {
          const day = i + 1;
          const estado = marcados[day];
          return (
            <span key={day}
              className={`text-[11px] mx-auto w-6 h-6 flex items-center justify-center font-medium transition-all
                ${esHoy(day) && !estado ? "ring-2 ring-[#2563EB] rounded-full text-[#2563EB]" : ""}
                ${estado ? colorDia(estado) : "text-gray-500 hover:bg-gray-100 rounded-full"}
              `}>
              {day}
            </span>
          );
        })}
      </div>

      {/* Leyenda */}
      <div className="flex items-center justify-center gap-3 mt-3 pt-2 border-t border-gray-100">
        {[
          { color: "bg-green-500",  label: "Confirmada" },
          { color: "bg-orange-400", label: "Pendiente"  },
          { color: "bg-red-400",    label: "Cancelada"  },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${l.color} inline-block`} />
            <span className="text-[10px] text-gray-400">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Segmentos de reservas ──────────────────────────────────────────────────
const segmentos = [
  { estado: "confirmada", label: "Confirmadas", icon: CheckCircle, color: "text-green-600",  bg: "bg-green-50  border-green-200"  },
  { estado: "pendiente",  label: "Pendientes",  icon: AlertCircle, color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  { estado: "finalizada", label: "Finalizadas", icon: Plane,       color: "text-blue-600",   bg: "bg-blue-50   border-blue-200"   },
  { estado: "cancelada",  label: "Canceladas",  icon: XCircle,     color: "text-red-500",    bg: "bg-red-50    border-red-200"    },
];

interface Props {
  usuario: any;
  clienteData: any;
  reservas: any[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function ProfileSidebar({ usuario, clienteData, reservas, activeTab, setActiveTab, onLogout }: Props) {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const totalViajes = reservas.filter(r => r.estado === "finalizada").length;
  const proximaReserva = reservas
    .filter(r => r.estado !== "cancelada" && new Date(r.fecha_inicio) >= new Date())
    .sort((a, b) => new Date(a.fecha_inicio).getTime() - new Date(b.fecha_inicio).getTime())[0];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden sticky top-24">

      {/* ── Banner superior ── */}
      <div className="h-16 bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#2563EB]" />

      <div className="px-5 pb-5">
        {/* Avatar */}
        <div className="-mt-10 mb-3 flex justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center ring-4 ring-white shadow-lg">
            <User className="w-10 h-10 text-white" />
          </div>
        </div>

        {/* Nombre */}
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {clienteData ? `${clienteData.nombre} ${clienteData.apellido}` : usuario?.username}
          </h2>
          <p className="text-xs text-gray-400">@{usuario?.username}</p>
          <div className="flex items-center justify-center gap-0.5 mt-1.5">
            {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
            <span className="text-xs text-gray-400 ml-1">Viajero VIP</span>
          </div>
        </div>

        {/* Stats rápidos */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { value: reservas.length, label: "Reservas",  color: "text-[#2563EB]" },
            { value: totalViajes,     label: "Viajes",    color: "text-[#06B6D4]" },
            { value: reservas.filter(r => r.estado === "pendiente").length, label: "Pendientes", color: "text-orange-500" },
          ].map(s => (
            <div key={s.label} className="bg-gray-50 rounded-xl py-2 text-center">
              <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Info contacto */}
        {clienteData && (
          <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
            {clienteData.correo && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Mail className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span className="truncate">{clienteData.correo}</span>
              </div>
            )}
            {clienteData.celular && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <Phone className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>{clienteData.celular}</span>
              </div>
            )}
            {clienteData.ciudad && (
              <div className="flex items-center gap-2 text-gray-500 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#2563EB] shrink-0" />
                <span>{clienteData.ciudad}, {clienteData.pais}</span>
              </div>
            )}
          </div>
        )}

        {/* Próxima reserva */}
        {proximaReserva && (
          <div className="bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-xl p-3 mb-4 text-white">
            <div className="flex items-center gap-1.5 mb-1 opacity-80">
              <Plane className="w-3 h-3" />
              <span className="text-[10px] font-semibold uppercase tracking-wider">Próximo viaje</span>
            </div>
            <p className="text-sm font-bold">Paquete #{proximaReserva.id_paquete}</p>
            <p className="text-xs text-blue-100 mt-0.5">
              {new Date(proximaReserva.fecha_inicio).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
              {" → "}
              {new Date(proximaReserva.fecha_fin).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
            </p>
          </div>
        )}

        {/* Segmentos por estado */}
       

        {/* Calendario toggle */}
       
        {/* Navegación tabs */}
        <nav className="space-y-1 mb-4">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-md"
                  : "text-gray-600 hover:bg-gray-50"
              }`}>
              <tab.icon className="w-4 h-4" />
              {tab.label}
              <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform ${activeTab === tab.id ? "rotate-90" : ""}`} />
            </button>
          ))}
        </nav>

        <button onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-4 h-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  );
}
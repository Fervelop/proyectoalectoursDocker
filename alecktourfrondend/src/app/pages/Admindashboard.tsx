import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  LayoutDashboard, CalendarDays, PlusCircle, Hotel, Package,
  Users, UserPlus, LogOut, Plane, ChevronRight, Menu, X, Moon, Sun
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../api/v1/api";
import { Reserva, HotelData, Paquete, Cliente, Empleado, Pago } from "../components/admin/types";
import ModuleDashboard from "../components/admin/ModuleDashboard";
import ModuleReservas from "../components/admin/ModuleReservas";
import ModuleCrearReserva from "../components/admin/ModuleCrearReserva";
import ModuleHoteles from "../components/admin/ModuleHoteles";
import ModulePaquetes from "../components/admin/ModulePaquetes";
import ModuleClientes from "../components/admin/ModuleClientes";

type Module = "dashboard" | "reservas" | "crear-reserva" | "hoteles" | "paquetes" | "clientes" | "usuarios";

const NAV_ITEMS = [
  { id: "dashboard",     label: "Dashboard",    icon: LayoutDashboard },
  { id: "reservas",      label: "Reservas",      icon: CalendarDays    },
  { id: "crear-reserva", label: "Crear Reserva", icon: PlusCircle      },
  { id: "hoteles",       label: "Hoteles",        icon: Hotel           },
  { id: "paquetes",      label: "Paquetes",       icon: Package         },
  { id: "clientes",      label: "Clientes",       icon: Users           },
  { id: "usuarios",      label: "Usuarios",       icon: UserPlus        },
] as const;

export default function AdminDashboard() {
  const { usuario, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState<Module>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(() => localStorage.getItem("admin-theme") === "dark");

  const [reservas,  setReservas]  = useState<Reserva[]>([]);
  const [hoteles,   setHoteles]   = useState<HotelData[]>([]);
  const [paquetes,  setPaquetes]  = useState<Paquete[]>([]);
  const [clientes,  setClientes]  = useState<Cliente[]>([]);
  const [empleados, setEmpleados] = useState<Empleado[]>([]);
  const [pagos,     setPagos]     = useState<Pago[]>([]);

  // ─── Dark mode via clase en <html> ───────────────────────────────────────
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("admin-theme", dark ? "dark" : "light");
  }, [dark]);

  useEffect(() => { if (!isAdmin) navigate("/"); }, [isAdmin]);

  useEffect(() => {
    if (activeModule === "reservas" || activeModule === "dashboard") {
      fetchReservas(); fetchEmpleados(); fetchPagos();
    }
    if (activeModule === "hoteles"       || activeModule === "dashboard")     fetchHoteles();
    if (activeModule === "paquetes"      || activeModule === "crear-reserva") fetchPaquetes();
    if (activeModule === "clientes"      || activeModule === "crear-reserva") fetchClientes();
  }, [activeModule]);

  const fetchReservas  = async () => { try { setReservas(await apiFetch<Reserva[]>("/reservas?limit=100"));     } catch {} };
  const fetchHoteles   = async () => { try { setHoteles(await apiFetch<HotelData[]>("/hoteles/?limit=100"));    } catch {} };
  const fetchPaquetes  = async () => { try { setPaquetes(await apiFetch<Paquete[]>("/paquetes?limit=100"));     } catch {} };
  const fetchClientes  = async () => { try { setClientes(await apiFetch<Cliente[]>("/clientes?limit=100"));     } catch {} };
  const fetchEmpleados = async () => { try { setEmpleados(await apiFetch<Empleado[]>("/empleados?limit=100")); } catch {} };
  const fetchPagos     = async () => { try { setPagos(await apiFetch<Pago[]>("/pagos?limit=100"));              } catch {} };

  const deleteReserva = async (id: number) => {
    if (!confirm("¿Eliminar esta reserva?")) return;
    await apiFetch(`/reservas/${id}`, { method: "DELETE" });
    fetchReservas();
  };
  const deleteHotel = async (id: number) => {
    if (!confirm("¿Eliminar este hotel?")) return;
    await apiFetch(`/hoteles/${id}`, { method: "DELETE" });
    fetchHoteles();
  };
  const deletePaquete = async (id: number) => {
    if (!confirm("¿Eliminar este paquete?")) return;
    await apiFetch(`/paquetes/${id}`, { method: "DELETE" });
    fetchPaquetes();
  };
  const deleteCliente = async (id: number) => {
    if (!confirm("¿Eliminar este cliente?")) return;
    await apiFetch(`/clientes/${id}`, { method: "DELETE" });
    fetchClientes();
  };

  const updateEstadoReserva = async (id: number, estado: string) => {
    await apiFetch(`/reservas/${id}`, { method: "PUT", body: { estado } });
    setReservas(prev => prev.map(r => r.id_reserva === id ? { ...r, estado } : r));
  };

  const submitReserva = async (data: any) => {
    setLoading(true);
    try { await apiFetch("/reservas", { method: "POST", body: data }); fetchReservas(); }
    finally { setLoading(false); }
  };
  const submitHotel = async (data: any) => {
    setLoading(true);
    try { await apiFetch("/hoteles/", { method: "POST", body: data }); fetchHoteles(); }
    finally { setLoading(false); }
  };
  const submitPaquete = async (data: any) => {
    setLoading(true);
    try { await apiFetch("/paquetes", { method: "POST", body: data }); fetchPaquetes(); }
    finally { setLoading(false); }
  };
  const submitCliente = async (data: any) => {
    setLoading(true);
    try { await apiFetch("/clientes", { method: "POST", body: data }); fetchClientes(); }
    finally { setLoading(false); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const MODULES: Record<Module, React.ReactNode> = {
    dashboard: (
      <ModuleDashboard
        reservas={reservas} hoteles={hoteles} paquetes={paquetes}
        clientes={clientes} setActiveModule={setActiveModule}
      />
    ),
    reservas: (
      <ModuleReservas
        reservas={reservas} clientes={clientes} empleados={empleados}
        paquetes={paquetes} pagos={pagos}
        onDelete={deleteReserva}
        onNueva={() => setActiveModule("crear-reserva")}
        onUpdateEstado={updateEstadoReserva}
      />
    ),
    "crear-reserva": (
      <ModuleCrearReserva clientes={clientes} paquetes={paquetes} onSubmit={submitReserva} loading={loading} />
    ),
    hoteles: (
      <ModuleHoteles hoteles={hoteles} onDelete={deleteHotel} onSubmit={submitHotel} loading={loading} />
    ),
    paquetes: (
      <ModulePaquetes paquetes={paquetes} onDelete={deletePaquete} onSubmit={submitPaquete} loading={loading} />
    ),
    clientes: (
      <ModuleClientes clientes={clientes} onDelete={deleteCliente} onSubmit={submitCliente} loading={loading} />
    ),
    usuarios: (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Usuarios</h2>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400">
          <UserPlus className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
          <p>Módulo de usuarios en construcción</p>
        </div>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f1117] flex flex-col transition-colors duration-300">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header className="h-16 bg-gradient-to-r from-[#1e3a8a] via-[#0e7490] to-[#b45309] flex items-center px-6 gap-4 sticky top-0 z-40 shadow-lg">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-white/80 hover:text-white transition-colors lg:hidden"
        >
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

        <div className="flex items-center gap-2">
          {/* ── Toggle dark mode ── */}
          <button
            onClick={() => setDark(d => !d)}
            title={dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            className="relative w-14 h-7 rounded-full transition-colors duration-300 focus:outline-none
              bg-white/20 hover:bg-white/30 flex items-center px-1"
          >
            <motion.div
              animate={{ x: dark ? 28 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-5 h-5 rounded-full bg-white shadow flex items-center justify-center"
            >
              {dark
                ? <Moon className="w-3 h-3 text-indigo-600" />
                : <Sun className="w-3 h-3 text-amber-500" />
              }
            </motion.div>
          </button>

          <div className="text-right hidden sm:block ml-1">
            <p className="text-white text-sm font-medium">{usuario?.username}</p>
            <p className="text-white/60 text-xs">Administrador</p>
          </div>
          <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-64 flex-shrink-0 flex flex-col border-r transition-colors duration-300
                bg-white border-gray-100
                dark:bg-[#13151f] dark:border-[#1e2130]"
            >
              {/* Logo area en sidebar */}
              <div className="px-5 py-4 border-b border-gray-100 dark:border-[#1e2130]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                  Panel de control
                </p>
              </div>

              <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
                {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
                  const isActive = activeModule === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveModule(id as Module)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20"
                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-white dark:hover:bg-[#1e2130]"
                      }`}
                    >
                      <Icon className={`w-4.5 h-4.5 flex-shrink-0 transition-transform group-hover:scale-110 ${isActive ? "text-white" : ""}`} />
                      <span>{label}</span>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto opacity-70" />}
                    </button>
                  );
                })}
              </nav>

              {/* Footer sidebar */}
              <div className="p-3 border-t border-gray-100 dark:border-[#1e2130] space-y-1">
                {/* Info usuario */}
                <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl
                  bg-gray-50 dark:bg-[#1e2130]">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {usuario?.username?.[0]?.toUpperCase() ?? "A"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 truncate">
                      {usuario?.username}
                    </p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500">Administrador</p>
                  </div>
                </div>

                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-2 text-xs rounded-xl transition-all
                    text-gray-500 hover:text-gray-700 hover:bg-gray-50
                    dark:text-gray-500 dark:hover:text-gray-300 dark:hover:bg-[#1e2130]"
                >
                  <Plane className="w-3.5 h-3.5" /> Ir al sitio
                </Link>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 transition-colors duration-300
          bg-gray-50 dark:bg-[#0f1117]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeModule}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
            >
              {MODULES[activeModule]}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
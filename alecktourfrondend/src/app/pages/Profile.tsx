import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "motion/react";
import { clienteService, ClienteResponse } from "../services/cliente.service";
import { reservaService, ReservaResponse } from "../services/reserva.service";
import { preferenciasService, PreferenciaResponse } from "../services/preferencias.service";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import TabReservas from "../components/profile/TabReservas";
import TabPreferencias from "../components/profile/TabPreferencias";
import TabCuenta from "../components/profile/TabCuenta";

export default function Profile() {
  const { usuario, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("reservas");
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [preferencias, setPreferencias] = useState<PreferenciaResponse | null>(null);
  const [clienteData, setClienteData] = useState<ClienteResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [reservaExpandida, setReservaExpandida] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated) { navigate("/login"); return; }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || !usuario?.id_cliente) { setLoading(false); return; }
    Promise.all([
      reservaService.getByCliente(usuario.id_cliente),
      clienteService.getById(usuario.id_cliente),
      preferenciasService.getByCliente(usuario.id_cliente).catch(() => null),
    ]).then(([res, cliente, prefs]) => {
      setReservas(res);
      setClienteData(cliente);
      setPreferencias(prefs);
    }).catch(console.error)
      .finally(() => setLoading(false));
  }, [usuario]);

  const handleLogout = () => { logout(); navigate("/"); };
  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="bg-gradient-to-r from-[#2563EB] via-[#06B6D4] to-[#F59E0B] h-40 relative">
        <div className="absolute inset-0 bg-black/10" />
      </div>
      <div className="max-w-7xl mx-auto px-4 -mt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <aside className="lg:col-span-1">
            <ProfileSidebar
              usuario={usuario}
              clienteData={clienteData}
              reservas={reservas}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onLogout={handleLogout}
            />
          </aside>
          <main className="lg:col-span-3 mt-8">
            <AnimatePresence mode="wait">
              {activeTab === "reservas" && (
                <motion.div key="reservas" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <TabReservas reservas={reservas} loading={loading} reservaExpandida={reservaExpandida} setReservaExpandida={setReservaExpandida}   clienteData={clienteData}  />
                </motion.div>
              )}
              {activeTab === "preferencias" && (
                <motion.div key="preferencias" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <TabPreferencias preferencias={preferencias} />
                </motion.div>
              )}
              {activeTab === "cuenta" && (
                <motion.div key="cuenta" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <TabCuenta clienteData={clienteData} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
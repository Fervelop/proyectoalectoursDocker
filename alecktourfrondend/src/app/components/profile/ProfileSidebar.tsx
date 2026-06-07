import { Link } from "react-router";
import { User, Mail, Phone, MapPin, Star, LogOut, Calendar, Heart, Settings, ChevronRight } from "lucide-react";

const tabs = [
  { id: "reservas", label: "Mis Reservas", icon: Calendar },
  { id: "preferencias", label: "Preferencias", icon: Heart },
  { id: "cuenta", label: "Mi Cuenta", icon: Settings },
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
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B35] to-[#F7931E] rounded-full flex items-center justify-center mx-auto mb-3 ring-4 ring-white shadow-lg">
          <User className="w-12 h-12 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">
          {clienteData ? `${clienteData.nombre} ${clienteData.apellido}` : usuario?.username}
        </h2>
        <p className="text-sm text-gray-500">@{usuario?.username}</p>
        <div className="flex items-center justify-center gap-1 mt-2">
          {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
          <span className="text-xs text-gray-500 ml-1">Viajero VIP</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-6 p-4 bg-gray-50 rounded-xl">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#2563EB]">{reservas.length}</p>
          <p className="text-xs text-gray-500">Reservas</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-[#06B6D4]">
            {reservas.filter(r => r.estado === 'finalizada').length}
          </p>
          <p className="text-xs text-gray-500">Viajes</p>
        </div>
      </div>

      {clienteData && (
        <div className="space-y-3 mb-6 pb-6 border-b">
          {clienteData.correo && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Mail className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span className="truncate">{clienteData.correo}</span>
            </div>
          )}
          {clienteData.celular && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <Phone className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>{clienteData.celular}</span>
            </div>
          )}
          {clienteData.ciudad && (
            <div className="flex items-center gap-2 text-gray-600 text-sm">
              <MapPin className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>{clienteData.ciudad}, {clienteData.pais}</span>
            </div>
          )}
        </div>
      )}

      <nav className="space-y-1 mb-6">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white shadow-md"
                : "text-gray-600 hover:bg-gray-50"
            }`}>
            <tab.icon className="w-4 h-4" />
            {tab.label}
            <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${activeTab === tab.id ? "rotate-90" : ""}`} />
          </button>
        ))}
      </nav>

      <button onClick={onLogout}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
        <LogOut className="w-4 h-4" />
        Cerrar sesión
      </button>
    </div>
  );
}
import { useState } from "react";
import { PlusCircle, Search, Trash2 } from "lucide-react";
import { Reserva, ESTADO_COLOR } from "./types";

interface Props {
  reservas: Reserva[];
  onDelete: (id: number) => void;
  onNueva: () => void;
}

export default function ModuleReservas({ reservas, onDelete, onNueva }: Props) {
  const [search, setSearch] = useState("");

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
        <button onClick={onNueva}
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
                  <button onClick={() => onDelete(r.id_reserva)}
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
}
import { useEffect, useState } from 'react';
import { reservaService } from '../services/services';
import { ReservaResponse, ReservaCreate, ReservaUpdate } from '../data/reservaTypes';

const estadoColors: Record<string, string> = {
  confirmada: 'bg-green-100 text-green-800',
  pendiente: 'bg-yellow-100 text-yellow-800',
  cancelada: 'bg-red-100 text-red-800',
  finalizada: 'bg-gray-100 text-gray-800',
};

const emptyForm = {
  id_cliente: '', id_empleado: '', id_paquete: '',
  fecha_inicio: '', fecha_fin: '', numero_personas: '', estado: 'pendiente'
};

export default function Reservas() {
  const [reservas, setReservas] = useState<ReservaResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { fetchReservas(); }, []);

  async function fetchReservas() {
    try {
      const data = await reservaService.getAll(0, 50);
      setReservas(data);
    } catch (e: any) {
      showAlert(e.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  function showAlert(msg: string, type: 'success' | 'error') {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3500);
  }

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  }

  function openEdit(r: ReservaResponse) {
    setEditingId(r.id_reserva);
    setForm({
      id_cliente: String(r.id_cliente),
      id_empleado: String(r.id_empleado),
      id_paquete: String(r.id_paquete),
      fecha_inicio: r.fecha_inicio?.split('T')[0] ?? '',
      fecha_fin: r.fecha_fin?.split('T')[0] ?? '',
      numero_personas: String(r.numero_personas),
      estado: r.estado,
    });
    setShowModal(true);
  }

  function openDelete(id: number) {
    setDeletingId(id);
    setShowConfirm(true);
  }

  async function saveReserva() {
    const body = {
      id_cliente: parseInt(form.id_cliente),
      id_empleado: parseInt(form.id_empleado),
      id_paquete: parseInt(form.id_paquete),
      fecha_inicio: form.fecha_inicio,
      fecha_fin: form.fecha_fin,
      numero_personas: parseInt(form.numero_personas),
      estado: form.estado,
    };
    try {
      if (editingId) {
        await reservaService.update(editingId, body as ReservaUpdate);
        showAlert('Reserva actualizada correctamente', 'success');
      } else {
        await reservaService.create(body as ReservaCreate);
        showAlert('Reserva creada correctamente', 'success');
      }
      setShowModal(false);
      fetchReservas();
    } catch (e: any) {
      showAlert(e.message, 'error');
    }
  }

  async function confirmDelete() {
    try {
      await reservaService.delete(deletingId!);
      showAlert('Reserva eliminada correctamente', 'success');
      setShowConfirm(false);
      fetchReservas();
    } catch (e: any) {
      showAlert(e.message, 'error');
      setShowConfirm(false);
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Alert */}
      {alert && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
          alert.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {alert.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
          + Nueva reserva
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Cargando...</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-600 font-semibold">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Paquete</th>
                <th className="px-4 py-3">Inicio</th>
                <th className="px-4 py-3">Fin</th>
                <th className="px-4 py-3">Personas</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reservas.map((r) => (
                <tr key={r.id_reserva} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">#{r.id_reserva}</td>
                  <td className="px-4 py-3 text-gray-600">{r.id_cliente}</td>
                  <td className="px-4 py-3 text-gray-600">{r.id_paquete}</td>
                  <td className="px-4 py-3 text-gray-600">{r.fecha_inicio?.split('T')[0]}</td>
                  <td className="px-4 py-3 text-gray-600">{r.fecha_fin?.split('T')[0]}</td>
                  <td className="px-4 py-3 text-gray-600">{r.numero_personas}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColors[r.estado]}`}>
                      {r.estado}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-2">
                    <button onClick={() => openEdit(r)}
                      className="px-3 py-1 text-xs border border-gray-300 rounded-lg hover:bg-gray-100">
                      Editar
                    </button>
                    <button onClick={() => openDelete(r.id_reserva)}
                      className="px-3 py-1 text-xs border border-red-300 text-red-600 rounded-lg hover:bg-red-50">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal crear/editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">
              {editingId ? `Editar reserva #${editingId}` : 'Nueva reserva'}
            </h2>
            <div className="space-y-3">
              {[
                { label: 'ID Cliente', key: 'id_cliente', type: 'number' },
                { label: 'ID Empleado', key: 'id_empleado', type: 'number' },
                { label: 'ID Paquete', key: 'id_paquete', type: 'number' },
                { label: 'Fecha inicio', key: 'fecha_inicio', type: 'date' },
                { label: 'Fecha fin', key: 'fecha_fin', type: 'date' },
                { label: 'Número de personas', key: 'numero_personas', type: 'number' },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-xs text-gray-500 mb-1">{label}</label>
                  <input type={type}
                    value={(form as any)[key]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs text-gray-500 mb-1">Estado</label>
                <select value={form.estado}
                  onChange={e => setForm({ ...form, estado: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="cancelada">Cancelada</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">
                Cancelar
              </button>
              <button onClick={saveReserva}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm text-center">
            <div className="text-red-500 text-4xl mb-3">🗑️</div>
            <p className="text-gray-700 mb-5">¿Eliminar esta reserva? Esta acción no se puede deshacer.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100">
                Cancelar
              </button>
              <button onClick={confirmDelete}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700">
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
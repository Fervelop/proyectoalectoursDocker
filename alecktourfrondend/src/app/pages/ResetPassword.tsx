import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { authService } from '../services/auth.service';
import { motion } from 'motion/react';
import Navbar from '../components/Navbar';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const token = params.get('token') ?? '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleReset() {
    setError('');
    if (!password || password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.resetPassword(token, password);
      setMsg(res.message);
      setTimeout(() => navigate('/login'), 2500);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      <div className="max-w-md mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl p-8"
        >
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Nueva contraseña</h1>
          <p className="text-gray-500 text-sm mb-6">Ingresa tu nueva contraseña para continuar.</p>

          {msg ? (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 text-sm">
              ✅ {msg} — Redirigiendo al login...
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm mb-4">
                  {error}
                </div>
              )}
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Nueva contraseña</label>
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Confirmar contraseña</label>
                  <input
                    type="password"
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                  />
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReset}
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-60"
              >
                {loading ? 'Guardando...' : 'Restablecer contraseña'}
              </motion.button>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}
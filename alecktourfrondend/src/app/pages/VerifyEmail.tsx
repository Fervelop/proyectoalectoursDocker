import { CheckCircle, Loader2, Plane, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { authService } from "../services/auth.service";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) { setStatus('error'); return; }

    authService.verifyEmail(token)
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'));
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#7B1E3A] via-[#922847] to-[#C9A227]/20 dark:from-[#0f0f10] dark:to-[#161618] flex items-center justify-center p-4 transition-colors duration-300">
      <div className="bg-white dark:bg-[#161618] rounded-xl shadow-2xl p-10 max-w-md w-full text-center border border-gray-100 dark:border-[#2a2a2e]">

        {/* Isotipo/Logo animado superior */}
        <div className="flex justify-center mb-8">
          <div className="p-3 bg-[#f1e4e8] dark:bg-[#2a1a1f] rounded-xl">
            <Plane className={`w-8 h-8 text-[#7B1E3A] dark:text-[#ffffff] ${status === 'loading' ? 'animate-bounce' : ''}`} />
          </div>
        </div>

        {/* ESTADO: CARGANDO */}
        {status === 'loading' && (
          <div className="py-6 flex flex-col items-center">
            <Loader2 className="w-10 h-10 text-[#C9A227] animate-spin mb-4" />
            <h2 className="text-xl font-bold text-gray-800 dark:text-[#f5f5f5] mb-1">Verificando tus datos</h2>
            <p className="text-sm text-gray-500 dark:text-[#a0a0a0]">Espera un momento mientras validamos tu cuenta...</p>
          </div>
        )}

        {/* ESTADO: ÉXITO */}
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-200 dark:border-emerald-800/50">
              <CheckCircle className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-[#f5f5f5] mb-2 tracking-tight">¡Email verificado!</h2>
            <p className="text-sm text-gray-500 dark:text-[#a0a0a0] mb-8">Tu cuenta de AlecTours está lista. Ya puedes iniciar sesión y planear tu próximo destino.</p>

            <button onClick={() => navigate('/login')}
              className="w-full py-4 bg-gradient-to-r from-[#7B1E3A] to-[#A13B55] text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:opacity-95 shadow-md transform active:scale-[0.98] transition-all cursor-pointer">
              Iniciar sesión
            </button>
          </>
        )}

        {/* ESTADO: ERROR */}
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-rose-50 dark:bg-rose-950/30 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-200 dark:border-rose-800/50">
              <XCircle className="w-10 h-10 text-rose-600 dark:text-rose-400" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-[#f5f5f5] mb-2 tracking-tight">Token inválido o expirado</h2>
            <p className="text-sm text-gray-500 dark:text-[#a0a0a0] mb-8">El enlace de verificación ya fue utilizado o ha caducado por motivos de seguridad.</p>

            <button onClick={() => navigate('/register')}
              className="w-full py-4 bg-gradient-to-r from-[#7B1E3A] to-[#A13B55] text-white font-bold uppercase text-xs tracking-widest rounded-xl hover:opacity-95 shadow-md transform active:scale-[0.98] transition-all cursor-pointer">
              Volver al registro
            </button>
          </>
        )}

      </div>
    </div>
  );
}
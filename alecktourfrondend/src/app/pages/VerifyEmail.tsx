import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { CheckCircle, XCircle, Plane } from "lucide-react";
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
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2563EB] via-[#06B6D4] to-[#F59E0B] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <Plane className="w-10 h-10 text-[#2563EB]" />
        </div>

        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-blue-200 border-t-[#2563EB] rounded-full animate-spin mx-auto mb-6" />
            <h2 className="text-xl font-bold text-gray-900">Verificando tu cuenta...</h2>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Email verificado!</h2>
            <p className="text-gray-500 mb-6">Tu cuenta está lista. Completa tu perfil para continuar.</p>
            <button onClick={() => navigate('/complete-profile')}
              className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all">
              Completar perfil
            </button>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <XCircle className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Token inválido</h2>
            <p className="text-gray-500 mb-6">El enlace expiró o ya fue usado. Regístrate de nuevo.</p>
            <button onClick={() => navigate('/register')}
              className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all">
              Volver al registro
            </button>
          </>
        )}
      </div>
    </div>
  );
}
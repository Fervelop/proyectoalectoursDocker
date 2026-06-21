import { AlertCircle, Eye, EyeOff, Lock, Mail, Plane, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service";

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToRegister?: () => void;
}

export default function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });
    const [formError, setFormError] = useState("");

    // Forgot password
    const [showForgot, setShowForgot] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMsg, setForgotMsg] = useState("");
    const [forgotLoading, setForgotLoading] = useState(false);

    const isFormValid = useMemo(
        () => formData.username.trim().length > 0 && formData.password.length > 0,
        [formData]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formError) setFormError("");
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const resetAndClose = () => {
        setFormData({ username: "", password: "" });
        setFormError("");
        setShowPassword(false);
        setShowForgot(false);
        setForgotMsg("");
        setForgotEmail("");
        onClose();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        setFormError("");
        setLoading(true);
        try {
            const res = await authService.login(formData);
            login(res.access_token, {
                username: res.username ?? formData.username,
                user_id: res.user_id,
                id_cliente: res.id_cliente,
                roles: res.roles ?? [],
            });
            toast.success(`¡Bienvenido, ${res.username ?? formData.username}!`);
            const roles = res.roles ?? [];
            resetAndClose();
            setTimeout(() => {
                navigate(roles.includes("admin") ? "/admin" : "/");
            }, 300);
        } catch (err: any) {
            const message = err?.message || "Usuario o contraseña incorrectos";
            setFormError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    async function handleForgot() {
        if (!forgotEmail) return;
        setForgotLoading(true);
        try {
            const res = await authService.forgotPassword(forgotEmail);
            setForgotMsg(res.message);
        } catch (e: any) {
            toast.error(e.message);
        } finally {
            setForgotLoading(false);
        }
    }

    function closeForgotSub() {
        setShowForgot(false);
        setForgotMsg("");
        setForgotEmail("");
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
                    onClick={resetAndClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.94, y: 24 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.94, y: 24 }}
                        transition={{ type: "spring", damping: 24, stiffness: 320 }}
                        onClick={(e) => e.stopPropagation()}
                        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
                    >
                        {/* Header con degradado */}
                        <div className="relative bg-gradient-to-br from-[#2563EB] via-[#2563EB] to-[#06B6D4] px-8 pt-8 pb-12">
                            <button
                                onClick={resetAndClose}
                                className="absolute top-5 right-5 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-lg mb-4">
                                <Plane className="w-6 h-6 text-[#2563EB]" />
                            </div>
                            <h1 className="text-2xl font-bold text-white mb-1">Bienvenido de nuevo</h1>
                            <p className="text-blue-100 text-sm">Inicia sesión para continuar tu viaje</p>
                        </div>

                        {/* Form card flotante */}
                        <div className="px-8 pb-8 -mt-6">
                            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                                <AnimatePresence>
                                    {formError && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                                            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                            className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 text-sm overflow-hidden"
                                        >
                                            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                            <span>{formError}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Usuario</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="text"
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                placeholder="juanperez123"
                                                required
                                                autoFocus
                                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-shadow"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center justify-between mb-1.5">
                                            <label className="text-sm font-medium text-gray-700">Contraseña</label>
                                            <button
                                                type="button"
                                                onClick={() => setShowForgot(true)}
                                                className="text-xs text-[#2563EB] hover:text-[#1d4ed8] hover:underline font-medium"
                                            >
                                                ¿Olvidaste tu contraseña?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="••••••••"
                                                required
                                                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#2563EB] focus:border-transparent outline-none transition-shadow"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((s) => !s)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={!isFormValid || loading}
                                        className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                    >
                                        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
                                    </button>
                                </form>
                            </div>

                            <p className="text-center text-gray-500 text-sm mt-5">
                                ¿No tienes cuenta?{" "}
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetAndClose();
                                        onSwitchToRegister?.();
                                    }}
                                    className="text-[#2563EB] hover:text-[#1d4ed8] font-semibold"
                                >
                                    Regístrate gratis
                                </button>
                            </p>
                        </div>

                        {/* Sub-modal: olvidé contraseña */}
                        <AnimatePresence>
                            {showForgot && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-3xl p-4"
                                    onClick={closeForgotSub}
                                >
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                        onClick={(e) => e.stopPropagation()}
                                        className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-2xl"
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-[#2563EB]" />
                                            </div>
                                            <h2 className="text-xl font-bold text-gray-900">Recuperar contraseña</h2>
                                        </div>
                                        <p className="text-gray-500 text-sm mb-6">
                                            Te enviaremos un enlace a tu correo para restablecer tu contraseña.
                                        </p>

                                        {forgotMsg ? (
                                            <div className="text-center py-2">
                                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <span className="text-3xl">✅</span>
                                                </div>
                                                <p className="text-green-700 font-medium mb-1">¡Correo enviado!</p>
                                                <p className="text-gray-500 text-sm">{forgotMsg}</p>
                                                <button
                                                    onClick={closeForgotSub}
                                                    className="mt-6 w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-xl font-semibold"
                                                >
                                                    Entendido
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="relative mb-4">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                                    <input
                                                        type="email"
                                                        placeholder="tu@correo.com"
                                                        value={forgotEmail}
                                                        onChange={(e) => setForgotEmail(e.target.value)}
                                                        onKeyDown={(e) => e.key === "Enter" && handleForgot()}
                                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
                                                    />
                                                </div>

                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={handleForgot}
                                                    disabled={forgotLoading || !forgotEmail}
                                                    className="w-full py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                                                >
                                                    {forgotLoading ? "Enviando..." : "Enviar enlace"}
                                                </motion.button>

                                                <button
                                                    onClick={closeForgotSub}
                                                    className="w-full mt-3 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                                                >
                                                    Cancelar
                                                </button>
                                            </>
                                        )}
                                    </motion.div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
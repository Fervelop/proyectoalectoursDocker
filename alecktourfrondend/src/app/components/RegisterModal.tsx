import { AlertCircle, Calendar, CheckCircle, CreditCard, Eye, EyeOff, Lock, Mail, MapPin, Phone, Plane, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { apiFetch } from "../api/v1/api";
import { authService } from "../services/auth.service";
import PrivacidadModal from "./PrivacidadModal";
import TerminosModal from "./TerminosModal";

interface RegisterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSwitchToLogin?: () => void;
}

const initialFormData = {
    username: "", correo_electronico: "", password: "", confirmPassword: "",
    nombre: "", apellido: "", cedula: "", celular: "",
    direccion: "", ciudad: "", pais: "Colombia", fecha_nacimiento: "",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function calcAge(dateStr: string) {
    if (!dateStr) return 0;
    const birth = new Date(dateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

interface FieldProps {
    icon: React.ReactNode;
    error?: string;
    suffix?: React.ReactNode;
    children: React.ReactElement<React.InputHTMLAttributes<HTMLInputElement>>;
}

function Field({ icon, error, suffix, children }: FieldProps) {
    return (
        <div className="space-y-1">
            <div className="relative group">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors">
                    {icon}
                </span>
                {children}
                {suffix && (
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">{suffix}</span>
                )}
            </div>
            <AnimatePresence>
                {error && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        className="text-xs text-red-500 flex items-center gap-1 pl-1"
                    >
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }: RegisterModalProps) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [success, setSuccess] = useState(false);
    const [verificationToken, setVerificationToken] = useState("");
    const [email, setEmail] = useState("");
    const [formData, setFormData] = useState(initialFormData);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [formError, setFormError] = useState("");
    const [showTerminos, setShowTerminos] = useState(false);
    const [showPrivacidad, setShowPrivacidad] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formError) setFormError("");
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setTouched((t) => ({ ...t, [e.target.name]: true }));
    };

    const errors = useMemo(() => {
        const e: Record<string, string> = {};
        if (formData.username && formData.username.trim().length < 3)
            e.username = "Mínimo 3 caracteres";
        if (formData.correo_electronico && !EMAIL_REGEX.test(formData.correo_electronico))
            e.correo_electronico = "Correo inválido";
        if (formData.password && formData.password.length < 6)
            e.password = "Mínimo 6 caracteres";
        if (formData.confirmPassword && formData.confirmPassword !== formData.password)
            e.confirmPassword = "Las contraseñas no coinciden";
        if (formData.cedula && !/^\d{6,12}$/.test(formData.cedula))
            e.cedula = "Solo números, 6–12 dígitos";
        if (formData.celular && !/^\d{7,10}$/.test(formData.celular))
            e.celular = "Solo números, 7–10 dígitos";
        if (formData.fecha_nacimiento && calcAge(formData.fecha_nacimiento) < 18)
            e.fecha_nacimiento = "Debes ser mayor de 18 años";
        return e;
    }, [formData]);

    const requiredFilled =
        formData.username.trim().length >= 3 &&
        EMAIL_REGEX.test(formData.correo_electronico) &&
        formData.password.length >= 6 &&
        formData.confirmPassword === formData.password &&
        formData.nombre.trim().length > 0 &&
        formData.apellido.trim().length > 0 &&
        /^\d{6,12}$/.test(formData.cedula) &&
        formData.fecha_nacimiento.length > 0 &&
        calcAge(formData.fecha_nacimiento) >= 18 &&
        (formData.celular === "" || /^\d{7,10}$/.test(formData.celular));

    const isFormValid = requiredFilled && acceptedTerms;
    const fieldError = (name: string) => (touched[name] ? errors[name] : undefined);

    const resetState = () => {
        setFormData(initialFormData);
        setSuccess(false);
        setVerificationToken("");
        setEmail("");
        setAcceptedTerms(false);
        setTouched({});
        setFormError("");
        setShowPassword(false);
        setShowConfirmPassword(false);
    };

    const handleClose = () => { resetState(); onClose(); };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        setFormError("");
        setLoading(true);
        try {
            const res = await authService.register({
                username: formData.username,
                correo_electronico: formData.correo_electronico,
                password: formData.password,
            });
            const cliente = await apiFetch<{ id_cliente: number }>("/clientes", {
                method: "POST",
                body: {
                    nombre: formData.nombre, apellido: formData.apellido,
                    cedula: formData.cedula, correo: formData.correo_electronico,
                    celular: formData.celular, direccion: formData.direccion,
                    ciudad: formData.ciudad, pais: formData.pais,
                    fecha_nacimiento: formData.fecha_nacimiento,
                },
            });
            await apiFetch(`/api/usuarios/${res.user_id}/vincular-cliente`, {
                method: "PUT",
                body: { id_cliente: cliente.id_cliente },
            });
            setVerificationToken(res.verification_token);
            setEmail(res.email);
            setSuccess(true);
        } catch (err: any) {
            const message = err?.message || "Error al crear la cuenta";
            setFormError(message);
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async () => {
        setVerifying(true);
        try {
            await authService.verifyEmail(verificationToken);
            toast.success("¡Cuenta verificada! Ya puedes iniciar sesión.");
            handleClose();
            setTimeout(() => onSwitchToLogin?.(), 300);
        } catch (err: any) {
            toast.error(err.message || "Error al verificar");
        } finally {
            setVerifying(false);
        }
    };

    const inputBase = (name: string) =>
        `w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border outline-none transition-all bg-gray-50 focus:bg-white ${fieldError(name)
            ? "border-red-300 focus:ring-2 focus:ring-red-200"
            : "border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
        }`;

    return (
        <>
            <TerminosModal isOpen={showTerminos} onClose={() => setShowTerminos(false)} />
            <PrivacidadModal isOpen={showPrivacidad} onClose={() => setShowPrivacidad(false)} />

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 flex items-center justify-center z-[100] p-4 overflow-y-auto"
                        style={{ backgroundColor: "rgba(15,23,42,0.75)", backdropFilter: "blur(6px)" }}
                        onClick={handleClose}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 26, stiffness: 340 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg my-8 rounded-2xl shadow-2xl overflow-hidden bg-white"
                        >
                            {/* ── Header naranja ── */}
                            <div
                                className="relative px-7 pt-7 pb-8 overflow-hidden"
                                style={{ background: "linear-gradient(135deg, #F97316 0%, #FB923C 60%, #FBBF24 100%)" }}
                            >
                                <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full"
                                    style={{ background: "rgba(255,255,255,0.15)" }} />
                                <div className="absolute top-10 -right-2 w-16 h-16 rounded-full"
                                    style={{ background: "rgba(255,255,255,0.08)" }} />

                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>

                                <div className="flex items-center gap-3 relative">
                                    <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
                                        <Plane className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="text-white/70 text-[10px] font-semibold tracking-widest uppercase">AleckTours</p>
                                        <h1 className="text-white font-bold text-xl leading-tight">Crea tu cuenta</h1>
                                    </div>
                                </div>

                                <p className="text-white/75 text-sm mt-2.5 relative">
                                    Únete y empieza a explorar el mundo ✈️
                                </p>

                                {/* Steps */}
                                <div className="flex items-center gap-2 mt-4 relative">
                                    {["Acceso", "Perfil", "Listo"].map((step, i) => (
                                        <div key={step} className="flex items-center gap-2">
                                            <div className={`h-1 rounded-full transition-all ${i === 0 ? "w-8 bg-white" : "w-5 bg-white/30"}`} />
                                            <span className="text-white/50 text-[10px] font-medium">{step}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ── Body ── */}
                            <div className="px-7 py-6">
                                {success ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-6"
                                    >
                                        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                                            style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)" }}>
                                            <CheckCircle className="w-8 h-8 text-white" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900 mb-1">¡Todo listo!</h2>
                                        <p className="text-gray-500 text-sm mb-6">
                                            Cuenta creada como{" "}
                                            <span className="font-semibold text-gray-700">{email}</span>
                                        </p>
                                        <button
                                            onClick={handleVerify}
                                            disabled={verifying}
                                            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg disabled:opacity-50"
                                            style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)" }}
                                        >
                                            {verifying ? "Verificando..." : "✓ Verificar mi cuenta"}
                                        </button>
                                        <p className="text-xs text-gray-400 mt-2 mb-4">En producción esto llegaría por email</p>
                                        <button
                                            onClick={() => { handleClose(); onSwitchToLogin?.(); }}
                                            className="text-sm text-gray-400 hover:text-orange-500 transition-colors"
                                        >
                                            Ir a iniciar sesión →
                                        </button>
                                    </motion.div>
                                ) : (
                                    <>
                                        <AnimatePresence>
                                            {formError && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                    animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                                    className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-xs"
                                                >
                                                    <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                                                    <span>{formError}</span>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <form onSubmit={handleSubmit} className="space-y-5">

                                            {/* Sección 1 */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                                                        style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)" }}>1</div>
                                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Datos de acceso</span>
                                                    <div className="flex-1 h-px bg-gray-100" />
                                                </div>
                                                <div className="space-y-3">
                                                    <Field icon={<User className="w-4 h-4" />} error={fieldError("username")}>
                                                        <input type="text" name="username" value={formData.username}
                                                            onChange={handleChange} onBlur={handleBlur}
                                                            placeholder="Nombre de usuario"
                                                            required minLength={3} maxLength={50}
                                                            className={inputBase("username")} />
                                                    </Field>
                                                    <Field icon={<Mail className="w-4 h-4" />} error={fieldError("correo_electronico")}>
                                                        <input type="email" name="correo_electronico" value={formData.correo_electronico}
                                                            onChange={handleChange} onBlur={handleBlur}
                                                            placeholder="Correo electrónico" required
                                                            className={inputBase("correo_electronico")} />
                                                    </Field>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Field icon={<Lock className="w-4 h-4" />} error={fieldError("password")}
                                                            suffix={
                                                                <button type="button" tabIndex={-1}
                                                                    onClick={() => setShowPassword(s => !s)}
                                                                    className="text-gray-400 hover:text-orange-500 transition-colors">
                                                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            }>
                                                            <input type={showPassword ? "text" : "password"}
                                                                name="password" value={formData.password}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                placeholder="Contraseña" required
                                                                className={inputBase("password") + " pr-9"} />
                                                        </Field>
                                                        <Field icon={<Lock className="w-4 h-4" />} error={fieldError("confirmPassword")}
                                                            suffix={
                                                                <button type="button" tabIndex={-1}
                                                                    onClick={() => setShowConfirmPassword(s => !s)}
                                                                    className="text-gray-400 hover:text-orange-500 transition-colors">
                                                                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                                </button>
                                                            }>
                                                            <input type={showConfirmPassword ? "text" : "password"}
                                                                name="confirmPassword" value={formData.confirmPassword}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                placeholder="Confirmar" required
                                                                className={inputBase("confirmPassword") + " pr-9"} />
                                                        </Field>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Sección 2 */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                                                        style={{ background: "linear-gradient(135deg, #F97316, #FBBF24)" }}>2</div>
                                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Datos personales</span>
                                                    <div className="flex-1 h-px bg-gray-100" />
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Field icon={<User className="w-4 h-4" />}>
                                                            <input type="text" name="nombre" value={formData.nombre}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                placeholder="Nombre" required className={inputBase("nombre")} />
                                                        </Field>
                                                        <Field icon={<User className="w-4 h-4" />}>
                                                            <input type="text" name="apellido" value={formData.apellido}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                placeholder="Apellido" required className={inputBase("apellido")} />
                                                        </Field>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Field icon={<CreditCard className="w-4 h-4" />} error={fieldError("cedula")}>
                                                            <input type="text" name="cedula" value={formData.cedula}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                placeholder="Cédula" required inputMode="numeric"
                                                                className={inputBase("cedula")} />
                                                        </Field>
                                                        <Field icon={<Phone className="w-4 h-4" />} error={fieldError("celular")}>
                                                            <input type="tel" name="celular" value={formData.celular}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                placeholder="Celular" inputMode="numeric"
                                                                className={inputBase("celular")} />
                                                        </Field>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <Field icon={<MapPin className="w-4 h-4" />}>
                                                            <input type="text" name="ciudad" value={formData.ciudad}
                                                                onChange={handleChange} placeholder="Ciudad"
                                                                className={inputBase("ciudad")} />
                                                        </Field>
                                                        <Field icon={<Calendar className="w-4 h-4" />} error={fieldError("fecha_nacimiento")}>
                                                            <input type="date" name="fecha_nacimiento" value={formData.fecha_nacimiento}
                                                                onChange={handleChange} onBlur={handleBlur}
                                                                required className={inputBase("fecha_nacimiento")} />
                                                        </Field>
                                                    </div>
                                                    <Field icon={<MapPin className="w-4 h-4" />}>
                                                        <input type="text" name="direccion" value={formData.direccion}
                                                            onChange={handleChange} placeholder="Dirección (opcional)"
                                                            className={inputBase("direccion")} />
                                                    </Field>
                                                </div>
                                            </div>

                                            {/* Términos */}
                                            <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                                <div className="relative mt-0.5 flex-shrink-0">
                                                    <input type="checkbox" checked={acceptedTerms}
                                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                                        className="sr-only peer" />
                                                    <div className="w-4 h-4 rounded border-2 border-gray-300 peer-checked:border-orange-500 peer-checked:bg-orange-500 transition-all flex items-center justify-center">
                                                        {acceptedTerms && (
                                                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-500 leading-relaxed">
                                                    He leído y acepto los{" "}
                                                    <button type="button"
                                                        onClick={(e) => { e.preventDefault(); setShowTerminos(true); }}
                                                        className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition-colors">
                                                        Términos y Condiciones
                                                    </button>{" "}
                                                    y la{" "}
                                                    <button type="button"
                                                        onClick={(e) => { e.preventDefault(); setShowPrivacidad(true); }}
                                                        className="text-orange-500 hover:text-orange-600 font-semibold hover:underline transition-colors">
                                                        Política de Privacidad
                                                    </button>{" "}
                                                    de AleckTours
                                                </span>
                                            </label>

                                            {/* Botón submit */}
                                            <button type="submit" disabled={!isFormValid || loading}
                                                className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
                                                style={{ background: "linear-gradient(135deg, #F97316 0%, #FBBF24 100%)" }}>
                                                {loading ? (
                                                    <span className="flex items-center justify-center gap-2">
                                                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                                                        </svg>
                                                        Creando cuenta...
                                                    </span>
                                                ) : "Crear cuenta →"}
                                            </button>

                                            <p className="text-center text-xs text-gray-400">
                                                ¿Ya tienes cuenta?{" "}
                                                <button type="button"
                                                    onClick={() => { handleClose(); onSwitchToLogin?.(); }}
                                                    className="text-orange-500 hover:text-orange-600 font-semibold transition-colors">
                                                    Inicia sesión
                                                </button>
                                            </p>
                                        </form>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
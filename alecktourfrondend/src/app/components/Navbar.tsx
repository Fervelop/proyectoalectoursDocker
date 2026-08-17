import {
  Building2,
  Car,
  ChevronDown,
  Gift,
  LogIn,
  LogOut,
  Menu,
  Package,
  Phone,
  Plane,
  Ship,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { ClienteResponse, clienteService } from "../services/cliente.service";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";
import { ThemeToggle } from "./ThemeToggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOffersMenu, setShowOffersMenu] = useState(false);
  const [showBenefitsMenu, setShowBenefitsMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [cliente, setCliente] = useState<ClienteResponse | null>(null);

  const navigate = useNavigate();
  const { isAuthenticated, usuario, logout } = useAuth();

  // Fetch del cliente cuando hay sesión activa y existe id_cliente
  useEffect(() => {
    if (isAuthenticated && usuario?.id_cliente) {
      clienteService.getById(usuario.id_cliente)
        .then(setCliente)
        .catch(() => setCliente(null));
    } else {
      setCliente(null);
    }
  }, [isAuthenticated, usuario?.id_cliente]);

  const handleLogout = () => {
    logout();
    setCliente(null);
    navigate("/");
  };

  function getRoleLabel(roles?: string[]) {
    if (!roles || roles.length === 0) return "Cliente";
    if (roles.includes("admin")) return "Admin";
    if (roles.includes("empleado")) return "Empleado";
    if (roles.includes("cliente")) return "Cliente";
    return roles[0];
  }

  // Nombre a mostrar: nombre+apellido del cliente si existe, si no username
  const displayName = cliente
    ? `${cliente.nombre} ${cliente.apellido}`
    : (usuario?.username ?? "");

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-background text-foreground sticky top-0 z-[9999] border-b border-border/60 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-[84px]">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <motion.div
                whileHover={{ rotate: 0, scale: 1.06 }}
                initial={{ rotate: -8 }}
                className="w-11 h-11 rounded-full flex items-center justify-center shrink-0 bg-primary text-primary-foreground"
                style={{ boxShadow: "0 10px 22px -6px rgba(123,30,58,0.4)" }}
              >
                <Plane className="w-5 h-5" />
              </motion.div>
              <div className="leading-none">
                <div
                  className="text-[21px] text-primary"
                  style={{ fontFamily: "'Fraunces', serif", fontWeight: 800 }}
                >
                  AlekTours
                </div>
                <div className="mt-1 text-[8px] uppercase tracking-[1.5px] font-bold text-muted-foreground/70">
                  Agencia de viajes
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-6 text-[12px] font-semibold">

              {/* Ofertas / Destinos */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowOffersMenu(true)}
                  onMouseLeave={() => setShowOffersMenu(false)}
                  className="flex items-center gap-1.5 text-foreground/75 hover:text-primary transition-colors py-2"
                >
                  <Plane className="w-3 h-3 text-primary" />
                  Ofertas / Destinos
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {showOffersMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setShowOffersMenu(true)}
                      onMouseLeave={() => setShowOffersMenu(false)}
                      className="absolute top-full left-0 mt-2 w-56 bg-card text-card-foreground rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      <Link to="/search" className="block px-5 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                        Todos los destinos
                      </Link>
                      <Link to="/search?transport=vuelo" className="block px-5 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                        Paquetes con vuelo
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Hoteles (link directo, visual) */}
              <Link to="/search?type=hotel" className="flex items-center gap-1.5 text-foreground/75 hover:text-primary transition-colors">
                <Building2 className="w-3 h-3 text-primary" />
                Hoteles
              </Link>

              {/* Paquetes */}
              <Link to="/search" className="flex items-center gap-1.5 text-foreground/75 hover:text-primary transition-colors">
                <Package className="w-3 h-3 text-primary" />
                Paquetes
              </Link>

              {/* Beneficios */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowBenefitsMenu(true)}
                  onMouseLeave={() => setShowBenefitsMenu(false)}
                  className="flex items-center gap-1.5 text-foreground/75 hover:text-primary transition-colors py-2"
                >
                  <Gift className="w-3 h-3 text-primary" />
                  Beneficios
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {showBenefitsMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setShowBenefitsMenu(true)}
                      onMouseLeave={() => setShowBenefitsMenu(false)}
                      className="absolute top-full left-0 mt-2 w-64 bg-card text-card-foreground rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      <Link to="/benefits" className="block px-5 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all group/item">
                        <div className="flex items-center gap-3">
                          <Gift className="w-4 h-4 text-primary group-hover/item:text-accent-foreground transition-colors" />
                          <span>Programa de puntos</span>
                        </div>
                      </Link>
                      <Link to="/corporate" className="block px-5 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all group/item">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-4 h-4 text-primary group-hover/item:text-accent-foreground transition-colors" />
                          <span>Convenios empresariales</span>
                        </div>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cruceros (visual, apunta a ofertas) */}
              <Link to="/search" className="flex items-center gap-1.5 text-foreground/75 hover:text-primary transition-colors">
                <Ship className="w-3 h-3 text-primary" />
                Cruceros
              </Link>

              {/* Autos */}
              <Link to="/search" className="flex items-center gap-1.5 text-foreground/75 hover:text-primary transition-colors">
                <Car className="w-3 h-3 text-primary" />
                Autos
              </Link>

              {/* Información */}
              <div className="relative">
                <button
                  onMouseEnter={() => setShowInfoMenu(true)}
                  onMouseLeave={() => setShowInfoMenu(false)}
                  className="flex items-center gap-1 text-foreground/75 hover:text-primary transition-colors py-2"
                >
                  Más
                  <ChevronDown className="w-3 h-3 text-muted-foreground" />
                </button>
                <AnimatePresence>
                  {showInfoMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setShowInfoMenu(true)}
                      onMouseLeave={() => setShowInfoMenu(false)}
                      className="absolute top-full right-0 mt-2 w-56 bg-card text-card-foreground rounded-xl shadow-xl border border-border overflow-hidden"
                    >
                      <Link to="/travel-info" className="block px-5 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                        Info para tu viaje
                      </Link>
                      <Link to="/faq" className="block px-5 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                        Preguntas frecuentes
                      </Link>
                      <Link to="/contact" className="block px-5 py-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all">
                        Contáctanos
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Derecha: teléfono + login + theme toggle */}
            <div className="hidden lg:flex items-center gap-5 shrink-0">
              <div className="flex items-center gap-2 text-foreground/80">
                <Phone className="w-4 h-4 text-primary" />
                <div className="leading-tight">
                  <b className="block text-[11px]">+57 601 123 4567</b>
                  <small className="text-[8px] text-muted-foreground">Asesoría 24/7</small>
                </div>
              </div>

              <ThemeToggle />

              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-[10px] hover:bg-accent transition-all font-semibold text-[11px]"
                  >
                    <User className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                    <span className="truncate max-w-[120px]">{displayName}</span>
                    <span className="text-[9px] opacity-60 uppercase tracking-wider font-normal flex-shrink-0">
                      {getRoleLabel(usuario?.roles)}
                    </span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-[10px] transition-all"
                    title="Cerrar sesión"
                  >
                    <LogOut className="w-4 h-4" />
                  </motion.button>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowLoginModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-[10px] hover:bg-accent transition-all font-bold text-[11px] text-primary"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Iniciar sesión
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-2 lg:hidden">
              <ThemeToggle />
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted text-foreground"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden py-4 border-t border-border overflow-hidden bg-background"
              >
                <div className="flex flex-col gap-2">
                  <Link to="/" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                    Inicio
                  </Link>
                  <Link to="/search" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                    Destinos
                  </Link>
                  <Link to="/search?type=hotel" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                    Hoteles
                  </Link>
                  <Link to="/benefits" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                    Beneficios
                  </Link>
                  <Link to="/contact" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                    Contáctanos
                  </Link>

                  <div className="flex items-center gap-2 px-4 py-2 text-foreground/70">
                    <Phone className="w-4 h-4 text-primary" />
                    <span className="text-xs font-semibold">+57 601 123 4567 · Asesoría 24/7</span>
                  </div>

                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 shadow-sm transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <User className="w-4 h-4 flex-shrink-0" />
                        <div className="flex flex-col items-start leading-none">
                          <span className="font-medium">{displayName}</span>
                          <span className="text-[12px] opacity-75 uppercase tracking-wider font-normal">
                            {getRoleLabel(usuario?.roles)}
                          </span>
                        </div>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="px-4 py-2.5 text-destructive hover:bg-destructive/10 rounded-lg text-center font-medium text-sm"
                      >
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                      <button
                        onClick={() => { setIsMenuOpen(false); setShowLoginModal(true); }}
                        className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-center font-medium text-sm"
                      >
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={() => { setIsMenuOpen(false); setShowRegisterModal(true); }}
                        className="px-4 py-2.5 border border-border text-foreground rounded-lg text-center font-medium text-sm hover:bg-muted"
                      >
                        Crear cuenta
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>

      {/* Modales fuera del nav sticky */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => { setShowLoginModal(false); setShowRegisterModal(true); }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => { setShowRegisterModal(false); setShowLoginModal(true); }}
      />
    </>
  );
}
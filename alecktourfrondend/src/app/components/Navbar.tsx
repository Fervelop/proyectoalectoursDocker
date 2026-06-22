import { AnimatePresence, motion } from "framer-motion";
import { Building2, ChevronDown, Gift, LogIn, LogOut, Menu, Plane, User, X } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import RegisterModal from "./RegisterModal";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOffersMenu, setShowOffersMenu] = useState(false);
  const [showBenefitsMenu, setShowBenefitsMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, usuario, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };
  function getRoleLabel(roles?: string[]) {
    if (!roles || roles.length === 0) return "Cliente";

    if (roles.includes("admin")) return "Admin";
    if (roles.includes("empleado")) return "Empleado";
    if (roles.includes("cliente")) return "Cliente";

    return roles[0];
  }
  return (
    // FIX: Fragment para que los modales queden FUERA del <nav> sticky
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="bg-background text-foreground shadow-md sticky top-0 z-[9999] border-b border-border/60 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.6 }}
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-md bg-primary text-primary-foreground"
              >
                <Plane className="w-6 h-6" />
              </motion.div>
              <div>
                <span className="text-2xl font-bold tracking-tight text-primary">
                  AleckTours
                </span>
                <p className="text-xs text-muted-foreground -mt-1 font-normal">Viaja con estilo</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">

              {/* Ofertas / Destinos */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setShowOffersMenu(true)}
                  onMouseLeave={() => setShowOffersMenu(false)}
                  className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-all duration-300 font-medium"
                >
                  Ofertas / Destinos
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <AnimatePresence>
                  {showOffersMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setShowOffersMenu(true)}
                      onMouseLeave={() => setShowOffersMenu(false)}
                      className="absolute top-full left-0 mt-2 w-56 bg-card text-card-foreground rounded-lg shadow-xl border border-border overflow-hidden"
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

              {/* Beneficios */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setShowBenefitsMenu(true)}
                  onMouseLeave={() => setShowBenefitsMenu(false)}
                  className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-all duration-300 font-medium"
                >
                  Beneficios AleckTours
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <AnimatePresence>
                  {showBenefitsMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setShowBenefitsMenu(true)}
                      onMouseLeave={() => setShowBenefitsMenu(false)}
                      className="absolute top-full left-0 mt-2 w-64 bg-card text-card-foreground rounded-lg shadow-xl border border-border overflow-hidden"
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

              {/* Información */}
              <div className="relative group">
                <button
                  onMouseEnter={() => setShowInfoMenu(true)}
                  onMouseLeave={() => setShowInfoMenu(false)}
                  className="flex items-center gap-1 text-foreground/80 hover:text-primary transition-all duration-300 font-medium"
                >
                  Información
                  <ChevronDown className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </button>
                <AnimatePresence>
                  {showInfoMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      onMouseEnter={() => setShowInfoMenu(true)}
                      onMouseLeave={() => setShowInfoMenu(false)}
                      className="absolute top-full left-0 mt-2 w-56 bg-card text-card-foreground rounded-lg shadow-xl border border-border overflow-hidden"
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

              {/* Login/Profile Button */}
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 shadow-sm transition-all duration-300 font-medium text-sm"
                  >
                    <User className="w-4 h-4" />
                    {usuario?.username}
                    <span className="text-[12px] opacity-75 uppercase tracking-wider font-normal">
                      {getRoleLabel(usuario?.roles)}
                    </span>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleLogout}
                    className="p-2.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all"
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
                  className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-95 shadow-sm transition-all duration-300 font-medium text-sm"
                >
                  <LogIn className="w-4 h-4" />
                  Iniciar Sesión
                </motion.button>
              )}
            </div>

            {/* Mobile menu button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-muted text-foreground"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden py-4 border-t border-border overflow-hidden bg-background"
              >
                <div className="flex flex-col gap-2">
                  <Link to="/" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                    Inicio
                  </Link>
                  <Link to="/search" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                    Destinos
                  </Link>
                  <Link to="/benefits" className="px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                    Beneficios
                  </Link>

                  {isAuthenticated ? (
                    <>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 shadow-sm transition-all duration-300"
                      >
                        <User className="w-4 h-4" />

                        <div className="flex flex-col items-start leading-none">
                          <span className="font-medium">
                            {usuario?.username}
                          </span>

                          <span className="text-[12px] opacity-75 uppercase tracking-wider font-normal">
                            {getRoleLabel(usuario?.roles)}
                          </span>
                        </div>
                      </Link>

                      <button onClick={handleLogout} className="px-4 py-2.5 text-destructive hover:bg-destructive/10 rounded-lg text-center font-medium text-sm">
                        Cerrar sesión
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-2 pt-2 border-t border-border/50">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setShowLoginModal(true);
                        }}
                        className="px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-center font-medium text-sm"
                      >
                        Iniciar Sesión
                      </button>
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          setShowRegisterModal(true);
                        }}
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

      {/* FIX: Modales FUERA del <nav> sticky para que no queden atrapados ni recortados */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={() => {
          setShowLoginModal(false);
          setShowRegisterModal(true);
        }}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={() => {
          setShowRegisterModal(false);
          setShowLoginModal(true);
        }}
      />
    </>
  );
}
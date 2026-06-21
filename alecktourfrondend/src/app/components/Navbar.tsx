import { Building2, ChevronDown, Gift, LogIn, LogOut, Menu, Plane, User, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

function getRoleLabel(roles?: string[]) {
  if (!roles || roles.length === 0) return "Cliente";
  if (roles.includes("admin")) return "Admin";
  if (roles.includes("empleado")) return "Empleado";
  return "Cliente";
}

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOffersMenu, setShowOffersMenu] = useState(false);
  const [showBenefitsMenu, setShowBenefitsMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, usuario, logout } = useAuth();
  const { openLogin, openRegister } = useAuthModal();

  const roleLabel = getRoleLabel(usuario?.roles);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg, #FF6B35, #F7931E)" }}
            >
              <Plane className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-[#FF6B35] to-[#F7931E] bg-clip-text text-transparent">
                AleckTours
              </span>
              <p className="text-xs text-gray-500 -mt-1">Viaja con estilo</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {/* Ofertas / Destinos */}
            <div className="relative group">
              <button
                onMouseEnter={() => setShowOffersMenu(true)}
                onMouseLeave={() => setShowOffersMenu(false)}
                className="flex items-center gap-1 text-gray-700 hover:text-[#FF6B35] transition-all duration-300 font-medium"
              >
                Ofertas / Destinos
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showOffersMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setShowOffersMenu(true)}
                    onMouseLeave={() => setShowOffersMenu(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <Link to="/search" className="block px-6 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white transition-all">
                      Todos los destinos
                    </Link>
                    <Link to="/search?transport=vuelo" className="block px-6 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white transition-all">
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
                className="flex items-center gap-1 text-gray-700 hover:text-[#FF6B35] transition-all duration-300 font-medium"
              >
                Beneficios AleckTours
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showBenefitsMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setShowBenefitsMenu(true)}
                    onMouseLeave={() => setShowBenefitsMenu(false)}
                    className="absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <Link to="/benefits" className="block px-6 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white transition-all group/item">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-[#FF6B35] group-hover/item:text-white transition-colors" />
                        <span>Programa de puntos</span>
                      </div>
                    </Link>
                    <Link to="/corporate" className="block px-6 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white transition-all group/item">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-[#FF6B35] group-hover/item:text-white transition-colors" />
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
                className="flex items-center gap-1 text-gray-700 hover:text-[#FF6B35] transition-all duration-300 font-medium"
              >
                Información
                <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {showInfoMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseEnter={() => setShowInfoMenu(true)}
                    onMouseLeave={() => setShowInfoMenu(false)}
                    className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                  >
                    <Link to="/travel-info" className="block px-6 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white transition-all">
                      Info para tu viaje
                    </Link>
                    <Link to="/faq" className="block px-6 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white transition-all">
                      Preguntas frecuentes
                    </Link>
                    <Link to="/contact" className="block px-6 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white transition-all">
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
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-full hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <User className="w-5 h-5" />
                  <span className="flex items-center gap-2">
                    {usuario?.username}
                    <span className="text-[10px] uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                      {roleLabel}
                    </span>
                  </span>
                </Link>
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="p-3 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                  title="Cerrar sesión"
                >
                  <LogOut className="w-5 h-5" />
                </motion.button>
              </div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openLogin}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-full hover:shadow-xl transition-all duration-300 font-medium"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </motion.button>
            )}
          </div>

          {/* Mobile menu button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
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
              className="md:hidden py-4 border-t overflow-hidden"
            >
              <div className="flex flex-col gap-3">
                <Link to="/" className="px-4 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                  Inicio
                </Link>
                <Link to="/search" className="px-4 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                  Destinos
                </Link>
                <Link to="/benefits" className="px-4 py-3 text-gray-800 font-medium hover:bg-[#FF6B35] hover:text-white rounded-lg transition-all" onClick={() => setIsMenuOpen(false)}>
                  Beneficios
                </Link>
                {isAuthenticated ? (
                  <>
                    <Link to="/profile" className="px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg text-center font-medium flex items-center justify-center gap-2" onClick={() => setIsMenuOpen(false)}>
                      Mi Perfil ({usuario?.username})
                      <span className="text-[10px] uppercase tracking-wide bg-white/20 px-2 py-0.5 rounded-full font-semibold">
                        {roleLabel}
                      </span>
                    </Link>
                    <button onClick={handleLogout} className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg text-center font-medium">
                      Cerrar sesión
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openLogin();
                      }}
                      className="px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg text-center font-medium"
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        openRegister();
                      }}
                      className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg text-center font-medium hover:bg-gray-50"
                    >
                      Crear cuenta
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
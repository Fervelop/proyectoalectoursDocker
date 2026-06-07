import { Link, useNavigate } from "react-router";
import { Plane, User, Menu, X, LogIn, ChevronDown, Building2, Gift, HelpCircle, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOffersMenu, setShowOffersMenu] = useState(false);
  const [showBenefitsMenu, setShowBenefitsMenu] = useState(false);
  const [showInfoMenu, setShowInfoMenu] = useState(false);
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-white/95 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-gray-200"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: 360, scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="w-12 h-12 bg-gradient-to-br from-[#FF6B35] via-[#FF8E53] to-[#F7931E] rounded-xl flex items-center justify-center shadow-lg"
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
                    <Link to="/search" className="block px-6 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all">
                      Todos los destinos
                    </Link>
                    <Link to="/search?transport=vuelo" className="block px-6 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all">
                      Paquetes con vuelo
                    </Link>
                    <Link to="/offers" className="block px-6 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all">
                      Ofertas especiales
                    </Link>
                         
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mi Reserva */}
            <Link
              to="/profile"
              className="text-gray-700 hover:text-[#FF6B35] transition-all duration-300 font-medium relative group"
            >
              Mi Reserva
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] group-hover:w-full transition-all duration-300" />
            </Link>

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
                    <Link to="/benefits" className="block px-6 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Gift className="w-5 h-5 text-[#FF6B35]" />
                        <span>Programa de puntos</span>
                      </div>
                    </Link>
                    <Link to="/corporate" className="block px-6 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all">
                      <div className="flex items-center gap-3">
                        <Building2 className="w-5 h-5 text-[#FF6B35]" />
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
                    <Link to="/travel-info" className="block px-6 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all">
                      Info para tu viaje
                    </Link>
                    <Link to="/faq" className="block px-6 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all">
                      Preguntas frecuentes
                    </Link>
                    <Link to="/contact" className="block px-6 py-3 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 transition-all">
                      Contáctanos
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Shopping Cart */}
            <motion.div whileHover={{ scale: 1.1 }} className="relative">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <ShoppingCart className="w-6 h-6 text-gray-700" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6B35] text-white text-xs rounded-full flex items-center justify-center font-bold">
                  0
                </span>
              </button>
            </motion.div>

            {/* Login/Profile Button */}
            {isLoggedIn ? (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-full hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <User className="w-5 h-5" />
                  Mi Perfil
                </Link>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-full hover:shadow-xl transition-all duration-300 font-medium"
                >
                  <LogIn className="w-5 h-5" />
                  Iniciar Sesión
                </Link>
              </motion.div>
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
                <Link
                  to="/"
                  className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link
                  to="/search"
                  className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Destinos
                </Link>
                <Link
                  to="/benefits"
                  className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beneficios
                </Link>
                <Link
                  to="/corporate"
                  className="px-4 py-3 text-gray-700 hover:bg-gradient-to-r hover:from-orange-50 hover:to-orange-100 rounded-lg transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Convenios empresariales
                </Link>
                {isLoggedIn ? (
                  <Link
                    to="/profile"
                    className="px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Mi Perfil
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="px-4 py-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white rounded-lg text-center font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
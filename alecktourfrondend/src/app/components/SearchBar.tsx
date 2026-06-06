import { Search, MapPin, Calendar, Users, Sparkles } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function SearchBar() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState("2");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/search?destination=${destination}&start=${startDate}&end=${endDate}&people=${people}`);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      onSubmit={handleSearch}
      className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 max-w-6xl mx-auto border border-gray-100"
    >
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-[#FF6B35]" />
        <h3 className="text-lg font-semibold text-gray-900">Encuentra tu viaje ideal</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Destination */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Destino
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
            <input
              type="text"
              placeholder="¿A dónde viajas?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
            />
          </div>
        </motion.div>

        {/* Start Date */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fecha inicio
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
            />
          </div>
        </motion.div>

        {/* End Date */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Fecha fin
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none transition-all hover:border-gray-300"
            />
          </div>
        </motion.div>

        {/* People */}
        <motion.div whileFocus={{ scale: 1.02 }} className="relative group">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Personas
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#FF6B35] transition-colors" />
            <select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] outline-none appearance-none bg-white transition-all hover:border-gray-300"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "persona" : "personas"}
                </option>
              ))}
            </select>
          </div>
        </motion.div>
      </div>

      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-5 bg-gradient-to-r from-[#FF6B35] via-[#FF8E53] to-[#F7931E] text-white rounded-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-lg group relative overflow-hidden"
      >
        <motion.div
          className="absolute inset-0 bg-white/20"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 0.6 }}
        />
        <Search className="w-6 h-6 group-hover:rotate-12 transition-transform" />
        <span>Buscar paquetes increíbles</span>
      </motion.button>
    </motion.form>
  );
}

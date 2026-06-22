import { Calendar, MapPin, Search, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";

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
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSearch}
      className="bg-white/97 backdrop-blur-xl rounded-[28px] p-7 md:p-8 max-w-6xl mx-auto border border-[#7B1E3A]/8 relative text-gray-800"
      style={{ boxShadow: "0 24px 60px -16px rgba(123, 30, 58, 0.32), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      {/* Gold corner accent */}
      <div className="absolute -top-px -left-px w-16 h-16 rounded-tl-[28px] border-t-2 border-l-2 border-[#C9A227]/50 pointer-events-none" />

      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-[18px] h-[18px] text-[#C9A227]" />
        <h3
          className="text-lg text-[#2E2E2E]"
          style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
        >
          Encuentra tu próximo destino
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Destination */}
        <div className="relative group">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6b6b6b] mb-2">
            Destino
          </label>
          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#A13B55]/50 group-focus-within:text-[#7B1E3A] transition-colors" />
            <input
              type="text"
              placeholder="¿A dónde viajas?"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-[#7B1E3A]/15 bg-[#f7f5f6] rounded-2xl focus:ring-2 focus:ring-[#7B1E3A]/25 focus:border-[#7B1E3A] outline-none transition-all hover:border-[#7B1E3A]/30 text-[#2E2E2E] placeholder:text-[#9b9b9b]"
              required
            />
          </div>
        </div>

        {/* Start Date */}
        <div className="relative group">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6b6b6b] mb-2">
            Fecha inicio
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#A13B55]/50 group-focus-within:text-[#7B1E3A] transition-colors" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-[#7B1E3A]/15 bg-[#f7f5f6] rounded-2xl focus:ring-2 focus:ring-[#7B1E3A]/25 focus:border-[#7B1E3A] outline-none transition-all hover:border-[#7B1E3A]/30 text-[#2E2E2E]"
              required
            />
          </div>
        </div>

        {/* End Date */}
        <div className="relative group">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6b6b6b] mb-2">
            Fecha fin
          </label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#A13B55]/50 group-focus-within:text-[#7B1E3A] transition-colors" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-[#7B1E3A]/15 bg-[#f7f5f6] rounded-2xl focus:ring-2 focus:ring-[#7B1E3A]/25 focus:border-[#7B1E3A] outline-none transition-all hover:border-[#7B1E3A]/30 text-[#2E2E2E]"
              required
            />
          </div>
        </div>

        {/* People */}
        <div className="relative group">
          <label className="block text-xs font-semibold uppercase tracking-wide text-[#6b6b6b] mb-2">
            Viajeros
          </label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#A13B55]/50 group-focus-within:text-[#7B1E3A] transition-colors" />
            <select
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 border border-[#7B1E3A]/15 bg-[#f7f5f6] rounded-2xl focus:ring-2 focus:ring-[#7B1E3A]/25 focus:border-[#7B1E3A] outline-none appearance-none transition-all hover:border-[#7B1E3A]/30 text-[#2E2E2E]"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? "persona" : "personas"}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Search Button */}
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        className="w-full py-4 bg-[#7B1E3A] text-white rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 font-semibold text-base group relative overflow-hidden cursor-pointer"
        style={{ boxShadow: "0 8px 24px -4px rgba(123, 30, 58, 0.45)" }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          initial={{ x: "-120%" }}
          whileHover={{ x: "120%" }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
        />
        <Search className="w-5 h-5 group-hover:scale-110 transition-transform" />
        <span>Buscar viajes</span>
      </motion.button>
    </motion.form>
  );
}
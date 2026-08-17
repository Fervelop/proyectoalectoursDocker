import { Calendar, MapPin, Search, ShieldCheck, Sparkles, Users } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useNavigate } from "react-router";

type TripType = "oneway" | "roundtrip" | "multi";

export default function SearchBar() {
  const navigate = useNavigate();
  const [origin, setOrigin] = useState("Bogotá, Colombia");
  const [destination, setDestination] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState("1");
  const [tripType, setTripType] = useState<TripType>("roundtrip");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(
      `/search?origin=${origin}&destination=${destination}&start=${startDate}&end=${endDate}&people=${people}&trip=${tripType}`
    );
  };

  const tripOptions: { id: TripType; label: string }[] = [
    { id: "oneway", label: "Solo ida" },
    { id: "roundtrip", label: "Ida y regreso" },
    { id: "multi", label: "Multidestino" },
  ];

  return (
    <motion.form
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSearch}
      className="bg-white/97 backdrop-blur-xl rounded-[22px] p-5 sm:p-6 w-full text-[#2E2E2E] relative border border-[#7B1E3A]/8"
      style={{ boxShadow: "0 24px 60px -16px rgba(123, 30, 58, 0.32), 0 4px 16px rgba(0,0,0,0.04)" }}
    >
      {/* Encabezado */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-[15px] h-[15px] text-[#C9A227]" />
            <h3
              className="text-[15px] text-[#2E2E2E]"
              style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
            >
              Encuentra tu próximo destino
            </h3>
          </div>
          <p className="text-[11px] text-[#9b9b9b] mt-1">
            Compara opciones y reserva en minutos
          </p>
        </div>

        <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          Seguro
        </span>
      </div>

      {/* Campos */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-2.5 mb-4">
        {/* Origen */}
        <Field label="Origen" icon={MapPin} className="lg:col-span-1">
          <input
            type="text"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            placeholder="Ciudad de origen"
            className="w-full bg-transparent text-[12px] font-semibold outline-none truncate"
          />
        </Field>

        {/* Destino */}
        <Field label="Destino" icon={MapPin} className="lg:col-span-1">
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="¿A dónde viajas?"
            required
            className="w-full bg-transparent text-[12px] font-semibold outline-none truncate placeholder:text-[#b9adb2] placeholder:font-normal"
          />
        </Field>

        {/* Fechas (ida + regreso en un solo bloque) */}
        <Field label="Fechas" icon={Calendar} className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full bg-transparent text-[12px] font-semibold outline-none"
            />
            {tripType === "roundtrip" && (
              <>
                <span className="text-[#c7bcc1] text-[11px]">—</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  className="w-full bg-transparent text-[12px] font-semibold outline-none"
                />
              </>
            )}
          </div>
        </Field>

        {/* Pasajeros */}
        <Field label="Pasajeros" icon={Users} className="lg:col-span-1">
          <select
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            className="w-full bg-transparent text-[12px] font-semibold outline-none appearance-none cursor-pointer"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "adulto" : "adultos"}
              </option>
            ))}
          </select>
        </Field>

        {/* Botón */}
        <motion.button
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="col-span-2 lg:col-span-1 rounded-[10px] bg-[#7B1E3A] text-white text-[12px] font-bold flex items-center justify-center gap-2 py-3 lg:py-0 relative overflow-hidden"
          style={{ boxShadow: "0 8px 20px -6px rgba(123, 30, 58, 0.45)" }}
        >
          <Search className="w-4 h-4" />
          Buscar
        </motion.button>
      </div>

      {/* Pie: tipo de viaje + pago seguro */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
        <div className="flex items-center gap-4">
          {tripOptions.map((opt) => (
            <button
              type="button"
              key={opt.id}
              onClick={() => setTripType(opt.id)}
              className="flex items-center gap-1.5 text-[11px] text-[#6b6b6b]"
            >
              <span
                className={`w-3 h-3 rounded-full border flex items-center justify-center ${tripType === opt.id ? "border-[#7B1E3A]" : "border-[#b9adb2]"
                  }`}
              >
                {tripType === opt.id && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#7B1E3A]" />
                )}
              </span>
              <span className={tripType === opt.id ? "text-[#2E2E2E] font-semibold" : ""}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>

        <span className="flex items-center gap-1.5 text-[11px] text-[#81767b]">
          <ShieldCheck className="w-3.5 h-3.5" />
          Pagos seguros
        </span>
      </div>
    </motion.form>
  );
}

function Field({
  label,
  icon: Icon,
  children,
  className = "",
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-[#f7f5f6] border border-[#7B1E3A]/12 rounded-[10px] px-3 py-2 ${className}`}
    >
      <label className="flex items-center gap-1 text-[8px] uppercase tracking-wide font-bold text-[#9d8e94] mb-1">
        <Icon className="w-2.5 h-2.5 text-[#7B1E3A]" />
        {label}
      </label>
      {children}
    </div>
  );
}
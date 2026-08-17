import { Compass, PlayCircle } from "lucide-react";
import { motion } from "motion/react";
import SearchBar from "./SearchBar";

const stats = [
    { value: "180K+", label: "viajeros" },
    { value: "4.8/5", label: "satisfacción" },
    { value: "24/7", label: "asistencia" },
    { value: "★", label: "mejor precio" },
];

const avatarImages = [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80",
];

export default function Hero() {
    return (
        <section className="relative overflow-hidden bg-[#0F080B]">
            {/* Fondo */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2400&auto=format&fit=crop"
                    alt="Destino de viaje"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
                    className="w-full h-full object-cover select-none pointer-events-none"
                />
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(90deg, rgba(38,17,26,.96) 0%, rgba(67,39,49,.80) 45%, rgba(76,46,56,.35) 100%)",
                    }}
                />
                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
            </div>

            {/* Contenido a dos columnas */}
            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 md:pt-20 md:pb-24 grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-10 lg:gap-16 items-center">
                {/* Texto */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                >
                    <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full border border-white/25 bg-white/10 backdrop-blur-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]" />
                        <span className="text-[#C9A227] text-[10px] font-bold tracking-[0.2em] uppercase">
                            Tarifas exclusivas para Colombia
                        </span>
                    </div>

                    <h1
                        className="text-white text-4xl sm:text-5xl md:text-[54px] font-normal leading-[1.05] mb-5 tracking-tight max-w-xl"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Tu próximo viaje
                        <br />
                        empieza <span className="italic text-[#C9A227]">aquí.</span>
                    </h1>

                    <p className="text-white/80 text-sm sm:text-[15px] max-w-md leading-relaxed font-light mb-7">
                        Compara vuelos, hoteles y experiencias en un solo lugar.
                        Encuentra destinos increíbles con precios transparentes y
                        acompañamiento real.
                    </p>

                    <div className="flex flex-wrap gap-3 mb-8">
                        <a
                            href="#destinos"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#A13B55] text-white text-[13px] font-bold hover:-translate-y-0.5 transition-transform"
                            style={{ boxShadow: "0 12px 25px rgba(123,30,58,0.35)" }}
                        >
                            <Compass className="w-4 h-4" />
                            Explorar destinos
                        </a>

                        <a
                            href="#como-funciona"
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/50 bg-white/10 backdrop-blur-sm text-white text-[13px] font-bold"
                        >
                            <PlayCircle className="w-4 h-4" />
                            Cómo funciona
                        </a>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex">
                            {avatarImages.map((src, i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full border-2 border-[#0F080B] bg-cover bg-center -ml-2 first:ml-0"
                                    style={{ backgroundImage: `url(${src})` }}
                                />
                            ))}
                        </div>
                        <p className="text-[11px] text-white/75 leading-tight">
                            <b className="text-white">+180.000 viajeros</b>
                            <br />
                            ya viajaron con nosotros
                        </p>
                    </div>
                </motion.div>

                {/* Buscador */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15, ease: [0.25, 1, 0.5, 1] }}
                >
                    <SearchBar />
                </motion.div>
            </div>

            {/* Stats flotantes */}
            <div className="hidden lg:flex absolute right-4 sm:right-6 lg:right-8 bottom-6 gap-2 z-10">
                {stats.map((s) => (
                    <div
                        key={s.label}
                        className="min-w-[76px] px-3 py-2.5 rounded-[9px] border border-white/10 bg-white/10 backdrop-blur-sm"
                    >
                        <strong className="block text-white text-sm">{s.value}</strong>
                        <span className="text-white/65 text-[8px] uppercase tracking-wide">
                            {s.label}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}
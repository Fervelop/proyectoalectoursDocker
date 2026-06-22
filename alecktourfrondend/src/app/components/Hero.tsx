import { motion } from "motion/react";
import SearchBar from "./SearchBar";

export default function Hero() {
    return (
        // Reducimos la altura mínima general para que no se estire tanto
        <section className="relative min-h-[500px] md:min-h-[560px] flex items-center overflow-hidden bg-[#0F080B]">

            {/* --- CAPA 1: BACKGROUND --- */}
            <div className="absolute inset-0 z-0">
                <motion.img
                    src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2400&auto=format&fit=crop"
                    alt="Destino de lujo - Torre Eiffel"
                    initial={{ scale: 1.08 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2, ease: [0.25, 1, 0.5, 1] }}
                    className="w-full h-full object-cover select-none pointer-events-none"
                />

                <div
                    className="absolute inset-0 opacity-95"
                    style={{
                        background: "linear-gradient(180deg, rgba(46, 18, 28, 0.60) 0%, rgba(123, 30, 58, 0.45) 50%, rgba(15, 8, 11, 0.90) 100%)",
                    }}
                />

                <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/40 to-transparent" />
            </div>

            {/* --- CAPA 2: CONTENIDO INTEGRADO --- */}
            {/* Reducimos pt, recortamos drásticamente el pb, y bajamos el gap de 12 a 6 */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10 md:pt-32 md:pb-12 flex flex-col gap-6 md:gap-8">

                {/* Bloque de Textos */}
                <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
                    className="max-w-2xl text-left"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="h-[1px] w-6 bg-[#C9A227]" />
                        <span className="text-[#C9A227] text-xs font-semibold tracking-[0.25em] uppercase">
                            Agencia de viajes desde 2010
                        </span>
                    </div>

                    <h1
                        className="text-white text-4xl sm:text-5xl md:text-5xl font-normal leading-[1.12] mb-4 tracking-tight"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        El mundo tiene
                        <br />
                        <span className="italic font-light text-white/95">su propio ritmo.</span>
                        <br />
                        Síguelo.
                    </h1>

                    <p className="text-white/80 text-sm sm:text-base max-w-lg leading-relaxed font-light">
                        Paquetes, vuelos y hoteles curados para quienes viajan con intención.
                        Te acompañamos desde la primera idea hasta el último recuerdo.
                    </p>
                </motion.div>

                {/* Contenedor de la barra de búsqueda */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 1, 0.5, 1] }}
                    className="w-full max-w-6xl"
                >
                    <SearchBar />
                </motion.div>

            </div>

        </section>
    );
}
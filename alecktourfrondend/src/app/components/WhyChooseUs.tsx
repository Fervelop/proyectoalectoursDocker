import { CircleDollarSign, Headset, MapPinned, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { motion } from "motion/react";

const sellingPoints = [
    { icon: CircleDollarSign, title: "Precios claros", desc: "sin sorpresas" },
    { icon: Headset, title: "Asesoría experta", desc: "acompañamiento real" },
    { icon: MapPinned, title: "Itinerarios a tu medida", desc: "viajes únicos" },
    { icon: SlidersHorizontal, title: "Opciones para todos", desc: "viajes a tu estilo" },
];

export default function WhyChooseUs() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-6 items-stretch">
                {/* Caja granate: por qué viajar con nosotros */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col justify-center"
                    style={{
                        background: "linear-gradient(135deg, #5E1730 0%, #7B1E3A 55%, #6b1a35 100%)",
                    }}
                >
                    <div
                        className="absolute inset-0 opacity-40"
                        style={{
                            background:
                                "radial-gradient(circle at 85% 15%, rgba(201,162,39,0.25), transparent 55%)",
                        }}
                    />
                    <h2
                        className="relative text-white text-2xl md:text-[28px] leading-tight mb-8"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                    >
                        ¿Por qué viajar con AleckTours?
                    </h2>

                    <div className="relative grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {sellingPoints.map((p) => (
                            <div key={p.title} className="flex flex-col items-start gap-2.5">
                                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                                    <p.icon className="w-5 h-5 text-[#C9A227]" />
                                </div>
                                <div>
                                    <strong className="block text-white text-[13px] leading-tight">
                                        {p.title}
                                    </strong>
                                    <span className="text-white/60 text-[12px] leading-tight">
                                        {p.desc}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Tarjeta de métodos de pago */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white rounded-3xl border border-[#eadfe2] p-6 md:p-8 flex flex-col justify-center"
                    style={{ boxShadow: "0 20px 60px rgba(48,17,30,.08)" }}
                >
                    <strong className="text-[15px] text-[#2E2E2E] mb-1 block">
                        Métodos de pago aceptados
                    </strong>
                    <p className="text-[#9b8e93] text-xs mb-5">
                        Paga fácil, seguro y a tu manera.
                    </p>

                    <div className="flex flex-wrap items-center gap-x-3.5 gap-y-3">
                        {/* Visa */}
                        <span
                            className="italic font-black text-[17px] tracking-tight"
                            style={{ color: "#1A1F71" }}
                        >
                            VISA
                        </span>

                        {/* Mastercard */}
                        <div className="flex items-center">
                            <span
                                className="w-5 h-5 rounded-full"
                                style={{ background: "#EB001B", marginRight: "-8px" }}
                            />
                            <span
                                className="w-5 h-5 rounded-full opacity-90"
                                style={{ background: "#F79E1B", mixBlendMode: "multiply" }}
                            />
                        </div>

                        {/* Amex */}
                        <span
                            className="text-white text-[9px] font-bold px-2 py-1 rounded"
                            style={{ background: "#016FD0" }}
                        >
                            AMEX
                        </span>

                        {/* Diners Club */}
                        <span className="text-[11px] font-bold" style={{ color: "#0079BE" }}>
                            Diners Club
                        </span>

                        {/* JCB */}
                        <span className="text-[12px] font-black italic" style={{ color: "#0B4EA2" }}>
                            JCB
                        </span>

                        {/* Efecty */}
                        <span className="text-[13px] font-black italic" style={{ color: "#E30613" }}>
                            efecty
                        </span>

                        {/* Bancolombia */}
                        <span
                            className="text-[11px] font-bold"
                            style={{ color: "#FFCC00", WebkitTextStroke: "0.5px #1A1A1A" }}
                        >
                            Bancolombia
                        </span>

                        {/* Nequi */}
                        <span className="text-[14px] font-black italic" style={{ color: "#DB0270" }}>
                            nequi
                        </span>

                        {/* DaviPlata */}
                        <span className="text-[10px] font-bold" style={{ color: "#EE1C25" }}>
                            DaviPlata
                        </span>
                    </div>

                    <div className="flex justify-between mt-5 pt-4 border-t border-[#f0e8e9] text-[11px] text-[#887b81]">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Datos protegidos
                        </span>
                        <strong className="text-[#2E2E2E]">Hasta 12 cuotas*</strong>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
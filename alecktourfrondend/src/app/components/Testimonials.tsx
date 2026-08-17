import { PlaneTakeoff, Quote, Star } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

const testimonials = [
    {
        name: "Laura Gómez",
        location: "Cartagena, Colombia",
        quote:
            "Todo fue perfecto, desde la reserva hasta el regreso. La atención y los detalles hacen la diferencia.",
        rating: 5,
        avatar:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "Daniel Ortega",
        location: "Bogotá, Colombia",
        quote:
            "Con AleckTours encontré el mejor precio y una asesoría increíble para mi viaje a Europa.",
        rating: 5,
        avatar:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    },
    {
        name: "María Camila Ruiz",
        location: "Medellín, Colombia",
        quote:
            "Viaje en familia a Cancún y todo estuvo organizado al detalle. ¡Repetiremos seguro!",
        rating: 5,
        avatar:
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
];

export default function Testimonials() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-3"
            >
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-px w-8 bg-[#C9A227]" />
                        <span className="text-[#7B1E3A] text-[11px] font-bold uppercase tracking-[0.2em]">
                            Lo que dicen nuestros viajeros
                        </span>
                    </div>
                    <h2
                        className="text-2xl md:text-3xl text-[#2E2E2E]"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                    >
                        Historias que inspiran
                    </h2>
                </div>
                <Link
                    to="/testimonios"
                    className="flex items-center gap-1.5 text-[#7B1E3A] text-sm font-semibold hover:gap-2.5 transition-all"
                >
                    Ver más testimonios
                </Link>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
                {/* Testimonios */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-5">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-60px" }}
                            transition={{ delay: i * 0.1, duration: 0.5 }}
                            className="bg-white rounded-2xl p-5 border border-[#7B1E3A]/8"
                            style={{ boxShadow: "0 2px 12px rgba(123,30,58,0.06)" }}
                        >
                            <Quote className="w-5 h-5 text-[#C9A227] mb-3" />
                            <p className="text-[#4a4a4a] text-sm leading-relaxed mb-5">
                                "{t.quote}"
                            </p>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
                                    style={{ backgroundImage: `url(${t.avatar})` }}
                                />
                                <div>
                                    <div className="flex items-center gap-0.5 mb-0.5">
                                        {Array.from({ length: t.rating }, (_, i) => (
                                            <Star
                                                key={i}
                                                className="w-3 h-3 fill-[#C9A227] text-[#C9A227]"
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[#2E2E2E] text-sm font-semibold leading-tight">
                                        {t.name}
                                    </p>
                                    <p className="text-[#9b9b9b] text-xs">{t.location}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA Grupos */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.5 }}
                    className="rounded-2xl p-6 flex flex-col justify-between bg-[#f6eef0] border border-[#7B1E3A]/10"
                >
                    <div>
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center mb-4">
                            <PlaneTakeoff className="w-5 h-5 text-[#7B1E3A]" />
                        </div>
                        <h3
                            className="text-lg text-[#2E2E2E] mb-2"
                            style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                        >
                            ¿Tienes un grupo?
                        </h3>
                        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-5">
                            Recibe tarifas especiales para grupos y eventos.
                        </p>
                    </div>
                    <Link
                        to="/grupos"
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl bg-[#7B1E3A] text-white text-sm font-bold hover:-translate-y-0.5 transition-transform"
                    >
                        Cotizar ahora
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}
import { ArrowUpRight, Star } from "lucide-react";
import { motion } from "motion/react";

const destinations = [
    {
        name: "Cartagena de Indias",
        tag: "Hotel boutique colonial",
        img: "https://images.unsplash.com/photo-1583531352515-8884af319dc1?q=80&w=1400&auto=format&fit=crop",
        rating: 4.8,
        price: "458.300",
        nights: "3 noches · 2 adultos",
    },
    {
        name: "San Andrés",
        tag: "Todo incluido frente al mar",
        img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1400&auto=format&fit=crop",
        rating: 4.6,
        price: "1.302.875",
        nights: "5 noches · 2 adultos",
    },
    {
        name: "Eje Cafetero",
        tag: "Finca con vista a las montañas",
        img: "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?q=80&w=1400&auto=format&fit=crop",
        rating: 4.9,
        price: "786.941",
        nights: "4 noches · 2 adultos",
    },
    {
        name: "Santa Marta",
        tag: "Resort con acceso a playa privada",
        img: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?q=80&w=1400&auto=format&fit=crop",
        rating: 4.7,
        price: "453.354",
        nights: "3 noches · 2 adultos",
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    }),
};

export default function DestinationsGrid() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 md:pt-36 pb-20">
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4"
            >
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <span className="h-px w-8 bg-[#C9A227]" />
                        <span className="text-[#7B1E3A] text-xs font-semibold uppercase tracking-[0.2em]">
                            Selección de la casa
                        </span>
                    </div>
                    <h2
                        className="text-3xl md:text-4xl text-[#2E2E2E]"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                    >
                        Destinos que enamoran
                    </h2>
                </div>
                <p className="text-[#6b6b6b] max-w-sm leading-relaxed">
                    Cada hospedaje pasa por nuestra curaduría antes de llegar a esta lista. Calidad antes que cantidad.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {destinations.map((d, i) => (
                    <motion.article
                        key={d.name}
                        custom={i}
                        variants={cardVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-60px" }}
                        whileHover={{ y: -6 }}
                        className="group bg-white rounded-3xl overflow-hidden border border-[#7B1E3A]/8 cursor-pointer"
                        style={{ boxShadow: "0 2px 12px rgba(123,30,58,0.06)" }}
                    >
                        <div className="relative h-48 overflow-hidden">
                            <img
                                src={d.img}
                                alt={d.name}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                            <div className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowUpRight className="w-4 h-4 text-[#7B1E3A]" />
                            </div>
                            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full">
                                <Star className="w-3.5 h-3.5 fill-[#C9A227] text-[#C9A227]" />
                                <span className="text-xs font-semibold text-[#2E2E2E]">{d.rating}</span>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="text-[#2E2E2E] font-semibold text-[17px] mb-1">{d.name}</h3>
                            <p className="text-[#6b6b6b] text-sm mb-4">{d.tag}</p>

                            <div className="flex items-end justify-between pt-4 border-t border-[#7B1E3A]/8">
                                <div>
                                    <p className="text-[11px] text-[#9b9b9b] mb-0.5">{d.nights}</p>
                                    <p className="text-[#7B1E3A] font-bold text-lg leading-none">
                                        ${d.price}
                                        <span className="text-[#9b9b9b] text-xs font-normal"> COP</span>
                                    </p>
                                </div>
                                <span className="text-[#C9A227] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                    Ver más
                                </span>
                            </div>
                        </div>
                    </motion.article>
                ))}
            </div>
        </section>
    );
}
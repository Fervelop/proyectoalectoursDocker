import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Link } from "react-router";

const offers = [
    {
        title: "Cancún Todo Incluido",
        tag: "Vuelo + Hotel + Traslados",
        discount: "-30%",
        price: "2.199.000",
        oldPrice: "3.140.000",
        img: "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?q=80&w=900&auto=format&fit=crop",
    },
    {
        title: "Punta Cana Premium",
        tag: "Vuelo + Hotel + Todo incluido",
        discount: "-25%",
        price: "2.499.000",
        oldPrice: "3.299.000",
        img: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=900&auto=format&fit=crop",
    },
    {
        title: "Europa Esencial",
        tag: "Vuelo + Alojamiento",
        discount: "-15%",
        price: "4.299.000",
        oldPrice: "5.099.000",
        img: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?q=80&w=900&auto=format&fit=crop",
    },
];

export default function OffersHighlight() {
    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-background transition-colors duration-300">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-3">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        {/* Usamos el dorado de tu variable --chart-2 */}
                        <span className="h-px w-8 bg-[var(--chart-2)]" />
                        <span className="text-primary text-[11px] font-bold uppercase tracking-[0.2em]">
                            Ofertas destacadas
                        </span>
                    </div>
                    <h2
                        className="text-2xl md:text-3xl text-foreground font-medium"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        Viaja más, paga menos
                    </h2>
                </div>
                <Link
                    to="/search"
                    className="flex items-center gap-1.5 text-primary text-sm font-semibold hover:gap-2.5 hover:text-primary/80 transition-all"
                >
                    Ver todas las ofertas
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {offers.map((o, i) => (
                    <motion.div
                        key={o.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-60px" }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer"
                    >
                        <img
                            src={o.img}
                            alt={o.title}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        {/* Se mantiene el gradiente negro para legibilidad sobre la foto */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />

                        {/* Etiqueta con el dorado de --chart-2 y texto oscuro para contraste */}
                        <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-[var(--chart-2)] text-[#513b12] text-[11px] font-black shadow-sm">
                            {o.discount}
                        </span>

                        <div className="absolute bottom-4 left-4 right-4 text-white">
                            <h3
                                className="text-lg mb-0.5 font-bold"
                                style={{ fontFamily: "'Fraunces', serif" }}
                            >
                                {o.title}
                            </h3>
                            <p className="text-white/75 text-xs mb-2">{o.tag}</p>
                            <p className="text-sm">
                                Desde <b className="text-[var(--chart-2)]">${o.price}</b>{" "}
                                <span className="line-through text-white/50 text-xs">${o.oldPrice}</span>
                            </p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
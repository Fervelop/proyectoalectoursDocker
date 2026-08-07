import { ArrowRight, Mail } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function Newsletter() {
    const [email, setEmail] = useState("");

    return (
        <section className="relative overflow-hidden bg-[#2E2E2E]">
            <div
                className="absolute inset-0 opacity-[0.07]"
                style={{
                    backgroundImage:
                        "radial-gradient(circle at 20% 20%, #C9A227 0, transparent 45%), radial-gradient(circle at 80% 80%, #7B1E3A 0, transparent 45%)",
                }}
            />
            <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{ duration: 0.6 }}
                >
                    <Mail className="w-7 h-7 text-[#C9A227] mx-auto mb-5" strokeWidth={1.5} />
                    <h2
                        className="text-white text-2xl md:text-3xl mb-3"
                        style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                    >
                        Ofertas que no salen en ningún otro lado
                    </h2>
                    <p className="text-white/60 mb-8 max-w-md mx-auto">
                        Súmate a la lista y recibe descuentos exclusivos antes que nadie.
                    </p>

                    <form
                        onSubmit={(e) => e.preventDefault()}
                        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                    >
                        <input
                            type="email"
                            required
                            placeholder="tucorreo@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 px-5 py-3.5 rounded-full bg-white/8 border border-white/15 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C9A227] transition-colors"
                        />
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            type="submit"
                            className="px-6 py-3.5 rounded-full bg-[#C9A227] text-[#2E2E2E] font-semibold flex items-center justify-center gap-2 hover:bg-[#dbb432] transition-colors"
                        >
                            Suscribirme
                            <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    </form>
                </motion.div>
            </div>
        </section>
    );
}
import { Facebook, Instagram, Mail, MapPin, Phone, Plane, Twitter } from "lucide-react";
import { Link } from "react-router";

const columns = [
    {
        title: "AlekTours",
        links: [
            { label: "Quiénes somos", to: "/" },
            { label: "Sostenibilidad", to: "/sustainability" },
        ],
    },
    {
        title: "Ayuda",
        links: [
            { label: "Centro de ayuda", to: "/faq" },
            { label: "Cómo reservar", to: "/travel-info" },
            { label: "Cambios y cancelaciones", to: "/policies" },
            { label: "Contáctanos", to: "/contact" },
        ],
    },
    {
        title: "Para empresas",
        links: [
            { label: "Convenios corporativos", to: "/corporate" },
            { label: "Viajes de grupo", to: "/groups" },
            { label: "Programa de puntos", to: "/benefits" },
        ],
    },
];

export default function Footer() {
    return (
        <footer className="bg-white border-t border-[#7B1E3A]/10">
            {/* Gold hairline */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-[#C9A227]/50 to-transparent" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
                    {/* Brand column */}
                    <div className="md:col-span-4">
                        <Link to="/" className="flex items-center gap-3 mb-5 w-fit">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center"
                                style={{ background: "linear-gradient(135deg, #7B1E3A 0%, #A13B55 100%)" }}
                            >
                                <Plane className="w-[18px] h-[18px] text-white" />
                            </div>
                            <span
                                className="text-xl text-[#2E2E2E]"
                                style={{ fontFamily: "'Fraunces', serif", fontWeight: 600 }}
                            >
                                Alek<span className="text-[#7B1E3A]">Tours</span>
                            </span>
                        </Link>
                        <p className="text-[#6b6b6b] text-sm leading-relaxed mb-6 max-w-xs">
                            Diseñamos viajes con la misma atención al detalle con la que tú
                            eliges cada destino. Desde Colombia para el mundo.
                        </p>
                        <div className="flex flex-col gap-2.5 text-sm text-[#6b6b6b]">
                            <div className="flex items-center gap-2.5">
                                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0" />
                                <span>Bogotá, Colombia</span>
                            </div>
                           
                            
                        </div>
                    </div>

                    {/* Link columns */}
                    <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        {columns.map((col) => (
                            <div key={col.title}>
                                <h4 className="text-[#2E2E2E] font-semibold text-sm uppercase tracking-wide mb-4">
                                    {col.title}
                                </h4>
                                <ul className="flex flex-col gap-3">
                                    {col.links.map((link) => (
                                        <li key={link.label}>
                                            <Link
                                                to={link.to}
                                                className="text-[#6b6b6b] text-sm hover:text-[#7B1E3A] transition-colors"
                                            >
                                                {link.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="pt-8 border-t border-[#7B1E3A]/8 flex flex-col sm:flex-row items-center justify-between gap-5">
                    <div className="flex items-center gap-4">


                    </div>

                    <p className="text-[#9b9b9b] text-xs text-center order-last sm:order-none">
                        © {new Date().getFullYear()} AleckTours S.A.S. Todos los derechos reservados.
                    </p>

                    <div className="flex items-center gap-3">
                        {[Instagram, Facebook, Twitter].map((Icon, i) => (
                            <a
                                key={i}
                                href="#"
                                className="w-9 h-9 rounded-full border border-[#7B1E3A]/15 flex items-center justify-center text-[#7B1E3A] hover:bg-[#7B1E3A] hover:text-white hover:border-[#7B1E3A] transition-colors duration-200"
                            >
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
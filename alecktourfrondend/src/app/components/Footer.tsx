import { Plane } from "lucide-react";
import { Link } from "react-router"; // Asumiendo React Router v7 según tu import

export default function Footer() {
    const footerLinks = {
        empresa: [
            { name: "Inicio", href: "/" },
            { name: "Viajes Corporativos", href: "/corporate" },
            { name: "AlecTours Rewards", href: "/benefits" },
            { name: "Contacto", href: "/contact" },
        ],
        soporte: [
            { name: "Preguntas Frecuentes", href: "/faq" },
            { name: "Información de Viaje", href: "/travel-info" },
            { name: "Buscar Destinos", href: "/search" },
        ],
        cuenta: [
            { name: "Mi Perfil", href: "/profile" },

            { name: "Preferencias de Viaje", href: "/preferences" },
        ],
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-card border-t border-border pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Column */}
                    <div className="col-span-1 lg:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-6 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
                                <Plane className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                                AlecTours
                            </span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                            Descubre el mundo con confianza. Ofrecemos las mejores experiencias de viaje personalizadas y seguras para ti.
                        </p>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h3 className="font-bold text-foreground mb-6">Empresa</h3>
                        <ul className="space-y-4">
                            {footerLinks.empresa.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-6">Ayuda e Información</h3>
                        <ul className="space-y-4">
                            {footerLinks.soporte.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-6">Mi Cuenta</h3>
                        <ul className="space-y-4">
                            {footerLinks.cuenta.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-muted-foreground hover:text-primary transition-colors text-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-muted-foreground text-sm text-center md:text-left">
                        © {currentYear} AlecTours. Todos los derechos reservados.
                    </p>
                    <div className="flex gap-6 text-sm">
                        <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                            Términos y Condiciones
                        </Link>
                        <Link to="/faq" className="text-muted-foreground hover:text-primary transition-colors">
                            Política de Privacidad
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
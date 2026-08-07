import { useEffect } from "react";

interface TerminosModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function TerminosModal({ isOpen, onClose }: TerminosModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-card text-card-foreground rounded-lg shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden border border-border"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header Granate Agencia ── */}
                <div className="flex items-center justify-between px-6 py-4 bg-primary text-primary-foreground">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/10 backdrop-blur-md rounded-md p-2 border border-white/10">
                            <svg className="w-5 h-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-primary-foreground font-medium text-lg leading-tight">Términos y Condiciones</h2>
                            <p className="text-primary-foreground/70 text-xs">AleckTours — Última actualización: junio 2025</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/10 hover:bg-white/20 text-primary-foreground rounded-md p-2 transition-all duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* ── Contenido Semántico ── */}
                <div className="overflow-y-auto px-6 py-5 flex-1 text-sm text-foreground/90 space-y-5 bg-card">

                    <Section title="1. Aceptación de los términos">
                        Al registrarte y utilizar los servicios de <strong className="text-foreground font-bold">AleckTours</strong>, aceptas cumplir con estos Términos y
                        Condiciones. Si no estás de acuerdo con alguna parte, te pedimos que no uses nuestra plataforma.
                    </Section>

                    <Section title="2. Uso del servicio">
                        AleckTours te permite buscar, comparar y reservar destinos y paquetes turísticos. El uso de la plataforma
                        está destinado exclusivamente a fines personales y no comerciales. Queda prohibido:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-muted-foreground">
                            <li>Usar la plataforma con fines fraudulentos o ilegales.</li>
                            <li>Compartir credenciales de acceso con terceros.</li>
                            <li>Reproducir o redistribuir contenido sin autorización.</li>
                        </ul>
                    </Section>

                    <Section title="3. Reservas y pagos">
                        Las reservas realizadas a través de AleckTours están sujetas a disponibilidad. Los precios pueden variar
                        según la temporada y disponibilidad. Al confirmar una reserva, aceptas el cargo total indicado al momento
                        del pago.
                    </Section>

                    <Section title="4. Cancelaciones y reembolsos">
                        Las políticas de cancelación varían según el proveedor del servicio. AleckTours gestionará las solicitudes
                        de cancelación, pero no garantiza reembolsos automáticos. Te recomendamos revisar las condiciones
                        específicas de cada reserva antes de confirmar.
                    </Section>

                    <Section title="5. Programa de puntos AleckTours Rewards">
                        Los puntos acumulados a través del programa de fidelidad son propiedad de AleckTours y pueden ser
                        modificados o cancelados en cualquier momento. No tienen valor monetario fuera de la plataforma y no son
                        transferibles.
                    </Section>

                    <Section title="6. Limitación de responsabilidad">
                        AleckTours actúa como intermediario entre el usuario y los proveedores de servicios turísticos. No nos
                        hacemos responsables por cancelaciones, cambios o inconvenientes causados directamente por aerolíneas,
                        hoteles u otros proveedores.
                    </Section>

                    <Section title="7. Modificaciones">
                        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados
                        a través de la plataforma y entrarán en vigor al momento de su publicación.
                    </Section>

                    <Section title="8. Contacto">
                        Si tienes dudas sobre estos términos, puedes contactarnos en{" "}
                        <a href="mailto:soporte@alecktours.com" className="text-primary hover:underline font-bold transition-colors">
                            soporte@alecktours.com
                        </a>.
                    </Section>
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 border-t border-border flex justify-end bg-muted/30">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground transition-all duration-200 hover:opacity-95 active:scale-95 shadow-sm"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1">
            <h3 className="font-medium text-foreground text-base">
                {title}
            </h3>
            <div className="text-muted-foreground leading-relaxed">
                {children}
            </div>
        </div>
    );
}
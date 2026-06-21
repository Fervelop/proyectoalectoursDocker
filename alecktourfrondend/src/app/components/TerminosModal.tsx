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
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div
                    className="flex items-center justify-between px-6 py-4"
                    style={{ background: "linear-gradient(135deg, #F97316 0%, #FBBF24 100%)" }}
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-white bg-opacity-20 rounded-xl p-2">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-tight">Términos y Condiciones</h2>
                            <p className="text-orange-100 text-xs">AleckTours — Última actualización: junio 2025</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-xl p-2 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto px-6 py-5 flex-1 text-sm text-gray-700 space-y-5">

                    <Section title="1. Aceptación de los términos">
                        Al registrarte y utilizar los servicios de <strong>AleckTours</strong>, aceptas cumplir con estos Términos y
                        Condiciones. Si no estás de acuerdo con alguna parte, te pedimos que no uses nuestra plataforma.
                    </Section>

                    <Section title="2. Uso del servicio">
                        AleckTours te permite buscar, comparar y reservar destinos y paquetes turísticos. El uso de la plataforma
                        está destinado exclusivamente a fines personales y no comerciales. Queda prohibido:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
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
                        <a href="mailto:soporte@alecktours.com" className="text-orange-500 hover:underline font-medium">
                            soporte@alecktours.com
                        </a>.
                    </Section>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
                        style={{ background: "linear-gradient(135deg, #F97316 0%, #FBBF24 100%)" }}
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
        <div>
            <h3 className="font-semibold text-gray-900 mb-1" style={{ color: "#1a1a1a" }}>
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{children}</p>
        </div>
    );
}

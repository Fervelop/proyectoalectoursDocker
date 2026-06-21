import { useEffect } from "react";

interface PrivacidadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function PrivacidadModal({ isOpen, onClose }: PrivacidadModalProps) {
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
                                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-white font-bold text-lg leading-tight">Política de Privacidad</h2>
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

                    <Section title="1. Información que recopilamos">
                        Al registrarte en <strong>AleckTours</strong>, recopilamos información personal como tu nombre, correo
                        electrónico, número de teléfono y datos de pago. También recopilamos datos de uso de la plataforma para
                        mejorar tu experiencia.
                    </Section>

                    <Section title="2. Uso de la información">
                        Utilizamos tu información para:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-600">
                            <li>Procesar y confirmar tus reservas.</li>
                            <li>Enviarte notificaciones sobre tus viajes y ofertas personalizadas.</li>
                            <li>Gestionar tu cuenta y el programa AleckTours Rewards.</li>
                            <li>Mejorar nuestros servicios mediante análisis de uso.</li>
                        </ul>
                    </Section>

                    <Section title="3. Compartir información con terceros">
                        AleckTours no vende ni arrienda tu información personal a terceros. Solo compartimos datos con
                        proveedores de servicios turísticos (aerolíneas, hoteles, etc.) en la medida necesaria para completar
                        tu reserva, y con plataformas de pago seguras para procesar transacciones.
                    </Section>

                    <Section title="4. Cookies y tecnologías de seguimiento">
                        Usamos cookies propias y de terceros para recordar tus preferencias, mantener tu sesión activa y
                        analizar el comportamiento dentro de la plataforma. Puedes gestionar las cookies desde la configuración
                        de tu navegador.
                    </Section>

                    <Section title="5. Seguridad de los datos">
                        Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra accesos
                        no autorizados, pérdida o alteración. Sin embargo, ningún sistema es 100% infalible; te recomendamos
                        usar contraseñas seguras y no compartirlas.
                    </Section>

                    <Section title="6. Tus derechos">
                        Tienes derecho a acceder, corregir o eliminar tus datos personales en cualquier momento. Para ejercer
                        estos derechos, escríbenos a{" "}
                        <a href="mailto:privacidad@alecktours.com" className="text-orange-500 hover:underline font-medium">
                            privacidad@alecktours.com
                        </a>{" "}
                        y gestionaremos tu solicitud en un plazo de 15 días hábiles.
                    </Section>

                    <Section title="7. Retención de datos">
                        Conservamos tu información mientras tu cuenta esté activa o sea necesaria para prestarte el servicio.
                        Si eliminas tu cuenta, borraremos o anonimizaremos tus datos, salvo que la ley nos obligue a
                        conservarlos por un período determinado.
                    </Section>

                    <Section title="8. Cambios en esta política">
                        Podemos actualizar esta política periódicamente. Te notificaremos cualquier cambio relevante mediante
                        un aviso en la plataforma o por correo electrónico. El uso continuado de AleckTours tras los cambios
                        implica tu aceptación.
                    </Section>

                    <Section title="9. Contacto">
                        Para cualquier consulta sobre privacidad, contáctanos en{" "}
                        <a href="mailto:privacidad@alecktours.com" className="text-orange-500 hover:underline font-medium">
                            privacidad@alecktours.com
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
            <h3 className="font-semibold text-gray-900 mb-1">
                {title}
            </h3>
            <p className="text-gray-600 leading-relaxed">{children}</p>
        </div>
    );
}

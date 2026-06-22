import {
  Clock, Coffee, Compass, CreditCard, Heart, MapPin,
  Mountain, Music, Palmtree,
  PenSquare,
  Plane, User, Utensils
} from "lucide-react";
import { Link } from "react-router";

// ── Mapeos de Negocio ──────────────────────────────────────────────────────
const interesIcons: Record<string, any> = {
  beach: Palmtree,
  nature: Mountain,
  culture: Music,
  food: Utensils,
  adventure: Compass,
  wellness: Coffee,
};

const interesLabels: Record<string, string> = {
  beach: "Playa y Relax",
  nature: "Naturaleza",
  culture: "Cultura",
  food: "Gastronomía",
  adventure: "Aventura",
  wellness: "Bienestar",
};

interface Props { preferencias: any; }

export default function TabPreferencias({ preferencias }: Props) {
  return (
    <>
      {/* ── Header de Sección ── */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight text-white">Mis Preferencias</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Así personalizamos tu experiencia y recomendaciones de viaje</p>
        </div>
        <Link
          to="/preferences"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-95 transition-all shadow-sm shrink-0"
        >
          <PenSquare className="w-4 h-4" />
          <span>{preferencias ? "Editar perfil" : "Completar"}</span>
        </Link>
      </div>

      {/* ── Estado Vacío (Sin Preferencias) ── */}
      {!preferencias ? (
        <div className="bg-card text-card-foreground border border-border rounded-xl p-12 text-center shadow-sm max-w-2xl mx-auto transition-colors duration-200">
          <div className="w-16 h-16 bg-primary/5 border border-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground tracking-tight">Sin preferencias guardadas</h3>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Cuéntanos qué te apasiona para calibrar el motor de sugerencias inteligentes con tus destinos ideales.
          </p>
          <Link
            to="/preferences"
            className="inline-block px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-95 transition-all shadow-sm"
          >
            Configurar preferencias
          </Link>
        </div>
      ) : (
        // ── Vista de Datos Estructurada ──
        <div className="space-y-6">

          {/* Bloque: Intereses Primarios */}
          <div className="bg-card text-card-foreground border border-border rounded-xl p-5 md:p-6 shadow-sm transition-colors duration-200">
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider text-muted-foreground/90 mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-primary" /> Tus intereses principales
            </h3>

            {preferencias.intereses && preferencias.intereses.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {(preferencias.intereses).map((interes: string) => {
                  const Icon = interesIcons[interes] || Compass;
                  return (
                    <div
                      key={interes}
                      className="flex items-center gap-2 px-3.5 py-1.5 bg-primary/5 text-primary rounded-full text-xs font-semibold border border-primary/10 transition-colors"
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{interesLabels[interes] || interes}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic">No has seleccionado intereses específicos aún.</p>
            )}
          </div>

          {/* Bloque: Requerimientos y Parámetros Logísticos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { label: "Compañía de viaje", value: preferencias.compania, icon: User },
              { label: "Presupuesto estimado", value: preferencias.presupuesto, icon: CreditCard },
              { label: "Clima preferido", value: preferencias.clima, icon: MapPin },
              { label: "Ritmo del viaje", value: preferencias.ritmo, icon: Clock },
              { label: "Transporte idóneo", value: preferencias.transporte, icon: Plane },
            ]
              .filter(item => item.value)
              .map(item => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="bg-card text-card-foreground border border-border rounded-xl p-4 flex items-center gap-3.5 shadow-sm transition-colors duration-200"
                  >
                    <div className="w-10 h-10 bg-primary/5 border border-primary/10 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                        {item.label}
                      </span>
                      <p className="font-bold text-foreground text-sm capitalize truncate mt-0.5">
                        {item.value}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>

        </div>
      )}
    </>
  );
}
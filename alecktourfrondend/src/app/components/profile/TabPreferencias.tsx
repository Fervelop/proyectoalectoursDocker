import { Link } from "react-router";
import { Heart, Compass, User, CreditCard, MapPin, Clock, Plane, Palmtree, Mountain, Music, Utensils, Coffee } from "lucide-react";

const interesIcons: Record<string, any> = {
  beach: Palmtree, nature: Mountain, culture: Music,
  food: Utensils, adventure: Compass, wellness: Coffee,
};
const interesLabels: Record<string, string> = {
  beach: "Playa y Relax", nature: "Naturaleza", culture: "Cultura",
  food: "Gastronomía", adventure: "Aventura", wellness: "Bienestar",
};

interface Props { preferencias: any; }

export default function TabPreferencias({ preferencias }: Props) {
  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mis Preferencias</h1>
          <p className="text-gray-500 mt-1">Así personalizamos tu experiencia de viaje</p>
        </div>
        <Link to="/preferences"
          className="px-4 py-2 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all">
          {preferencias ? "Editar" : "Completar"}
        </Link>
      </div>

      {!preferencias ? (
        <div className="bg-white rounded-2xl shadow p-12 text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin preferencias guardadas</h3>
          <p className="text-gray-500 mb-6">Cuéntanos qué te gusta para recomendarte los mejores destinos.</p>
          <Link to="/preferences" className="inline-block px-6 py-3 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white rounded-xl hover:shadow-xl transition-all">
            Completar preferencias
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#FF6B35]" /> Tus intereses
            </h3>
            <div className="flex flex-wrap gap-3">
              {(preferencias.intereses || []).map((interes: string) => {
                const Icon = interesIcons[interes] || Compass;
                return (
                  <div key={interes} className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-[#2563EB] rounded-full text-sm font-medium border border-blue-100">
                    <Icon className="w-4 h-4" />
                    {interesLabels[interes] || interes}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {[
  { label: "Compañía de viaje", value: preferencias.compania, icon: User },
  { label: "Presupuesto", value: preferencias.presupuesto, icon: CreditCard },
  { label: "Clima preferido", value: preferencias.clima, icon: MapPin },
  { label: "Ritmo del viaje", value: preferencias.ritmo, icon: Clock },
  { label: "Transporte", value: preferencias.transporte, icon: Plane },
].filter(item => item.value).map(item => (
  <div key={item.label} className="bg-white rounded-2xl shadow p-5 flex items-center gap-4">
    <div className="w-12 h-12 bg-gradient-to-br from-[#2563EB] to-[#06B6D4] rounded-xl flex items-center justify-center shrink-0">
      <item.icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-xs text-gray-500">{item.label}</p>
      <p className="font-semibold text-gray-900 capitalize">{item.value}</p>
    </div>
  </div>
))}
          </div>
        </div>
      )}
    </>
  );
}
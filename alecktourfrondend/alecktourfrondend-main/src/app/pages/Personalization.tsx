import { useParams } from "react-router";
import { useState } from "react";
import Navbar from "../components/Navbar";
import { packages } from "../data/packages";
import { Sparkles, CheckCircle, Info } from "lucide-react";

type EntertainmentClass = "classA" | "classB" | "classC";

export default function Personalization() {
  const { id } = useParams();
  const pkg = packages.find((p) => p.id === id);
  const [selectedClass, setSelectedClass] = useState<EntertainmentClass>("classB");
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Paquete no encontrado</h1>
        </div>
      </div>
    );
  }

  const classInfo = {
    classA: {
      label: "Clase Premium",
      description: "Experiencias exclusivas y VIP",
      color: "from-[#F59E0B] to-[#D97706]",
      borderColor: "border-[#F59E0B]",
      bgColor: "bg-orange-50",
    },
    classB: {
      label: "Clase Confort",
      description: "El balance perfecto",
      color: "from-[#2563EB] to-[#06B6D4]",
      borderColor: "border-[#2563EB]",
      bgColor: "bg-blue-50",
    },
    classC: {
      label: "Clase Esencial",
      description: "Lo mejor al mejor precio",
      color: "from-[#06B6D4] to-[#2563EB]",
      borderColor: "border-[#06B6D4]",
      bgColor: "bg-cyan-50",
    },
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities((prev) =>
      prev.includes(activity)
        ? prev.filter((a) => a !== activity)
        : [...prev, activity]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-[#F59E0B]" />
            <h1 className="text-4xl font-bold text-gray-900">
              Personaliza tu experiencia
            </h1>
          </div>
          <p className="text-xl text-gray-600">
            Selecciona las actividades que deseas incluir en tu viaje a{" "}
            <span className="font-semibold text-[#2563EB]">
              {pkg.destination}
            </span>
          </p>
        </div>

        {/* Class Selection */}
        <div className="bg-white rounded-2xl shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Elige tu categoría de entretenimiento
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(["classA", "classB", "classC"] as EntertainmentClass[]).map(
              (classType) => (
                <label
                  key={classType}
                  className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all ${
                    selectedClass === classType
                      ? classInfo[classType].borderColor + " shadow-lg"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="class"
                    checked={selectedClass === classType}
                    onChange={() => setSelectedClass(classType)}
                    className="sr-only"
                  />

                  <div className="text-center">
                    <div
                      className={`w-16 h-16 rounded-full bg-gradient-to-br ${classInfo[classType].color} flex items-center justify-center mx-auto mb-4`}
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {classInfo[classType].label}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {classInfo[classType].description}
                    </p>
                  </div>

                  {selectedClass === classType && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-[#2563EB]" />
                    </div>
                  )}
                </label>
              )
            )}
          </div>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-2xl shadow-md p-8">
          <div className="flex items-start gap-3 mb-6">
            <Info className="w-6 h-6 text-[#2563EB] flex-shrink-0 mt-1" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Actividades disponibles -{" "}
                {classInfo[selectedClass].label}
              </h2>
              <p className="text-gray-600">
                Selecciona las actividades que te gustaría realizar durante tu
                viaje
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pkg.entertainment[selectedClass].map((activity, index) => (
              <label
                key={index}
                className={`flex items-start gap-4 p-5 rounded-xl cursor-pointer border-2 transition-all ${
                  selectedActivities.includes(activity)
                    ? classInfo[selectedClass].borderColor +
                      " " +
                      classInfo[selectedClass].bgColor
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedActivities.includes(activity)}
                  onChange={() => toggleActivity(activity)}
                  className="mt-1 w-5 h-5 text-[#2563EB] rounded focus:ring-[#2563EB]"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{activity}</p>
                </div>
                {selectedActivities.includes(activity) && (
                  <CheckCircle className="w-5 h-5 text-[#2563EB] flex-shrink-0" />
                )}
              </label>
            ))}
          </div>

          {/* Summary */}
          {selectedActivities.length > 0 && (
            <div
              className={`mt-8 p-6 rounded-xl ${
                classInfo[selectedClass].bgColor
              }`}
            >
              <h3 className="font-semibold text-gray-900 mb-3">
                Resumen de tu selección
              </h3>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  <strong>Categoría:</strong>{" "}
                  {classInfo[selectedClass].label}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Actividades seleccionadas:</strong>{" "}
                  {selectedActivities.length}
                </p>
                <div className="pt-3 border-t border-gray-300">
                  <ul className="space-y-1">
                    {selectedActivities.map((activity, index) => (
                      <li
                        key={index}
                        className="text-sm text-gray-700 flex items-start gap-2"
                      >
                        <CheckCircle className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 py-4 bg-gradient-to-r from-[#2563EB] to-[#06B6D4] text-white font-semibold rounded-xl hover:shadow-xl transition-all duration-300">
              Guardar preferencias
            </button>
            <button className="px-8 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors">
              Cancelar
            </button>
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                ¿Cómo funciona?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • Puedes cambiar tu selección hasta 7 días antes del viaje
                </li>
                <li>
                  • Algunas actividades pueden tener costo adicional dependiendo de
                  la temporada
                </li>
                <li>
                  • Te contactaremos para coordinar horarios de las actividades
                  seleccionadas
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

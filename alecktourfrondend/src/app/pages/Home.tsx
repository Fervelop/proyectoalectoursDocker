import Footer from "../components/Footer";
import Hero from "../components/Hero";
import HotelCard from "../components/HotelCard";
import Navbar from "../components/Navbar";
import Newsletter from "../components/Newsletter";
import QuickAccessCards from "../components/QuickAccessCards";

// SUPOSICIÓN: Aquí asumo el array que traes desde tu DB. Reemplázalo por tu fetch real/props.
const listaHotelesDesdeDB = [
  {
    id_hotel: 1,
    nombre_hotel: "OZ Hotel Luxury",
    ciudad: "Cartagena",
    pais: "Colombia",
    calificacion: 5,
    correo_electronico: "reservas@ozhotel.com",
    telefono: "3001234567",
    hotel_caracteristicas: [
      { id_caracteristica: 1, disponible: true, caracteristica: { nombre_caracteristica: "Piscina al aire libre" } },
      { id_caracteristica: 2, disponible: true, caracteristica: { nombre_caracteristica: "Spa y masajes" } }
    ],
    habitaciones: [{ estado: "disponible", precio_noche: 268866 }]
  },
  {
    id_hotel: 2,
    nombre_hotel: "Decameron Isleño All Inclusive",
    ciudad: "San Andrés",
    pais: "Colombia",
    calificacion: 4,
    correo_electronico: "isleno@decameron.com",
    telefono: "3007654321",
    hotel_caracteristicas: [
      { id_caracteristica: 3, disponible: true, caracteristica: { nombre_caracteristica: "Restaurante buffet" } },
      { id_caracteristica: 4, disponible: true, caracteristica: { nombre_caracteristica: "Gimnasio" } }
    ],
    habitaciones: [{ estado: "disponible", precio_noche: 1292733 }]
  },
  {
    id_hotel: 3,
    nombre_hotel: "Irotama Lago",
    ciudad: "Santa Marta",
    pais: "Colombia",
    calificacion: 4,
    correo_electronico: "reservas@irotama.com",
    telefono: "3009998881",
    hotel_caracteristicas: [
      { id_caracteristica: 5, disponible: true, caracteristica: { nombre_caracteristica: "Piscina al aire libre" } }
    ],
    habitaciones: [{ estado: "disponible", precio_noche: 433354 }]
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <Navbar />
      <Hero />
      <QuickAccessCards />

      {/* SECCIÓN DE HOTELES DE LA DB */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-4">
        <div className="text-left mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 tracking-tight">
            Alojamientos más populares
          </h2>
          <p className="text-sm text-gray-500">
            Descubre las mejores ofertas recomendadas para ti hoy.
          </p>
        </div>

        {/* Grilla responsiva de 4 columnas idéntica a Despegar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {listaHotelesDesdeDB.map((hotel, index) => (
            <HotelCard
              key={hotel.id_hotel}
              hotel={hotel as any}
              index={index}
            />
          ))}
        </div>
      </main>

      <div className="bg-white">
        <Newsletter />
      </div>

      <Footer />
    </div>
  );
}
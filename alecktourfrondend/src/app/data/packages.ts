export interface TravelPackage {
  id: string;
  destination: string;
  image: string;
  transport: "vuelo" | "bus";
  duration: string;
  price: number;
  rating: number;
  reviews: number;
  description: string;
  included: string[];
  hotel: {
    name: string;
    stars: number;
    amenities: string[];
  };
  transportation: {
    type: string;
    details: string;
  };
  entertainment: {
    classA: string[];
    classB: string[];
    classC: string[];
  };
}

export const packages: TravelPackage[] = [
  {
    id: "1",
    destination: "Cartagena",
    image: "https://images.unsplash.com/photo-1651421977680-1abad0df1a40?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxDYXJ0YWdlbmElMjBDb2xvbWJpYSUyMGJlYWNofGVufDF8fHx8MTc3NDAzNjIyNHww&ixlib=rb-4.1.0&q=80&w=1080",
    transport: "vuelo",
    duration: "5 días / 4 noches",
    price: 1850000,
    rating: 4.8,
    reviews: 324,
    description: "Descubre la magia de Cartagena, la ciudad amurallada más hermosa de Colombia. Playas paradisíacas, historia colonial y gastronomía caribeña te esperan.",
    included: ["Vuelo ida y vuelta", "Hotel 4 estrellas", "Desayunos incluidos", "Tour ciudad amurallada", "Visita Islas del Rosario"],
    hotel: {
      name: "Hotel Caribe Premium",
      stars: 4,
      amenities: ["Piscina", "WiFi", "Spa", "Restaurante", "Bar", "Playa privada"]
    },
    transportation: {
      type: "Vuelo directo",
      details: "Avianca - Salida Bogotá 08:00, retorno 18:00"
    },
    entertainment: {
      classA: ["Tour privado ciudad amurallada", "Cena romántica en restaurante gourmet", "Día completo Islas del Rosario con almuerzo", "Paseo en yate al atardecer"],
      classB: ["Tour grupal ciudad amurallada", "Visita a las murallas", "Tour Islas del Rosario", "Paseo en chiva rumbera"],
      classC: ["Recorrido libre ciudad amurallada", "Visita playa Bocagrande", "Tour caminata histórica"]
    }
  },
  {
    id: "2",
    destination: "San Andrés",
    image: "https://images.unsplash.com/photo-1613806143235-18dd8977615c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxTYW4lMjBBbmRyZXMlMjBpc2xhbmQlMjBDb2xvbWJpYXxlbnwxfHx8fDE3NzQwNTA2Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080",
    transport: "vuelo",
    duration: "4 días / 3 noches",
    price: 2100000,
    rating: 4.9,
    reviews: 412,
    description: "Explora el mar de los siete colores en San Andrés. Snorkel, playas de ensueño y cultura raizal en el Caribe colombiano.",
    included: ["Vuelo ida y vuelta", "Hotel frente al mar", "Desayunos", "Tour Johnny Cay", "Alquiler de carrito de golf"],
    hotel: {
      name: "San Andrés Beach Resort",
      stars: 5,
      amenities: ["Todo incluido", "Piscina infinity", "Deportes acuáticos", "3 Restaurantes", "Spa"]
    },
    transportation: {
      type: "Vuelo directo",
      details: "LATAM - Salida Bogotá 09:30, retorno 16:45"
    },
    entertainment: {
      classA: ["Tour privado Johnny Cay", "Buceo certificado", "Paseo en lancha rápida", "Cena bajo las estrellas"],
      classB: ["Tour Johnny Cay compartido", "Snorkel en arrecife", "Visita acuario", "Tour isla en carrito"],
      classC: ["Playa libre", "Snorkel básico", "Caminata isla"]
    }
  },
  {
    id: "3",
    destination: "Eje Cafetero",
    image: "https://images.unsplash.com/photo-1672851612794-6687bf0bf1a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxFamUlMjBDYWZldGVybyUyMENvbG9tYmlhJTIwY29mZmVlfGVufDF8fHx8MTc3NDA1MDYzMHww&ixlib=rb-4.1.0&q=80&w=1080",
    transport: "bus",
    duration: "3 días / 2 noches",
    price: 980000,
    rating: 4.7,
    reviews: 256,
    description: "Sumérgete en la cultura cafetera colombiana. Paisajes verdes, café de clase mundial y parques temáticos te esperan.",
    included: ["Transporte terrestre", "Hospedaje finca cafetera", "Todas las comidas", "Tour del café", "Entrada parques"],
    hotel: {
      name: "Finca Villa Cafetera",
      stars: 4,
      amenities: ["Vista montañas", "Piscina natural", "Tour café incluido", "Comida típica"]
    },
    transportation: {
      type: "Bus turístico",
      details: "Velotax - Salida Bogotá 07:00, retorno 17:00"
    },
    entertainment: {
      classA: ["Tour café privado VIP", "Parque del Café completo", "Canopy extremo", "Cena gourmet en finca"],
      classB: ["Tour café tradicional", "Parque del Café", "Valle del Cocora", "Visita Salento"],
      classC: ["Recorrido cafetales", "Visita pueblo Salento", "Caminata libre"]
    }
  },
  {
    id: "4",
    destination: "Parque Tayrona",
    image: "https://images.unsplash.com/photo-1635079552384-dd8adecd8a7c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxUYXlyb25hJTIwTmF0aW9uYWwlMjBQYXJrJTIwQ29sb21iaWF8ZW58MXx8fHwxNzc0MDUwNjMwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    transport: "vuelo",
    duration: "4 días / 3 noches",
    price: 1650000,
    rating: 4.9,
    reviews: 389,
    description: "Vive la aventura en el Parque Tayrona. Selva tropical, playas vírgenes y naturaleza salvaje en la costa Caribe.",
    included: ["Vuelo a Santa Marta", "Hospedaje eco-lodge", "Alimentación", "Entrada al parque", "Guía especializado"],
    hotel: {
      name: "Tayrona EcoLodge",
      stars: 3,
      amenities: ["Ecológico", "Playa privada", "Hamacas", "Comida orgánica"]
    },
    transportation: {
      type: "Vuelo + transporte terrestre",
      details: "Avianca a Santa Marta + Jeep al parque"
    },
    entertainment: {
      classA: ["Trekking guiado premium", "Snorkel Bahía Concha", "Tour nocturno naturaleza", "Masaje en playa"],
      classB: ["Trekking guiado estándar", "Visita playas principales", "Observación de aves"],
      classC: ["Trekking libre", "Playa libre", "Caminata autoguiada"]
    }
  },
  {
    id: "5",
    destination: "Bogotá Cultural",
    image: "https://images.unsplash.com/photo-1692489792450-c2b158ce4e35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxCb2dvdGElMjBDb2xvbWJpYSUyMGNpdHl8ZW58MXx8fHwxNzc0MDMzNjI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
    transport: "bus",
    duration: "2 días / 1 noche",
    price: 650000,
    rating: 4.6,
    reviews: 198,
    description: "Descubre la capital colombiana. Museos, gastronomía, Monserrate y la vibrante vida cultural de Bogotá.",
    included: ["Transporte local", "Hotel boutique zona T", "Desayunos", "Tour ciudad", "Entrada museos"],
    hotel: {
      name: "Hotel Casa Boutique",
      stars: 4,
      amenities: ["Zona T", "WiFi premium", "Restaurante", "Terraza"]
    },
    transportation: {
      type: "Transporte incluido",
      details: "Van privada para todos los tours"
    },
    entertainment: {
      classA: ["Tour privado Museo del Oro", "Cena restaurante premiado", "Subida Monserrate teleférico", "Tour graffiti Candelaria"],
      classB: ["Tour Museo del Oro", "Almuerzo típico", "Monserrate", "Caminata Candelaria"],
      classC: ["Museo gratis domingo", "Monserrate caminando", "Tour libre centro"]
    }
  },
  {
    id: "6",
    destination: "Medellín Innovadora",
    image: "https://images.unsplash.com/photo-1633627425472-d07ac65e2a36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxNZWRlbGxpbiUyMENvbG9tYmlhJTIwY2l0eXNjYXBlfGVufDF8fHx8MTc3NDA1MDYzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    transport: "vuelo",
    duration: "3 días / 2 noches",
    price: 1350000,
    rating: 4.8,
    reviews: 301,
    description: "Conoce la ciudad de la eterna primavera. Innovación, cultura paisa y naturaleza urbana en Medellín.",
    included: ["Vuelo ida y vuelta", "Hotel El Poblado", "Desayunos", "Tour Comuna 13", "Metro cable"],
    hotel: {
      name: "Hotel Poblado Plaza",
      stars: 4,
      amenities: ["Piscina", "Gym", "WiFi", "Zona Poblado", "Restaurante"]
    },
    transportation: {
      type: "Vuelo directo",
      details: "Avianca - Salida Bogotá 10:00, retorno 19:00"
    },
    entertainment: {
      classA: ["Tour privado Comuna 13", "Paseo helicóptero ciudad", "Cena Cerro Nutibara", "Visita Guatapé privada"],
      classB: ["Tour Comuna 13", "Metro cable", "Jardín Botánico", "Pueblito Paisa"],
      classC: ["Metro cable", "Caminata Comuna 13", "Parques ciudad"]
    }
  },
  {
    id: "7",
    destination: "Villa de Leyva",
    image: "https://images.unsplash.com/photo-1679245602879-abda77af411d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxWaWxsYSUyMGRlJTIwTGV5dmElMjBDb2xvbWJpYSUyMGNvbG9uaWFsfGVufDF8fHx8MTc3NDA1MDYzMXww&ixlib=rb-4.1.0&q=80&w=1080",
    transport: "bus",
    duration: "2 días / 1 noche",
    price: 750000,
    rating: 4.7,
    reviews: 167,
    description: "Viaja en el tiempo a la época colonial. Arquitectura histórica, astronomía y paisajes únicos en Boyacá.",
    included: ["Transporte terrestre", "Hotel colonial", "Desayunos", "Tour pueblo", "Entrada museos"],
    hotel: {
      name: "Posada Colonial del Centro",
      stars: 3,
      amenities: ["Arquitectura colonial", "Patio central", "WiFi", "Restaurante típico"]
    },
    transportation: {
      type: "Bus turístico",
      details: "Salida Bogotá 08:00, retorno 18:00"
    },
    entertainment: {
      classA: ["Tour privado arqueológico", "Visita viñedo premium", "Observatorio astronómico VIP", "Cena colonial"],
      classB: ["Tour plaza mayor", "Casa Terracota", "Pozos Azules", "Museo paleontológico"],
      classC: ["Caminata pueblo", "Plaza mayor libre", "Museo gratis"]
    }
  },
  {
    id: "8",
    destination: "Caño Cristales",
    image: "https://images.unsplash.com/photo-1516962717882-20ddbf2c7cbf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMHJhaW5ib3clMjByaXZlciUyMG5hdHVyZXxlbnwxfHx8fDE3NzQwNTA2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080",
    transport: "vuelo",
    duration: "4 días / 3 noches",
    price: 2450000,
    rating: 5.0,
    reviews: 145,
    description: "Descubre el río más hermoso del mundo. Colores únicos, naturaleza virgen y una experiencia inolvidable.",
    included: ["Vuelos completos", "Hospedaje La Macarena", "Todas las comidas", "Guía especializado", "Trekking río"],
    hotel: {
      name: "Ecolodge La Macarena",
      stars: 3,
      amenities: ["Vista río", "Comida casera", "Hamacas", "Fogata nocturna"]
    },
    transportation: {
      type: "Vuelo chárter",
      details: "Vuelo Bogotá-La Macarena + transporte local"
    },
    entertainment: {
      classA: ["Trekking exclusivo 3 días", "Guía privado naturalista", "Avistamiento fauna premium", "Fotografía profesional"],
      classB: ["Trekking 2 días completo", "Visita pozos coloridos", "Rápidos del río", "Tour nocturno"],
      classC: ["Trekking 1 día básico", "Visita río principal", "Caminata corta"]
    }
  }
];

'use client';

import { motion } from 'framer-motion';
import { Plane } from 'lucide-react'; // Asegúrate de tener instalado lucide-react

export default function Loader() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background">
            {/* Contenedor del avión con animación de vuelo */}
            <motion.div
                animate={{
                    x: [-20, 20, -20], // Movimiento horizontal suave
                    rotate: [0, 5, -5, 0] // Oscilación sutil
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="text-primary"
            >
                <Plane size={48} strokeWidth={1.5} />
            </motion.div>

            {/* Texto con efecto de desvanecimiento */}
            <motion.p
                initial={{ opacity: 0.5 }}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="mt-6 font-medium text-foreground tracking-widest uppercase text-sm"
            >
                Preparando su viaje...
            </motion.p>
        </div>
    );
}
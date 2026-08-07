import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    // Al cargar, verificar si el sistema ya tiene el modo oscuro activado
    useEffect(() => {
        const isDarkMode = document.documentElement.classList.contains("dark");
        setIsDark(isDarkMode);
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove("dark");
            setIsDark(false);
        } else {
            document.documentElement.classList.add("dark");
            setIsDark(true);
        }
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-accent transition-colors text-foreground"
            aria-label="Cambiar tema"
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
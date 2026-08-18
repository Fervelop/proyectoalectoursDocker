import { Camera, Eye, EyeOff, Lock, User } from "lucide-react";
import { useState } from "react";

export default function TabCuenta() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="w-full max-w-4xl">
      {/* ── Encabezado ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
          Mi Cuenta
        </h1>
        <p className="text-muted-foreground mt-1">
          Información de tu perfil y configuración de seguridad
        </p>
      </div>

      <div className="space-y-8">

        {/* ── SECCIÓN 1: Foto de Perfil ── */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center gap-6">

          {/* Avatar con botón superpuesto */}
          <div className="relative group shrink-0">
            <div className="w-24 h-24 bg-primary/10 rounded-full border-4 border-background flex items-center justify-center shadow-md overflow-hidden">
              <User className="w-10 h-10 text-primary" />
            </div>
            <button
              className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-full border-2 border-card shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer"
              title="Cambiar foto de perfil"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* Textos y botón de acción */}
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold text-foreground">Foto de perfil</h2>
            <p className="text-sm text-muted-foreground mb-4 mt-1 max-w-md">
              Sube una nueva foto para personalizar tu cuenta. Recomendamos usar una imagen cuadrada de al menos 256x256px en formato JPG o PNG.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <button className="text-sm font-semibold bg-background border border-border hover:border-primary/50 hover:text-primary px-5 py-2.5 rounded-full transition-all duration-200 active:scale-95 shadow-sm">
                Subir nueva imagen
              </button>
              <button className="text-sm font-semibold text-destructive hover:text-destructive/80 px-4 py-2.5 transition-colors">
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* ── SECCIÓN 2: Información Personal (Estilo Bento Box) ── */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="bg-background border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                Nombre Completo
              </label>
              <p className="text-base font-bold text-foreground">juanpedro castillo</p>
            </div>

            <div className="bg-background border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                Documento de Identidad / Cédula
              </label>
              <p className="text-base font-bold text-foreground">102300231</p>
            </div>

            <div className="bg-background border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                Correo Electrónico
              </label>
              <p className="text-base font-bold text-foreground">nata12@gmail.com</p>
            </div>

            <div className="bg-background border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                Teléfono Celular
              </label>
              <p className="text-base font-bold text-foreground">32228128</p>
            </div>

            <div className="bg-background border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                Ciudad
              </label>
              <p className="text-base font-bold text-foreground">Manizales</p>
            </div>

            <div className="bg-background border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                País
              </label>
              <p className="text-base font-bold text-foreground">Colombia</p>
            </div>

            <div className="bg-background border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                Dirección de Residencia
              </label>
              <p className="text-base font-bold text-foreground">calle juanito alcachofa</p>
            </div>

            <div className="bg-background border border-border/50 rounded-2xl p-4 hover:border-primary/30 transition-colors">
              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">
                Fecha de Nacimiento
              </label>
              <p className="text-base font-bold text-foreground">31 de diciembre de 1008</p>
            </div>

          </div>
        </div>

        {/* ── SECCIÓN 3: Seguridad de la cuenta ── */}
        <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Seguridad de la cuenta</h2>
          </div>

          <p className="text-sm text-muted-foreground mb-6 ml-13">
            Actualiza tu contraseña de acceso para mantener la cuenta protegida
          </p>

          <div className="space-y-5 max-w-md ml-13">
            {/* Input: Contraseña actual */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Contraseña actual</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Input: Nueva contraseña */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Input: Confirmar nueva contraseña */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Confirmar nueva contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <div className="pt-2">
              <button className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold px-6 py-3 rounded-full hover:bg-primary/90 hover:scale-[0.98] transition-all active:scale-95 shadow-md">
                <Lock className="w-4 h-4" />
                Actualizar contraseña
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
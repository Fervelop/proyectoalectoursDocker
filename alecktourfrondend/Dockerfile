# Imagen base
FROM node:22-alpine

# Carpeta de trabajo
WORKDIR /app

# Instalar pnpm
RUN npm install -g pnpm

# Copiar archivos de dependencias
COPY package.json pnpm-lock.yaml* ./

# Instalar dependencias
RUN pnpm install

# Copiar el resto del proyecto
COPY . .

# Exponer puerto de Vite
EXPOSE 5173

# Ejecutar aplicación
CMD ["pnpm", "dev", "--host"]
# ==============================
# 🧩 Etapa 1: Build de la app
# ==============================
FROM node:20-alpine AS builder

# Instalar pnpm globalmente
RUN npm install -g pnpm

# Crear directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Instalar dependencias con pnpm
RUN pnpm install

# Copiar el resto del código del proyecto
COPY . .

# Compilar la aplicación Next.js
RUN pnpm run build


# ==============================
# 🧱 Etapa 2: Producción
# ==============================
FROM node:20-alpine

# Instalar pnpm globalmente (para ejecutar en producción)
RUN npm install -g pnpm

# Crear directorio de trabajo
WORKDIR /app

# Copiar los archivos necesarios desde el builder
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Exponer el puerto que usa Next.js
EXPOSE 3000

# Comando de inicio (standalone mode)
CMD ["node", "server.js"]

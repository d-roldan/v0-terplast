# Terplast V2 - Sistema de Control de Envasado

Sistema de monitoreo y control para líneas de envasado con indicadores de autonomía en tiempo real.

## Características

- Control de tanques de envasado con estado en tiempo real
- Indicador de autonomía IDEAL vs REAL basado en GPM (Golpes Por Minuto)
- Registro de actividad detallado
- Interfaz responsive y moderna

## Despliegue con Docker

### Requisitos previos

- Docker
- Docker Compose

### Instalación

1. Clona el repositorio:
\`\`\`bash
git clone <tu-repositorio>
cd terplast-v2
\`\`\`

2. Construye y levanta el contenedor:
\`\`\`bash
docker-compose up -d
\`\`\`

3. Accede a la aplicación:
\`\`\`
http://localhost:3001
\`\`\`

### Comandos útiles

\`\`\`bash
# Ver logs
docker-compose logs -f terplast-v2

# Detener el contenedor
docker-compose down

# Reconstruir después de cambios
docker-compose up -d --build
\`\`\`

## Estructura del Proyecto

\`\`\`
terplast-v2/
├── app/                    # Páginas de Next.js
├── components/             # Componentes React
├── hooks/                  # Hooks personalizados
├── lib/                    # Utilidades
├── public/                 # Archivos estáticos
├── Dockerfile              # Configuración Docker
├── docker-compose.yml      # Orquestación Docker
└── package.json            # Dependencias
\`\`\`

## Tecnologías

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui

## Licencia

Privado - Terplast

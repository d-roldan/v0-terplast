# Integración Terplast-V2 a Docker Compose Existente

## Resumen
Esta guía te ayudará a integrar el nuevo contenedor **Terplast-V2** a tu infraestructura Docker existente.

## Estructura del Proyecto

Copia todos los archivos de este proyecto a una nueva carpeta llamada `Terplast-V2` en tu estructura actual:

\`\`\`
tu-proyecto/
├── docker-compose.yml (tu archivo principal)
├── ENVASADO/
├── FABRICACION/
├── LABORATORIO/
├── mosquitto/
├── FrontEnd TERPLAST/ (versión original)
└── Terplast-V2/ (NUEVA CARPETA - copia todo aquí)
    ├── .dockerignore
    ├── Dockerfile
    ├── next.config.mjs
    ├── package.json
    ├── tsconfig.json
    ├── postcss.config.mjs
    ├── components.json
    ├── app/
    ├── components/
    ├── hooks/
    ├── lib/
    └── public/
\`\`\`

## Archivos a Copiar

### ✅ Archivos NECESARIOS:
- `.dockerignore`
- `Dockerfile`
- `next.config.mjs`
- `package.json`
- `tsconfig.json`
- `postcss.config.mjs`
- `components.json`
- `app/` (carpeta completa)
- `components/` (carpeta completa)
- `hooks/` (carpeta completa)
- `lib/` (carpeta completa)
- `public/` (carpeta completa - solo icon.svg y placeholder.svg)

### ❌ Archivos NO NECESARIOS (ya los tienes o no son relevantes):
- `MQTT_DOCUMENTATION.md` (ya tienes mosquitto configurado)
- `MQTT_SETUP_INSTRUCTIONS.md` (ya tienes mosquitto configurado)
- `DOCKER_SETUP.md` (información redundante)
- `docker-compose.yml` (usarás tu archivo principal)
- `docker-compose.terplast-v2.yml` (solo referencia)
- `README.md` (opcional)
- `.env.local` (crear nuevo si es necesario)
- `.gitignore` (opcional)
- `pnpm-lock.yaml` (se generará automáticamente)
- `styles/globals.css` (duplicado de app/globals.css)

## Configuración en tu docker-compose.yml Principal

Agrega este servicio a tu archivo `docker-compose.yml` existente:

\`\`\`yaml
  terplast-v2:
    build:
      context: ./Terplast-V2
      dockerfile: Dockerfile
    container_name: terplast-v2
    ports:
      - "3001:3000"  # Puerto 3001 para no conflictuar con la versión original
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_MQTT_BROKER_URL=ws://mosquitto:9001
    networks:
      - terplast-network  # Usa tu red existente
    restart: unless-stopped
    depends_on:
      - mosquitto
\`\`\`

## Comandos para Desplegar

\`\`\`bash
# 1. Construir la imagen (primera vez o después de cambios)
docker-compose build terplast-v2

# 2. Levantar el contenedor
docker-compose up -d terplast-v2

# 3. Ver logs
docker-compose logs -f terplast-v2

# 4. Detener el contenedor
docker-compose stop terplast-v2

# 5. Eliminar el contenedor
docker-compose down terplast-v2
\`\`\`

## Acceso

Una vez desplegado, accede a la aplicación en:
- **Terplast V2**: http://localhost:3001
- **Terplast Original**: http://localhost:3000 (si lo tienes corriendo)

## Variables de Entorno

Si necesitas variables de entorno adicionales, crea un archivo `.env.local` en la carpeta `Terplast-V2/`:

\`\`\`env
NEXT_PUBLIC_MQTT_BROKER_URL=ws://mosquitto:9001
\`\`\`

## Verificación

Para verificar que todo está funcionando:

\`\`\`bash
# Ver contenedores corriendo
docker ps | grep terplast

# Verificar conectividad con mosquitto
docker exec terplast-v2 ping mosquitto -c 3
\`\`\`

## Notas Importantes

1. **Puerto**: El contenedor expone el puerto 3001 externamente (3000 internamente)
2. **Red**: Debe estar en la misma red que mosquitto para comunicarse
3. **MQTT**: La URL del broker usa el nombre del servicio de mosquitto de tu compose
4. **Persistencia**: No hay volúmenes porque es una app frontend sin estado persistente

## Troubleshooting

Si el contenedor no inicia:
\`\`\`bash
# Ver logs detallados
docker-compose logs terplast-v2

# Reconstruir sin caché
docker-compose build --no-cache terplast-v2
\`\`\`

Si no se conecta a MQTT:
\`\`\`bash
# Verificar que mosquitto esté corriendo
docker ps | grep mosquitto

# Verificar la red
docker network inspect terplast-network

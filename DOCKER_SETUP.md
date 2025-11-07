# Despliegue con Docker

Este proyecto está configurado para desplegarse como contenedor Docker junto con Node-RED y MQTT.

## Requisitos Previos

- Docker instalado
- Docker Compose instalado

## Estructura de Servicios

El `docker-compose.yml` incluye tres servicios:

1. **terplast-app** - Aplicación Next.js (puerto 3000)
2. **mqtt** - Broker MQTT Mosquitto (puerto 1883)
3. **nodered** - Node-RED (puerto 1880)

## Instrucciones de Despliegue

### 1. Si ya tienes Node-RED y MQTT desplegados

Modifica el `docker-compose.yml` para usar tus contenedores existentes:

\`\`\`yaml
version: '3.8'

services:
  terplast-app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: terplast-app
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MQTT_BROKER_URL=mqtt://TU_CONTAINER_MQTT:1883
      - NODERED_URL=http://TU_CONTAINER_NODERED:1880
    networks:
      - TU_RED_EXISTENTE
    restart: unless-stopped

networks:
  TU_RED_EXISTENTE:
    external: true
\`\`\`

### 2. Construir y levantar el contenedor

\`\`\`bash
# Construir la imagen
docker-compose build

# Levantar todos los servicios
docker-compose up -d

# O solo el servicio de la app si ya tienes los otros
docker-compose up -d terplast-app
\`\`\`

### 3. Verificar que está corriendo

\`\`\`bash
# Ver logs
docker-compose logs -f terplast-app

# Ver contenedores activos
docker ps
\`\`\`

### 4. Acceder a la aplicación

- **Aplicación Terplast:** http://localhost:3000
- **Node-RED:** http://localhost:1880
- **MQTT Broker:** mqtt://localhost:1883

## Conectar con Node-RED

### Configuración de WebSocket en Node-RED

1. Instala el nodo `node-red-contrib-websocket-server` en Node-RED
2. Crea un flujo que envíe datos del tanque vía WebSocket

### Ejemplo de flujo Node-RED para enviar datos:

\`\`\`json
[
  {
    "id": "websocket-out",
    "type": "websocket out",
    "name": "Enviar a Terplast",
    "server": "",
    "client": "ws://terplast-app:3000/api/ws",
    "z": "flow-id"
  },
  {
    "id": "mqtt-in",
    "type": "mqtt in",
    "topic": "tanque/peso",
    "broker": "mqtt",
    "z": "flow-id",
    "wires": [["websocket-out"]]
  }
]
\`\`\`

### Formato de datos esperado desde Node-RED:

\`\`\`json
{
  "tankId": "tk6",
  "weight": 25.43,
  "timestamp": "2025-01-21T10:30:00Z"
}
\`\`\`

## Comandos Útiles

\`\`\`bash
# Detener servicios
docker-compose down

# Reiniciar solo la app
docker-compose restart terplast-app

# Ver logs en tiempo real
docker-compose logs -f

# Reconstruir después de cambios
docker-compose up -d --build

# Eliminar todo (incluyendo volúmenes)
docker-compose down -v
\`\`\`

## Variables de Entorno

Puedes crear un archivo `.env` para configurar variables:

\`\`\`env
MQTT_BROKER_URL=mqtt://mqtt:1883
NODERED_URL=http://nodered:1880
PORT=3000
\`\`\`

## Troubleshooting

### La app no se conecta a Node-RED
- Verifica que todos los contenedores estén en la misma red
- Usa los nombres de contenedor, no `localhost`

### Error al construir
- Asegúrate de tener suficiente espacio en disco
- Ejecuta `docker system prune` para limpiar imágenes antiguas

### Cambios no se reflejan
- Reconstruye la imagen: `docker-compose up -d --build`

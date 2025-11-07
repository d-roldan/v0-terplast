# 🚀 Instrucciones de Despliegue con MQTT

## 1. Preparar Estructura de Archivos

Asegúrate de tener esta estructura en tu proyecto:

\`\`\`
proyecto/
├── docker-compose.yml
├── Dockerfile
├── mosquitto/
│   ├── config/
│   │   └── mosquitto.conf
│   ├── data/
│   ├── log/
│   └── passwords/
└── (resto del proyecto Next.js)
\`\`\`

## 2. Crear Directorios de Mosquitto

\`\`\`bash
mkdir -p mosquitto/config
mkdir -p mosquitto/data
mkdir -p mosquitto/log
mkdir -p mosquitto/passwords
\`\`\`

## 3. Configurar Permisos (Linux/Mac)

\`\`\`bash
sudo chown -R 1883:1883 mosquitto/
\`\`\`

## 4. Levantar los Contenedores

\`\`\`bash
# Construir y levantar todo
docker-compose up --build -d

# Ver logs
docker-compose logs -f terplast-frontend
docker-compose logs -f mosquitto
\`\`\`

## 5. Verificar Conexiones

### Verificar que Mosquitto está corriendo:
\`\`\`bash
docker exec -it mqtt_broker mosquitto_sub -t "test" -v
\`\`\`

### Probar publicación desde host:
\`\`\`bash
# Instalar mosquitto-clients si no lo tienes
sudo apt-get install mosquitto-clients

# Publicar un mensaje de prueba
mosquitto_pub -h localhost -p 1884 -t "terplast/tk5/peso_envase" -m '{"peso": 25.12}'
\`\`\`

### Acceder al Frontend:
Abre tu navegador en: **http://localhost:3000**

## 6. Topics MQTT Configurados

### 📥 Node-RED → Frontend (Publicar en estos topics)

**Peso del tanque:**
\`\`\`
Topic: terplast/tk5/peso_tanque
Payload: {"peso": 3385.50}
\`\`\`

**Peso de cada envase:**
\`\`\`
Topic: terplast/tk5/peso_envase
Payload: {"peso": 25.45}
\`\`\`

### 📤 Frontend → Node-RED (Suscribirse a estos topics)

**Comandos de inicio/parada:**
\`\`\`
Topic: terplast/tk5/command
Payloads:
  - {"action":"start","format":"25KG","legajo":"102620","ordenEnvasado":"60121151"}
  - {"action":"stop"}
\`\`\`

**Resúmenes de envasado:**
\`\`\`
Topic: terplast/tk5/summary
Payload: (JSON completo con métricas OEE)
\`\`\`

## 7. Configuración de Node-RED

### Nodo MQTT Out (Para enviar datos al frontend):
- **Server:** `172.29.0.14:1883`
- **Topic:** `terplast/tk5/peso_envase`
- **QoS:** 1
- **Retain:** false

### Nodo MQTT In (Para recibir comandos del frontend):
- **Server:** `172.29.0.14:1883`
- **Topic:** `terplast/+/command` (+ es wildcard)
- **QoS:** 1

## 8. Troubleshooting

### El frontend no conecta a MQTT:
\`\`\`bash
# Verificar que el puerto WebSocket está abierto
docker exec -it mqtt_broker netstat -tuln | grep 9001

# Ver logs de Mosquitto
docker logs mqtt_broker
\`\`\`

### Verificar red Docker:
\`\`\`bash
docker network inspect sintetico_red_sintetico
\`\`\`

### Reiniciar servicios:
\`\`\`bash
# Solo el frontend
docker-compose restart terplast-frontend

# Todo
docker-compose down
docker-compose up -d
\`\`\`

## 9. Comandos Útiles

\`\`\`bash
# Ver logs en tiempo real
docker-compose logs -f terplast-frontend

# Entrar al contenedor del frontend
docker exec -it terplast_frontend sh

# Verificar conectividad MQTT desde el frontend
docker exec -it terplast_frontend ping 172.29.0.14

# Detener todo
docker-compose down

# Limpiar volúmenes y reconstruir
docker-compose down -v
docker-compose up --build -d
\`\`\`

## 10. Seguridad (Opcional)

Para habilitar autenticación en Mosquitto:

\`\`\`bash
# Crear usuario y contraseña
docker exec -it mqtt_broker mosquitto_passwd -c /mosquitto/passwords/passwd usuario1

# Descomentar en mosquitto.conf:
# allow_anonymous false
# password_file /mosquitto/passwords/passwd

# Reiniciar Mosquitto
docker-compose restart mosquitto
\`\`\`

Luego actualizar las variables de entorno en docker-compose.yml:
\`\`\`yaml
- NEXT_PUBLIC_MQTT_USERNAME=usuario1
- NEXT_PUBLIC_MQTT_PASSWORD=tu_password

# Documentación MQTT - Sistema Terplast

## Configuración del Broker

El sistema se conecta a un broker MQTT usando WebSocket. Configurar las siguientes variables de entorno:

\`\`\`env
NEXT_PUBLIC_MQTT_BROKER=ws://localhost:9001
NEXT_PUBLIC_MQTT_USERNAME=usuario (opcional)
NEXT_PUBLIC_MQTT_PASSWORD=contraseña (opcional)
\`\`\`

## Estructura de Topics

### Topics de Entrada (Node-RED → Aplicación)

#### 1. Peso del Tanque
**Topic:** `terplast/{tankId}/peso_tanque`

Actualiza el peso total del tanque en tiempo real.

**Mensaje:**
\`\`\`json
{
  "tankId": "tk5",
  "peso": 3385.5,
  "timestamp": 1704067200000
}
\`\`\`

**Ejemplo Node-RED:**
\`\`\`javascript
msg.topic = "terplast/tk5/peso_tanque";
msg.payload = {
    tankId: "tk5",
    peso: 3385.5,
    timestamp: Date.now()
};
return msg;
\`\`\`

---

#### 2. Peso de Envase Individual
**Topic:** `terplast/{tankId}/peso_envase`

Registra el peso de cada envase que pasa por la línea.

**Mensaje:**
\`\`\`json
{
  "tankId": "tk6",
  "peso": 25.12,
  "numeroEnvase": 125,
  "timestamp": 1704067200000
}
\`\`\`

**Ejemplo Node-RED:**
\`\`\`javascript
msg.topic = "terplast/tk6/peso_envase";
msg.payload = {
    tankId: "tk6",
    peso: 25.12,
    numeroEnvase: 125,
    timestamp: Date.now()
};
return msg;
\`\`\`

**Nota:** El sistema mantiene máximo 100 puntos en la gráfica. Los valores más antiguos se eliminan automáticamente.

---

### Topics de Salida (Aplicación → Node-RED)

#### 3. Comandos de Control
**Topic:** `terplast/{tankId}/comando`

Recibe comandos para iniciar o detener el envasado.

**Mensaje - Iniciar:**
\`\`\`json
{
  "accion": "iniciar",
  "timestamp": 1704067200000,
  "data": {
    "of": "OF-12345",
    "material": "MAT-001",
    "description": "Pintura Blanca",
    "format": "25kg",
    "legajo": "102620",
    "ordenEnvasado": "60121151"
  }
}
\`\`\`

**Mensaje - Detener:**
\`\`\`json
{
  "accion": "detener",
  "timestamp": 1704067200000
}
\`\`\`

**Ejemplo Node-RED (Suscripción):**
\`\`\`javascript
// Suscribirse a comandos de todos los tanques
var tanques = ["tk3", "tk4", "tk5", "tk6"];
tanques.forEach(function(tank) {
    node.subscribe("terplast/" + tank + "/comando");
});

// Manejar mensaje recibido
if (msg.topic.includes("/comando")) {
    var comando = JSON.parse(msg.payload);
    if (comando.accion === "iniciar") {
        // Iniciar proceso de envasado
        node.send({payload: "Iniciando " + msg.topic});
    } else if (comando.accion === "detener") {
        // Detener proceso de envasado
        node.send({payload: "Deteniendo " + msg.topic});
    }
}
\`\`\`

---

#### 4. Resumen de Envasado
**Topic:** `terplast/{tankId}/resumen`

Envía un resumen completo al finalizar cada proceso de envasado con métricas OEE.

**Mensaje:**
\`\`\`json
{
  "tankId": "tk6",
  "legajo": "102620",
  "ordenEnvasado": "60121151",
  "inicio": 1704067200000,
  "fin": 1704070800000,
  "duracionSegundos": 3600,
  "totalEnvases": 313,
  "pesoPromedio": 25.05,
  "pesoMin": 24.85,
  "pesoMax": 25.23,
  "formatoSeleccionado": "25kg",
  "toleranciaMinima": 24.50,
  "toleranciaMaxima": 25.50,
  "envasesOptimos": 280,
  "envasesAlerta": 25,
  "envasesFuera": 8,
  "disponibilidad": 98.5,
  "rendimiento": 95.2,
  "calidad": 89.4,
  "oee": 83.8
}
\`\`\`

**Métricas OEE:**
- **Disponibilidad:** Porcentaje del tiempo que el equipo estuvo operativo
- **Rendimiento:** Eficiencia de producción vs. capacidad teórica
- **Calidad:** Porcentaje de envases dentro de tolerancia óptima
- **OEE:** Overall Equipment Effectiveness (Disponibilidad × Rendimiento × Calidad / 100)

**Ejemplo Node-RED (Suscripción):**
\`\`\`javascript
// Suscribirse a resúmenes
node.subscribe("terplast/+/resumen");

// Procesar resumen recibido
if (msg.topic.includes("/resumen")) {
    var resumen = JSON.parse(msg.payload);
    
    // Guardar en base de datos
    msg.payload = {
        tabla: "envasados",
        datos: resumen
    };
    
    // Enviar notificación si calidad < 90%
    if (resumen.calidad < 90) {
        node.send([null, {
            payload: "Alerta: Calidad baja en " + resumen.tankId,
            resumen: resumen
        }]);
    } else {
        node.send([msg, null]);
    }
}
\`\`\`

---

## Identificadores de Tanques

- `tk3` - Tanque 3 (color amarillo)
- `tk4` - Tanque 4 (color verde)
- `tk5` - Tanque 5 (color morado)
- `tk6` - Tanque 6 (color rosa)

## Formatos de Envasado

Los formatos disponibles y sus pesos nominales:
- `5kg` - 5.0 kg (tolerancia: ±2%)
- `10kg` - 10.0 kg (tolerancia: ±2%)
- `20kg` - 20.0 kg (tolerancia: ±2%)
- `25kg` - 25.0 kg (tolerancia: ±2%)

## Rangos de Tolerancia

Para cada formato, se calculan tres zonas:

**Zona Verde (Óptima):**
- Límite inferior: Peso nominal - (tolerancia × 0.5)
- Límite superior: Peso nominal + (tolerancia × 0.5)

**Zona Amarilla (Alerta):**
- Inferior: Entre (nominal - tolerancia) y (nominal - tolerancia × 0.5)
- Superior: Entre (nominal + tolerancia × 0.5) y (nominal + tolerancia)

**Zona Roja (Fuera de tolerancia):**
- Inferior: < (nominal - tolerancia)
- Superior: > (nominal + tolerancia)

**Ejemplo para 25kg:**
- Verde: 24.75 - 25.25 kg
- Amarilla: 24.50 - 24.75 kg o 25.25 - 25.50 kg
- Roja: < 24.50 kg o > 25.50 kg

## Ejemplos Completos

### Flujo Completo en Node-RED

\`\`\`javascript
// Nodo 1: Simular sensor de peso de tanque
var peso = global.get("peso_tanque") || 3000;
peso += (Math.random() - 0.5) * 100;
global.set("peso_tanque", peso);

msg.topic = "terplast/tk6/peso_tanque";
msg.payload = {
    tankId: "tk6",
    peso: Math.round(peso * 10) / 10,
    timestamp: Date.now()
};
return msg;

// Nodo 2: Simular envasado individual
var contador = global.get("contador") || 0;
contador++;
global.set("contador", contador);

var pesoNominal = 25.0;
var tolerancia = pesoNominal * 0.02;
var pesoEnvase = pesoNominal + (Math.random() * tolerancia * 4 - tolerancia * 2);

msg.topic = "terplast/tk6/peso_envase";
msg.payload = {
    tankId: "tk6",
    peso: Math.round(pesoEnvase * 100) / 100,
    numeroEnvase: contador,
    timestamp: Date.now()
};
return msg;

// Nodo 3: Recibir comandos
var comando = JSON.parse(msg.payload);
if (comando.accion === "iniciar") {
    global.set("contador", 0);
    global.set("envasando", true);
    msg.payload = "Envasado iniciado en " + comando.data.format;
} else {
    global.set("envasando", false);
    msg.payload = "Envasado detenido";
}
return msg;

// Nodo 4: Procesar resumen final
var resumen = JSON.parse(msg.payload);
msg.payload = {
    type: "insert",
    table: "historial_envasados",
    data: {
        tanque: resumen.tankId,
        orden: resumen.ordenEnvasado,
        fecha: new Date(resumen.fin),
        total_envases: resumen.totalEnvases,
        peso_promedio: resumen.pesoPromedio,
        calidad: resumen.calidad,
        oee: resumen.oee
    }
};
return msg;
\`\`\`

## Troubleshooting

### No se conecta al broker
- Verificar que el broker MQTT esté corriendo en `localhost:9001`
- Verificar que el broker tenga habilitado WebSocket
- Revisar las credenciales en `.env.local`

### No llegan los datos
- Verificar que Node-RED esté publicando en los topics correctos
- Usar MQTT Explorer para debuggear mensajes
- Revisar console del navegador (`console.log("[v0] ...")`)

### Los datos no se procesan
- Verificar que el JSON esté bien formado
- Verificar que `tankId` coincida con el formato esperado (`tk3`, `tk4`, `tk5`, `tk6`)
- Verificar que el proceso esté en estado "filling" para procesar envases

## Docker Compose

Para integrar el broker MQTT con tu configuración existente:

\`\`\`yaml
services:
  mosquitto:
    image: eclipse-mosquitto:latest
    ports:
      - "1883:1883"
      - "9001:9001"
    volumes:
      - ./mosquitto/config:/mosquitto/config
      - ./mosquitto/data:/mosquitto/data
      - ./mosquitto/log:/mosquitto/log
    networks:
      - terplast-network

  terplast-app:
    environment:
      - NEXT_PUBLIC_MQTT_BROKER=ws://mosquitto:9001
\`\`\`

Configuración de Mosquitto (`mosquitto/config/mosquitto.conf`):
\`\`\`
listener 1883
listener 9001
protocol websockets
allow_anonymous true

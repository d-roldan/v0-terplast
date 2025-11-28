# Sistema de Control de Envasado TERPLAST

*Sistema de monitoreo y control para tanques de envasado de productos químicos*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/d-roldans-projects/v0-terplast)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/ct56hGOBgk8)

## 📋 Índice

- [Descripción General](#descripción-general)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Componentes Principales](#componentes-principales)
- [Funcionamiento del Sistema](#funcionamiento-del-sistema)
- [Cálculos y Fórmulas](#cálculos-y-fórmulas)
- [Instalación y Deployment](#instalación-y-deployment)
- [Configuración](#configuración)
- [Uso del Sistema](#uso-del-sistema)
- [Estructura de Archivos](#estructura-de-archivos)

---

## 📖 Descripción General

El **Sistema de Control de Envasado TERPLAST** es una aplicación web desarrollada en Next.js que permite monitorear y controlar en tiempo real el proceso de envasado de productos químicos en 4 tanques diferentes: TK3, TK4, TK5 y TK6.

### Características Principales:

- **Monitoreo en tiempo real** de 4 tanques de envasado
- **Simulación realista** del proceso de envasado con cadencia ajustable
- **Cálculo de autonomía** basado en consumo y peso restante
- **Registro de eventos** con historial completo de actividades
- **Gráficas en tiempo real** de pesos con bandas de tolerancia
- **Tres formatos de envase**: 10kg, 20kg y 25kg
- **Interfaz responsive** optimizada para pantallas industriales (1366x768)

---

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico:

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **UI Components**: shadcn/ui (Radix UI)
- **Estilos**: Tailwind CSS v4
- **Gráficas**: Recharts
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React

### Estructura de la Aplicación:

\`\`\`
Sistema TERPLAST
├── Vista Principal (Selector de Tanques)
│   ├── TK3 + TK4 (Vista Dual)
│   ├── TK5 (Vista Individual)
│   └── TK6 (Vista Individual)
├── Vista de Autonomía de Tanques
└── Registro de Actividades
\`\`\`

---

## 🔧 Componentes Principales

### 1. **TankSelector** (`components/tank-selector.tsx`)

Barra lateral de navegación que permite:
- Seleccionar entre diferentes vistas de tanques
- Acceder a la vista de autonomía
- Ver el registro de actividades
- Indicador visual de estado de envasado (punto verde parpadeante)
<img width="96" height="468" alt="image" src="https://github.com/user-attachments/assets/84965b60-edeb-4af1-b8c3-b9a5fd81614f" />

### 2. **TankControl** (`components/tank-control.tsx`)

Componente para control individual de un tanque. Incluye:
- **Visualización del peso actual** del tanque
- **Animación de llenado** de envases con dosificación realista
- **Gráfica de peso vs. tiempo** con bandas de tolerancia (±0.3%)
- **Contador de envases** clasificados por estado:
  - ✓ Verde: Dentro de tolerancia
  - ⚠ Amarillo: En alerta (fuera de ±0.3% pero dentro de ±0.5%)
  - ✗ Rojo: Fuera de tolerancia (>±0.5%)
- **Controles de inicio/detención** del proceso
<img width="1810" height="807" alt="image" src="https://github.com/user-attachments/assets/e6292075-c3a6-46e7-b037-b5b74dca416e" />


### 3. **DualTankControl** (`components/dual-tank-control.tsx`)

Vista especial para TK3 y TK4 que muestra ambos tanques lado a lado con funcionalidad completa.

### 4. **TankAutonomy** (`components/tank-autonomy.tsx`)

Vista de autonomía que muestra para cada tanque:
- **Autonomía de Envasado**: Tiempo restante hasta vaciar el tanque
- **Peso Actual**: Kilogramos disponibles en el tanque
- **Consumo**: kg/min basado en formato y GPM estándar
- **Golpes por Minuto (GPM)**: Velocidad de envasado actual
- **Reloj en tiempo real** con zona horaria de Argentina

<img width="1160" height="901" alt="image" src="https://github.com/user-attachments/assets/29656f26-22d2-438a-af8c-5e039c5fae0c" />


### 5. **WeightChart** (`components/weight-chart.tsx`)

Gráfica interactiva que muestra:
- Línea de peso objetivo (negro)
- Banda de tolerancia ±0.3% (verde)
- Banda de alerta ±0.5% (amarillo)
- Puntos de peso de cada envase coloreados según tolerancia
- Persistencia de datos hasta 100 puntos máximo

### 6. **ActivityLog** (`components/activity-log.tsx`)

Registro completo de eventos del sistema:
- Inicio de procesos (formato, legajo, orden de envasado)
- Detención de procesos
- Cambios de peso en tanques
- Alertas y eventos críticos
- Timestamp de cada evento

---

## ⚙️ Funcionamiento del Sistema

### Flujo de Trabajo del Proceso de Envasado:

1. **Inicio del Proceso**:
   - El usuario selecciona un tanque (TK3, TK4, TK5 o TK6)
   - Hace clic en "Iniciar Envasado"
   - Completa el formulario con:
     - **Formato**: 10kg, 20kg o 25kg
     - **Legajo**: Número de identificación del operario
     - **Orden de Envasado**: Número de orden de producción

2. **Simulación de Envasado**:
   - El sistema genera envases simulados con cadencia realista
   - Cada envase tiene un peso aleatorio dentro de rangos de tolerancia
   - El peso del tanque disminuye con cada envase procesado
   - La gráfica se actualiza en tiempo real
   - Los contadores clasifican cada envase por tolerancia

3. **Monitoreo en Tiempo Real**:
   - El peso del tanque se actualiza continuamente
   - La autonomía se recalcula basándose en el consumo actual
   - El registro de actividades documenta todos los eventos
   - Los indicadores visuales muestran el estado de cada tanque

4. **Finalización del Proceso**:
   - El usuario hace clic en "Detener Envasado"
   - El sistema guarda el historial de la gráfica y las bandas de color
   - Se registra el evento de detención
   - Los datos persisten hasta iniciar un nuevo proceso

---

## 📊 Cálculos y Fórmulas

### Estándares de Golpes por Minuto (GPM):

\`\`\`typescript
const GPM_STANDARDS = {
  "25KG": 4,   // 4 envases por minuto (15 segundos por envase)
  "20KG": 11,  // 11 envases por minuto (~5.5 segundos por envase)
  "10KG": 13   // 13 envases por minuto (~4.6 segundos por envase)
}
\`\`\`

### Cálculo de Consumo:

\`\`\`
Consumo (kg/min) = GPM estándar × Peso del formato

Ejemplos:
- 25kg a 4 GPM: 4 × 25 = 100 kg/min
- 20kg a 11 GPM: 11 × 20 = 220 kg/min
- 10kg a 13 GPM: 13 × 10 = 130 kg/min
\`\`\`

### Cálculo de Autonomía:

\`\`\`
Tiempo Restante (minutos) = Peso Actual del Tanque ÷ Consumo (kg/min)

Ejemplo:
- Tanque con 3000 kg
- Formato 25kg a 4 GPM (100 kg/min de consumo)
- Autonomía: 3000 ÷ 100 = 30 minutos
\`\`\`

### Intervalos de Simulación:

\`\`\`
Intervalo entre envases (ms) = (60000 ms / GPM estándar)

Ejemplos:
- 25kg: 60000 / 4 = 15000 ms (15 segundos)
- 20kg: 60000 / 11 ≈ 5454 ms (5.5 segundos)
- 10kg: 60000 / 13 ≈ 4615 ms (4.6 segundos)
\`\`\`

### Generación de Peso de Envases:

\`\`\`
Peso Base = Peso del formato seleccionado
Variación = ±2% aleatorio
Peso Final = Peso Base × (1 + variación)

Ejemplo para 25kg:
- Base: 25 kg
- Variación: entre -0.5 y +0.5 kg
- Rango: 24.5 kg - 25.5 kg
\`\`\`

### Clasificación de Tolerancias:

\`\`\`
Peso Objetivo = Formato seleccionado

DENTRO (✓ Verde):
  |peso - objetivo| ≤ 0.3% del objetivo

ALERTA (⚠ Amarillo):
  0.3% < |peso - objetivo| ≤ 0.5% del objetivo

FUERA (✗ Rojo):
  |peso - objetivo| > 0.5% del objetivo

Ejemplo para 25kg:
- Dentro: 24.925 - 25.075 kg (±0.075 kg)
- Alerta: 24.875 - 24.925 kg y 25.075 - 25.125 kg (±0.125 kg)
- Fuera: < 24.875 kg o > 25.125 kg
\`\`\`

---

## 🚀 Instalación y Deployment

### Requisitos Previos:

- Node.js 20 o superior
- pnpm (recomendado) o npm
- Docker (opcional, para containerización)

### Instalación Local:

\`\`\`bash
# Clonar el repositorio
git clone https://github.com/d-roldan/v0-terplast.git
cd v0-terplast

# Instalar dependencias
pnpm install
# o
npm install

# Ejecutar en desarrollo
pnpm dev
# o
npm run dev

# Abrir en navegador
http://localhost:3000
\`\`\`

### Build para Producción:

\`\`\`bash
# Crear build optimizado
pnpm build

# Ejecutar build
pnpm start
\`\`\`

### Deployment con Docker:

\`\`\`bash
# Construir imagen
docker build -t terplast-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 terplast-frontend
\`\`\`

### Deployment con Docker Compose:

\`\`\`yaml
# En tu docker-compose.yml
services:
  terplast-frontend:
    build: ./FrontEnd TERPLAST
    ports:
      - "3000:3000"
    networks:
      - red_sintetico
    environment:
      - NODE_ENV=production
\`\`\`

\`\`\`bash
# Levantar servicio
docker-compose up -d terplast-frontend
\`\`\`

---

## ⚙️ Configuración

### Variables de Entorno:

Actualmente el sistema funciona en modo standalone sin variables de entorno requeridas. Sin embargo, para futuras integraciones con MQTT o APIs externas, se pueden agregar:

\`\`\`env
# .env.local (opcional)
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_MQTT_BROKER=ws://localhost:9001
\`\`\`

### Configuración de Tanques:

Los pesos iniciales de los tanques se configuran en `app/page.tsx`:

\`\`\`typescript
const [tankStates, setTankStates] = useState({
  tk3: { 
    weight: 2850,      // Peso inicial en kg
    isPackaging: false,
    format: null,
    legajo: "",
    ordenEnvasado: ""
  },
  tk4: { weight: 1650, isPackaging: false, ... },
  tk5: { weight: 3420, isPackaging: false, ... },
  tk6: { weight: 980, isPackaging: false, ... }
})
\`\`\`

### Personalización de Formatos:

Para agregar o modificar formatos de envase, editar en los componentes correspondientes:

\`\`\`typescript
const formats = ["25KG", "20KG", "10KG"] // Agregar nuevos formatos aquí

const GPM_STANDARDS = {
  "25KG": 4,
  "20KG": 11,
  "10KG": 13,
  // Agregar nuevos estándares aquí
}
\`\`\`

---

## 📱 Uso del Sistema

### Pantalla Principal:

1. **Selección de Tanque**: Usa la barra lateral izquierda para cambiar entre tanques
2. **Vista Dual TK3+TK4**: Muestra ambos tanques simultáneamente
3. **Vistas Individuales**: TK5 y TK6 tienen vista completa

### Inicio de Envasado:

1. Hacer clic en el botón **"Iniciar Envasado"**
2. Seleccionar **formato** (10kg, 20kg o 25kg)
3. Ingresar **legajo** del operario
4. Ingresar **orden de envasado**
5. Confirmar con **"Iniciar"**

### Durante el Envasado:

- Observar la **animación del llenado** del envase
- Monitorear el **peso del tanque** en tiempo real
- Ver la **gráfica** actualizándose con cada envase
- Revisar los **contadores** de clasificación
- El **indicador verde parpadeante** en la barra lateral muestra tanques activos

### Detención del Proceso:

1. Hacer clic en **"Detener Envasado"**
2. Confirmar la detención
3. Los datos se guardan y persisten en la gráfica

### Vista de Autonomía:

1. Hacer clic en el botón del **reloj** (⏱️) en la barra lateral
2. Visualizar las 4 tarjetas con información de cada tanque:
   - Autonomía de envasado (tiempo restante)
   - Peso actual
   - Consumo en kg/min
   - Golpes por minuto
3. El **reloj superior** muestra la hora de Argentina

### Registro de Actividades:

1. Hacer clic en el botón de **lista** (📋) en la barra lateral
2. Ver todos los eventos registrados
3. Scroll para ver historial completo

---

## 📁 Estructura de Archivos

\`\`\`
v0-terplast/
├── app/
│   ├── layout.tsx              # Layout principal de la aplicación
│   ├── page.tsx                # Página principal con lógica de estados
│   └── globals.css             # Estilos globales y variables CSS
├── components/
│   ├── ui/                     # Componentes base de shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   └── ...
│   ├── activity-log.tsx        # Registro de actividades
│   ├── dual-tank-control.tsx   # Control dual TK3+TK4
│   ├── start-process-dialog.tsx # Diálogo de inicio
│   ├── stop-process-dialog.tsx  # Diálogo de detención
│   ├── tank-autonomy.tsx       # Vista de autonomía
│   ├── tank-control.tsx        # Control individual de tanque
│   ├── tank-header.tsx         # Header de información del tanque
│   ├── tank-selector.tsx       # Selector lateral de tanques
│   └── weight-chart.tsx        # Gráfica de pesos
├── lib/
│   └── utils.ts                # Utilidades (cn function)
├── hooks/
│   ├── use-mobile.tsx          # Hook para detección mobile
│   └── use-toast.ts            # Hook para notificaciones
├── public/                     # Archivos estáticos
├── Dockerfile                  # Configuración Docker
├── docker-compose.yml          # Orquestación Docker
├── next.config.mjs             # Configuración Next.js
├── package.json                # Dependencias y scripts
├── tsconfig.json               # Configuración TypeScript
└── README.md                   # Este archivo
\`\`\`

### Descripción de Componentes Clave:

**`app/page.tsx`**:
- Estado global de los 4 tanques
- Lógica de cambio entre vistas
- Callbacks para actualizar estados
- Estructura principal de la UI

**`components/tank-control.tsx`**:
- Lógica de simulación de envasado
- Generación de envases con cadencia realista
- Actualización del peso del tanque
- Control de animaciones
- Clasificación de tolerancias

**`components/weight-chart.tsx`**:
- Renderizado de gráfica con Recharts
- Cálculo de bandas de tolerancia
- Persistencia de datos (máximo 100 puntos)
- Coloreado de puntos según tolerancia

**`components/tank-autonomy.tsx`**:
- Cálculo de autonomía en tiempo real
- Determinación de GPM según formato
- Conversión de minutos a formato h:min
- Reloj con zona horaria de Argentina

---

## 🔄 Flujo de Datos

\`\`\`
Usuario Inicia Proceso
        ↓
  [StartProcessDialog]
        ↓
  Actualiza tankState en page.tsx
        ↓
  Prop isPackaging = true → [TankControl]
        ↓
  Inicia simulación con setInterval
        ↓
  Cada X segundos (según GPM):
    1. Genera peso aleatorio del envase
    2. Clasifica según tolerancia
    3. Actualiza contadores
    4. Agrega punto a gráfica
    5. Disminuye peso del tanque
    6. Callback onWeightChange → page.tsx
        ↓
  Estado actualizado en toda la app
        ↓
  [TankAutonomy] recalcula autonomía
        ↓
  [ActivityLog] registra evento
\`\`\`

---

## 🎨 Diseño y UX

### Paleta de Colores:

- **Background**: `hsl(0 0% 7%)` - Fondo oscuro industrial
- **Foreground**: `hsl(0 0% 98%)` - Texto claro
- **Primary**: `hsl(0 0% 98%)` - Elementos principales
- **Muted**: `hsl(0 0% 15%)` - Fondos secundarios
- **Accent**: `hsl(0 0% 15%)` - Acentos y highlights

### Estados de Color:

- **Verde (`#22c55e`)**: Dentro de tolerancia, estado activo
- **Amarillo (`#eab308`)**: Alerta, fuera de tolerancia normal
- **Rojo (`#ef4444`)**: Fuera de tolerancia crítica, error
- **Gris (`#6b7280`)**: Elementos deshabilitados, secundarios

### Tipografía:

- **Sans-serif**: Geist - para UI y texto general
- **Monospace**: Geist Mono - para números y datos técnicos

### Responsive Design:

- Optimizado para **1366x768** (pantallas industriales)
- Grid layout adaptativo para tarjetas de autonomía
- Vista dual colapsable en pantallas pequeñas

---

## 🧪 Testing y Debugging

### Logs de Desarrollo:

El sistema incluye logs para debugging:

\`\`\`typescript
console.log("[v0 TankControl] Generando envase:", peso)
console.log("[v0 TankAutonomy] Calculando autonomía para:", tankId)
\`\`\`

### Verificación de Funcionamiento:

1. **Simulación de Envasado**: 
   - Verificar que los envases aparezcan con la cadencia correcta
   - Confirmar que el peso del tanque disminuye

2. **Cálculo de Autonomía**:
   - Comparar consumo teórico vs. mostrado
   - Verificar que el tiempo restante sea coherente

3. **Persistencia de Gráficas**:
   - Detener proceso y verificar que los datos permanezcan
   - Iniciar nuevo proceso y confirmar que se limpian

4. **Clasificación de Tolerancias**:
   - Generar envases en diferentes rangos
   - Verificar colores en gráfica y contadores

---

## 📈 Futuras Mejoras

### Integraciones Planeadas:

- [ ] **MQTT**: Conexión con PLCs para datos reales
- [ ] **Base de Datos**: Persistencia de históricos
- [ ] **Reportes**: Generación de PDFs con estadísticas OEE
- [ ] **Autenticación**: Control de acceso por roles
- [ ] **API REST**: Endpoints para integración con ERP
- [ ] **Alertas**: Notificaciones push para eventos críticos

### Mejoras de UX:

- [ ] **Modo Claro/Oscuro**: Toggle de temas
- [ ] **Configuración Dinámica**: Panel de ajustes sin editar código
- [ ] **Exportación de Datos**: CSV/Excel de procesos
- [ ] **Filtros Avanzados**: En registro de actividades
- [ ] **Dashboard General**: Vista de todos los tanques simultáneamente

---

## 👥 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto es propiedad de TERPLAST y está bajo licencia privada.

---

## 📞 Contacto

Para consultas o soporte:
- **GitHub**: [@d-roldan](https://github.com/d-roldan)
- **Proyecto**: [v0-terplast](https://github.com/d-roldan/v0-terplast)

---

## 🙏 Agradecimientos

Desarrollado con ❤️ usando:
- [v0.dev](https://v0.dev) - Generación de UI con IA
- [Next.js](https://nextjs.org) - Framework React
- [shadcn/ui](https://ui.shadcn.com) - Componentes UI
- [Recharts](https://recharts.org) - Librería de gráficas
- [Tailwind CSS](https://tailwindcss.com) - Framework de estilos

---

*Última actualización: Noviembre 2025 - Versión 0.24.0*

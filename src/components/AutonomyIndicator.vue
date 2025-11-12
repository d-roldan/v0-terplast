<template>
  <div
    :class="cn(
      'rounded-xl p-4 border backdrop-blur-sm',
      `bg-gradient-to-br ${colorClasses[color].gradient} ${colorClasses[color].border}`,
    )"
  >
    <div class="flex items-center justify-between mb-3">
      <div>
        <div class="text-xs text-gray-400 uppercase font-semibold mb-1">Indicador de Autonomía</div>
        <div v-if="tankNumber" class="text-sm text-gray-300">Tanque {{ tankNumber }}</div>
      </div>
      <div
        :class="cn(
          'text-xs px-2 py-1 rounded-full font-bold',
          isEfficient ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400',
        )"
      >
        {{ efficiency.toFixed(0) }}% Eficiencia
      </div>
    </div>

    <div class="grid grid-cols-2 gap-3 mb-3">
      <div class="bg-[#1a1e25] rounded-lg p-3 border border-cyan-500/30">
        <div class="text-xs text-cyan-400 font-semibold mb-1 uppercase">IDEAL</div>
        <div class="text-cyan-400 text-3xl font-bold mb-1">{{ formatTime(remainingIdealMinutes) }}</div>
        <div class="text-xs text-gray-500">Según GPM: {{ gpm }} gol/min</div>
        <div class="text-[10px] text-gray-600 mt-1">Tiempo total: {{ formatTime(idealTimeMinutes) }}</div>
      </div>

      <div class="bg-[#1a1e25] rounded-lg p-3 border border-orange-500/30">
        <div class="text-xs text-orange-400 font-semibold mb-1 uppercase">REAL</div>
        <div class="text-orange-400 text-3xl font-bold mb-1">{{ formatTime(remainingRealMinutes) }}</div>
        <div class="text-xs text-gray-500">Ritmo actual</div>
        <div class="text-[10px] text-gray-600 mt-1">Tiempo total: {{ formatTime(realTimeMinutes) }}</div>
      </div>
    </div>

    <div class="bg-[#1a1e25] rounded-lg p-3 mb-3 border border-[#2a2e35]">
      <div class="flex justify-between text-xs text-gray-400 mb-2">
        <span>Progreso de Envasado</span>
        <span class="text-white font-bold">
          {{ currentCount }} / {{ targetQuantity }} unidades
        </span>
      </div>
      <div class="bg-[#0b0e12] rounded-full h-3 overflow-hidden shadow-inner mb-2">
        <div
          :class="cn('h-full transition-all duration-500 rounded-full shadow-lg', colorClasses[color].bg)"
          :style="{ width: `${progressPercentage}%` }"
        />
      </div>
      <div class="flex justify-between text-[10px]">
        <span class="text-gray-500">Tiempo transcurrido: {{ formatTime(elapsedMinutes) }}</span>
        <span :class="cn('font-bold', colorClasses[color].text)">{{ progressPercentage.toFixed(1) }}%</span>
      </div>
    </div>

    <div class="grid grid-cols-3 gap-2 mb-3">
      <div class="bg-[#1a1e25] rounded-lg p-2">
        <div class="text-[10px] text-gray-400 mb-0.5">GPM Estándar</div>
        <div class="text-white text-lg font-bold">{{ gpm }}</div>
      </div>
      <div class="bg-[#1a1e25] rounded-lg p-2">
        <div class="text-[10px] text-gray-400 mb-0.5">GPM Real</div>
        <div class="text-cyan-400 text-lg font-bold">
          {{ elapsedMinutes > 0 ? (currentCount / elapsedMinutes).toFixed(1) : '0.0' }}
        </div>
      </div>
      <div class="bg-[#1a1e25] rounded-lg p-2">
        <div class="text-[10px] text-gray-400 mb-0.5">Diferencia</div>
        <div
          :class="cn('text-lg font-bold', realTimeMinutes > idealTimeMinutes ? 'text-red-400' : 'text-green-400')"
        >
          {{ realTimeMinutes > idealTimeMinutes ? '+' : '' }}
          {{ formatTime(Math.abs(realTimeMinutes - idealTimeMinutes)) }}
        </div>
      </div>
    </div>

    <div class="flex items-center gap-2 text-xs">
      <div :class="cn('w-2 h-2 rounded-full animate-pulse', colorClasses[color].bg)" />
      <span class="text-gray-400">
        {{
          color === 'red'
            ? efficiency < 80
              ? 'Rendimiento bajo - Revisar proceso'
              : 'Tiempo crítico - Acelerar producción'
            : color === 'yellow'
              ? efficiency < 90
                ? 'Eficiencia moderada - Optimizar'
                : 'Atención - Tiempo limitado'
              : 'Operación óptima'
        }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '../utils/cn'

interface Props {
  targetQuantity: number
  currentCount: number
  gpm: number
  startTime: number | null
  tankNumber?: number
}

const props = defineProps<Props>()

const idealTimeMinutes = computed(() => (props.gpm > 0 ? props.targetQuantity / props.gpm : 0))

const elapsedMinutes = computed(() => (props.startTime ? (Date.now() - props.startTime) / 60000 : 0))

const realTimeMinutes = computed(() =>
  props.currentCount > 0 && elapsedMinutes.value > 0
    ? (elapsedMinutes.value / props.currentCount) * props.targetQuantity
    : idealTimeMinutes.value
)

const remainingIdealMinutes = computed(() => Math.max(0, idealTimeMinutes.value - elapsedMinutes.value))
const remainingRealMinutes = computed(() => Math.max(0, realTimeMinutes.value - elapsedMinutes.value))

const progressPercentage = computed(() =>
  props.targetQuantity > 0 ? Math.min((props.currentCount / props.targetQuantity) * 100, 100) : 0
)

const efficiency = computed(() => (realTimeMinutes.value > 0 ? (idealTimeMinutes.value / realTimeMinutes.value) * 100 : 100))
const isEfficient = computed(() => efficiency.value >= 95)

const color = computed(() => {
  if (remainingIdealMinutes.value < 30 || efficiency.value < 80) return 'red'
  if (remainingIdealMinutes.value < 60 || efficiency.value < 90) return 'yellow'
  return 'green'
})

const colorClasses = {
  green: {
    bg: 'bg-green-500',
    text: 'text-green-400',
    border: 'border-green-500/30',
    gradient: 'from-green-500/20 to-green-600/10',
  },
  yellow: {
    bg: 'bg-yellow-500',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    gradient: 'from-yellow-500/20 to-yellow-600/10',
  },
  red: {
    bg: 'bg-red-500',
    text: 'text-red-400',
    border: 'border-red-500/30',
    gradient: 'from-red-500/20 to-red-600/10',
  },
}

function formatTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const mins = Math.round(minutes % 60)
    return `${hours}h ${mins}m`
  }
  return `${Math.round(minutes)} min`
}
</script>

<template>
  <div class="bg-[#1a1e25] rounded-xl p-4 border border-[#3a3e45]">
    <h3 class="text-lg font-semibold text-cyan-400 mb-4">Gráfico de Peso</h3>
    <div class="h-64 flex items-center justify-center">
      <div v-if="data.length === 0" class="text-gray-500">
        Esperando datos...
      </div>
      <div v-else class="w-full h-full relative">
        <svg class="w-full h-full" viewBox="0 0 600 200">
          <!-- Líneas de referencia -->
          <line
            v-if="nominalWeight"
            x1="0"
            :y1="getY(nominalWeight)"
            x2="600"
            :y2="getY(nominalWeight)"
            stroke="#06b6d4"
            stroke-width="2"
            stroke-dasharray="5,5"
          />
          <line
            v-if="nominalWeight"
            x1="0"
            :y1="getY(nominalWeight + tolerance)"
            x2="600"
            :y2="getY(nominalWeight + tolerance)"
            stroke="#eab308"
            stroke-width="1"
            stroke-dasharray="3,3"
          />
          <line
            v-if="nominalWeight"
            x1="0"
            :y1="getY(nominalWeight - tolerance)"
            x2="600"
            :y2="getY(nominalWeight - tolerance)"
            stroke="#eab308"
            stroke-width="1"
            stroke-dasharray="3,3"
          />
          
          <!-- Línea de datos -->
          <polyline
            :points="chartPoints"
            fill="none"
            stroke="#22c55e"
            stroke-width="2"
          />
          
          <!-- Puntos -->
          <circle
            v-for="(point, i) in data"
            :key="i"
            :cx="getX(point.x)"
            :cy="getY(point.y)"
            r="3"
            :fill="getPointColor(point.y)"
          />
        </svg>
        
        <div class="mt-2 flex justify-between text-xs text-gray-400">
          <span>Min: {{ minValue.toFixed(2) }} kg</span>
          <span>Nominal: {{ nominalWeight?.toFixed(2) }} kg</span>
          <span>Max: {{ maxValue.toFixed(2) }} kg</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Format } from '../types'

interface Props {
  data: Array<{ x: number; y: number }>
  format: Format
  previousFormat?: Format
}

const props = defineProps<Props>()

const formatWeights: Record<Format, number> = {
  '1lt': 1,
  '4lt': 4,
  '5kg': 5,
  '10kg': 10,
  '20kg': 20,
  '25kg': 25,
}

const nominalWeight = computed(() => formatWeights[props.format])
const tolerance = computed(() => nominalWeight.value * 0.02)

const minValue = computed(() => {
  if (props.data.length === 0) return nominalWeight.value - tolerance.value * 2
  return Math.min(...props.data.map(d => d.y), nominalWeight.value - tolerance.value * 2)
})

const maxValue = computed(() => {
  if (props.data.length === 0) return nominalWeight.value + tolerance.value * 2
  return Math.max(...props.data.map(d => d.y), nominalWeight.value + tolerance.value * 2)
})

const chartPoints = computed(() => {
  return props.data.map(point => `${getX(point.x)},${getY(point.y)}`).join(' ')
})

function getX(x: number): number {
  const maxX = Math.max(...props.data.map(d => d.x), 10)
  return (x / maxX) * 600
}

function getY(y: number): number {
  const range = maxValue.value - minValue.value
  return 200 - ((y - minValue.value) / range) * 200
}

function getPointColor(y: number): string {
  if (y < nominalWeight.value - tolerance.value || y > nominalWeight.value + tolerance.value) {
    return '#ef4444' // Rojo - fuera de tolerancia
  }
  if (
    (y >= nominalWeight.value - tolerance.value && y <= nominalWeight.value - tolerance.value / 2) ||
    (y >= nominalWeight.value + tolerance.value / 2 && y <= nominalWeight.value + tolerance.value)
  ) {
    return '#eab308' // Amarillo - alerta
  }
  return '#22c55e' // Verde - dentro de tolerancia
}
</script>

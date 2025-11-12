<template>
  <div class="p-6">
    <h2 class="text-3xl font-bold text-cyan-400 mb-6">Registro de Actividad</h2>
    
    <div v-if="summaries.length === 0" class="text-center text-gray-500 py-12">
      No hay registros de envasado aún
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="summary in summaries"
        :key="summary.id"
        class="bg-[#1a1e25] rounded-xl p-6 border border-[#3a3e45]"
      >
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="text-xl font-bold text-cyan-400">
              Tanque {{ summary.tankNumber }}
            </h3>
            <p class="text-sm text-gray-400">
              {{ formatDate(summary.startTime) }} - {{ formatDate(summary.endTime) }}
            </p>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-white">
              {{ summary.totalUnits }}
            </div>
            <div class="text-xs text-gray-400">unidades</div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div class="text-xs text-gray-400">Material</div>
            <div class="text-white">{{ summary.processData.material }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400">Formato</div>
            <div class="text-white">{{ summary.processData.format }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400">OF</div>
            <div class="text-white">{{ summary.processData.of }}</div>
          </div>
          <div>
            <div class="text-xs text-gray-400">Orden Envasado</div>
            <div class="text-white">{{ summary.processData.ordenEnvasado }}</div>
          </div>
        </div>

        <div class="grid grid-cols-3 gap-4 mb-4">
          <div class="bg-green-500/20 rounded-lg p-3">
            <div class="text-xs text-green-400">Dentro</div>
            <div class="text-lg font-bold text-green-400">
              {{ summary.withinTolerance }}
            </div>
            <div class="text-xs text-gray-400">
              {{ getPercentage(summary.withinTolerance, summary.totalUnits) }}%
            </div>
          </div>
          <div class="bg-yellow-500/20 rounded-lg p-3">
            <div class="text-xs text-yellow-400">Alerta</div>
            <div class="text-lg font-bold text-yellow-400">
              {{ summary.inAlert }}
            </div>
            <div class="text-xs text-gray-400">
              {{ getPercentage(summary.inAlert, summary.totalUnits) }}%
            </div>
          </div>
          <div class="bg-red-500/20 rounded-lg p-3">
            <div class="text-xs text-red-400">Fuera</div>
            <div class="text-lg font-bold text-red-400">
              {{ summary.outOfTolerance }}
            </div>
            <div class="text-xs text-gray-400">
              {{ getPercentage(summary.outOfTolerance, summary.totalUnits) }}%
            </div>
          </div>
        </div>

        <div class="flex justify-between text-sm">
          <div>
            <span class="text-gray-400">Promedio:</span>
            <span class="text-white ml-2">{{ summary.averageWeight.toFixed(2) }} kg</span>
          </div>
          <div>
            <span class="text-gray-400">Min:</span>
            <span class="text-white ml-2">{{ summary.minWeight.toFixed(2) }} kg</span>
          </div>
          <div>
            <span class="text-gray-400">Max:</span>
            <span class="text-white ml-2">{{ summary.maxWeight.toFixed(2) }} kg</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { format } from 'date-fns'
import type { PackagingSummary } from '../types'

interface Props {
  summaries: PackagingSummary[]
}

defineProps<Props>()

function formatDate(date: Date): string {
  return format(new Date(date), 'dd/MM/yyyy HH:mm')
}

function getPercentage(value: number, total: number): string {
  if (total === 0) return '0'
  return ((value / total) * 100).toFixed(1)
}
</script>

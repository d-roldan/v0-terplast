<template>
  <div class="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-xl p-4 shadow-lg">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-white">Tanque {{ tankNumber }}</h2>
        <p class="text-cyan-100 text-sm">Sistema de Control de Envasado</p>
      </div>
      <div
        :class="cn(
          'px-4 py-2 rounded-full text-sm font-bold',
          statusColors[status].bg,
          statusColors[status].text
        )"
      >
        {{ statusLabels[status] }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { cn } from '../utils/cn'
import type { ProcessStatus } from '../types'

interface Props {
  tankNumber: number
  status: ProcessStatus
}

defineProps<Props>()

const statusLabels: Record<ProcessStatus, string> = {
  idle: 'Detenido',
  filling: 'Envasando',
  stopped: 'Pausado',
}

const statusColors = {
  idle: { bg: 'bg-gray-500/30', text: 'text-gray-200' },
  filling: { bg: 'bg-green-500/30', text: 'text-green-200' },
  stopped: { bg: 'bg-yellow-500/30', text: 'text-yellow-200' },
}
</script>

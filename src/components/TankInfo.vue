<template>
  <div class="bg-[#1a1e25] rounded-xl p-4 border border-[#3a3e45]">
    <div class="grid grid-cols-2 gap-4 mb-4">
      <div>
        <label class="text-xs text-gray-400 uppercase font-semibold">Peso del Tanque</label>
        <div class="text-3xl font-bold text-cyan-400">{{ weight.toFixed(1) }} kg</div>
      </div>
      <div>
        <label class="text-xs text-gray-400 uppercase font-semibold">Contador</label>
        <div class="text-3xl font-bold text-green-400">{{ counter }}</div>
      </div>
    </div>

    <div v-if="processData" class="space-y-2 mb-4">
      <div class="grid grid-cols-2 gap-2 text-sm">
        <div>
          <span class="text-gray-400">OF:</span>
          <span class="text-white ml-2">{{ processData.of }}</span>
        </div>
        <div>
          <span class="text-gray-400">Material:</span>
          <span class="text-white ml-2">{{ processData.material }}</span>
        </div>
        <div>
          <span class="text-gray-400">Formato:</span>
          <span class="text-white ml-2">{{ processData.format }}</span>
        </div>
        <div>
          <span class="text-gray-400">Legajo:</span>
          <span class="text-white ml-2">{{ processData.legajo }}</span>
        </div>
      </div>
      <div v-if="processData.description" class="text-sm">
        <span class="text-gray-400">Descripción:</span>
        <span class="text-white ml-2">{{ processData.description }}</span>
      </div>
    </div>

    <div class="flex gap-2">
      <button
        v-if="status === 'idle'"
        @click="$emit('start')"
        class="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        Iniciar Proceso
      </button>
      <button
        v-if="status === 'filling'"
        @click="$emit('stop')"
        class="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
      >
        Detener Proceso
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ProcessStatus, ProcessData } from '../types'

interface Props {
  status: ProcessStatus
  processData: ProcessData | null
  weight: number
  counter: number
}

defineProps<Props>()
defineEmits<{
  start: []
  stop: []
}>()
</script>

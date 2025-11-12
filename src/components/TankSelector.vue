<template>
  <div class="w-24 bg-[#1a1e25] border-r border-[#2a2e35] flex flex-col items-center py-6 gap-3">
    <div class="text-cyan-400 font-bold text-sm mb-4 tracking-wider">TANQUES</div>

    <button
      v-for="tank in tanks"
      :key="tank"
      @click="$emit('selectTank', tank)"
      :class="[
        'w-16 h-16 rounded-xl font-bold text-xs transition-all duration-300 relative',
        'flex items-center justify-center',
        selectedTank === tank
          ? `bg-gradient-to-br ${getTankColors(tank).bg} text-white shadow-lg ${getTankColors(tank).shadow} scale-110`
          : 'bg-[#2a2e35] text-gray-400 hover:bg-[#3a3e45] hover:text-gray-200'
      ]"
    >
      <div v-if="tank === '3-4'" class="flex flex-col items-center leading-tight">
        <span>TK3</span>
        <span class="text-[10px]">&</span>
        <span>TK4</span>
      </div>
      <div v-else-if="tank === 'log'" class="flex flex-col items-center gap-1">
        <ClipboardList :size="24" />
        <span class="text-[9px]">LOG</span>
      </div>
      <template v-else>TK{{ tank }}</template>

      <!-- Agregar indicador de estado activo del tanque -->
      <div v-if="isActive(tank)" class="absolute -top-1 -right-1">
        <span
          :class="[
            'block w-4 h-4 rounded-full animate-pulse',
            'border-2 border-[#1a1e25]',
            'shadow-lg'
          ]"
          :style="{
            backgroundColor: selectedTank === tank ? 'white' : getTankColors(tank).fill,
            boxShadow: selectedTank === tank ? '0 0 10px rgba(255, 255, 255, 0.8)' : `0 0 10px ${getTankColors(tank).fill}80`
          }"
        />
      </div>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ClipboardList } from 'lucide-vue-next'
import type { TankState } from '../types'

interface Props {
  selectedTank: number | '3-4' | 'log'
  tankStates: Record<number, TankState>
}

const props = defineProps<Props>()
defineEmits<{
  selectTank: [tank: number | '3-4' | 'log']
}>()

const tanks: Array<number | '3-4' | 'log'> = ['3-4', 5, 6, 'log']

const tankColors = {
  '3-4': {
    bg: 'from-yellow-500 via-green-500 to-green-700',
    shadow: 'shadow-yellow-500/50',
    fill: '#eab308',
  },
  3: {
    bg: 'from-yellow-500 to-yellow-700',
    shadow: 'shadow-yellow-500/50',
    fill: '#eab308',
  },
  4: {
    bg: 'from-green-500 to-green-700',
    shadow: 'shadow-green-500/50',
    fill: '#22c55e',
  },
  5: {
    bg: 'from-purple-500 to-purple-700',
    shadow: 'shadow-purple-500/50',
    fill: '#a855f7',
  },
  6: {
    bg: 'from-pink-500 to-pink-700',
    shadow: 'shadow-pink-500/50',
    fill: '#ec4899',
  },
  log: {
    bg: 'from-orange-500 to-orange-700',
    shadow: 'shadow-orange-500/50',
    fill: '#f97316',
  },
}

const getTankColors = (tank: number | '3-4' | 'log') => {
  return tankColors[tank as keyof typeof tankColors]
}

const isActive = (tank: number | '3-4' | 'log') => {
  if (tank === '3-4') {
    return props.tankStates[3]?.status === 'filling' || props.tankStates[4]?.status === 'filling'
  }
  if (typeof tank === 'number') {
    return props.tankStates[tank]?.status === 'filling'
  }
  return false
}
</script>

<template>
  <div class="h-screen bg-[#0b0e12] flex overflow-hidden">
    <!-- Columna izquierda - Selector de tanques -->
    <TankSelector
      :selectedTank="selectedTank"
      :tankStates="tankStates"
      @selectTank="selectTank"
    />

    <!-- Área principal - Control del tanque o registro -->
    <div class="flex-1 overflow-auto">
      <ActivityLog
        v-if="selectedTank === 'log'"
        :summaries="packagingSummaries"
      />
      <DualTankControl
        v-else-if="selectedTank === '3-4'"
        :tank3State="tankStates[3]"
        :tank4State="tankStates[4]"
        @updateTank3="(state) => updateTankState(3, state)"
        @updateTank4="(state) => updateTankState(4, state)"
        @addSummary="addPackagingSummary"
      />
      <TankControl
        v-else
        :tankNumber="selectedTank"
        :tankState="tankStates[selectedTank]"
        @updateState="(state) => updateTankState(selectedTank, state)"
        @addSummary="addPackagingSummary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import TankSelector from './components/TankSelector.vue'
import TankControl from './components/TankControl.vue'
import DualTankControl from './components/DualTankControl.vue'
import ActivityLog from './components/ActivityLog.vue'
import type { TankState } from './types'
import type { PackagingSummary } from './types'

const selectedTank = ref<number | '3-4' | 'log'>('3-4')
const tankStates = ref<Record<number, TankState>>({
  3: { status: 'idle', weight: 1950, counter: 313, chartData: [], processData: null },
  4: { status: 'idle', weight: 1950, counter: 313, chartData: [], processData: null },
  5: { status: 'idle', weight: 1950, counter: 313, chartData: [], processData: null },
  6: { status: 'idle', weight: 1950, counter: 313, chartData: [], processData: null },
})

const packagingSummaries = ref<PackagingSummary[]>([])

const selectTank = (tank: number | '3-4' | 'log') => {
  selectedTank.value = tank
}

const updateTankState = (tankNumber: number, newState: Partial<TankState>) => {
  tankStates.value[tankNumber] = { ...tankStates.value[tankNumber], ...newState }
}

const addPackagingSummary = (summary: Omit<PackagingSummary, 'id'>) => {
  const newSummary: PackagingSummary = {
    ...summary,
    id: Date.now().toString(),
  }
  packagingSummaries.value = [newSummary, ...packagingSummaries.value]
}
</script>

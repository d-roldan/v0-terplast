<template>
  <div class="grid grid-cols-2 gap-3 p-3">
    <TankControl
      :tankNumber="3"
      :tankState="tank3State"
      @updateState="(state) => $emit('updateTank3', state)"
      @addSummary="$emit('addSummary', $event)"
    />
    <TankControl
      :tankNumber="4"
      :tankState="tank4State"
      @updateState="(state) => $emit('updateTank4', state)"
      @addSummary="$emit('addSummary', $event)"
    />
  </div>
</template>

<script setup lang="ts">
import TankControl from './TankControl.vue'
import type { TankState, PackagingSummary } from '../types'

interface Props {
  tank3State: TankState
  tank4State: TankState
}

defineProps<Props>()
defineEmits<{
  updateTank3: [state: Partial<TankState>]
  updateTank4: [state: Partial<TankState>]
  addSummary: [summary: Omit<PackagingSummary, 'id'>]
}>()
</script>

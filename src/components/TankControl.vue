<template>
  <div class="p-3 space-y-2">
    <TankHeader :tankNumber="tankNumber" :status="tankState.status" />

    <div class="grid grid-cols-[1fr_300px] gap-3">
      <TankInfo
        :status="tankState.status"
        :processData="tankState.processData"
        :weight="tankState.weight"
        :counter="tankState.counter"
        @start="showStartDialog = true"
        @stop="showStopDialog = true"
      />

      <AutonomyIndicator
        v-if="tankState.processData"
        :targetQuantity="tankState.processData.targetQuantity"
        :currentCount="tankState.counter"
        :gpm="tankState.processData.gpm"
        :startTime="tankState.startTime || null"
        :tankNumber="tankNumber"
      />
      <div v-else class="rounded-xl p-4 border border-[#3a3e45] bg-[#1a1e25] flex items-center justify-center">
        <p class="text-gray-500 text-center text-sm">Inicie un proceso para ver la autonomía</p>
      </div>
    </div>

    <div>
      <WeightChart
        :data="tankState.chartData"
        :format="tankState.processData?.format || '25kg'"
        :previousFormat="tankState.previousFormat"
      />
    </div>

    <StartProcessDialog
      v-if="showStartDialog"
      @close="showStartDialog = false"
      @confirm="handleStartProcess"
    />

    <StopProcessDialog
      v-if="showStopDialog"
      @close="showStopDialog = false"
      @confirm="handleStopProcess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import TankHeader from './TankHeader.vue'
import TankInfo from './TankInfo.vue'
import AutonomyIndicator from './AutonomyIndicator.vue'
import WeightChart from './WeightChart.vue'
import StartProcessDialog from './StartProcessDialog.vue'
import StopProcessDialog from './StopProcessDialog.vue'
import type { TankState, ProcessData, PackagingSummary } from '../types'

interface Props {
  tankNumber: number
  tankState: TankState
}

const props = defineProps<Props>()
const emit = defineEmits<{
  updateState: [newState: Partial<TankState>]
  addSummary: [summary: Omit<PackagingSummary, 'id'>]
}>()

const showStartDialog = ref(false)
const showStopDialog = ref(false)

const processMetrics = ref({
  startTime: new Date(),
  withinTolerance: 0,
  inAlert: 0,
  outOfTolerance: 0,
  weights: [] as number[],
})

let intervalId: number | null = null

const formatWeights: Record<string, number> = {
  '1lt': 1,
  '4lt': 4,
  '5kg': 5,
  '10kg': 10,
  '20kg': 20,
  '25kg': 25,
}

watch(
  () => [props.tankState.status, props.tankState.processData] as const,
  ([status, processData]) => {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }

    if (status === 'filling' && processData) {
      intervalId = window.setInterval(() => {
        const nominalWeight = formatWeights[processData.format]
        const tolerance = nominalWeight * 0.02
        const randomWeight = nominalWeight + (Math.random() * tolerance * 4 - tolerance * 2)

        emit('updateState', {
          weight: props.tankState.weight + Math.random() * 50 - 25,
          counter: props.tankState.counter + 1,
          chartData: [
            ...props.tankState.chartData,
            {
              x: props.tankState.chartData.length + 1,
              y: randomWeight,
            },
          ].slice(-100),
        })

        const status =
          randomWeight < nominalWeight - tolerance
            ? 'fuera'
            : randomWeight > nominalWeight + tolerance
              ? 'fuera'
              : randomWeight >= nominalWeight - tolerance && randomWeight <= nominalWeight - tolerance / 2
                ? 'alerta'
                : randomWeight >= nominalWeight + tolerance / 2 && randomWeight <= nominalWeight + tolerance
                  ? 'alerta'
                  : 'dentro'

        processMetrics.value.weights.push(randomWeight)
        if (status === 'dentro') processMetrics.value.withinTolerance++
        else if (status === 'alerta') processMetrics.value.inAlert++
        else processMetrics.value.outOfTolerance++
      }, 2000)
    }
  },
  { immediate: true }
)

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})

function handleStartProcess(data: ProcessData) {
  processMetrics.value = {
    startTime: new Date(),
    withinTolerance: 0,
    inAlert: 0,
    outOfTolerance: 0,
    weights: [],
  }

  emit('updateState', {
    processData: data,
    status: 'filling',
    chartData: [],
    counter: 0,
    previousFormat: props.tankState.processData?.format,
    startTime: Date.now(),
  })
  showStartDialog.value = false
}

function handleStopProcess() {
  if (props.tankState.processData && processMetrics.value.weights.length > 0) {
    const weights = processMetrics.value.weights
    const summary: Omit<PackagingSummary, 'id'> = {
      tankNumber: props.tankNumber,
      startTime: processMetrics.value.startTime,
      endTime: new Date(),
      processData: props.tankState.processData,
      totalUnits: props.tankState.counter,
      withinTolerance: processMetrics.value.withinTolerance,
      inAlert: processMetrics.value.inAlert,
      outOfTolerance: processMetrics.value.outOfTolerance,
      averageWeight: weights.reduce((a, b) => a + b, 0) / weights.length,
      minWeight: Math.min(...weights),
      maxWeight: Math.max(...weights),
    }
    emit('addSummary', summary)
  }

  emit('updateState', {
    status: 'idle',
    processData: null,
    previousFormat: props.tankState.processData?.format,
    startTime: undefined,
  })
  showStopDialog.value = false
}
</script>

"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { TankHeader } from "./tank-header"
import { TankInfo } from "./tank-info"
import { WeightChart } from "./weight-chart"
import { StartProcessDialog } from "./start-process-dialog"
import { StopProcessDialog } from "./stop-process-dialog"
import { useState } from "react"
import type { PackagingSummary } from "./activity-log"

interface TankControlProps {
  tankNumber: number
  tankState: TankState
  onUpdateState: (newState: Partial<TankState>) => void
  onAddSummary: (summary: Omit<PackagingSummary, "id">) => void
}

export type ProcessStatus = "idle" | "filling" | "stopped"
export type Format = "5kg" | "10kg" | "20kg" | "25kg"

export interface ProcessData {
  of: string
  material: string
  description: string
  format: Format
  legajo: string
  ordenEnvasado: string
}

export interface TankState {
  status: ProcessStatus
  weight: number
  counter: number
  chartData: Array<{ x: number; y: number }>
  processData: ProcessData | null
  previousFormat?: Format
}

const formatWeights = {
  "5kg": 5,
  "10kg": 10,
  "20kg": 20,
  "25kg": 25,
}

const standardGPM = {
  "25kg": 4,
  "20kg": 11,
  "10kg": 13,
  "5kg": 13, // Usar mismo que 10kg
}

export function TankControl({ tankNumber, tankState, onUpdateState, onAddSummary }: TankControlProps) {
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [showStopDialog, setShowStopDialog] = useState(false)

  const processMetrics = useRef({
    startTime: new Date(),
    withinTolerance: 0,
    inAlert: 0,
    outOfTolerance: 0,
    weights: [] as number[],
  })

  useEffect(() => {
    if (tankState.status === "filling" && tankState.processData) {
      const format = tankState.processData.format
      const nominalWeight = formatWeights[format]
      const gpm = standardGPM[format]
      const intervalMs = (60 / gpm) * 1000 // Convertir GPM a milisegundos entre envases

      const interval = setInterval(() => {
        const tolerance = nominalWeight * 0.02
        const randomWeight = nominalWeight + (Math.random() * tolerance * 4 - tolerance * 2)

        // Reducir el peso del tanque por el peso del envase
        const newTankWeight = Math.max(0, tankState.weight - randomWeight)

        onUpdateState({
          weight: newTankWeight,
          counter: tankState.counter + 1,
          chartData: [
            ...tankState.chartData,
            {
              x: tankState.chartData.length + 1,
              y: randomWeight,
            },
          ].slice(-100),
        })

        const status =
          randomWeight < nominalWeight - tolerance
            ? "fuera"
            : randomWeight > nominalWeight + tolerance
              ? "fuera"
              : randomWeight >= nominalWeight - tolerance && randomWeight <= nominalWeight - tolerance / 2
                ? "alerta"
                : randomWeight >= nominalWeight + tolerance / 2 && randomWeight <= nominalWeight + tolerance
                  ? "alerta"
                  : "dentro"

        processMetrics.current.weights.push(randomWeight)
        if (status === "dentro") processMetrics.current.withinTolerance++
        else if (status === "alerta") processMetrics.current.inAlert++
        else processMetrics.current.outOfTolerance++
      }, intervalMs)

      return () => clearInterval(interval)
    }
  }, [tankState.status, tankState.processData, tankState.weight, tankState.counter, tankState.chartData, onUpdateState])

  const handleStartProcess = (data: ProcessData) => {
    processMetrics.current = {
      startTime: new Date(),
      withinTolerance: 0,
      inAlert: 0,
      outOfTolerance: 0,
      weights: [],
    }

    onUpdateState({
      processData: data,
      status: "filling",
      chartData: [],
      counter: 0,
      previousFormat: tankState.processData?.format,
    })
    setShowStartDialog(false)
  }

  const handleStopProcess = () => {
    if (tankState.processData && processMetrics.current.weights.length > 0) {
      const weights = processMetrics.current.weights
      const summary: Omit<PackagingSummary, "id"> = {
        tankNumber,
        startTime: processMetrics.current.startTime,
        endTime: new Date(),
        processData: tankState.processData,
        totalUnits: tankState.counter,
        withinTolerance: processMetrics.current.withinTolerance,
        inAlert: processMetrics.current.inAlert,
        outOfTolerance: processMetrics.current.outOfTolerance,
        averageWeight: weights.reduce((a, b) => a + b, 0) / weights.length,
        minWeight: Math.min(...weights),
        maxWeight: Math.max(...weights),
      }
      onAddSummary(summary)
    }

    onUpdateState({
      status: "idle",
      processData: null,
      previousFormat: tankState.processData?.format,
    })
    setShowStopDialog(false)
  }

  return (
    <div className="p-3 space-y-2">
      <TankHeader tankNumber={tankNumber} status={tankState.status} />

      <TankInfo
        status={tankState.status}
        processData={tankState.processData}
        weight={tankState.weight}
        counter={tankState.counter}
        onStart={() => setShowStartDialog(true)}
        onStop={() => setShowStopDialog(true)}
      />

      <div>
        <WeightChart
          data={tankState.chartData}
          format={tankState.processData?.format || "25kg"}
          previousFormat={tankState.previousFormat}
        />
      </div>

      <AnimatePresence>
        {showStartDialog && (
          <StartProcessDialog onClose={() => setShowStartDialog(false)} onConfirm={handleStartProcess} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showStopDialog && <StopProcessDialog onClose={() => setShowStopDialog(false)} onConfirm={handleStopProcess} />}
      </AnimatePresence>
    </div>
  )
}

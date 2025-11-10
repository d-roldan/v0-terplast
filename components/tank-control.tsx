"use client"

import { useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { TankHeader } from "./tank-header"
import { TankInfo } from "./tank-info"
import { WeightChart } from "./weight-chart"
import { StartProcessDialog } from "./start-process-dialog"
import { StopProcessDialog } from "./stop-process-dialog"
import { AutonomyIndicator } from "./autonomy-indicator"
import { useState } from "react"
import type { PackagingSummary } from "./activity-log"

interface TankControlProps {
  tankNumber: number
  tankState: TankState
  onUpdateState: (newState: Partial<TankState>) => void
  onAddSummary: (summary: Omit<PackagingSummary, "id">) => void
}

export type ProcessStatus = "idle" | "filling" | "stopped"
export type Format = "1lt" | "4lt" | "5kg" | "10kg" | "20kg" | "25kg"

export interface ProcessData {
  of: string
  material: string
  description: string
  format: Format
  legajo: string
  ordenEnvasado: string
  targetQuantity: number // Cantidad de envases a producir
  gpm: number // Golpes Por Minuto (estándar del material)
}

export interface TankState {
  status: ProcessStatus
  weight: number
  counter: number
  chartData: Array<{ x: number; y: number }>
  processData: ProcessData | null
  previousFormat?: Format
  startTime?: number // Agregar startTime para calcular tiempo real
}

const formatWeights = {
  "1lt": 1,
  "4lt": 4,
  "5kg": 5,
  "10kg": 10,
  "20kg": 20,
  "25kg": 25,
}

const STANDARD_AUTONOMY = 1000

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
      const interval = setInterval(() => {
        const nominalWeight = formatWeights[tankState.processData.format]
        const tolerance = nominalWeight * 0.02
        const randomWeight = nominalWeight + (Math.random() * tolerance * 4 - tolerance * 2)

        onUpdateState({
          weight: tankState.weight + Math.random() * 50 - 25,
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
      }, 4000) // Aumentado a 4 segundos

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
      startTime: Date.now(),
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
      startTime: undefined,
    })
    setShowStopDialog(false)
  }

  return (
    <div className="p-3 space-y-2">
      <TankHeader tankNumber={tankNumber} status={tankState.status} />

      <div className="grid grid-cols-[1fr_300px] gap-3">
        <TankInfo
          status={tankState.status}
          processData={tankState.processData}
          weight={tankState.weight}
          counter={tankState.counter}
          onStart={() => setShowStartDialog(true)}
          onStop={() => setShowStopDialog(true)}
        />

        {tankState.processData ? (
          <AutonomyIndicator
            targetQuantity={tankState.processData.targetQuantity}
            currentCount={tankState.counter}
            gpm={tankState.processData.gpm}
            startTime={tankState.startTime || null}
            tankNumber={tankNumber}
          />
        ) : (
          <div className="rounded-xl p-4 border border-[#3a3e45] bg-[#1a1e25] flex items-center justify-center">
            <p className="text-gray-500 text-center text-sm">Inicie un proceso para ver la autonomía</p>
          </div>
        )}
      </div>

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

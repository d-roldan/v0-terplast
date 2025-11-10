"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { TankHeader } from "./tank-header"
import { TankInfo } from "./tank-info"
import { WeightChart } from "./weight-chart"
import { StartProcessDialog } from "./start-process-dialog"
import { StopProcessDialog } from "./stop-process-dialog"
import { AutonomyIndicator } from "./autonomy-indicator"
import type { TankState, ProcessData } from "./tank-control"
import type { PackagingSummary } from "./activity-log"
import { cn } from "@/lib/utils"

interface DualTankControlProps {
  tank3State: TankState
  tank4State: TankState
  onUpdateTank3: (newState: Partial<TankState>) => void
  onUpdateTank4: (newState: Partial<TankState>) => void
  onAddSummary: (summary: Omit<PackagingSummary, "id">) => void
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

export function DualTankControl({
  tank3State,
  tank4State,
  onUpdateTank3,
  onUpdateTank4,
  onAddSummary,
}: DualTankControlProps) {
  const [activeTank, setActiveTank] = useState<3 | 4>(3)
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [showStopDialog, setShowStopDialog] = useState(false)

  const activeState = activeTank === 3 ? tank3State : tank4State
  const onUpdateActive = activeTank === 3 ? onUpdateTank3 : onUpdateTank4

  const isTank3Filling = tank3State.status === "filling"
  const isTank4Filling = tank4State.status === "filling"
  const isAnyTankFilling = isTank3Filling || isTank4Filling

  const processMetrics = useRef({
    startTime: new Date(),
    withinTolerance: 0,
    inAlert: 0,
    outOfTolerance: 0,
    weights: [] as number[],
  })

  // Simular cambio de peso durante el envasado
  useEffect(() => {
    if (activeState.status === "filling" && activeState.processData) {
      const interval = setInterval(() => {
        const nominalWeight = formatWeights[activeState.processData.format]
        const tolerance = nominalWeight * 0.02
        const randomWeight = nominalWeight + (Math.random() * tolerance * 4 - tolerance * 2)

        onUpdateActive({
          weight: activeState.weight + Math.random() * 50 - 25,
          counter: activeState.counter + 1,
          chartData: [
            ...activeState.chartData,
            {
              x: activeState.chartData.length + 1,
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
      }, 2000)

      return () => clearInterval(interval)
    }
  }, [
    activeState.status,
    activeState.processData,
    activeState.weight,
    activeState.counter,
    activeState.chartData,
    onUpdateActive,
  ])

  const handleStartProcess = (data: ProcessData) => {
    processMetrics.current = {
      startTime: new Date(),
      withinTolerance: 0,
      inAlert: 0,
      outOfTolerance: 0,
      weights: [],
    }

    onUpdateActive({
      processData: data,
      status: "filling",
      chartData: [],
      counter: 0,
      previousFormat: activeState.processData?.format,
      startTime: Date.now(),
    })
    setShowStartDialog(false)
  }

  const handleStopProcess = () => {
    if (activeState.processData && processMetrics.current.weights.length > 0) {
      const weights = processMetrics.current.weights
      const summary: Omit<PackagingSummary, "id"> = {
        tankNumber: activeTank,
        startTime: processMetrics.current.startTime,
        endTime: new Date(),
        processData: activeState.processData,
        totalUnits: activeState.counter,
        withinTolerance: processMetrics.current.withinTolerance,
        inAlert: processMetrics.current.inAlert,
        outOfTolerance: processMetrics.current.outOfTolerance,
        averageWeight: weights.reduce((a, b) => a + b, 0) / weights.length,
        minWeight: Math.min(...weights),
        maxWeight: Math.max(...weights),
      }
      onAddSummary(summary)
    }

    onUpdateActive({
      status: "idle",
      processData: null,
      startTime: undefined,
    })
    setShowStopDialog(false)
  }

  return (
    <div className="p-3 space-y-2">
      {/* Selector de tanque activo */}
      <div className="flex gap-3 justify-center">
        <button
          onClick={() => !isAnyTankFilling && setActiveTank(3)}
          disabled={isTank4Filling}
          className={cn(
            "px-4 py-1.5 rounded-lg font-bold text-sm transition-all duration-300",
            activeTank === 3
              ? "bg-gradient-to-r from-yellow-500 to-yellow-700 text-white shadow-lg shadow-yellow-500/50"
              : isTank4Filling
                ? "bg-[#1a1e25] text-gray-600 cursor-not-allowed opacity-50"
                : "bg-[#2a2e35] text-gray-400 hover:bg-[#3a3e45]",
          )}
        >
          Tanque 3
        </button>
        <button
          onClick={() => !isAnyTankFilling && setActiveTank(4)}
          disabled={isTank3Filling}
          className={cn(
            "px-4 py-1.5 rounded-lg font-bold text-sm transition-all duration-300",
            activeTank === 4
              ? "bg-gradient-to-r from-green-500 to-green-700 text-white shadow-lg shadow-green-500/50"
              : isTank3Filling
                ? "bg-[#1a1e25] text-gray-600 cursor-not-allowed opacity-50"
                : "bg-[#2a2e35] text-gray-400 hover:bg-[#3a3e45]",
          )}
        >
          Tanque 4
        </button>
      </div>

      <TankHeader tankNumber={activeTank} status={activeState.status} />

      <div className="grid grid-cols-[1fr_300px] gap-3">
        <TankInfo
          status={activeState.status}
          processData={activeState.processData}
          weight={activeState.weight}
          counter={activeState.counter}
          onStart={() => setShowStartDialog(true)}
          onStop={() => setShowStopDialog(true)}
        />

        {activeState.processData ? (
          <AutonomyIndicator
            targetQuantity={activeState.processData.targetQuantity}
            currentCount={activeState.counter}
            gpm={activeState.processData.gpm}
            startTime={activeState.startTime || null}
            tankNumber={activeTank}
          />
        ) : (
          <div className="rounded-xl p-4 border border-[#3a3e45] bg-[#1a1e25] flex items-center justify-center">
            <p className="text-gray-500 text-center text-sm">Inicie un proceso para ver la autonomía</p>
          </div>
        )}
      </div>

      <div>
        <WeightChart
          data={activeState.chartData}
          format={activeState.processData?.format || "25kg"}
          previousFormat={activeState.previousFormat}
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

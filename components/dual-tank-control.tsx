"use client"

import { useEffect, useState, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { TankHeader } from "./tank-header"
import { TankInfo } from "./tank-info"
import { WeightChart } from "./weight-chart"
import { StartProcessDialog } from "./start-process-dialog"
import { StopProcessDialog } from "./stop-process-dialog"
import type { TankState, ProcessData } from "./tank-control"
import type { PackagingSummary } from "./activity-log"
import { cn } from "@/lib/utils"
import { useMQTTClient } from "@/lib/mqtt-client"

interface DualTankControlProps {
  tank3State: TankState
  tank4State: TankState
  onUpdateTank3: (newState: Partial<TankState>) => void
  onUpdateTank4: (newState: Partial<TankState>) => void
  onAddSummary: (summary: Omit<PackagingSummary, "id">) => void
}

const formatWeights = {
  "5kg": 5,
  "10kg": 10,
  "20kg": 20,
  "25kg": 25,
}

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

  const mqtt = useMQTTClient()

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

  useEffect(() => {
    if (!mqtt.isConnected) return

    mqtt.subscribe(`terplast/tk3/peso_tanque`, (message) => {
      try {
        const data = JSON.parse(message)
        onUpdateTank3({ weight: data.peso })
      } catch (error) {
        console.error("[v0] Error parseando peso_tanque tk3:", error)
      }
    })

    mqtt.subscribe(`terplast/tk3/peso_envase`, (message) => {
      try {
        const data = JSON.parse(message)
        if (activeTank === 3 && tank3State.status === "filling" && tank3State.processData) {
          const nominalWeight = formatWeights[tank3State.processData.format]
          const tolerance = nominalWeight * 0.02

          onUpdateTank3({
            counter: tank3State.counter + 1,
            chartData: [...tank3State.chartData, { x: tank3State.chartData.length + 1, y: data.peso }].slice(-100),
          })

          const status =
            data.peso < nominalWeight - tolerance
              ? "fuera"
              : data.peso > nominalWeight + tolerance
                ? "fuera"
                : data.peso >= nominalWeight - tolerance && data.peso <= nominalWeight - tolerance / 2
                  ? "alerta"
                  : data.peso >= nominalWeight + tolerance / 2 && data.peso <= nominalWeight + tolerance
                    ? "alerta"
                    : "dentro"

          processMetrics.current.weights.push(data.peso)
          if (status === "dentro") processMetrics.current.withinTolerance++
          else if (status === "alerta") processMetrics.current.inAlert++
          else processMetrics.current.outOfTolerance++
        }
      } catch (error) {
        console.error("[v0] Error parseando peso_envase tk3:", error)
      }
    })

    mqtt.subscribe(`terplast/tk4/peso_tanque`, (message) => {
      try {
        const data = JSON.parse(message)
        onUpdateTank4({ weight: data.peso })
      } catch (error) {
        console.error("[v0] Error parseando peso_tanque tk4:", error)
      }
    })

    mqtt.subscribe(`terplast/tk4/peso_envase`, (message) => {
      try {
        const data = JSON.parse(message)
        if (activeTank === 4 && tank4State.status === "filling" && tank4State.processData) {
          const nominalWeight = formatWeights[tank4State.processData.format]
          const tolerance = nominalWeight * 0.02

          onUpdateTank4({
            counter: tank4State.counter + 1,
            chartData: [...tank4State.chartData, { x: tank4State.chartData.length + 1, y: data.peso }].slice(-100),
          })

          const status =
            data.peso < nominalWeight - tolerance
              ? "fuera"
              : data.peso > nominalWeight + tolerance
                ? "fuera"
                : data.peso >= nominalWeight - tolerance && data.peso <= nominalWeight - tolerance / 2
                  ? "alerta"
                  : data.peso >= nominalWeight + tolerance / 2 && data.peso <= nominalWeight + tolerance
                    ? "alerta"
                    : "dentro"

          processMetrics.current.weights.push(data.peso)
          if (status === "dentro") processMetrics.current.withinTolerance++
          else if (status === "alerta") processMetrics.current.inAlert++
          else processMetrics.current.outOfTolerance++
        }
      } catch (error) {
        console.error("[v0] Error parseando peso_envase tk4:", error)
      }
    })

    return () => {
      mqtt.unsubscribe(`terplast/tk3/peso_tanque`)
      mqtt.unsubscribe(`terplast/tk3/peso_envase`)
      mqtt.unsubscribe(`terplast/tk4/peso_tanque`)
      mqtt.unsubscribe(`terplast/tk4/peso_envase`)
    }
  }, [mqtt.isConnected, activeTank, tank3State, tank4State, onUpdateTank3, onUpdateTank4])

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
    })
    setShowStartDialog(false)

    mqtt.publish(`terplast/tk${activeTank}/comando`, {
      accion: "iniciar",
      timestamp: Date.now(),
      data: data,
    })
  }

  const handleStopProcess = () => {
    if (activeState.processData && processMetrics.current.weights.length > 0) {
      const weights = processMetrics.current.weights
      const endTime = new Date()
      const duracionSegundos = Math.floor((endTime.getTime() - processMetrics.current.startTime.getTime()) / 1000)

      const disponibilidad = 100
      const rendimiento = (activeState.counter / (duracionSegundos / 2)) * 100
      const calidad = (processMetrics.current.withinTolerance / activeState.counter) * 100
      const oee = (disponibilidad * rendimiento * calidad) / 10000

      const summary: Omit<PackagingSummary, "id"> = {
        tankNumber: activeTank,
        startTime: processMetrics.current.startTime,
        endTime,
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

      mqtt.publish(`terplast/tk${activeTank}/resumen`, {
        tankId: `tk${activeTank}`,
        legajo: activeState.processData.legajo,
        ordenEnvasado: activeState.processData.ordenEnvasado,
        inicio: processMetrics.current.startTime.getTime(),
        fin: endTime.getTime(),
        duracionSegundos,
        totalEnvases: activeState.counter,
        pesoPromedio: summary.averageWeight,
        pesoMin: summary.minWeight,
        pesoMax: summary.maxWeight,
        formatoSeleccionado: activeState.processData.format,
        toleranciaMinima: formatWeights[activeState.processData.format] * 0.98,
        toleranciaMaxima: formatWeights[activeState.processData.format] * 1.02,
        envasesOptimos: processMetrics.current.withinTolerance,
        envasesAlerta: processMetrics.current.inAlert,
        envasesFuera: processMetrics.current.outOfTolerance,
        disponibilidad: Math.round(disponibilidad * 100) / 100,
        rendimiento: Math.round(rendimiento * 100) / 100,
        calidad: Math.round(calidad * 100) / 100,
        oee: Math.round(oee * 100) / 100,
      })
    }

    onUpdateActive({
      status: "idle",
      processData: null,
    })
    setShowStopDialog(false)

    mqtt.publish(`terplast/tk${activeTank}/comando`, {
      accion: "detener",
      timestamp: Date.now(),
    })
  }

  return (
    <div className="p-3 space-y-2">
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

      <TankInfo
        status={activeState.status}
        processData={activeState.processData}
        weight={activeState.weight}
        counter={activeState.counter}
        onStart={() => setShowStartDialog(true)}
        onStop={() => setShowStopDialog(true)}
      />

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

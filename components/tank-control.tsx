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
import { useMQTTClient } from "@/lib/mqtt-client"
import type { TankControlProps } from "./tank-control-props"

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

export function TankControl({ tankNumber, tankState, onUpdateState, onAddSummary }: TankControlProps) {
  const [showStartDialog, setShowStartDialog] = useState(false)
  const [showStopDialog, setShowStopDialog] = useState(false)

  const mqtt = useMQTTClient()

  const processMetrics = useRef({
    startTime: new Date(),
    withinTolerance: 0,
    inAlert: 0,
    outOfTolerance: 0,
    weights: [] as number[],
  })

  useEffect(() => {
    if (!mqtt.isConnected) return

    const tankId = `tk${tankNumber}`

    mqtt.subscribe(`terplast/${tankId}/peso_tanque`, (message) => {
      try {
        const data = JSON.parse(message)
        console.log(`[v0] Peso tanque ${tankNumber} recibido:`, data.peso)
        onUpdateState({ weight: data.peso })
      } catch (error) {
        console.error("[v0] Error parseando peso_tanque:", error)
      }
    })

    mqtt.subscribe(`terplast/${tankId}/peso_envase`, (message) => {
      try {
        const data = JSON.parse(message)
        console.log(`[v0] Envase ${data.numeroEnvase} recibido:`, data.peso)

        if (tankState.status === "filling" && tankState.processData) {
          const nominalWeight = formatWeights[tankState.processData.format]
          const tolerance = nominalWeight * 0.02

          onUpdateState({
            counter: tankState.counter + 1,
            chartData: [
              ...tankState.chartData,
              {
                x: tankState.chartData.length + 1,
                y: data.peso,
              },
            ].slice(-100),
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
        console.error("[v0] Error parseando peso_envase:", error)
      }
    })

    return () => {
      mqtt.unsubscribe(`terplast/${tankId}/peso_tanque`)
      mqtt.unsubscribe(`terplast/${tankId}/peso_envase`)
    }
  }, [
    mqtt.isConnected,
    tankNumber,
    tankState.status,
    tankState.processData,
    tankState.counter,
    tankState.chartData,
    onUpdateState,
  ])

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

    mqtt.publish(`terplast/tk${tankNumber}/comando`, {
      accion: "iniciar",
      timestamp: Date.now(),
      data: data,
    })
  }

  const handleStopProcess = () => {
    if (tankState.processData && processMetrics.current.weights.length > 0) {
      const weights = processMetrics.current.weights
      const endTime = new Date()
      const duracionSegundos = Math.floor((endTime.getTime() - processMetrics.current.startTime.getTime()) / 1000)

      const disponibilidad = 100
      const rendimiento = (tankState.counter / (duracionSegundos / 2)) * 100
      const calidad = (processMetrics.current.withinTolerance / tankState.counter) * 100
      const oee = (disponibilidad * rendimiento * calidad) / 10000

      const summary: Omit<PackagingSummary, "id"> = {
        tankNumber,
        startTime: processMetrics.current.startTime,
        endTime,
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

      mqtt.publish(`terplast/tk${tankNumber}/resumen`, {
        tankId: `tk${tankNumber}`,
        legajo: tankState.processData.legajo,
        ordenEnvasado: tankState.processData.ordenEnvasado,
        inicio: processMetrics.current.startTime.getTime(),
        fin: endTime.getTime(),
        duracionSegundos,
        totalEnvases: tankState.counter,
        pesoPromedio: summary.averageWeight,
        pesoMin: summary.minWeight,
        pesoMax: summary.maxWeight,
        formatoSeleccionado: tankState.processData.format,
        toleranciaMinima: formatWeights[tankState.processData.format] * 0.98,
        toleranciaMaxima: formatWeights[tankState.processData.format] * 1.02,
        envasesOptimos: processMetrics.current.withinTolerance,
        envasesAlerta: processMetrics.current.inAlert,
        envasesFuera: processMetrics.current.outOfTolerance,
        disponibilidad: Math.round(disponibilidad * 100) / 100,
        rendimiento: Math.round(rendimiento * 100) / 100,
        calidad: Math.round(calidad * 100) / 100,
        oee: Math.round(oee * 100) / 100,
      })
    }

    onUpdateState({
      status: "idle",
      processData: null,
      previousFormat: tankState.processData?.format,
    })
    setShowStopDialog(false)

    mqtt.publish(`terplast/tk${tankNumber}/comando`, {
      accion: "detener",
      timestamp: Date.now(),
    })
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

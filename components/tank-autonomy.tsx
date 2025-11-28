"use client"

import { tankColors } from "./tank-selector"
import type { TankState } from "./tank-control"
import { Clock, Droplet, TrendingDown, Gauge } from "lucide-react"
import { useState, useEffect } from "react"

interface TankAutonomyProps {
  tankStates: Record<number, TankState>
}

export function TankAutonomy({ tankStates }: TankAutonomyProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      forceUpdate({})
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const calculateAutonomy = (tankNumber: number) => {
    const state = tankStates[tankNumber]
    if (!state || state.status !== "filling" || !state.processData) {
      return {
        timeRemaining: "N/A",
        timeRemainingFormatted: "N/A",
        consumptionRate: 0,
        gpm: 0,
      }
    }

    let theoreticalGPM = 4
    let kgPerContainer = 25

    if (state.processData.format === "25KG") {
      theoreticalGPM = 4
      kgPerContainer = 25
    } else if (state.processData.format === "20KG") {
      theoreticalGPM = 11
      kgPerContainer = 20
    } else if (state.processData.format === "10KG") {
      theoreticalGPM = 13
      kgPerContainer = 10
    }

    const consumptionRate = theoreticalGPM * kgPerContainer // kg/min

    const currentWeight = state.weight
    const minutesRemaining = currentWeight / consumptionRate

    // Convertir a horas y minutos
    const hours = Math.floor(minutesRemaining / 60)
    const minutes = Math.floor(minutesRemaining % 60)

    return {
      timeRemaining: hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`,
      timeRemainingFormatted: `(${hours} h ${minutes} min)`,
      consumptionRate: consumptionRate.toFixed(1),
      gpm: theoreticalGPM,
    }
  }

  const tanks = [3, 4, 5, 6]

  return (
    <div className="h-full bg-gradient-to-br from-[#0f1419] to-[#1a1e25] p-4 overflow-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header compacto */}
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold text-white">Autonomía de Tanques</h1>

          <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-2 border-cyan-500/30 rounded-xl px-4 py-2 flex items-center gap-3">
            <Clock className="w-6 h-6 text-cyan-400" />
            <div>
              <div className="text-3xl font-bold text-white tabular-nums">
                {currentTime.toLocaleTimeString("es-AR", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                  timeZone: "America/Argentina/Buenos_Aires",
                })}
              </div>
              <div className="text-xs text-gray-400">Buenos Aires, Argentina</div>
            </div>
          </div>
        </div>

        {/* Grid de tarjetas compactas - 2x2 */}
        <div className="grid grid-cols-2 gap-3">
          {tanks.map((tankNumber) => {
            const state = tankStates[tankNumber]
            const colors = tankColors[tankNumber as keyof typeof tankColors]
            const autonomy = calculateAutonomy(tankNumber)
            const isActive = state?.status === "filling"

            return (
              <div
                key={tankNumber}
                className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                  isActive
                    ? `${colors.border} bg-gradient-to-br from-[#1a1e25] to-[#2a2e35] ${colors.shadow}`
                    : "border-[#2a2e35] bg-[#1a1e25]"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
                        isActive ? `bg-gradient-to-br ${colors.bg} text-white` : "bg-[#2a2e35] text-gray-400"
                      }`}
                    >
                      TK{tankNumber}
                    </div>
                    <div>
                      <div className={`text-lg font-bold ${isActive ? colors.text : "text-gray-400"}`}>
                        TANQUE {tankNumber}
                      </div>
                      <div className="text-sm text-gray-500">{isActive ? "Envasando" : "Detenido"}</div>
                    </div>
                  </div>
                  {isActive && (
                    <div
                      className="w-3 h-3 rounded-full animate-pulse"
                      style={{
                        backgroundColor: colors.fill,
                        boxShadow: `0 0 10px ${colors.fill}`,
                      }}
                    />
                  )}
                </div>

                {/* Información con texto más grande */}
                <div className="space-y-3">
                  <div className="bg-[#0f1419] rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className={`w-5 h-5 ${isActive ? colors.text : "text-gray-500"}`} />
                      <span className="text-sm text-gray-400 font-medium">Autonomía de Envasado</span>
                    </div>
                    <div className={`text-4xl font-bold ${isActive ? "text-white" : "text-gray-500"}`}>
                      {autonomy.timeRemaining}
                    </div>
                    {isActive && autonomy.timeRemainingFormatted !== "N/A" && (
                      <div className="text-sm text-gray-400 mt-1">{autonomy.timeRemainingFormatted}</div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-[#0f1419] rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Droplet className={`w-4 h-4 ${isActive ? colors.text : "text-gray-500"}`} />
                      </div>
                      <div className="text-xs text-gray-400">Peso</div>
                      <div className={`text-2xl font-bold ${isActive ? "text-white" : "text-gray-500"}`}>
                        {state?.weight.toFixed(0)}
                      </div>
                      <div className="text-xs text-gray-500">kg</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingDown className={`w-4 h-4 ${isActive ? colors.text : "text-gray-500"}`} />
                      </div>
                      <div className="text-xs text-gray-400">Consumo</div>
                      <div className={`text-2xl font-bold ${isActive ? "text-white" : "text-gray-500"}`}>
                        {isActive ? autonomy.consumptionRate : "0"}
                      </div>
                      <div className="text-xs text-gray-500">kg/min</div>
                    </div>

                    <div className="bg-[#0f1419] rounded-lg p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Gauge className={`w-4 h-4 ${isActive ? colors.text : "text-gray-500"}`} />
                      </div>
                      <div className="text-xs text-gray-400">Golpes</div>
                      <div className={`text-2xl font-bold ${isActive ? "text-white" : "text-gray-500"}`}>
                        {isActive ? autonomy.gpm : "0"}
                      </div>
                      <div className="text-xs text-gray-500">gpm</div>
                    </div>
                  </div>

                  {/* Info del proceso sin cambios */}
                  {isActive && state?.processData && (
                    <div className="border-t border-[#2a2e35] pt-2">
                      <div className="text-xs text-gray-500 space-y-0.5">
                        <div className="flex justify-between">
                          <span>Legajo:</span>
                          <span className="text-gray-400 font-medium">{state.processData.legajo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Orden:</span>
                          <span className="text-gray-400 font-medium">{state.processData.ordenEnvasado}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Formato:</span>
                          <span className="text-gray-400 font-medium">{state.processData.format}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Nota compacta */}
        <div className="mt-3 p-2 bg-[#1a1e25] border border-[#2a2e35] rounded-lg">
          <p className="text-xs text-gray-400">
            <span className="font-semibold text-cyan-400">Nota:</span> Cálculos basados en GPM estándar - 25kg: 4 GPM,
            20kg: 11 GPM, 10kg: 13 GPM
          </p>
        </div>
      </div>
    </div>
  )
}

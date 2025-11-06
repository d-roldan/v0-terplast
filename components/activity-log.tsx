"use client"

import { cn } from "@/lib/utils"
import type { ProcessData } from "./tank-control"

export interface PackagingSummary {
  id: string
  tankNumber: number
  startTime: Date
  endTime: Date
  processData: ProcessData
  totalUnits: number
  withinTolerance: number
  inAlert: number
  outOfTolerance: number
  averageWeight: number
  minWeight: number
  maxWeight: number
}

interface ActivityLogProps {
  summaries: PackagingSummary[]
}

const tankColors = {
  3: "text-yellow-400 bg-yellow-500/20",
  4: "text-green-400 bg-green-500/20",
  5: "text-purple-400 bg-purple-500/20",
  6: "text-pink-400 bg-pink-500/20",
}

export function ActivityLog({ summaries }: ActivityLogProps) {
  const calculateMetrics = (summary: PackagingSummary) => {
    const calidad = ((summary.withinTolerance / summary.totalUnits) * 100).toFixed(1)
    const rendimiento = (((summary.withinTolerance + summary.inAlert) / summary.totalUnits) * 100).toFixed(1)
    const disponibilidad = ((summary.totalUnits / (summary.totalUnits + summary.outOfTolerance * 2)) * 100).toFixed(1)

    return { calidad, rendimiento, disponibilidad }
  }

  return (
    <div className="h-screen bg-[#1a1e25] p-6 overflow-auto">
      <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600 mb-6">
        Resumen de Envasados
      </h2>

      <div className="space-y-4">
        {summaries.length === 0 ? (
          <div className="text-gray-500 text-center py-16 text-lg bg-[#2a2e35] rounded-xl border border-[#3a3e45]">
            No hay envasados completados
          </div>
        ) : (
          summaries.map((summary) => {
            const metrics = calculateMetrics(summary)
            const duration = Math.round((summary.endTime.getTime() - summary.startTime.getTime()) / 1000 / 60)

            return (
              <div
                key={summary.id}
                className="bg-[#2a2e35] rounded-xl p-5 border border-[#3a3e45] hover:border-[#4a4e55] transition-colors"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "font-bold text-lg px-3 py-1 rounded-lg",
                        tankColors[summary.tankNumber as keyof typeof tankColors],
                      )}
                    >
                      TK{summary.tankNumber}
                    </span>
                    <div>
                      <div className="text-white font-semibold text-lg">OF: {summary.processData.of}</div>
                      <div className="text-gray-400 text-sm">{summary.processData.description}</div>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    <div>{summary.startTime.toLocaleDateString("es-ES")}</div>
                    <div>
                      {summary.startTime.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      -{" "}
                      {summary.endTime.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                    <div className="text-cyan-400 font-semibold">{duration} min</div>
                  </div>
                </div>

                {/* Datos del proceso */}
                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div className="bg-[#1a1e25] rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Total Unidades</div>
                    <div className="text-white text-2xl font-bold">{summary.totalUnits}</div>
                  </div>
                  <div className="bg-[#1a1e25] rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Formato</div>
                    <div className="text-cyan-400 text-2xl font-bold">{summary.processData.format}</div>
                  </div>
                  <div className="bg-[#1a1e25] rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Peso Promedio</div>
                    <div className="text-white text-2xl font-bold">{summary.averageWeight.toFixed(2)} kg</div>
                  </div>
                  <div className="bg-[#1a1e25] rounded-lg p-3">
                    <div className="text-gray-400 text-xs mb-1">Rango</div>
                    <div className="text-white text-lg font-bold">
                      {summary.minWeight.toFixed(2)} - {summary.maxWeight.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Métricas OEE */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-lg p-3 border border-green-500/30">
                    <div className="text-green-400 text-xs font-semibold mb-1">CALIDAD</div>
                    <div className="text-white text-3xl font-bold">{metrics.calidad}%</div>
                    <div className="text-green-300 text-xs mt-1">{summary.withinTolerance} dentro de tolerancia</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-lg p-3 border border-blue-500/30">
                    <div className="text-blue-400 text-xs font-semibold mb-1">RENDIMIENTO</div>
                    <div className="text-white text-3xl font-bold">{metrics.rendimiento}%</div>
                    <div className="text-blue-300 text-xs mt-1">
                      {summary.withinTolerance + summary.inAlert} aceptables
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 rounded-lg p-3 border border-purple-500/30">
                    <div className="text-purple-400 text-xs font-semibold mb-1">DISPONIBILIDAD</div>
                    <div className="text-white text-3xl font-bold">{metrics.disponibilidad}%</div>
                    <div className="text-purple-300 text-xs mt-1">{summary.outOfTolerance} rechazos</div>
                  </div>
                </div>

                {/* Distribución de tolerancias */}
                <div className="flex gap-2">
                  <div className="flex-1 bg-green-500/20 rounded-lg p-2 border border-green-500/30">
                    <div className="text-green-400 text-xs">Dentro</div>
                    <div className="text-white font-bold">{summary.withinTolerance}</div>
                  </div>
                  <div className="flex-1 bg-yellow-500/20 rounded-lg p-2 border border-yellow-500/30">
                    <div className="text-yellow-400 text-xs">Alerta</div>
                    <div className="text-white font-bold">{summary.inAlert}</div>
                  </div>
                  <div className="flex-1 bg-red-500/20 rounded-lg p-2 border border-red-500/30">
                    <div className="text-red-400 text-xs">Fuera</div>
                    <div className="text-white font-bold">{summary.outOfTolerance}</div>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"

interface AutonomyIndicatorProps {
  currentCount: number
  standardCount: number
  tankNumber?: number
  compact?: boolean
}

export function AutonomyIndicator({
  currentCount,
  standardCount,
  tankNumber,
  compact = false,
}: AutonomyIndicatorProps) {
  const percentage = Math.min((currentCount / standardCount) * 100, 100)
  const remaining = Math.max(standardCount - currentCount, 0)

  // Determinar color basado en el porcentaje
  const getColor = () => {
    if (percentage >= 90) return "red"
    if (percentage >= 70) return "yellow"
    return "green"
  }

  const color = getColor()

  const colorClasses = {
    green: {
      bg: "bg-green-500",
      text: "text-green-400",
      border: "border-green-500/30",
      gradient: "from-green-500/20 to-green-600/10",
    },
    yellow: {
      bg: "bg-yellow-500",
      text: "text-yellow-400",
      border: "border-yellow-500/30",
      gradient: "from-yellow-500/20 to-yellow-600/10",
    },
    red: {
      bg: "bg-red-500",
      text: "text-red-400",
      border: "border-red-500/30",
      gradient: "from-red-500/20 to-red-600/10",
    },
  }

  if (compact) {
    return (
      <div
        className={cn(
          "rounded-lg p-2 border backdrop-blur-sm",
          `bg-gradient-to-br ${colorClasses[color].gradient} ${colorClasses[color].border}`,
        )}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <div className="text-[10px] text-gray-400 uppercase font-semibold mb-0.5">Autonomía</div>
            <div className={cn("text-lg font-bold", colorClasses[color].text)}>{remaining}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500">Estándar</div>
            <div className="text-sm text-gray-300 font-semibold">{standardCount}</div>
          </div>
        </div>
        <div className="mt-2 bg-[#1a1e25] rounded-full h-1.5 overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500", colorClasses[color].bg)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "rounded-xl p-4 border backdrop-blur-sm",
        `bg-gradient-to-br ${colorClasses[color].gradient} ${colorClasses[color].border}`,
      )}
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs text-gray-400 uppercase font-semibold mb-1">Indicador de Autonomía</div>
          {tankNumber && <div className="text-sm text-gray-300">Tanque {tankNumber}</div>}
        </div>
        <div className={cn("text-4xl font-bold", colorClasses[color].text)}>{percentage.toFixed(0)}%</div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#1a1e25] rounded-lg p-2.5">
          <div className="text-xs text-gray-400 mb-1">Actual</div>
          <div className="text-white text-2xl font-bold">{currentCount}</div>
        </div>
        <div className="bg-[#1a1e25] rounded-lg p-2.5">
          <div className="text-xs text-gray-400 mb-1">Estándar</div>
          <div className="text-cyan-400 text-2xl font-bold">{standardCount}</div>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Restantes</span>
          <span className={cn("font-bold", colorClasses[color].text)}>{remaining} unidades</span>
        </div>
        <div className="bg-[#1a1e25] rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={cn("h-full transition-all duration-500 rounded-full shadow-lg", colorClasses[color].bg)}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className={cn("w-2 h-2 rounded-full animate-pulse", colorClasses[color].bg)} />
        <span className="text-gray-400">
          {percentage >= 90
            ? "Nivel crítico - Reposición urgente"
            : percentage >= 70
              ? "Nivel de alerta - Planificar reposición"
              : "Nivel óptimo"}
        </span>
      </div>
    </div>
  )
}

"use client"

import { cn } from "@/lib/utils"

interface AutonomyIndicatorProps {
  targetQuantity: number // Cantidad total a envasar
  currentCount: number // Cantidad ya envasada
  gpm: number // Golpes Por Minuto estándar del material
  startTime: number | null // Timestamp de inicio del proceso
  tankNumber?: number
  compact?: boolean
}

export function AutonomyIndicator({
  targetQuantity,
  currentCount,
  gpm,
  startTime,
  tankNumber,
  compact = false,
}: AutonomyIndicatorProps) {
  const idealTimeMinutes = gpm > 0 ? targetQuantity / gpm : 0

  const elapsedMinutes = startTime ? (Date.now() - startTime) / 60000 : 0
  const realTimeMinutes =
    currentCount > 0 && elapsedMinutes > 0 ? (elapsedMinutes / currentCount) * targetQuantity : idealTimeMinutes

  const remainingIdealMinutes = Math.max(0, idealTimeMinutes - elapsedMinutes)
  const remainingRealMinutes = Math.max(0, realTimeMinutes - elapsedMinutes)

  const progressPercentage = targetQuantity > 0 ? Math.min((currentCount / targetQuantity) * 100, 100) : 0

  const efficiency = realTimeMinutes > 0 ? (idealTimeMinutes / realTimeMinutes) * 100 : 100
  const isEfficient = efficiency >= 95 // 95% o más se considera eficiente

  const getColor = () => {
    if (remainingIdealMinutes < 30 || efficiency < 80) return "red" // Crítico: menos de 30 min o <80% eficiencia
    if (remainingIdealMinutes < 60 || efficiency < 90) return "yellow" // Alerta: menos de 60 min o <90% eficiencia
    return "green" // Óptimo
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

  const formatTime = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60)
      const mins = Math.round(minutes % 60)
      return `${hours}h ${mins}m`
    }
    return `${Math.round(minutes)} min`
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
            <div className="flex gap-2 items-baseline">
              <div className={cn("text-sm font-bold", colorClasses[color].text)}>
                {formatTime(remainingIdealMinutes)}
              </div>
              <div className="text-xs text-gray-500">/ {formatTime(remainingRealMinutes)}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500">Eficiencia</div>
            <div className={cn("text-sm font-semibold", isEfficient ? "text-green-400" : "text-orange-400")}>
              {efficiency.toFixed(0)}%
            </div>
          </div>
        </div>
        <div className="mt-2 bg-[#1a1e25] rounded-full h-1.5 overflow-hidden">
          <div
            className={cn("h-full transition-all duration-500", colorClasses[color].bg)}
            style={{ width: `${progressPercentage}%` }}
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
        <div
          className={cn(
            "text-xs px-2 py-1 rounded-full font-bold",
            isEfficient ? "bg-green-500/20 text-green-400" : "bg-orange-500/20 text-orange-400",
          )}
        >
          {efficiency.toFixed(0)}% Eficiencia
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#1a1e25] rounded-lg p-3 border border-cyan-500/30">
          <div className="text-xs text-cyan-400 font-semibold mb-1 uppercase">IDEAL</div>
          <div className="text-cyan-400 text-3xl font-bold mb-1">{formatTime(remainingIdealMinutes)}</div>
          <div className="text-xs text-gray-500">Según GPM: {gpm} gol/min</div>
          <div className="text-[10px] text-gray-600 mt-1">Tiempo total: {formatTime(idealTimeMinutes)}</div>
        </div>

        <div className="bg-[#1a1e25] rounded-lg p-3 border border-orange-500/30">
          <div className="text-xs text-orange-400 font-semibold mb-1 uppercase">REAL</div>
          <div className="text-orange-400 text-3xl font-bold mb-1">{formatTime(remainingRealMinutes)}</div>
          <div className="text-xs text-gray-500">Ritmo actual</div>
          <div className="text-[10px] text-gray-600 mt-1">Tiempo total: {formatTime(realTimeMinutes)}</div>
        </div>
      </div>

      <div className="bg-[#1a1e25] rounded-lg p-3 mb-3 border border-[#2a2e35]">
        <div className="flex justify-between text-xs text-gray-400 mb-2">
          <span>Progreso de Envasado</span>
          <span className="text-white font-bold">
            {currentCount} / {targetQuantity} unidades
          </span>
        </div>
        <div className="bg-[#0b0e12] rounded-full h-3 overflow-hidden shadow-inner mb-2">
          <div
            className={cn("h-full transition-all duration-500 rounded-full shadow-lg", colorClasses[color].bg)}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px]">
          <span className="text-gray-500">Tiempo transcurrido: {formatTime(elapsedMinutes)}</span>
          <span className={cn("font-bold", colorClasses[color].text)}>{progressPercentage.toFixed(1)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-[#1a1e25] rounded-lg p-2">
          <div className="text-[10px] text-gray-400 mb-0.5">GPM Estándar</div>
          <div className="text-white text-lg font-bold">{gpm}</div>
        </div>
        <div className="bg-[#1a1e25] rounded-lg p-2">
          <div className="text-[10px] text-gray-400 mb-0.5">GPM Real</div>
          <div className="text-cyan-400 text-lg font-bold">
            {elapsedMinutes > 0 ? (currentCount / elapsedMinutes).toFixed(1) : "0.0"}
          </div>
        </div>
        <div className="bg-[#1a1e25] rounded-lg p-2">
          <div className="text-[10px] text-gray-400 mb-0.5">Diferencia</div>
          <div
            className={cn("text-lg font-bold", realTimeMinutes > idealTimeMinutes ? "text-red-400" : "text-green-400")}
          >
            {realTimeMinutes > idealTimeMinutes ? "+" : ""}
            {formatTime(Math.abs(realTimeMinutes - idealTimeMinutes))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <div className={cn("w-2 h-2 rounded-full animate-pulse", colorClasses[color].bg)} />
        <span className="text-gray-400">
          {color === "red"
            ? efficiency < 80
              ? "Rendimiento bajo - Revisar proceso"
              : "Tiempo crítico - Acelerar producción"
            : color === "yellow"
              ? efficiency < 90
                ? "Eficiencia moderada - Optimizar"
                : "Atención - Tiempo limitado"
              : "Operación óptima"}
        </span>
      </div>
    </div>
  )
}

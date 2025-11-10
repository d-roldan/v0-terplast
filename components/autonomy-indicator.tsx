"use client"

import { cn } from "@/lib/utils"

interface AutonomyIndicatorProps {
  availableKg: number // Kg disponibles en el tanque
  packagingStandardKgMin: number // Estándar de envasado en Kg/min
  targetQuantityKg?: number // Cantidad objetivo de la orden (opcional)
  tankNumber?: number
  compact?: boolean
}

export function AutonomyIndicator({
  availableKg,
  packagingStandardKgMin,
  targetQuantityKg,
  tankNumber,
  compact = false,
}: AutonomyIndicatorProps) {
  const autonomyMinutes = packagingStandardKgMin > 0 ? availableKg / packagingStandardKgMin : 0

  // Calcular porcentaje solo si hay cantidad objetivo
  const percentage =
    targetQuantityKg && targetQuantityKg > 0 ? Math.min((availableKg / targetQuantityKg) * 100, 100) : 0

  // Determinar color basado en la autonomía en minutos
  const getColor = () => {
    if (autonomyMinutes < 30) return "red" // Menos de 30 minutos = crítico
    if (autonomyMinutes < 60) return "yellow" // Menos de 1 hora = alerta
    return "green" // Más de 1 hora = óptimo
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

  // Formatear autonomía para mostrar
  const formatAutonomy = (minutes: number) => {
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
            <div className={cn("text-lg font-bold", colorClasses[color].text)}>{formatAutonomy(autonomyMinutes)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-gray-500">Disponible</div>
            <div className="text-sm text-gray-300 font-semibold">{availableKg.toFixed(0)} kg</div>
          </div>
        </div>
        {targetQuantityKg && targetQuantityKg > 0 && (
          <div className="mt-2 bg-[#1a1e25] rounded-full h-1.5 overflow-hidden">
            <div
              className={cn("h-full transition-all duration-500", colorClasses[color].bg)}
              style={{ width: `${percentage}%` }}
            />
          </div>
        )}
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
        <div className={cn("text-4xl font-bold", colorClasses[color].text)}>{formatAutonomy(autonomyMinutes)}</div>
      </div>

      <div className="bg-[#1a1e25] rounded-lg p-3 mb-3 border border-[#2a2e35]">
        <div className="text-xs text-gray-400 mb-2 text-center">Autonomía (min) =</div>
        <div className="flex items-center justify-center gap-2 text-sm">
          <div className="text-center">
            <div className="text-cyan-400 font-bold text-lg">{availableKg.toFixed(0)} kg</div>
            <div className="text-gray-500 text-xs">Kg Aprobados</div>
          </div>
          <div className="text-gray-500 text-xl">÷</div>
          <div className="text-center">
            <div className="text-orange-400 font-bold text-lg">{packagingStandardKgMin.toFixed(2)} kg/min</div>
            <div className="text-gray-500 text-xs">Estándar Envasado</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-[#1a1e25] rounded-lg p-2.5">
          <div className="text-xs text-gray-400 mb-1">Material Disponible</div>
          <div className="text-white text-2xl font-bold">{availableKg.toFixed(0)} kg</div>
        </div>
        <div className="bg-[#1a1e25] rounded-lg p-2.5">
          <div className="text-xs text-gray-400 mb-1">Velocidad Envasado</div>
          <div className="text-cyan-400 text-2xl font-bold">{packagingStandardKgMin.toFixed(1)} kg/min</div>
        </div>
      </div>

      {targetQuantityKg && targetQuantityKg > 0 && (
        <>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progreso de la Orden</span>
              <span className={cn("font-bold", colorClasses[color].text)}>
                {availableKg.toFixed(0)} / {targetQuantityKg.toFixed(0)} kg
              </span>
            </div>
            <div className="bg-[#1a1e25] rounded-full h-3 overflow-hidden shadow-inner">
              <div
                className={cn("h-full transition-all duration-500 rounded-full shadow-lg", colorClasses[color].bg)}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-2 text-xs">
        <div className={cn("w-2 h-2 rounded-full animate-pulse", colorClasses[color].bg)} />
        <span className="text-gray-400">
          {autonomyMinutes < 30
            ? "Nivel crítico - Reposición urgente"
            : autonomyMinutes < 60
              ? "Nivel de alerta - Planificar reposición"
              : "Nivel óptimo"}
        </span>
      </div>
    </div>
  )
}

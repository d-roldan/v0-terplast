"use client"

import { cn } from "@/lib/utils"
import { ClipboardList } from "lucide-react"
import type { TankState } from "./tank-control"

interface TankSelectorProps {
  selectedTank: number | "3-4" | "log"
  onSelectTank: (tank: number | "3-4" | "log") => void
  tankStates: Record<number, TankState>
}

const tankColors = {
  "3-4": {
    bg: "from-yellow-500 via-green-500 to-green-700",
    shadow: "shadow-yellow-500/50",
    text: "text-yellow-400",
    border: "border-yellow-500",
    fill: "#eab308", // Color de llenado para animación de lata
  },
  3: {
    bg: "from-yellow-500 to-yellow-700",
    shadow: "shadow-yellow-500/50",
    text: "text-yellow-400",
    border: "border-yellow-500",
    fill: "#eab308", // Amarillo para TK3
  },
  4: {
    bg: "from-green-500 to-green-700",
    shadow: "shadow-green-500/50",
    text: "text-green-400",
    border: "border-green-500",
    fill: "#22c55e", // Verde para TK4
  },
  5: {
    bg: "from-purple-500 to-purple-700",
    shadow: "shadow-purple-500/50",
    text: "text-purple-400",
    border: "border-purple-500",
    fill: "#a855f7", // Morado para TK5
  },
  6: {
    bg: "from-pink-500 to-pink-700",
    shadow: "shadow-pink-500/50",
    text: "text-pink-400",
    border: "border-pink-500",
    fill: "#ec4899", // Rosa para TK6
  },
  log: {
    bg: "from-orange-500 to-orange-700",
    shadow: "shadow-orange-500/50",
    text: "text-orange-400",
    border: "border-orange-500",
    fill: "#f97316", // Naranja para LOG
  },
}

export function TankSelector({ selectedTank, onSelectTank, tankStates }: TankSelectorProps) {
  const tanks: Array<number | "3-4" | "log"> = ["3-4", 5, 6, "log"]

  return (
    <div className="w-24 bg-[#1a1e25] border-r border-[#2a2e35] flex flex-col items-center py-6 gap-3">
      <div className="text-cyan-400 font-bold text-sm mb-4 tracking-wider">TANQUES</div>

      {tanks.map((tank) => {
        const colors = tankColors[tank as keyof typeof tankColors]
        const isActive =
          tank === "3-4"
            ? tankStates[3]?.status === "filling" || tankStates[4]?.status === "filling"
            : typeof tank === "number"
              ? tankStates[tank]?.status === "filling"
              : false

        return (
          <button
            key={tank}
            onClick={() => onSelectTank(tank)}
            className={cn(
              "w-16 h-16 rounded-xl font-bold text-xs transition-all duration-300 relative",
              "flex items-center justify-center",
              selectedTank === tank
                ? `bg-gradient-to-br ${colors.bg} text-white shadow-lg ${colors.shadow} scale-110`
                : "bg-[#2a2e35] text-gray-400 hover:bg-[#3a3e45] hover:text-gray-200",
            )}
          >
            {tank === "3-4" ? (
              <div className="flex flex-col items-center leading-tight">
                <span>TK3</span>
                <span className="text-[10px]">&</span>
                <span>TK4</span>
              </div>
            ) : tank === "log" ? (
              <div className="flex flex-col items-center gap-1">
                <ClipboardList className="w-6 h-6" />
                <span className="text-[9px]">LOG</span>
              </div>
            ) : (
              `TK${tank}`
            )}
            {isActive && (
              <div className="absolute -top-1 -right-1">
                <span
                  className={cn(
                    "block w-4 h-4 rounded-full animate-pulse",
                    "border-2 border-[#1a1e25]",
                    "shadow-lg",
                    selectedTank === tank ? "bg-white shadow-white/50" : `bg-[${colors.fill}]`,
                  )}
                  style={{
                    backgroundColor: selectedTank === tank ? "white" : colors.fill,
                    boxShadow:
                      selectedTank === tank ? "0 0 10px rgba(255, 255, 255, 0.8)" : `0 0 10px ${colors.fill}80`,
                  }}
                />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}

export { tankColors }

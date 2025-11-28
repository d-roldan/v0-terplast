"use client"

import { cn } from "@/lib/utils"
import { ClipboardList, Clock } from "lucide-react"
import type { TankState } from "./tank-control"

interface TankSelectorProps {
  selectedTank: number | "3-4" | "log" | "autonomy"
  onSelectTank: (tank: number | "3-4" | "log" | "autonomy") => void
  tankStates: Record<number, TankState>
}

const tankColors = {
  "3-4": {
    bg: "from-yellow-500 via-green-500 to-green-700",
    shadow: "shadow-yellow-500/50",
    text: "text-yellow-400",
    border: "border-yellow-500",
    fill: "#eab308",
  },
  3: {
    bg: "from-yellow-500 to-yellow-700",
    shadow: "shadow-yellow-500/50",
    text: "text-yellow-400",
    border: "border-yellow-500",
    fill: "#eab308",
  },
  4: {
    bg: "from-green-500 to-green-700",
    shadow: "shadow-green-500/50",
    text: "text-green-400",
    border: "border-green-500",
    fill: "#22c55e",
  },
  5: {
    bg: "from-purple-500 to-purple-700",
    shadow: "shadow-purple-500/50",
    text: "text-purple-400",
    border: "border-purple-500",
    fill: "#a855f7",
  },
  6: {
    bg: "from-pink-500 to-pink-700",
    shadow: "shadow-pink-500/50",
    text: "text-pink-400",
    border: "border-pink-500",
    fill: "#ec4899",
  },
  log: {
    bg: "from-orange-500 to-orange-700",
    shadow: "shadow-orange-500/50",
    text: "text-orange-400",
    border: "border-orange-500",
    fill: "#f97316",
  },
  autonomy: {
    bg: "from-cyan-500 to-cyan-700",
    shadow: "shadow-cyan-500/50",
    text: "text-cyan-400",
    border: "border-cyan-500",
    fill: "#06b6d4",
  },
}

export function TankSelector({ selectedTank, onSelectTank, tankStates }: TankSelectorProps) {
  const tanks: Array<number | "3-4" | "log" | "autonomy"> = ["3-4", 5, 6, "autonomy", "log"]

  return (
    <div className="w-24 bg-[#1a1e25] border-r border-[#2a2e35] flex flex-col items-center py-6 gap-3">
      <div className="text-cyan-400 font-bold text-sm mb-4 tracking-wider">TERPLAST</div>

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
            ) : tank === "autonomy" ? (
              <div className="flex flex-col items-center gap-1">
                <Clock className="w-6 h-6" />
                <span className="text-[9px]">AUTO</span>
              </div>
            ) : (
              `TK${tank}`
            )}
            {isActive && tank !== "log" && tank !== "autonomy" && (
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

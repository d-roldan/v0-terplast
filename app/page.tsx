"use client"

import { useState } from "react"
import { TankSelector } from "@/components/tank-selector"
import { TankControl } from "@/components/tank-control"
import { DualTankControl } from "@/components/dual-tank-control"
import { ActivityLog } from "@/components/activity-log"
import type { TankState } from "@/components/tank-control"
import type { PackagingSummary } from "@/components/activity-log"

export default function Home() {
  const [selectedTank, setSelectedTank] = useState<number | "3-4" | "log">("3-4")
  const [tankStates, setTankStates] = useState<Record<number, TankState>>({
    3: { status: "idle", weight: 1950, counter: 313, chartData: [], processData: null },
    4: { status: "idle", weight: 1950, counter: 313, chartData: [], processData: null },
    5: { status: "idle", weight: 1950, counter: 313, chartData: [], processData: null },
    6: { status: "idle", weight: 1950, counter: 313, chartData: [], processData: null },
  })

  const [packagingSummaries, setPackagingSummaries] = useState<PackagingSummary[]>([])

  const updateTankState = (tankNumber: number, newState: Partial<TankState>) => {
    setTankStates((prev) => ({
      ...prev,
      [tankNumber]: { ...prev[tankNumber], ...newState },
    }))
  }

  const addPackagingSummary = (summary: Omit<PackagingSummary, "id">) => {
    const newSummary: PackagingSummary = {
      ...summary,
      id: Date.now().toString(),
    }
    setPackagingSummaries((prev) => [newSummary, ...prev])
  }

  return (
    <div className="h-screen bg-[#0b0e12] flex overflow-hidden">
      {/* Columna izquierda - Selector de tanques */}
      <TankSelector selectedTank={selectedTank} onSelectTank={setSelectedTank} tankStates={tankStates} />

      {/* Área principal - Control del tanque o registro */}
      <div className="flex-1 overflow-auto">
        {selectedTank === "log" ? (
          <ActivityLog summaries={packagingSummaries} />
        ) : selectedTank === "3-4" ? (
          <DualTankControl
            tank3State={tankStates[3]}
            tank4State={tankStates[4]}
            onUpdateTank3={(newState) => updateTankState(3, newState)}
            onUpdateTank4={(newState) => updateTankState(4, newState)}
            onAddSummary={addPackagingSummary}
          />
        ) : (
          <TankControl
            tankNumber={selectedTank as number}
            tankState={tankStates[selectedTank as number]}
            onUpdateState={(newState) => updateTankState(selectedTank as number, newState)}
            onAddSummary={addPackagingSummary}
          />
        )}
      </div>
    </div>
  )
}

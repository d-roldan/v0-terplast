"use client"

import { motion } from "framer-motion"
import type { ProcessStatus, ProcessData } from "./tank-control"
import { Button } from "./ui/button"

interface TankInfoProps {
  status: ProcessStatus
  processData: ProcessData | null
  weight: number
  counter: number
  onStart: () => void
  onStop: () => void
}

export function TankInfo({ status, processData, weight, counter, onStart, onStop }: TankInfoProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-4 gap-2">
        {/* Legajo */}
        <div className="bg-[#1a1e25] rounded-xl p-2 border border-[#3a3e45] flex flex-col justify-between h-[70px]">
          <div className="text-gray-400 text-[10px] mb-1">Legajo:</div>
          <div className="font-bold text-white truncate text-3xl text-center">{processData?.legajo || "—"}</div>
        </div>

        {/* Orden de Envasado */}
        <div className="bg-[#1a1e25] rounded-xl p-2 border border-[#3a3e45] flex flex-col justify-between h-[70px]">
          <div className="text-gray-400 text-[10px] mb-1">Orden de Envasado:</div>
          <div className="font-bold text-white truncate text-3xl text-center">{processData?.ordenEnvasado || "—"}</div>
        </div>

        {/* Peso TK */}
        <div className="bg-[#1a1e25] rounded-xl p-2 border border-[#3a3e45] flex flex-col justify-between h-[70px]">
          <div className="text-pink-400 text-sm font-bold mb-1">Peso TK{processData ? "6" : "6"}</div>
          <motion.div
            key={weight}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="font-bold text-pink-300 px-0 mx-0 my-0 border-0 leading-7 tracking-normal text-3xl text-center"
          >
            {Math.round(weight)} kg
          </motion.div>
        </div>

        {/* Contador */}
        <div className="bg-[#1a1e25] rounded-xl p-2 border border-[#3a3e45] flex flex-col justify-between h-[70px]">
          <div className="text-lime-400 text-sm font-bold mb-1">Contador</div>
          <motion.div
            key={counter}
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            className="font-bold text-lime-300 text-3xl text-center"
          >
            {counter}
          </motion.div>
        </div>
      </div>

      {/* Botón de control */}
      <div>
        {status === "filling" ? (
          <Button
            onClick={onStop}
            className="w-full h-12 bg-red-600 hover:bg-red-700 text-white rounded-xl text-4xl font-extrabold"
          >
            DETENER
          </Button>
        ) : (
          <Button
            onClick={onStart}
            className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl text-4xl font-extrabold"
          >
            INICIAR
          </Button>
        )}
      </div>
    </div>
  )
}

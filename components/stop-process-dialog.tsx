"use client"

import { motion } from "framer-motion"
import { Button } from "./ui/button"

interface StopProcessDialogProps {
  onClose: () => void
  onConfirm: () => void
}

export function StopProcessDialog({ onClose, onConfirm }: StopProcessDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#1a1e25] rounded-2xl p-8 max-w-md w-full border border-[#3a3e45] shadow-2xl"
      >
        <h2 className="text-2xl font-bold text-red-400 mb-4">Detener Proceso</h2>
        <p className="text-gray-300 text-lg mb-8">¿Desea finalizar el proceso de envasado?</p>

        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
          >
            Cancelar
          </Button>
          <Button onClick={onConfirm} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
            Aceptar
          </Button>
        </div>
      </motion.div>
    </motion.div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import type { ProcessData, Format } from "./tank-control"

interface StartProcessDialogProps {
  onClose: () => void
  onConfirm: (data: ProcessData) => void
}

export function StartProcessDialog({ onClose, onConfirm }: StartProcessDialogProps) {
  const [formData, setFormData] = useState<ProcessData>({
    of: "",
    material: "",
    description: "",
    format: "25kg",
    legajo: "",
    ordenEnvasado: "",
    targetQuantityKg: 0,
    packagingStandardKgMin: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (
      formData.of &&
      formData.material &&
      formData.legajo &&
      formData.ordenEnvasado &&
      formData.targetQuantityKg > 0 &&
      formData.packagingStandardKgMin > 0
    ) {
      onConfirm(formData)
    }
  }

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
        className="bg-[#1a1e25] rounded-2xl p-8 max-w-2xl w-full border border-[#3a3e45] shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">Iniciar Proceso de Envasado</h2>
        <p className="text-gray-400 mb-6">Confirmar datos de inicio de envasado</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="of" className="text-gray-300">
                OF (Orden de Fabricación)
              </Label>
              <Input
                id="of"
                value={formData.of}
                onChange={(e) => setFormData({ ...formData, of: e.target.value })}
                className="bg-[#2a2e35] border-[#3a3e45] text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="legajo" className="text-gray-300">
                Legajo
              </Label>
              <Input
                id="legajo"
                value={formData.legajo}
                onChange={(e) => setFormData({ ...formData, legajo: e.target.value })}
                className="bg-[#2a2e35] border-[#3a3e45] text-white"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="ordenEnvasado" className="text-gray-300">
              Orden de Envasado
            </Label>
            <Input
              id="ordenEnvasado"
              value={formData.ordenEnvasado}
              onChange={(e) => setFormData({ ...formData, ordenEnvasado: e.target.value })}
              className="bg-[#2a2e35] border-[#3a3e45] text-white"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="material" className="text-gray-300">
                Material
              </Label>
              <Input
                id="material"
                value={formData.material}
                onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                className="bg-[#2a2e35] border-[#3a3e45] text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="format" className="text-gray-300">
                Formato
              </Label>
              <select
                id="format"
                value={formData.format}
                onChange={(e) => setFormData({ ...formData, format: e.target.value as Format })}
                className="w-full h-10 px-3 rounded-md bg-[#2a2e35] border border-[#3a3e45] text-white"
              >
                <option value="5kg">5 kg</option>
                <option value="10kg">10 kg</option>
                <option value="20kg">20 kg</option>
                <option value="25kg">25 kg</option>
              </select>
            </div>
          </div>

          <div>
            <Label htmlFor="description" className="text-gray-300">
              Descripción
            </Label>
            <Input
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-[#2a2e35] border-[#3a3e45] text-white"
            />
          </div>

          <div className="border-t border-[#3a3e45] pt-4 mt-4">
            <h3 className="text-lg font-semibold text-cyan-400 mb-3">Parámetros de Autonomía</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="targetQuantityKg" className="text-gray-300">
                  Cantidad Objetivo (Kg)
                </Label>
                <Input
                  id="targetQuantityKg"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.targetQuantityKg || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, targetQuantityKg: Number.parseFloat(e.target.value) || 0 })
                  }
                  className="bg-[#2a2e35] border-[#3a3e45] text-white"
                  placeholder="Ej: 5000"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Total de kg a envasar en esta orden</p>
              </div>

              <div>
                <Label htmlFor="packagingStandardKgMin" className="text-gray-300">
                  Estándar de Envasado (Kg/min)
                </Label>
                <Input
                  id="packagingStandardKgMin"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.packagingStandardKgMin || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, packagingStandardKgMin: Number.parseFloat(e.target.value) || 0 })
                  }
                  className="bg-[#2a2e35] border-[#3a3e45] text-white"
                  placeholder="Ej: 50"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Velocidad de envasado del material</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 bg-transparent border-gray-600 text-gray-300 hover:bg-gray-800"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700 text-white">
              Iniciar Proceso
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

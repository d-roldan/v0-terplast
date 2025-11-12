<template>
  <div
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    @click="$emit('close')"
  >
    <div
      class="bg-[#1a1e25] rounded-2xl p-8 max-w-2xl w-full border border-[#3a3e45] shadow-2xl max-h-[90vh] overflow-y-auto"
      @click.stop
    >
      <h2 class="text-2xl font-bold text-cyan-400 mb-2">Iniciar Proceso de Envasado</h2>
      <p class="text-gray-400 mb-6">Confirmar datos de inicio de envasado</p>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="of" class="block text-sm font-medium text-gray-300 mb-1">
              OF (Orden de Fabricación)
            </label>
            <input
              id="of"
              v-model="formData.of"
              class="w-full px-3 py-2 bg-[#2a2e35] border border-[#3a3e45] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>

          <div>
            <label for="legajo" class="block text-sm font-medium text-gray-300 mb-1">
              Legajo
            </label>
            <input
              id="legajo"
              v-model="formData.legajo"
              class="w-full px-3 py-2 bg-[#2a2e35] border border-[#3a3e45] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              required
            />
          </div>
        </div>

        <div>
          <label for="ordenEnvasado" class="block text-sm font-medium text-gray-300 mb-1">
            Orden de Envasado
          </label>
          <input
            id="ordenEnvasado"
            v-model="formData.ordenEnvasado"
            class="w-full px-3 py-2 bg-[#2a2e35] border border-[#3a3e45] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="material" class="block text-sm font-medium text-gray-300 mb-1">
              Material
            </label>
            <input
              id="material"
              v-model="formData.material"
              class="w-full px-3 py-2 bg-[#2a2e35] border border-[#3a3e45] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Ej: 3295"
              required
            />
          </div>

          <div>
            <label for="format" class="block text-sm font-medium text-gray-300 mb-1">
              Formato
            </label>
            <select
              id="format"
              v-model="formData.format"
              class="w-full px-3 py-2 bg-[#2a2e35] border border-[#3a3e45] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="1lt">1 lt</option>
              <option value="4lt">4 lt</option>
              <option value="5kg">5 kg</option>
              <option value="10kg">10 kg</option>
              <option value="20kg">20 kg</option>
              <option value="25kg">25 kg</option>
            </select>
          </div>
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-300 mb-1">
            Descripción
          </label>
          <input
            id="description"
            v-model="formData.description"
            class="w-full px-3 py-2 bg-[#2a2e35] border border-[#3a3e45] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
            placeholder="Ej: Lavable Ext Mate Bermellon"
          />
        </div>

        <div class="border-t border-[#3a3e45] pt-4 mt-4">
          <h3 class="text-lg font-semibold text-cyan-400 mb-3">Parámetros de Autonomía</h3>
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="targetQuantity" class="block text-sm font-medium text-gray-300 mb-1">
                Cantidad a Envasar
              </label>
              <input
                id="targetQuantity"
                v-model.number="formData.targetQuantity"
                type="number"
                min="1"
                class="w-full px-3 py-2 bg-[#2a2e35] border border-[#3a3e45] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Ej: 1000"
                required
              />
              <p class="text-xs text-gray-500 mt-1">Cantidad total de envases a producir</p>
            </div>

            <div>
              <label for="gpm" class="block text-sm font-medium text-gray-300 mb-1">
                GPM (Golpes Por Minuto)
              </label>
              <input
                id="gpm"
                v-model.number="formData.gpm"
                type="number"
                min="1"
                class="w-full px-3 py-2 bg-[#2a2e35] border border-[#3a3e45] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                placeholder="Ej: 48"
                required
              />
              <p class="text-xs text-gray-500 mt-1">Estándar de envasado del material</p>
            </div>
          </div>
          <div class="mt-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-3">
            <p class="text-xs text-cyan-400 font-semibold mb-1">Ejemplos de GPM por formato:</p>
            <div class="text-xs text-gray-400 space-y-0.5">
              <div>• 1lt = 48 gol/min</div>
              <div>• 4lt = 12 gol/min</div>
              <div>• 20lt = 5 gol/min</div>
            </div>
          </div>
        </div>

        <div class="flex gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
          >
            Iniciar Proceso
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { ProcessData } from '../types'

const emit = defineEmits<{
  close: []
  confirm: [data: ProcessData]
}>()

const formData = reactive<ProcessData>({
  of: '',
  material: '',
  description: '',
  format: '25kg',
  legajo: '',
  ordenEnvasado: '',
  targetQuantity: 0,
  gpm: 0,
})

function handleSubmit() {
  if (
    formData.of &&
    formData.material &&
    formData.legajo &&
    formData.ordenEnvasado &&
    formData.targetQuantity > 0 &&
    formData.gpm > 0
  ) {
    emit('confirm', { ...formData })
    Object.assign(formData, {
      of: '',
      material: '',
      description: '',
      format: '25kg',
      legajo: '',
      ordenEnvasado: '',
      targetQuantity: 0,
      gpm: 0,
    })
  }
}
</script>

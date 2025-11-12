<template>
  <div
    class="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
    @click="$emit('close')"
  >
    <div
      class="bg-[#1a1e25] rounded-2xl p-8 max-w-md w-full border border-[#3a3e45] shadow-2xl"
      @click.stop
    >
      <h2 class="text-2xl font-bold text-red-400 mb-2">Detener Proceso</h2>
      <p class="text-gray-400 mb-6">¿Está seguro que desea detener el proceso de envasado?</p>

      <div class="flex gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 px-4 py-2 bg-transparent border border-gray-600 text-gray-300 rounded-md hover:bg-gray-800 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="button"
          @click="$emit('confirm')"
          class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
        >
          Detener
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  close: []
  confirm: []
}>()
</script>

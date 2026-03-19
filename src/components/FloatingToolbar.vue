<script setup lang="ts">
import { Download, Maximize2, Minus, Plus, RotateCcw } from 'lucide-vue-next'

defineProps<{
  disabled?: boolean
}>()

const emit = defineEmits<{
  zoomIn: []
  zoomOut: []
  reset: []
  fullscreen: []
  export: []
}>()

const buttonClass =
  'group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-slate-600 shadow-float backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40'
</script>

<template>
  <div class="absolute bottom-6 right-6 z-20 flex items-center gap-3">
    <button :class="buttonClass" :disabled="disabled" type="button" aria-label="Zoom out" @click="emit('zoomOut')">
      <Minus class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" aria-label="Reset view" @click="emit('reset')">
      <RotateCcw class="h-5 w-5 transition duration-200 group-hover:-rotate-45" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" aria-label="Zoom in" @click="emit('zoomIn')">
      <Plus class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" aria-label="Fullscreen preview" @click="emit('fullscreen')">
      <Maximize2 class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" aria-label="Export PNG" @click="emit('export')">
      <Download class="h-5 w-5 transition duration-200 group-hover:translate-y-0.5" />
    </button>
  </div>
</template>

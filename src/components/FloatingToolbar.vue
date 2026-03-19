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
  'group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-slate-600 shadow-float backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40'
</script>

<template>
  <div class="absolute bottom-6 right-6 z-20 flex items-center gap-3">
    <button :class="buttonClass" :disabled="disabled" type="button" title="Zoom out" aria-label="Zoom out" @click="emit('zoomOut')">
      <Minus class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Reset view" aria-label="Reset view" @click="emit('reset')">
      <RotateCcw class="h-5 w-5 transition duration-200 group-hover:-rotate-45" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Zoom in" aria-label="Zoom in" @click="emit('zoomIn')">
      <Plus class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Fullscreen preview" aria-label="Fullscreen preview" @click="emit('fullscreen')">
      <Maximize2 class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Export PNG" aria-label="Export PNG" @click="emit('export')">
      <Download class="h-5 w-5 transition duration-200 group-hover:translate-y-0.5" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { Download, History, Maximize2, Minus, Moon, Plus, RotateCcw, Save, Sun } from 'lucide-vue-next'

defineProps<{
  disabled?: boolean
  isDark?: boolean
}>()

const emit = defineEmits<{
  zoomIn: []
  zoomOut: []
  reset: []
  fullscreen: []
  export: []
  toggleDark: []
  save: []
  toggleSidebar: []
}>()

const buttonClass =
  'group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-slate-600 shadow-float backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
</script>

<template>
  <div class="absolute bottom-6 right-6 z-20 flex flex-wrap items-center justify-end gap-3 max-w-[calc(100%-3rem)]">
    <button :class="buttonClass" type="button" title="Toggle Theme" aria-label="Toggle Theme" @click="emit('toggleDark')">
      <Moon v-if="!isDark" class="h-5 w-5 transition duration-200 group-hover:scale-110" aria-hidden="true" />
      <Sun v-else class="h-5 w-5 transition duration-200 group-hover:scale-110" aria-hidden="true" />
    </button>
    <button :class="buttonClass" type="button" title="History" aria-label="History" @click="emit('toggleSidebar')">
      <History class="h-5 w-5 transition duration-200 group-hover:scale-110" aria-hidden="true" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Save Chart" aria-label="Save Chart" @click="emit('save')">
      <Save class="h-5 w-5 transition duration-200 group-hover:scale-110" aria-hidden="true" />
    </button>

    <div class="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

    <button :class="buttonClass" :disabled="disabled" type="button" title="Zoom out" aria-label="Zoom out" @click="emit('zoomOut')">
      <Minus class="h-5 w-5 transition duration-200 group-hover:scale-110" aria-hidden="true" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Reset view" aria-label="Reset view" @click="emit('reset')">
      <RotateCcw class="h-5 w-5 transition duration-200 group-hover:-rotate-45" aria-hidden="true" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Zoom in" aria-label="Zoom in" @click="emit('zoomIn')">
      <Plus class="h-5 w-5 transition duration-200 group-hover:scale-110" aria-hidden="true" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Fullscreen preview" aria-label="Fullscreen preview" @click="emit('fullscreen')">
      <Maximize2 class="h-5 w-5 transition duration-200 group-hover:scale-110" aria-hidden="true" />
    </button>
    <button :class="buttonClass" :disabled="disabled" type="button" title="Export PNG" aria-label="Export PNG" @click="emit('export')">
      <Download class="h-5 w-5 transition duration-200 group-hover:translate-y-0.5" aria-hidden="true" />
    </button>
  </div>
</template>

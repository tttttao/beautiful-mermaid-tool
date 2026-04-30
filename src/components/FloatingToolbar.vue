<script setup lang="ts">
import { Download, History, Maximize2, Minus, Moon, Plus, RotateCcw, Save, Sun, Check } from 'lucide-vue-next'
import { ref } from 'vue'

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

const isSaved = ref(false)
let saveTimeout: ReturnType<typeof setTimeout> | undefined

function handleSave() {
  emit('save')
  isSaved.value = true
  clearTimeout(saveTimeout)
  saveTimeout = setTimeout(() => {
    isSaved.value = false
  }, 2000)
}

const buttonClass =
  'group flex h-12 w-12 items-center justify-center rounded-2xl border border-white/70 bg-white/90 text-slate-600 shadow-float backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:bg-white hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200'
</script>

<template>
  <div class="absolute bottom-6 right-6 z-20 flex flex-wrap items-center justify-end gap-3 max-w-[calc(100%-3rem)]">
    <button :class="buttonClass" type="button" title="Toggle Theme" aria-label="Toggle Theme" @click="emit('toggleDark')">
      <Moon v-if="!isDark" class="h-5 w-5 transition duration-200 group-hover:scale-110" />
      <Sun v-else class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>
    <button :class="buttonClass" type="button" title="History" aria-label="History" @click="emit('toggleSidebar')">
      <History class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>
    <button
      :class="buttonClass"
      :disabled="disabled"
      type="button"
      :title="isSaved ? 'Chart Saved' : 'Save Chart'"
      :aria-label="isSaved ? 'Chart Saved' : 'Save Chart'"
      aria-live="polite"
      @click="handleSave"
    >
      <Check v-if="isSaved" class="h-5 w-5 text-emerald-600 dark:text-emerald-400 transition duration-200" />
      <Save v-else class="h-5 w-5 transition duration-200 group-hover:scale-110" />
    </button>

    <div class="w-[1px] h-8 bg-slate-200 dark:bg-slate-700 mx-1"></div>

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

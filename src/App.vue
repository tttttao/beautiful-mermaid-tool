<script setup lang="ts">
import { useDark, useDebounceFn, useToggle } from '@vueuse/core'
import { computed, defineAsyncComponent, ref, watch } from 'vue'

import FloatingToolbar from '@/components/FloatingToolbar.vue'
import SidebarHistory from '@/components/SidebarHistory.vue'
import { useHistory } from '@/composables/useHistory'
import FullscreenPreview from '@/components/FullscreenPreview.vue'
import MermaidCanvas from '@/components/MermaidCanvas.vue'
import { DEFAULT_MERMAID_SOURCE } from '@/constants/defaultMermaidSource'

const MermaidEditor = defineAsyncComponent(() => import('@/components/MermaidEditor.vue'))

type MermaidCanvasExpose = InstanceType<typeof MermaidCanvas>

const source = ref(DEFAULT_MERMAID_SOURCE)
const debouncedSource = ref(DEFAULT_MERMAID_SOURCE)
const renderError = ref('')
const canvasRef = ref<MermaidCanvasExpose | null>(null)
const showFullscreen = ref(false)
const isSidebarOpen = ref(false)

const isDark = useDark()
const toggleDark = useToggle(isDark)
const { history, saveToHistory, deleteFromHistory } = useHistory()

const syncDebouncedSource = useDebounceFn((value: string) => {
  debouncedSource.value = value
}, 320)

watch(
  source,
  (value) => {
    syncDebouncedSource(value)
  },
  { immediate: true },
)

const statusText = computed(() => (renderError.value ? 'Last valid preview preserved' : 'Realtime preview synced'))

function openFullscreen() {
  if (canvasRef.value?.lastSuccessfulSvg) {
    showFullscreen.value = true
  }
}

function handleSave() {
  saveToHistory(source.value)
}

function handleLoad(loadedSource: string) {
  source.value = loadedSource
}
</script>

<template>
  <main class="min-h-screen px-4 py-4 text-ink dark:bg-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
    <div class="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1800px] flex-col gap-4 rounded-[36px] border border-white/60 bg-white/55 dark:border-white/10 dark:bg-slate-800/50 p-4 shadow-soft backdrop-blur xl:p-6 relative overflow-hidden">
      <header class="flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/75 dark:border-white/10 dark:bg-slate-800/80 px-6 py-5 shadow-sm backdrop-blur lg:flex-row lg:items-end lg:justify-between z-10">
        <div class="max-w-2xl">
          <p class="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400 dark:text-slate-500">Beautiful Mermaid</p>
          <h1 class="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white sm:text-4xl">
            Design crisp Mermaid diagrams in a calm, browser-native workspace.
          </h1>
        </div>
        <div class="flex items-center gap-3 self-start rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-slate-950/10">
          <span class="h-2.5 w-2.5 rounded-full" :class="renderError ? 'bg-amber-300' : 'bg-emerald-300'" />
          {{ statusText }}
        </div>
      </header>

      <section class="grid min-h-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(420px,0.92fr)_minmax(0,1.08fr)]">
        <MermaidEditor v-model="source" :is-dark="isDark" />

        <div class="relative min-h-[420px] z-10">
          <MermaidCanvas
            ref="canvasRef"
            :source="debouncedSource"
            :is-dark="isDark"
            @error="renderError = $event"
            @rendered="renderError = ''"
            @fullscreen="openFullscreen"
          />
          <FloatingToolbar
            :disabled="!canvasRef"
            :is-dark="isDark"
            @toggle-dark="toggleDark()"
            @save="handleSave"
            @toggle-sidebar="isSidebarOpen = !isSidebarOpen"
            @zoom-in="canvasRef?.zoomIn()"
            @zoom-out="canvasRef?.zoomOut()"
            @reset="canvasRef?.resetView()"
            @fullscreen="openFullscreen"
            @export="canvasRef?.exportPng()"
          />
        </div>
      </section>

      <SidebarHistory
        :is-open="isSidebarOpen"
        :history="history"
        @close="isSidebarOpen = false"
        @load="handleLoad"
        @delete="deleteFromHistory"
      />
    </div>
  </main>

  <FullscreenPreview
    v-if="showFullscreen && canvasRef"
    :svg-markup="canvasRef.lastSuccessfulSvg"
    :natural-size="canvasRef.naturalSize"
    @close="showFullscreen = false"
  />
</template>

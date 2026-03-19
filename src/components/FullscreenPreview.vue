<script setup lang="ts">
import { X } from 'lucide-vue-next'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'

import { useZoomPan } from '@/composables/useZoomPan'
import type { CameraState } from '@/types/mermaid'

const props = defineProps<{
  svgMarkup: string
  naturalSize: { width: number; height: number }
}>()

const emit = defineEmits<{
  close: []
}>()

const viewportRef = ref<HTMLDivElement | null>(null)
const stageRef = ref<HTMLDivElement | null>(null)
const svgHostRef = ref<HTMLDivElement | null>(null)
const naturalSizeRef = ref({ ...props.naturalSize })

let svgElement: SVGSVGElement | null = null

function applySvgCamera(state: CameraState, stageEl: HTMLDivElement) {
  stageEl.style.transform = `translate(${state.x}px, ${state.y}px)`
  if (svgElement) {
    svgElement.setAttribute('width', String(naturalSizeRef.value.width * state.scale))
    svgElement.setAttribute('height', String(naturalSizeRef.value.height * state.scale))
  }
}

const { cameraState, fitToView, initialize, destroy } = useZoomPan(
  viewportRef,
  stageRef,
  naturalSizeRef,
  applySvgCamera,
)

let pointerStartX = 0
let pointerStartY = 0

function onPointerDown(e: PointerEvent) {
  pointerStartX = e.clientX
  pointerStartY = e.clientY
}

function onOverlayClick(e: MouseEvent) {
  const dx = Math.abs(e.clientX - pointerStartX)
  const dy = Math.abs(e.clientY - pointerStartY)
  if (dx > 5 || dy > 5) return

  const target = e.target as HTMLElement
  if (!target.closest('.fullscreen-svg-host')) {
    emit('close')
  }
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') emit('close')
}

onMounted(async () => {
  document.addEventListener('keydown', onKeydown)
  await nextTick()

  const svg = svgHostRef.value?.querySelector('svg')
  if (svg) {
    svgElement = svg as SVGSVGElement
    if (!svg.getAttribute('viewBox')) {
      const w = svg.getAttribute('width') || '0'
      const h = svg.getAttribute('height') || '0'
      svg.setAttribute('viewBox', `0 0 ${w} ${h}`)
    }
  }

  initialize()
  await nextTick()
  fitToView()
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  destroy()
})
</script>

<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-50"
      @pointerdown="onPointerDown"
      @click="onOverlayClick"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div
        ref="viewportRef"
        class="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        <div ref="stageRef" class="absolute left-0 top-0 origin-top-left">
          <div
            ref="svgHostRef"
            class="fullscreen-svg-host rounded-[28px] border border-white/10 bg-[#fbfcfe] p-4 shadow-2xl"
            v-html="svgMarkup"
          />
        </div>
      </div>

      <div class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-5">
        <div class="pointer-events-auto rounded-full bg-black/40 px-4 py-1.5 text-sm font-medium text-white/90 backdrop-blur">
          {{ Math.round(cameraState.scale * 100) }}%
        </div>
        <button
          class="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white/90 backdrop-blur transition hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:ring-offset-2 focus-visible:ring-offset-black/20"
          title="Close fullscreen"
          aria-label="Close fullscreen"
          @click.stop="emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>
    </div>
  </Teleport>
</template>

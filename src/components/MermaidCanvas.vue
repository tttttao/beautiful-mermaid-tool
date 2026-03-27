<script setup lang="ts">
import { renderMermaidSVG } from 'beautiful-mermaid'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { useZoomPan } from '@/composables/useZoomPan'
import type { ExportOptions, RenderStatus } from '@/types/mermaid'

const props = defineProps<{
  source: string
  isDark?: boolean
}>()

const emit = defineEmits<{
  rendered: []
  error: [message: string]
  fullscreen: []
}>()

const viewportRef = ref<HTMLDivElement | null>(null)
const stageRef = ref<HTMLDivElement | null>(null)
const svgHostRef = ref<HTMLDivElement | null>(null)
const status = ref<RenderStatus>('idle')
const errorMessage = ref('')
const svgMarkup = ref('')
const lastSuccessfulSvg = ref('')
const hasFittedInitially = ref(false)
const naturalSize = ref({ width: 0, height: 0 })

const {
  cameraState,
  isDefaultView,
  zoomIn,
  zoomOut,
  fitToView,
  resetView,
  initialize: initializeZoom,
} = useZoomPan(viewportRef, stageRef, naturalSize)

const isReady = computed(() => status.value === 'ready' || Boolean(lastSuccessfulSvg.value))

const themeOptions = computed(() => {
  if (props.isDark) {
    return {
      bg: '#0F172A', // slate-900
      fg: '#F8FAFC', // slate-50
      accent: '#38BDF8', // sky-400
      line: '#94A3B8', // slate-400
      muted: '#64748B', // slate-500
      surface: '#1E293B', // slate-800
      border: '#334155', // slate-700
      padding: 56,
      font: 'Manrope',
      nodeSpacing: 30,
      layerSpacing: 52,
      componentSpacing: 28,
    }
  }

  return {
    bg: '#FBFCFE',
    fg: '#102033',
    accent: '#0F6CDD',
    line: '#5F7894',
    muted: '#71839A',
    surface: '#F7FAFD',
    border: '#C7D4E4',
    padding: 56,
    font: 'Manrope',
    nodeSpacing: 30,
    layerSpacing: 52,
    componentSpacing: 28,
  }
})

function downloadDataUrl(url: string, fileName: string) {
  const link = document.createElement('a')
  link.download = fileName
  link.href = url
  link.click()
}

function loadImage(url: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = () => reject(new Error('Unable to rasterize Mermaid SVG for PNG export.'))
    image.src = url
  })
}

function blobToDataUri(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read blob'))
    reader.readAsDataURL(blob)
  })
}

async function fetchEmbeddableFontCss(): Promise<string> {
  const link = document.querySelector<HTMLLinkElement>('link[href*="fonts.googleapis.com"]')
  if (!link?.href) return ''

  try {
    const res = await fetch(link.href)
    let css = await res.text()
    const fontUrls = new Map<string, string>()

    for (const match of css.matchAll(/url\(\s*['"]?(https?:\/\/[^'")\s]+)['"]?\s*\)/g)) {
      const url = match[1]
      if (fontUrls.has(url)) continue
      try {
        const fontRes = await fetch(url)
        const blob = await fontRes.blob()
        fontUrls.set(url, await blobToDataUri(blob))
      } catch { /* skip unloadable fonts */ }
    }

    for (const [url, dataUri] of fontUrls) {
      css = css.replaceAll(url, dataUri)
    }

    return css
  } catch {
    return ''
  }
}

function getSvgNode() {
  return svgHostRef.value?.querySelector('svg') as SVGSVGElement | null
}

function readNaturalSize(svg: SVGSVGElement) {
  const viewBox = svg.viewBox?.baseVal
  if (viewBox && viewBox.width > 0 && viewBox.height > 0) {
    return { width: viewBox.width, height: viewBox.height }
  }

  const width = Number.parseFloat(svg.getAttribute('width') || '0')
  const height = Number.parseFloat(svg.getAttribute('height') || '0')
  if (width > 0 && height > 0) {
    return { width, height }
  }

  const bbox = svg.getBBox()
  return { width: bbox.width, height: bbox.height }
}

async function exportPng(options: ExportOptions = {}) {
  const sourceSvg = getSvgNode()
  if (!sourceSvg || !naturalSize.value.width || !naturalSize.value.height) return

  const padding = 40
  const pixelRatio = options.pixelRatio ?? 3
  const backgroundColor = options.backgroundColor ?? '#FBFCFE'
  const exportWidth = naturalSize.value.width + padding * 2
  const exportHeight = naturalSize.value.height + padding * 2
  const clonedSvg = sourceSvg.cloneNode(true) as SVGSVGElement

  clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  clonedSvg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
  clonedSvg.setAttribute('width', String(exportWidth))
  clonedSvg.setAttribute('height', String(exportHeight))
  clonedSvg.setAttribute('viewBox', `${-padding} ${-padding} ${exportWidth} ${exportHeight}`)

  const fontCss = await fetchEmbeddableFontCss()
  if (fontCss) {
    const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style')
    styleEl.textContent = fontCss
    clonedSvg.insertBefore(styleEl, clonedSvg.firstChild)
  }

  const serializer = new XMLSerializer()
  const svgText = serializer.serializeToString(clonedSvg)
  const svgBlob = new Blob([svgText], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)

  try {
    const image = await loadImage(svgUrl)
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (!context) throw new Error('Unable to create a canvas context for PNG export.')

    canvas.width = Math.round(exportWidth * pixelRatio)
    canvas.height = Math.round(exportHeight * pixelRatio)
    context.scale(pixelRatio, pixelRatio)
    context.fillStyle = options.backgroundColor ?? themeOptions.value.bg
    context.fillRect(0, 0, exportWidth, exportHeight)
    context.drawImage(image, 0, 0, exportWidth, exportHeight)

    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    downloadDataUrl(canvas.toDataURL('image/png'), options.fileName ?? `beautiful-mermaid-${stamp}.png`)
    errorMessage.value = ''
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

async function renderDiagram(source: string) {
  if (!svgHostRef.value) return

  status.value = 'rendering'

  try {
    const markup = renderMermaidSVG(source, themeOptions.value)
    svgMarkup.value = markup
    lastSuccessfulSvg.value = markup
    errorMessage.value = ''

    svgHostRef.value.innerHTML = markup
    await nextTick()

    const svg = getSvgNode()
    if (!svg) throw new Error('Beautiful Mermaid did not return an SVG element.')

    svg.style.display = 'block'
    svg.style.overflow = 'visible'
    naturalSize.value = readNaturalSize(svg)
    status.value = 'ready'

    if (!hasFittedInitially.value) {
      fitToView()
      hasFittedInitially.value = true
    }

    emit('rendered')
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : 'Unable to render Mermaid diagram.'
    emit('error', errorMessage.value)

    if (lastSuccessfulSvg.value) {
      svgHostRef.value.innerHTML = lastSuccessfulSvg.value
      await nextTick()
      const svg = getSvgNode()
      if (svg) {
        svg.style.display = 'block'
        svg.style.overflow = 'visible'
        naturalSize.value = readNaturalSize(svg)
      }
    } else {
      svgHostRef.value.innerHTML = ''
    }
  }
}

onMounted(() => {
  initializeZoom()
  void renderDiagram(props.source)
})

watch(
  () => props.source,
  (value) => {
    void renderDiagram(value)
  },
)

watch(
  () => props.isDark,
  () => {
    void renderDiagram(props.source)
  },
)

const resizeObserver = new ResizeObserver(() => {
  if (!hasFittedInitially.value) return
  if (isDefaultView.value) {
    fitToView()
  }
})

onMounted(() => {
  if (viewportRef.value) {
    resizeObserver.observe(viewportRef.value)
  }
})

onBeforeUnmount(() => {
  resizeObserver.disconnect()
})

defineExpose({
  zoomIn,
  zoomOut,
  fitToView,
  resetView,
  exportPng,
  lastSuccessfulSvg,
  naturalSize,
})
</script>

<template>
  <section class="relative h-full min-h-[360px] overflow-hidden rounded-[32px] border border-white/70 bg-white/70 dark:border-white/10 dark:bg-slate-800/80 shadow-soft backdrop-blur transition-colors">
    <div class="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-6 py-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Preview</p>
        <h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-200">Infinite Canvas</h2>
      </div>
      <div class="rounded-full bg-white/85 dark:bg-slate-900/85 px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400 shadow-sm backdrop-blur">
        {{ Math.round(cameraState.scale * 100) }}%
      </div>
    </div>

    <div
      v-if="errorMessage"
      class="absolute left-6 right-24 top-24 z-10 rounded-2xl border border-amber-200 bg-amber-50/95 dark:border-amber-900/50 dark:bg-amber-900/30 dark:text-amber-200 px-4 py-3 text-sm text-amber-800 shadow-sm backdrop-blur"
      role="alert"
    >
      {{ errorMessage }}
    </div>

    <div ref="viewportRef" class="canvas-grid absolute inset-0 cursor-grab overflow-hidden rounded-[32px] active:cursor-grabbing">
      <div ref="stageRef" class="absolute left-0 top-0 origin-top-left will-change-transform">
        <div
          ref="svgHostRef"
          class="rounded-[28px] border border-slate-200/80 bg-[#fbfcfe] dark:border-white/5 dark:bg-[#0F172A] p-4 shadow-[0_24px_64px_rgba(15,23,42,0.08)] transition-colors"
          @dblclick="emit('fullscreen')"
        />
      </div>
    </div>

    <div
      v-if="status === 'rendering' && !svgMarkup"
      class="absolute inset-0 flex items-center justify-center bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm"
    >
      <div class="rounded-full border border-white/70 bg-white/80 dark:border-slate-700 dark:bg-slate-800 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 shadow-sm">
        Rendering diagram…
      </div>
    </div>

    <div
      v-if="!isReady && status !== 'rendering'"
      class="absolute inset-0 flex items-center justify-center text-sm font-medium text-slate-400 dark:text-slate-500"
    >
      Start typing Mermaid syntax to see a preview.
    </div>
  </section>
</template>

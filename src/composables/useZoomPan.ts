import type { Ref } from 'vue'
import { ref } from 'vue'
import { select } from 'd3-selection'
import { zoom, zoomIdentity } from 'd3-zoom'

import type { CameraState } from '@/types/mermaid'

export type CameraApplier = (state: CameraState, stageEl: HTMLDivElement) => void

const defaultApplyCamera: CameraApplier = (state, stageEl) => {
  stageEl.style.transform = `translate(${state.x}px, ${state.y}px) scale(${state.scale})`
}

export function useZoomPan(
  viewportRef: Ref<HTMLDivElement | null>,
  stageRef: Ref<HTMLDivElement | null>,
  naturalSize: Ref<{ width: number; height: number }>,
  onCamera?: CameraApplier,
) {
  const cameraState = ref<CameraState>({ x: 0, y: 0, scale: 1 })
  const isDefaultView = ref(false)
  let zoomBehavior: ReturnType<typeof zoom<HTMLDivElement, unknown>> | null = null

  const applier = onCamera ?? defaultApplyCamera

  function applyCamera(next: CameraState) {
    cameraState.value = next
    if (stageRef.value) {
      applier(next, stageRef.value)
    }
  }

  function setZoomTransform(next: CameraState) {
    if (!viewportRef.value || !zoomBehavior) {
      applyCamera(next)
      return
    }
    select(viewportRef.value).call(
      zoomBehavior.transform,
      zoomIdentity.translate(next.x, next.y).scale(next.scale),
    )
  }

  function fitToView() {
    if (!viewportRef.value || !naturalSize.value.width || !naturalSize.value.height) return
    const bounds = viewportRef.value.getBoundingClientRect()
    const margin = 96
    const availW = Math.max(bounds.width - margin, 120)
    const availH = Math.max(bounds.height - margin, 120)
    const scale = Math.min(availW / naturalSize.value.width, availH / naturalSize.value.height, 1.4)
    const x = (bounds.width - naturalSize.value.width * scale) / 2
    const y = (bounds.height - naturalSize.value.height * scale) / 2
    setZoomTransform({ x, y, scale })
    isDefaultView.value = true
  }

  function resetView() {
    fitToView()
  }

  function zoomBy(factor: number) {
    if (!viewportRef.value || !zoomBehavior) return
    select(viewportRef.value).call(zoomBehavior.scaleBy, factor)
  }

  function initialize() {
    if (!viewportRef.value) return

    zoomBehavior = zoom<HTMLDivElement, unknown>()
      .scaleExtent([0.2, 4])
      .filter((event: Event & { button?: number; type: string }) => {
        if (event.type === 'wheel') return true
        if (event.type.startsWith('touch') || event.type.startsWith('pointer')) {
          return (event as PointerEvent).button === 0 || event.type !== 'pointerdown'
        }
        if (event.type === 'mousedown') return (event as MouseEvent).button === 0
        return false
      })
      .on('zoom', (event) => {
        applyCamera({
          x: event.transform.x,
          y: event.transform.y,
          scale: event.transform.k,
        })
        if (event.sourceEvent) {
          isDefaultView.value = false
        }
      })

    select(viewportRef.value).call(zoomBehavior)
  }

  function destroy() {
    if (viewportRef.value) {
      select(viewportRef.value).on('.zoom', null)
    }
    zoomBehavior = null
  }

  return {
    cameraState,
    isDefaultView,
    zoomIn: () => zoomBy(1.2),
    zoomOut: () => zoomBy(0.84),
    fitToView,
    resetView,
    zoomBy,
    initialize,
    destroy,
  }
}

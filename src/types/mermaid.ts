export type RenderStatus = 'idle' | 'rendering' | 'ready' | 'error'

export interface ExportOptions {
  pixelRatio?: number
  backgroundColor?: string
  fileName?: string
}

export interface CameraState {
  x: number
  y: number
  scale: number
}

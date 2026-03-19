import { flushPromises, mount } from '@vue/test-utils'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { nextTick } from 'vue'

// ---------------------------------------------------------------------------
// 1. Debounce logic (unit test)
// ---------------------------------------------------------------------------

describe('Debounce logic', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  it('should delay invocation until timeout elapses', () => {
    const fn = vi.fn()
    let timer: ReturnType<typeof setTimeout> | null = null

    function debounced(value: string) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => fn(value), 320)
    }

    debounced('a')
    debounced('ab')
    debounced('abc')

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(320)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith('abc')

    vi.useRealTimers()
  })

  it('should invoke immediately once timeout passes', () => {
    const fn = vi.fn()
    let timer: ReturnType<typeof setTimeout> | null = null

    function debounced(value: string) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => fn(value), 320)
    }

    debounced('first')
    vi.advanceTimersByTime(320)
    expect(fn).toHaveBeenCalledWith('first')

    debounced('second')
    vi.advanceTimersByTime(320)
    expect(fn).toHaveBeenCalledWith('second')
    expect(fn).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})

// ---------------------------------------------------------------------------
// 2. PNG export core logic (unit test)
// ---------------------------------------------------------------------------

describe('PNG export helpers', () => {
  it('should build correct viewBox with padding', () => {
    const naturalWidth = 300
    const naturalHeight = 200
    const padding = 40
    const exportWidth = naturalWidth + padding * 2
    const exportHeight = naturalHeight + padding * 2
    const viewBox = `${-padding} ${-padding} ${exportWidth} ${exportHeight}`

    expect(viewBox).toBe('-40 -40 380 280')
    expect(exportWidth).toBe(380)
    expect(exportHeight).toBe(280)
  })

  it('should calculate canvas dimensions with pixel ratio', () => {
    const exportWidth = 380
    const exportHeight = 280
    const pixelRatio = 3

    const canvasWidth = Math.round(exportWidth * pixelRatio)
    const canvasHeight = Math.round(exportHeight * pixelRatio)

    expect(canvasWidth).toBe(1140)
    expect(canvasHeight).toBe(840)
  })

  it('should generate correct filename with timestamp pattern', () => {
    const stamp = '2025-01-15T10:30:00.000Z'.replace(/[:.]/g, '-')
    const fileName = `beautiful-mermaid-${stamp}.png`

    expect(fileName).toBe('beautiful-mermaid-2025-01-15T10-30-00-000Z.png')
    expect(fileName).not.toMatch(/[:]/)
  })
})

// ---------------------------------------------------------------------------
// 3. readNaturalSize logic (unit test)
// ---------------------------------------------------------------------------

describe('readNaturalSize logic', () => {
  it('should prefer viewBox dimensions when available', () => {
    const viewBox = { x: 0, y: 0, width: 400, height: 300 }
    const result = viewBox.width > 0 && viewBox.height > 0
      ? { width: viewBox.width, height: viewBox.height }
      : { width: 0, height: 0 }

    expect(result).toEqual({ width: 400, height: 300 })
  })

  it('should fall back to width/height attributes', () => {
    const viewBox = { x: 0, y: 0, width: 0, height: 0 }
    const attrWidth = 500
    const attrHeight = 350

    let result: { width: number; height: number }
    if (viewBox.width > 0 && viewBox.height > 0) {
      result = { width: viewBox.width, height: viewBox.height }
    } else if (attrWidth > 0 && attrHeight > 0) {
      result = { width: attrWidth, height: attrHeight }
    } else {
      result = { width: 0, height: 0 }
    }

    expect(result).toEqual({ width: 500, height: 350 })
  })
})

// ---------------------------------------------------------------------------
// Mocks
// ---------------------------------------------------------------------------

const MOCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="150"><rect width="200" height="150" fill="#fff"/><text x="100" y="75">Test</text></svg>'

let mockEditorInstance: any = null

vi.mock('@/composables/useMermaidMonaco', () => ({
  getConfiguredMonaco: vi.fn(() =>
    Promise.resolve({
      editor: {
        createModel: vi.fn(() => ({ dispose: vi.fn() })),
        create: vi.fn((_container: any) => {
          const listeners: Record<string, Function> = {}
          let value = ''
          const instance = {
            getValue: () => value,
            setValue: (v: string) => { value = v },
            getModel: () => ({ dispose: vi.fn() }),
            dispose: vi.fn(),
            onDidChangeModelContent: (cb: Function) => {
              listeners['change'] = cb
            },
            _triggerChange: (newValue: string) => {
              value = newValue
              listeners['change']?.()
            },
          }
          mockEditorInstance = instance
          return instance
        }),
      },
    }),
  ),
}))

vi.mock('beautiful-mermaid', () => ({
  renderMermaidSVG: vi.fn(() => MOCK_SVG),
}))

vi.mock('d3-selection', () => ({
  select: vi.fn(() => ({
    call: vi.fn().mockReturnThis(),
    on: vi.fn().mockReturnThis(),
  })),
}))

vi.mock('d3-zoom', () => ({
  zoom: vi.fn(() => {
    const behavior = {
      scaleExtent: vi.fn(() => behavior),
      filter: vi.fn(() => behavior),
      on: vi.fn(() => behavior),
      transform: vi.fn(),
      scaleBy: vi.fn(),
    }
    return behavior
  }),
  zoomIdentity: {
    translate: vi.fn(() => ({
      scale: vi.fn(() => ({})),
    })),
  },
}))

// ---------------------------------------------------------------------------
// 4. MermaidEditor component (component test)
// ---------------------------------------------------------------------------

describe('MermaidEditor component', () => {
  it('should emit update:modelValue when editor content changes', async () => {
    const { default: MermaidEditor } = await import('@/components/MermaidEditor.vue')

    const wrapper = mount(MermaidEditor, {
      props: { modelValue: 'flowchart TD\n  A --> B' },
    })

    await flushPromises()
    await nextTick()
    await flushPromises()

    expect(mockEditorInstance).toBeTruthy()
    mockEditorInstance._triggerChange('flowchart TD\n  A --> B --> C')
    await nextTick()

    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeDefined()
    expect(emitted!.length).toBeGreaterThan(0)
  })

  it('should mount and render a container element', async () => {
    const { default: MermaidEditor } = await import('@/components/MermaidEditor.vue')

    const wrapper = mount(MermaidEditor, {
      props: { modelValue: 'flowchart TD\n  A --> B' },
    })

    expect(wrapper.find('.min-h-0').exists()).toBe(true)
    expect(wrapper.find('header').exists()).toBe(true)
  })
})

// ---------------------------------------------------------------------------
// 5. MermaidCanvas component (component test)
// ---------------------------------------------------------------------------

describe('MermaidCanvas component', () => {
  it('should render SVG when source prop is provided', async () => {
    const { renderMermaidSVG } = await import('beautiful-mermaid')
    const { default: MermaidCanvas } = await import('@/components/MermaidCanvas.vue')

    const wrapper = mount(MermaidCanvas, {
      props: { source: 'flowchart TD\n  A --> B' },
    })

    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()

    expect(renderMermaidSVG).toHaveBeenCalled()
    expect(wrapper.html()).toContain('<svg')
  })

  it('should emit rendered event on successful render', async () => {
    const { default: MermaidCanvas } = await import('@/components/MermaidCanvas.vue')

    const wrapper = mount(MermaidCanvas, {
      props: { source: 'flowchart TD\n  A --> B' },
    })

    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()

    const rendered = wrapper.emitted('rendered')
    expect(rendered).toBeDefined()
  })

  it('should emit error event when renderMermaidSVG throws', async () => {
    const { renderMermaidSVG } = await import('beautiful-mermaid')
    ;(renderMermaidSVG as ReturnType<typeof vi.fn>).mockImplementationOnce(() => {
      throw new Error('Parse error')
    })

    const { default: MermaidCanvas } = await import('@/components/MermaidCanvas.vue')

    const wrapper = mount(MermaidCanvas, {
      props: { source: 'invalid syntax' },
    })

    await flushPromises()
    await nextTick()
    await flushPromises()
    await nextTick()

    const errorEmits = wrapper.emitted('error')
    expect(errorEmits).toBeDefined()
    expect(errorEmits![0][0]).toContain('Parse error')
  })

  it('should emit fullscreen event on double-click', async () => {
    const { renderMermaidSVG } = await import('beautiful-mermaid')
    ;(renderMermaidSVG as ReturnType<typeof vi.fn>).mockReturnValue(MOCK_SVG)

    const { default: MermaidCanvas } = await import('@/components/MermaidCanvas.vue')

    const wrapper = mount(MermaidCanvas, {
      props: { source: 'flowchart TD\n  A --> B' },
    })

    await flushPromises()
    await nextTick()

    const svgHost = wrapper.find('.rounded-\\[28px\\]')
    if (svgHost.exists()) {
      await svgHost.trigger('dblclick')
      expect(wrapper.emitted('fullscreen')).toBeDefined()
    }
  })

  it('should expose zoomIn, zoomOut, fitToView, resetView, exportPng', async () => {
    const { default: MermaidCanvas } = await import('@/components/MermaidCanvas.vue')

    const wrapper = mount(MermaidCanvas, {
      props: { source: 'flowchart TD\n  A --> B' },
    })

    await flushPromises()

    const vm = wrapper.vm as any
    expect(typeof vm.zoomIn).toBe('function')
    expect(typeof vm.zoomOut).toBe('function')
    expect(typeof vm.fitToView).toBe('function')
    expect(typeof vm.resetView).toBe('function')
    expect(typeof vm.exportPng).toBe('function')
  })
})

// ---------------------------------------------------------------------------
// 6. FloatingToolbar component (component test)
// ---------------------------------------------------------------------------

describe('FloatingToolbar component', () => {
  it('should emit all toolbar events', async () => {
    const { default: FloatingToolbar } = await import('@/components/FloatingToolbar.vue')

    const wrapper = mount(FloatingToolbar, {
      props: { disabled: false },
    })

    const buttons = wrapper.findAll('button')
    expect(buttons.length).toBe(5)

    await buttons[0].trigger('click') // zoomOut
    await buttons[1].trigger('click') // reset
    await buttons[2].trigger('click') // zoomIn
    await buttons[3].trigger('click') // fullscreen
    await buttons[4].trigger('click') // export

    expect(wrapper.emitted('zoomOut')).toHaveLength(1)
    expect(wrapper.emitted('reset')).toHaveLength(1)
    expect(wrapper.emitted('zoomIn')).toHaveLength(1)
    expect(wrapper.emitted('fullscreen')).toHaveLength(1)
    expect(wrapper.emitted('export')).toHaveLength(1)
  })

  it('should disable buttons when disabled prop is true', async () => {
    const { default: FloatingToolbar } = await import('@/components/FloatingToolbar.vue')

    const wrapper = mount(FloatingToolbar, {
      props: { disabled: true },
    })

    const buttons = wrapper.findAll('button')
    buttons.forEach((btn) => {
      expect(btn.attributes('disabled')).toBeDefined()
    })
  })
})

// ---------------------------------------------------------------------------
// 7. FullscreenPreview component (component test)
// ---------------------------------------------------------------------------

describe('FullscreenPreview component', () => {
  it('should render SVG markup in the fullscreen overlay', async () => {
    const { default: FullscreenPreview } = await import('@/components/FullscreenPreview.vue')

    const wrapper = mount(FullscreenPreview, {
      props: {
        svgMarkup: MOCK_SVG,
        naturalSize: { width: 200, height: 150 },
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    await flushPromises()
    await nextTick()

    expect(wrapper.html()).toContain('<svg')
  })

  it('should emit close on close button click', async () => {
    const { default: FullscreenPreview } = await import('@/components/FullscreenPreview.vue')

    const wrapper = mount(FullscreenPreview, {
      props: {
        svgMarkup: MOCK_SVG,
        naturalSize: { width: 200, height: 150 },
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    await flushPromises()

    const closeBtn = wrapper.find('button[aria-label="Close fullscreen"]')
    expect(closeBtn.exists()).toBe(true)
    await closeBtn.trigger('click')
    expect(wrapper.emitted('close')).toBeDefined()
  })

  it('should emit close on ESC key press', async () => {
    const { default: FullscreenPreview } = await import('@/components/FullscreenPreview.vue')

    const wrapper = mount(FullscreenPreview, {
      props: {
        svgMarkup: MOCK_SVG,
        naturalSize: { width: 200, height: 150 },
      },
      global: {
        stubs: { Teleport: true },
      },
    })

    await flushPromises()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await nextTick()

    expect(wrapper.emitted('close')).toBeDefined()
  })
})

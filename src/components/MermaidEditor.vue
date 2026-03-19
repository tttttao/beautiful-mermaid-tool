<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'

import { getConfiguredMonaco } from '@/composables/useMermaidMonaco'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const containerRef = ref<HTMLElement | null>(null)
let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = null
let isSyncingFromProps = false

onMounted(async () => {
  const monaco = await getConfiguredMonaco()
  if (!containerRef.value) {
    return
  }

  const model = monaco.editor.createModel(props.modelValue, 'mermaid')
  const editorInstance = monaco.editor.create(containerRef.value, {
    model,
    theme: 'mermaid-soft',
    automaticLayout: true,
    fontFamily: 'JetBrains Mono, ui-monospace, SFMono-Regular, monospace',
    fontSize: 14,
    lineHeight: 22,
    minimap: { enabled: false },
    wordWrap: 'on',
    wrappingIndent: 'same',
    scrollBeyondLastLine: false,
    smoothScrolling: true,
    padding: { top: 24, bottom: 24 },
    renderLineHighlight: 'line',
    contextmenu: true,
    tabSize: 2,
    insertSpaces: true,
    guides: {
      indentation: false,
    },
    overviewRulerBorder: false,
  })
  editor = editorInstance

  editorInstance.onDidChangeModelContent(() => {
    if (isSyncingFromProps) {
      return
    }
    const nextValue = editorInstance.getValue()
    emit('update:modelValue', nextValue)
  })
})

watch(
  () => props.modelValue,
  (value) => {
    if (!editor) {
      return
    }

    const currentValue = editor.getValue()
    if (currentValue === value) {
      return
    }

    isSyncingFromProps = true
    editor.setValue(value)
    isSyncingFromProps = false
  },
)

onBeforeUnmount(() => {
  editor?.getModel()?.dispose()
  editor?.dispose()
})
</script>

<template>
  <section class="flex h-full min-h-[360px] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/90 shadow-soft backdrop-blur">
    <header class="flex items-center justify-between border-b border-slate-100 px-6 py-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">Editor</p>
        <h2 class="mt-1 text-lg font-semibold text-slate-900">Mermaid Source</h2>
      </div>
      <div class="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-500">
        Live syntax highlighting
      </div>
    </header>

    <div ref="containerRef" class="min-h-0 flex-1" />
  </section>
</template>

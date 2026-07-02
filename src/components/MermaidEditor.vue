<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useClipboard } from '@vueuse/core'
import { Check, Copy } from 'lucide-vue-next'

import { getConfiguredMonaco } from '@/composables/useMermaidMonaco'

const props = defineProps<{
  modelValue: string
  isDark?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const { copy, copied } = useClipboard()
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
    theme: props.isDark ? 'mermaid-dark' : 'mermaid-soft',
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
  () => props.isDark,
  (isDark) => {
    if (editor) {
      import('monaco-editor').then((monaco) => {
        monaco.editor.setTheme(isDark ? 'mermaid-dark' : 'mermaid-soft')
      })
    }
  },
)

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
  <section class="flex h-full min-h-[360px] flex-col overflow-hidden rounded-[28px] border border-white/70 bg-white/90 dark:border-white/10 dark:bg-slate-800/90 shadow-soft backdrop-blur transition-colors">
    <header class="flex items-center justify-between border-b border-slate-100 dark:border-white/10 px-6 py-4">
      <div>
        <p class="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Editor</p>
        <h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-200">Mermaid Source</h2>
      </div>
      <div class="flex items-center gap-2">
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-full bg-slate-50 dark:bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
          @click="copy(modelValue)"
          :aria-label="copied ? 'Source code copied' : 'Copy source code'"
        >
          <Check v-if="copied" class="w-3.5 h-3.5 text-emerald-500" />
          <Copy v-else class="w-3.5 h-3.5" aria-hidden="true" />
          <span aria-hidden="true">{{ copied ? 'Copied' : 'Copy' }}</span>
        </button>
        <div aria-live="polite" class="sr-only">
          {{ copied ? 'Source code copied to clipboard' : '' }}
        </div>
        <div class="hidden sm:block rounded-full bg-slate-50 dark:bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Live syntax highlighting
        </div>
      </div>
    </header>

    <div ref="containerRef" class="min-h-0 flex-1" />
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Copy, Check } from 'lucide-vue-next'

import { getConfiguredMonaco } from '@/composables/useMermaidMonaco'

const props = defineProps<{
  modelValue: string
  isDark?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const containerRef = ref<HTMLElement | null>(null)
let editor: import('monaco-editor').editor.IStandaloneCodeEditor | null = null
let isSyncingFromProps = false

const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | undefined

function copyToClipboard() {
  navigator.clipboard.writeText(props.modelValue).then(() => {
    isCopied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      isCopied.value = false
    }, 2000)
  })
}

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
  if (copyTimeout) clearTimeout(copyTimeout)
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
      <div class="flex items-center gap-3">
        <button
          type="button"
          class="group flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Copy source code"
          aria-label="Copy source code"
          @click="copyToClipboard"
        >
          <Check v-if="isCopied" class="h-4 w-4 text-emerald-500" />
          <Copy v-else class="h-4 w-4 transition-transform group-hover:scale-110" />
        </button>
        <div class="rounded-full bg-slate-50 dark:bg-slate-900/50 px-3 py-1 text-xs font-medium text-slate-500 dark:text-slate-400">
          Live syntax highlighting
        </div>
      </div>
    </header>
    <div aria-live="polite" class="sr-only">
      <span v-if="isCopied">Copied source code to clipboard</span>
    </div>

    <div ref="containerRef" class="min-h-0 flex-1" />
  </section>
</template>

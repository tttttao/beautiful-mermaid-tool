import loader from '@monaco-editor/loader'
import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'

let isRegistered = false

function registerMermaidLanguage(instance: typeof monaco) {
  if (isRegistered) {
    return
  }

  instance.languages.register({ id: 'mermaid' })
  instance.languages.setMonarchTokensProvider('mermaid', {
    tokenizer: {
      root: [
        [/\b(flowchart|graph|sequenceDiagram|classDiagram|stateDiagram-v2|erDiagram|journey|gantt|mindmap|timeline|quadrantChart|gitGraph|pie|xychart-beta|requirementDiagram|C4Context|C4Container|C4Component|C4Dynamic|C4Deployment)\b/, 'keyword'],
        [/\b(subgraph|direction|participant|actor|class|state|title|section|accTitle|accDescr|note|loop|alt|opt|par|critical|and|else|end)\b/, 'keyword.control'],
        [/-->|==>|-.->|---|===|~~~|o--o|x--x|o-->|x-->|\|.*?\|/, 'operators'],
        [/\[[^\]]*\]|\([^\)]*\)|\{[^\}]*\}|>[^<\n]*]|"[^"]*"/, 'string'],
        [/\b\d+\b/, 'number'],
        [/\b[A-Za-z_][\w-]*\b/, 'identifier'],
        [/%%.*$/, 'comment'],
      ],
    },
  })

  instance.editor.defineTheme('mermaid-soft', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '0F6CDD', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: '2563EB' },
      { token: 'operators', foreground: '7C3AED' },
      { token: 'string', foreground: '0F766E' },
      { token: 'comment', foreground: '94A3B8', fontStyle: 'italic' },
      { token: 'number', foreground: 'EA580C' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.lineHighlightBackground': '#F5F9FF',
      'editorLineNumber.foreground': '#B6C2D2',
      'editorLineNumber.activeForeground': '#6B7B92',
      'editorCursor.foreground': '#0F6CDD',
      'editor.selectionBackground': '#DCEAFE',
      'editor.inactiveSelectionBackground': '#EAF1FB',
    },
  })

  instance.editor.defineTheme('mermaid-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'keyword', foreground: '60A5FA', fontStyle: 'bold' },
      { token: 'keyword.control', foreground: '93C5FD' },
      { token: 'operators', foreground: 'A78BFA' },
      { token: 'string', foreground: '2DD4BF' },
      { token: 'comment', foreground: '64748B', fontStyle: 'italic' },
      { token: 'number', foreground: 'FB923C' },
    ],
    colors: {
      'editor.background': '#00000000', // Transparent so parent tailwind controls background
      'editor.lineHighlightBackground': '#1E293B',
      'editorLineNumber.foreground': '#475569',
      'editorLineNumber.activeForeground': '#94A3B8',
      'editorCursor.foreground': '#60A5FA',
      'editor.selectionBackground': '#1E3A8A',
      'editor.inactiveSelectionBackground': '#172554',
    },
  })

  isRegistered = true
}

export async function getConfiguredMonaco() {
  ;(self as typeof self & { MonacoEnvironment?: { getWorker: () => Worker } }).MonacoEnvironment = {
    getWorker: () => new editorWorker(),
  }

  loader.config({ monaco })
  const instance = await loader.init()
  registerMermaidLanguage(instance)
  return instance
}

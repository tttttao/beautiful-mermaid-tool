<script setup lang="ts">
import { Clock, Trash2, X } from 'lucide-vue-next'

import type { HistoryItem } from '@/types/history'

defineProps<{
  isOpen: boolean
  history: HistoryItem[]
}>()

const emit = defineEmits<{
  close: []
  load: [source: string]
  delete: [id: string]
}>()

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

function truncateCode(code: string, maxLength = 80) {
  const inline = code.replace(/\s+/g, ' ').trim()
  return inline.length > maxLength ? inline.slice(0, maxLength) + '...' : inline
}
</script>

<template>
  <div
    class="fixed inset-y-0 right-0 z-40 w-full max-w-sm transform shadow-2xl transition-transform duration-300 ease-in-out sm:w-96"
    :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex h-full flex-col bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-l border-slate-200 dark:border-white/10">
      <div class="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-white/10">
        <div class="flex items-center gap-2">
          <Clock class="h-5 w-5 text-slate-500 dark:text-slate-400" />
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Local History</h2>
        </div>
        <button
          type="button"
          class="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
          title="Close history"
          aria-label="Close history"
          @click="emit('close')"
        >
          <X class="h-5 w-5" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4">
        <div v-if="history.length === 0" class="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400">
          <Clock class="h-12 w-12 mb-4 opacity-20" />
          <p>No history yet.</p>
          <p class="text-sm mt-1">Saved charts will appear here.</p>
        </div>
        <ul v-else class="space-y-3">
          <li
            v-for="item in history"
            :key="item.id"
            class="group relative flex flex-col gap-2 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 p-4 shadow-sm transition-all hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md cursor-pointer"
            @click="emit('load', item.source)"
          >
            <div class="flex items-center justify-between">
              <span class="text-xs font-medium text-slate-500 dark:text-slate-400">{{ formatDate(item.timestamp) }}</span>
              <button
                type="button"
                class="rounded p-1.5 text-slate-400 opacity-0 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 group-hover:opacity-100 transition-all focus:opacity-100"
                title="Delete item"
                aria-label="Delete item"
                @click.stop="emit('delete', item.id)"
              >
                <Trash2 class="h-4 w-4" />
              </button>
            </div>
            <pre class="font-mono text-xs text-slate-700 dark:text-slate-300 overflow-hidden text-ellipsis whitespace-nowrap">{{ truncateCode(item.source) }}</pre>
          </li>
        </ul>
      </div>
    </div>
  </div>

  <!-- Backdrop for mobile/smaller screens to close when clicking outside -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-30 bg-black/20 dark:bg-black/40 backdrop-blur-sm lg:hidden"
    @click="emit('close')"
  ></div>
</template>

import { useStorage } from '@vueuse/core'

import type { HistoryItem } from '@/types/history'

export function useHistory() {
  const history = useStorage<HistoryItem[]>('beautiful-mermaid-history', [])

  function saveToHistory(source: string) {
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      source,
    }
    history.value.unshift(newItem)
    return newItem
  }

  function deleteFromHistory(id: string) {
    const index = history.value.findIndex((item) => item.id === id)
    if (index !== -1) {
      history.value.splice(index, 1)
    }
  }

  return {
    history,
    saveToHistory,
    deleteFromHistory,
  }
}

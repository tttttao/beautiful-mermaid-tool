import { useStorage } from '@vueuse/core'

import type { HistoryItem } from '@/types/history'

export function useHistory() {
  const history = useStorage<HistoryItem[]>('beautiful-mermaid-history', [])

  const MAX_HISTORY_LENGTH = 50

  function saveToHistory(source: string) {
    // Check if identical source already exists
    const existingIndex = history.value.findIndex(item => item.source === source)

    // If it exists, update its timestamp and move it to the front
    if (existingIndex !== -1) {
      const [existingItem] = history.value.splice(existingIndex, 1)
      existingItem.timestamp = Date.now()
      history.value.unshift(existingItem)
      return existingItem
    }

    // Otherwise, create a new item
    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      source,
    }
    history.value.unshift(newItem)

    // Enforce max length
    if (history.value.length > MAX_HISTORY_LENGTH) {
      history.value = history.value.slice(0, MAX_HISTORY_LENGTH)
    }

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

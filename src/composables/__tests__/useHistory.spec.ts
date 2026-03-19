import { describe, it, expect, beforeEach } from 'vitest'
import { useHistory } from '../useHistory'

describe('useHistory composable', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with empty history', () => {
    const { history } = useHistory()
    expect(history.value).toEqual([])
  })

  it('saves an item to history', () => {
    const { history, saveToHistory } = useHistory()

    const source = 'graph TD\nA-->B'
    const item = saveToHistory(source)

    expect(history.value.length).toBe(1)
    expect(history.value[0].id).toBe(item.id)
    expect(history.value[0].source).toBe(source)
    expect(history.value[0].timestamp).toBeTypeOf('number')
  })

  it('adds newer items to the beginning of the list', () => {
    const { history, saveToHistory } = useHistory()

    saveToHistory('item 1')
    saveToHistory('item 2')

    expect(history.value.length).toBe(2)
    expect(history.value[0].source).toBe('item 2')
    expect(history.value[1].source).toBe('item 1')
  })

  it('deletes an item from history by id', () => {
    const { history, saveToHistory, deleteFromHistory } = useHistory()

    const item1 = saveToHistory('item 1')
    const item2 = saveToHistory('item 2')

    expect(history.value.length).toBe(2)

    deleteFromHistory(item1.id)

    expect(history.value.length).toBe(1)
    expect(history.value[0].source).toBe('item 2')

    deleteFromHistory(item2.id)
    expect(history.value.length).toBe(0)
  })

  it('does nothing if deleting a non-existent id', () => {
    const { history, saveToHistory, deleteFromHistory } = useHistory()

    saveToHistory('item 1')

    deleteFromHistory('fake-id')
    expect(history.value.length).toBe(1)
  })

  it('deduplicates items by moving them to the front and updating timestamp', () => {
    const { history, saveToHistory } = useHistory()

    const source1 = 'graph TD\nA-->B'
    const source2 = 'graph LR\nB-->A'

    const firstSave = saveToHistory(source1)
    const originalTimestamp = firstSave.timestamp

    saveToHistory(source2) // Move down to index 1

    expect(history.value.length).toBe(2)
    expect(history.value[0].source).toBe(source2)
    expect(history.value[1].source).toBe(source1)

    // Save identical source
    const duplicateSave = saveToHistory(source1)

    expect(history.value.length).toBe(2) // No new items added
    expect(history.value[0].source).toBe(source1) // Moved to front
    expect(history.value[1].source).toBe(source2)
    expect(history.value[0].id).toBe(firstSave.id) // ID remains the same
    expect(duplicateSave.timestamp).toBeGreaterThanOrEqual(originalTimestamp) // Timestamp updated
  })

  it('respects maximum history length of 50', () => {
    const { history, saveToHistory } = useHistory()

    // Attempt to add 60 distinct items
    for (let i = 0; i < 60; i++) {
      saveToHistory(`item ${i}`)
    }

    expect(history.value.length).toBe(50)
    // The most recently added item should be at the front
    expect(history.value[0].source).toBe('item 59')
    // The oldest kept item should be item 10
    expect(history.value[49].source).toBe('item 10')
  })
})

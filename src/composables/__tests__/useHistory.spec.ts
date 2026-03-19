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
})

import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'

import SidebarHistory from '@/components/SidebarHistory.vue'
import type { HistoryItem } from '@/types/history'

describe('SidebarHistory component', () => {
  const dummyHistory: HistoryItem[] = [
    { id: '1', timestamp: 1700000000000, source: 'graph TD\n A --> B' },
    { id: '2', timestamp: 1700000005000, source: 'graph LR\n C --> D' },
  ]

  it('renders correctly when closed', () => {
    const wrapper = mount(SidebarHistory, {
      props: { isOpen: false, history: [] },
    })

    // Check if translation class is correct for closed state
    expect(wrapper.find('div.fixed.inset-y-0.right-0').classes()).toContain('translate-x-full')
  })

  it('renders correctly when open', () => {
    const wrapper = mount(SidebarHistory, {
      props: { isOpen: true, history: [] },
    })

    // Check if translation class is correct for open state
    expect(wrapper.find('div.fixed.inset-y-0.right-0').classes()).toContain('translate-x-0')
  })

  it('displays empty state when history is empty', () => {
    const wrapper = mount(SidebarHistory, {
      props: { isOpen: true, history: [] },
    })

    expect(wrapper.text()).toContain('No history yet.')
    expect(wrapper.text()).toContain('Saved charts will appear here.')
  })

  it('displays history items when provided', () => {
    const wrapper = mount(SidebarHistory, {
      props: { isOpen: true, history: dummyHistory },
    })

    expect(wrapper.text()).not.toContain('No history yet.')

    const items = wrapper.findAll('li')
    expect(items.length).toBe(2)

    // Check truncated source logic
    expect(items[0].text()).toContain('graph TD A --> B')
    expect(items[1].text()).toContain('graph LR C --> D')
  })

  it('emits "close" when the close button is clicked', async () => {
    const wrapper = mount(SidebarHistory, {
      props: { isOpen: true, history: [] },
    })

    const closeBtn = wrapper.find('button[title="Close history"]')
    await closeBtn.trigger('click')

    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  it('emits "load" with the correct source when an item is clicked', async () => {
    const wrapper = mount(SidebarHistory, {
      props: { isOpen: true, history: dummyHistory },
    })

    const items = wrapper.findAll('li')
    await items[0].trigger('click')

    const loadEvents = wrapper.emitted('load')
    expect(loadEvents).toBeTruthy()
    expect(loadEvents?.[0]).toEqual(['graph TD\n A --> B'])
  })

  it('emits "delete" with the correct id when the delete button is clicked', async () => {
    const wrapper = mount(SidebarHistory, {
      props: { isOpen: true, history: dummyHistory },
    })

    const deleteBtns = wrapper.findAll('button[title="Delete item"]')
    expect(deleteBtns.length).toBe(2)

    // We must use .stop correctly, vue-test-utils click handles it, but let's just trigger click
    await deleteBtns[1].trigger('click')

    const deleteEvents = wrapper.emitted('delete')
    expect(deleteEvents).toBeTruthy()
    expect(deleteEvents?.[0]).toEqual(['2'])

    // Ensure "load" was not also emitted because of the .stop modifier
    expect(wrapper.emitted('load')).toBeFalsy()
  })
})

import React from 'react'
import { Meta, Story } from '@storybook/react'
import { CalendarView } from './CalendarView'
import { sampleEvents } from '../../utils/event.utils'
import { CalendarEvent } from './CalendarView.types'

export default {
  title: 'Components/Calendar/CalendarView',
  component: CalendarView
} as Meta

const Template: Story<any> = (args) => <div style={{ maxWidth: 1200 }}><CalendarView {...args} /></div>

export const Default = Template.bind({})
Default.args = {
  events: sampleEvents,
  onEventAdd: () => {},
  onEventUpdate: () => {},
  onEventDelete: () => {}
}

export const Empty = Template.bind({})
Empty.args = {
  events: [],
  onEventAdd: () => {},
  onEventUpdate: () => {},
  onEventDelete: () => {}
}

export const WeekViewStory = Template.bind({})
WeekViewStory.args = {
  events: sampleEvents,
  initialView: 'week',
  onEventAdd: () => {},
  onEventUpdate: () => {},
  onEventDelete: () => {}
}

export const WithManyEvents = Template.bind({})
const many: CalendarEvent[] = []
for (let i = 0; i < 25; i++) {
  const day = new Date()
  day.setDate(day.getDate() + (i % 10))
  const s = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 9 + (i % 6), 0)
  const e = new Date(s.getTime() + (30 + (i % 4) * 30) * 60 * 1000)
  many.push({
    id: `many-${i}`,
    title: `Event ${i + 1}`,
    startDate: s,
    endDate: e,
    color: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][i % 4]
  })
}
WithManyEvents.args = {
  events: many,
  onEventAdd: () => {},
  onEventUpdate: () => {},
  onEventDelete: () => {}
}

export const InteractivePlayground = Template.bind({})
InteractivePlayground.args = {
  events: sampleEvents,
  onEventAdd: (e: CalendarEvent) => { console.log('added', e) },
  onEventUpdate: (id: string, upd: Partial<CalendarEvent>) => { console.log('update', id, upd) },
  onEventDelete: (id: string) => { console.log('delete', id) }
}
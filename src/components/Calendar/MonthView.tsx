import React from 'react'
import { getCalendarGrid, isToday } from '../../utils/date.utils'
import { CalendarCell } from './CalendarCell'
import { CalendarEvent } from './CalendarView.types'

interface Props {
  monthDate: Date
  events: CalendarEvent[]
  onDayClick: (d: Date) => void
  onEventClick: (e: CalendarEvent) => void
}

export const MonthView: React.FC<Props> = ({ monthDate, events, onDayClick, onEventClick }) => {
  const grid = getCalendarGrid(monthDate)
  const eventsByDay = new Map<string, CalendarEvent[]>()
  events.forEach(ev => {
    const key = ev.startDate.toDateString()
    const arr = eventsByDay.get(key) ?? []
    arr.push(ev)
    eventsByDay.set(key, arr)
  })
  return (
    <div className="grid grid-cols-7 gap-1">
      {grid.map((d) => {
        const key = d.toDateString()
        const dayEvents = eventsByDay.get(key) ?? []
        const otherMonth = d.getMonth() !== monthDate.getMonth()
        return (
          <CalendarCell
            key={key}
            date={d}
            events={dayEvents}
            isToday={isToday(d)}
            isOtherMonth={otherMonth}
            onClick={onDayClick}
            onEventClick={onEventClick}
          />
        )
      })}
    </div>
  )
}
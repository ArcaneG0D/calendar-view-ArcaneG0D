import React, { useCallback, useEffect, useRef, useState } from 'react'
import { CalendarViewProps, CalendarEvent } from './CalendarView.types'
import { useCalendar } from '../../hooks/useCalendar'
import { MonthView } from './MonthView'
import { WeekView } from './WeekView'
import { EventModal } from './EventModal'
import { useEventManager } from '../../hooks/useEventManager'
import { getCalendarGrid } from '../../utils/date.utils'

export const CalendarView: React.FC<CalendarViewProps> = ({ events: initialEvents, onEventAdd, onEventUpdate, onEventDelete, initialView, initialDate }) => {
  const { currentDate, view, goToNextMonth, goToPreviousMonth, goToToday, setMonthView, setWeekView, setCurrentDate } = useCalendar(initialDate ?? new Date())
  const { events, addEvent, updateEvent, deleteEvent } = useEventManager(initialEvents)
  useEffect(() => {
    if (initialView === 'week') setWeekView()
  }, [initialView, setWeekView])

  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<CalendarEvent | null>(null)
  const [focusedDate, setFocusedDate] = useState<Date | null>(null)
  const gridRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (focusedDate) {
      const selector = `[data-date="${focusedDate.toDateString()}"]`
      const el = document.querySelector(selector) as HTMLElement | null
      el?.focus()
    }
  }, [focusedDate])

  const openCreateOnDate = useCallback((d: Date) => {
    const hasTime = d.getHours() !== 0 || d.getMinutes() !== 0 || d.getSeconds() !== 0
    const start = hasTime ? new Date(d) : new Date(d.getFullYear(), d.getMonth(), d.getDate(), 9, 0)
    const end = new Date(start.getTime() + 60 * 60 * 1000)
    setEditing({
      id: 'evt-' + Math.random().toString(36).slice(2, 9),
      title: '',
      description: '',
      startDate: start,
      endDate: end,
      color: '#0ea5e9'
    })
    setModalOpen(true)
  }, [])

  const openEdit = useCallback((ev: CalendarEvent) => {
    setEditing(ev)
    setModalOpen(true)
  }, [])

  const handleSave = useCallback((ev: CalendarEvent) => {
    const exists = events.some(e => e.id === ev.id)
    if (exists) {
      updateEvent(ev.id, ev)
      onEventUpdate?.(ev.id, ev)
    } else {
      addEvent(ev)
      onEventAdd?.(ev)
    }
    setModalOpen(false)
    setEditing(null)
  }, [addEvent, events, updateEvent, onEventAdd, onEventUpdate])

  const handleDelete = useCallback((id: string) => {
    deleteEvent(id)
    onEventDelete?.(id)
    setModalOpen(false)
    setEditing(null)
  }, [deleteEvent, onEventDelete])

  const handleDayClick = useCallback((d: Date) => {
    openCreateOnDate(d)
  }, [openCreateOnDate])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!focusedDate) {
      setFocusedDate(new Date(currentDate))
      return
    }
    let next = new Date(focusedDate)
    if (e.key === 'ArrowRight') next.setDate(next.getDate() + 1)
    if (e.key === 'ArrowLeft') next.setDate(next.getDate() - 1)
    if (e.key === 'ArrowDown') next.setDate(next.getDate() + 7)
    if (e.key === 'ArrowUp') next.setDate(next.getDate() - 7)
    if (e.key === 'Enter') {
      openCreateOnDate(focusedDate)
      return
    }
    setFocusedDate(next)
  }

  useEffect(() => {
    setCurrentDate(prev => prev)
  }, [setCurrentDate])

  const monthGrid = getCalendarGrid(currentDate)
  const eventsMap = new Map<string, CalendarEvent[]>()
  events.forEach(ev => {
    const key = ev.startDate.toDateString()
    const arr = eventsMap.get(key) ?? []
    arr.push(ev)
    eventsMap.set(key, arr)
  })

  const weekStart = (() => {
    const d = new Date(currentDate)
    const day = d.getDay()
    d.setDate(d.getDate() - day)
    return d
  })()

  const handlePrev = useCallback(() => {
    if (view === 'month') {
      goToPreviousMonth()
    } else {
      setCurrentDate(d => {
        const next = new Date(d)
        next.setDate(next.getDate() - 7)
        return next
      })
    }
  }, [view, goToPreviousMonth, setCurrentDate])

  const handleNext = useCallback(() => {
    if (view === 'month') {
      goToNextMonth()
    } else {
      setCurrentDate(d => {
        const next = new Date(d)
        next.setDate(next.getDate() + 7)
        return next
      })
    }
  }, [view, goToNextMonth, setCurrentDate])

  const handleToday = useCallback(() => {
    if (view === 'month') {
      goToToday()
    } else {
      const now = new Date()
      setCurrentDate(now)
    }
  }, [view, goToToday, setCurrentDate])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          <button onClick={handlePrev} aria-label="Previous" className="px-3 py-1 rounded border">Prev</button>
          <button onClick={handleToday} aria-label="Today" className="px-3 py-1 rounded border">Today</button>
          <button onClick={handleNext} aria-label="Next" className="px-3 py-1 rounded border">Next</button>
        </div>
        <div className="flex gap-2 items-center">
          <div className="text-sm font-medium">{currentDate.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</div>
          <button onClick={setMonthView} className={`px-3 py-1 rounded border ${view === 'month' ? 'bg-neutral-100' : ''}`}>Month</button>
          <button onClick={setWeekView} className={`px-3 py-1 rounded border ${view === 'week' ? 'bg-neutral-100' : ''}`}>Week</button>
        </div>
      </div>

      <div ref={gridRef} onKeyDown={handleKeyDown} tabIndex={0}>
        {view === 'month' && (
          <MonthView
            monthDate={currentDate}
            events={events}
            onDayClick={handleDayClick}
            onEventClick={openEdit}
          />
        )}

        {view === 'week' && (
          <WeekView startDate={weekStart} events={events} onEventClick={openEdit} onSlotDoubleClick={openCreateOnDate} />
        )}
      </div>

      <EventModal
        open={modalOpen}
        initial={editing}
        onSave={handleSave}
        onClose={() => { setModalOpen(false); setEditing(null) }}
        onDelete={handleDelete}
      />
    </div>
  )
}
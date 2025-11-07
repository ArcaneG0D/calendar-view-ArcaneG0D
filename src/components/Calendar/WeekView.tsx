import React, { useMemo, useRef, useCallback } from 'react'
import { CalendarEvent } from './CalendarView.types'
import { isSameDay } from '../../utils/date.utils'

interface Props {
  startDate: Date
  events: CalendarEvent[]
  hourHeight?: number
  onEventClick: (e: CalendarEvent) => void
  onSlotDoubleClick?: (d: Date) => void
}

const HOURS = Array.from({ length: 24 }, (_, i) => i)

const groupEventsByDay = (startDate: Date, events: CalendarEvent[]) => {
  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startDate)
    day.setDate(startDate.getDate() + i)
    day.setHours(0, 0, 0, 0)
    return day
  })
  return days.map(day => events.filter(e => isSameDay(e.startDate, day)))
}

const computePosition = (ev: CalendarEvent, hourHeight: number) => {
  const start = ev.startDate
  const end = ev.endDate
  const startMinutes = start.getHours() * 60 + start.getMinutes()
  const endMinutes = end.getHours() * 60 + end.getMinutes()
  const top = (startMinutes / 60) * hourHeight
  const height = Math.max(18, ((endMinutes - startMinutes) / 60) * hourHeight)
  return { top, height }
}

export const WeekView: React.FC<Props> = ({ startDate, events, hourHeight = 48, onEventClick, onSlotDoubleClick }) => {
  const eventsByDay = useMemo(() => groupEventsByDay(startDate, events), [startDate, events])
  const totalHeight = hourHeight * 24
  const scrollRef = useRef<HTMLDivElement | null>(null)

  // double-click handler: compute time from click Y and call onSlotDoubleClick with full Date
  const handleDayDoubleClick = useCallback((dayDate: Date, clientY: number) => {
    if (!scrollRef.current) {
      if (onSlotDoubleClick) onSlotDoubleClick(dayDate)
      return
    }
    const scroller = scrollRef.current
    const rect = scroller.getBoundingClientRect()
    const yWithin = clientY - rect.top + scroller.scrollTop
    const clamped = Math.max(0, Math.min(yWithin, totalHeight - 1))
    const minutes = (clamped / totalHeight) * 24 * 60
    const hour = Math.floor(minutes / 60)
    const minute = Math.round((minutes % 60) / 5) * 5
    const d = new Date(dayDate)
    d.setHours(hour, minute, 0, 0)
    if (onSlotDoubleClick) onSlotDoubleClick(d)
  }, [onSlotDoubleClick, totalHeight])

  return (
    <div className="w-full border border-neutral-200 bg-white">
      <div className="flex">
        <div style={{ width: 80 }} className="flex-shrink-0 border-r border-neutral-200 bg-neutral-50">
          <div className="sticky top-0 bg-neutral-50 p-2 text-sm font-medium text-center">Time</div>
        </div>

        <div className="flex-1 overflow-auto" ref={scrollRef} style={{ maxHeight: 'calc(80vh)', height: `${totalHeight}px` }}>
          <div style={{ display: 'grid', gridTemplateColumns: '80px repeat(7, 1fr)' }}>
            <div>
              <div style={{ position: 'sticky', top: 0, background: 'white', zIndex: 10, padding: '8px', borderBottom: '1px solid rgba(0,0,0,0.06)' }} className="text-sm text-center"> </div>
              <div>
                {HOURS.map(h => (
                  <div key={h} style={{ height: hourHeight, boxSizing: 'border-box', paddingRight: 8 }} className="text-[12px] text-right pr-2 py-0.5 text-neutral-500">
                    {String(h).padStart(2, '0')}:00
                  </div>
                ))}
              </div>
            </div>

            {eventsByDay.map((dayEvents, dayIdx) => {
              const dayDate = new Date(startDate)
              dayDate.setDate(startDate.getDate() + dayIdx)
              const dayKey = dayDate.toDateString()
              return (
                <div key={dayKey} className="border-l border-neutral-100" style={{ minHeight: totalHeight, position: 'relative' }}>
                  <div style={{ position: 'sticky', top: 0, zIndex: 10, background: 'white', borderBottom: '1px solid rgba(0,0,0,0.06)', padding: '10px', textAlign: 'center' }}>
                    <div className="font-medium text-sm">{dayDate.toLocaleDateString(undefined, { weekday: 'short' })}</div>
                    <div className="text-xs text-neutral-500">{dayDate.toLocaleDateString()}</div>
                  </div>

                  {/* This inner area receives double-clicks to create events; headers/time labels do not */}
                  <div
                    style={{ position: 'relative', height: totalHeight }}
                    onDoubleClick={(e) => {
                      handleDayDoubleClick(dayDate, (e as React.MouseEvent).clientY)
                    }}
                  >
                    {HOURS.map(h => (
                      <div key={h} style={{ height: hourHeight, borderTop: '1px solid rgba(0,0,0,0.04)' }} />
                    ))}

                    {dayEvents.map((ev, idx) => {
                      const { top, height } = computePosition(ev, hourHeight)
                      const leftOffset = 6 + (idx * 6)
                      return (
                        <div
                          key={ev.id}
                          role="button"
                          tabIndex={0}
                          onDoubleClick={(e) => { e.stopPropagation(); onEventClick(ev) }}
                          onKeyDown={(e) => { if (e.key === 'Enter') onEventClick(ev) }}
                          style={{
                            position: 'absolute',
                            left: `${leftOffset}%`,
                            right: '6%',
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: ev.color ?? '#0ea5e9',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}
                          className="text-xs text-white cursor-pointer shadow-sm"
                          aria-label={`${ev.title} ${ev.startDate.toLocaleTimeString()} - ${ev.endDate.toLocaleTimeString()}`}
                        >
                          <div className="font-medium truncate">{ev.title}</div>
                          <div className="text-[10px] truncate">
                            {String(ev.startDate.getHours()).padStart(2, '0')}:{String(ev.startDate.getMinutes()).padStart(2, '0')} - {String(ev.endDate.getHours()).padStart(2, '0')}:{String(ev.endDate.getMinutes()).padStart(2, '0')}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
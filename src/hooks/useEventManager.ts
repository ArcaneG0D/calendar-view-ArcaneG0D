// src/hooks/useEventManager.ts
import { useCallback, useEffect, useState } from 'react'
import { CalendarEvent } from '../components/Calendar/CalendarView.types'

const STORAGE_KEY = 'calendar_events_v1'

export function useEventManager(initial: CalendarEvent[] = []) {
  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (!raw) return initial
      const parsed = JSON.parse(raw) as any[]
      return parsed.map(p => ({ ...p, startDate: new Date(p.startDate), endDate: new Date(p.endDate) })) as CalendarEvent[]
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch (e) {
      // ignore storage errors
    }
  }, [events])

  const addEvent = useCallback((ev: CalendarEvent) => {
    setEvents(prev => [...prev, ev])
  }, [])

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e))
  }, [])

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id))
  }, [])

  const replaceAll = useCallback((list: CalendarEvent[]) => {
    setEvents(list)
  }, [])

  return { events, addEvent, updateEvent, deleteEvent, replaceAll }
}
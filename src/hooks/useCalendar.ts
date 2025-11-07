import { useCallback, useState } from 'react'

export const useCalendar = (initialDate: Date = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate)
  const [view, setView] = useState<'month' | 'week'>('month')
  const goToNextMonth = useCallback(() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)), [])
  const goToPreviousMonth = useCallback(() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)), [])
  const goToToday = useCallback(() => setCurrentDate(new Date()), [])
  const setMonthView = useCallback(() => setView('month'), [])
  const setWeekView = useCallback(() => setView('week'), [])
  return { currentDate, view, goToNextMonth, goToPreviousMonth, goToToday, setMonthView, setWeekView, setCurrentDate }
}
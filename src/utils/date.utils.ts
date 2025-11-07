export const isSameDay = (a: Date, b: Date): boolean =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

export const getCalendarGrid = (date: Date): Date[] => {
  const year = date.getFullYear()
  const month = date.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDay = firstDay.getDay()
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - startDay)
  const grid: Date[] = []
  for (let i = 0; i < 42; i++) {
    grid.push(new Date(startDate))
    startDate.setDate(startDate.getDate() + 1)
  }
  return grid
}

export const isToday = (date: Date): boolean => isSameDay(date, new Date())

export const toDateTimeLocal = (d: Date): string => {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  const hours = String(d.getHours()).padStart(2, '0')
  const minutes = String(d.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export const parseDateTimeLocal = (s: string): Date => {
  const [datePart, timePart] = s.split('T')
  const [y, m, d] = datePart.split('-').map(Number)
  const [hh, mm] = (timePart ?? '00:00').split(':').map(Number)
  return new Date(y, m - 1, d, hh ?? 0, mm ?? 0)
}
import React, { useEffect, useState } from 'react'
import { Modal } from '../primitives/Modal'
import { CalendarEvent } from './CalendarView.types'
import { parseDateTimeLocal, toDateTimeLocal } from '../../utils/date.utils'

interface Props {
  open: boolean
  initial?: CalendarEvent | null
  onSave: (e: CalendarEvent) => void
  onClose: () => void
  onDelete?: (id: string) => void
}

const PRESET_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#fb7185']

export const EventModal: React.FC<Props> = ({ open, initial, onSave, onClose, onDelete }) => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [color, setColor] = useState(PRESET_COLORS[0])

  useEffect(() => {
    if (initial) {
      setTitle(initial.title ?? '')
      setDescription(initial.description ?? '')
      setStart(toDateTimeLocal(initial.startDate ?? new Date()))
      setEnd(toDateTimeLocal(initial.endDate ?? new Date()))
      setColor(initial.color ?? PRESET_COLORS[0])
    } else {
      const now = new Date()
      const later = new Date(now.getTime() + 60 * 60 * 1000)
      setTitle('')
      setDescription('')
      setStart(toDateTimeLocal(now))
      setEnd(toDateTimeLocal(later))
      setColor(PRESET_COLORS[0])
    }
  }, [initial, open])

  const save = () => {
    const ev: CalendarEvent = {
      id: initial?.id ?? 'evt-' + Math.random().toString(36).slice(2, 9),
      title: title.trim() || 'Untitled',
      description: description.trim() || undefined,
      startDate: parseDateTimeLocal(start),
      endDate: parseDateTimeLocal(end),
      color,
      category: initial?.category
    }
    if (ev.endDate <= ev.startDate) {
      const later = new Date(ev.startDate.getTime() + 60 * 60 * 1000)
      ev.endDate = later
    }
    onSave(ev)
  }

  return (
    <Modal open={open} onClose={onClose}>
      <div id="modal-title" className="text-lg font-semibold mb-2">{initial ? 'Edit Event' : 'Create Event'}</div>
      <div className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input className="w-full border px-2 py-1 rounded" value={title} onChange={e => setTitle(e.target.value)} maxLength={100} />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea className="w-full border px-2 py-1 rounded" value={description} onChange={e => setDescription(e.target.value)} maxLength={500} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-sm mb-1">Start</label>
            <input className="w-full border px-2 py-1 rounded" type="datetime-local" value={start} onChange={e => setStart(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">End</label>
            <input className="w-full border px-2 py-1 rounded" type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">Color</label>
          <div className="flex gap-2">
            {PRESET_COLORS.map(c => (
              <button key={c} onClick={() => setColor(c)} className={`w-8 h-8 rounded ${color === c ? 'ring-2 ring-offset-1' : ''}`} style={{ backgroundColor: c }} aria-label={`Choose color ${c}`} />
            ))}
          </div>
        </div>
        <div className="flex gap-2 justify-end mt-4">
          <button onClick={onClose} className="px-3 py-1 border rounded">Cancel</button>
          {initial && onDelete && <button onClick={() => onDelete(initial.id)} className="px-3 py-1 border rounded">Delete</button>}
          <button onClick={save} className="px-3 py-1 bg-primary-500 text-white rounded">Save</button>
        </div>
      </div>
    </Modal>
  )
}
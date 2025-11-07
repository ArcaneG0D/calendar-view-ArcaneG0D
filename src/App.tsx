import { CalendarView } from './components/Calendar/CalendarView'
import { sampleEvents } from './utils/event.utils'

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-6xl mx-auto">
        <CalendarView
          events={sampleEvents}
          onEventAdd={() => {}}
          onEventUpdate={() => {}}
          onEventDelete={() => {}}
        />
      </div>
    </div>
  )
}
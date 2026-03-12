import { Routes, Route } from 'react-router-dom'
import { DashboardView } from '@/features/dashboard/DashboardView'
import { BoardView } from '@/features/boardView/BoardView'

function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardView />} />
      <Route path="/board/:id" element={<BoardView />} />
    </Routes>
  )
}

export default App

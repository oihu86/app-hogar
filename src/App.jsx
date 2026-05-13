import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar from './components/NavBar'
import Dashboard from './pages/Dashboard'
import Tareas from './pages/Tareas'
import Gastos from './pages/Gastos'
import Compra from './pages/Compra'
import Calendario from './pages/Calendario'

function App() {
  return (
    <BrowserRouter>
      <NavBar />       
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tareas" element={<Tareas />} />
        <Route path="/gastos" element={<Gastos />} />
        <Route path="/compra" element={<Compra />} />
        <Route path="/calendario" element={<Calendario />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

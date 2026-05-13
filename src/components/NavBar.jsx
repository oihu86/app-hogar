import { useNavigate, useLocation } from 'react-router-dom'

function NavBar() {
  const navigate = useNavigate()
  const location = useLocation()

  const enlaces = [
    { ruta: '/',           nombre: 'Inicio' },
    { ruta: '/tareas',     nombre: 'Tareas' },
    { ruta: '/gastos',     nombre: 'Gastos' },
    { ruta: '/compra',     nombre: 'Compra' },
    { ruta: '/calendario', nombre: 'Calendario' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around py-3">
      {enlaces.map(enlace => (
        <button
          key={enlace.ruta}
          onClick={() => navigate(enlace.ruta)}
          className={location.pathname === enlace.ruta ? 'text-blue-500 font-bold' : 'text-gray-400'}
        >
          {enlace.nombre}
        </button>
      ))}
    </nav>
  )
}

export default NavBar

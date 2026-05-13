import { useState } from 'react'

const CATEGORIAS = ['Fresco', 'Seco', 'Limpieza', 'Gatos']
const TIENDAS_INICIALES = ['Mercadona', 'Eroski']

const PRODUCTOS_INICIALES = [
  { id: 1, nombre: 'Leche', categoria: 'Fresco', tienda: 'Mercadona', necesito: false },
  { id: 2, nombre: 'Leche sin lactosa', categoria: 'Fresco', tienda: 'Mercadona', necesito: false },
  { id: 3, nombre: 'Pan bocata', categoria: 'Fresco', tienda: 'Eroski', necesito: false },
]

function Compra() {
  const [vista, setVista] = useState('productos') // 'productos' o 'lista'
  const [productos, setProductos] = useState(PRODUCTOS_INICIALES)
  const [tiendas, setTiendas] = useState(TIENDAS_INICIALES)

  const [mostrarFormProducto, setMostrarFormProducto] = useState(false)
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: '', categoria: CATEGORIAS[0], tienda: TIENDAS_INICIALES[0] })

  const [mostrarFormTienda, setMostrarFormTienda] = useState(false)
  const [nuevaTienda, setNuevaTienda] = useState('')

  function guardarProducto() {
    if (nuevoProducto.nombre.trim() === '') return
    setProductos([...productos, { id: Date.now(), ...nuevoProducto, necesito: false }])
    setNuevoProducto({ nombre: '', categoria: CATEGORIAS[0], tienda: tiendas[0] })
    setMostrarFormProducto(false)
  }

  function guardarTienda() {
    if (nuevaTienda.trim() === '') return
    setTiendas([...tiendas, nuevaTienda])
    setNuevaTienda('')
    setMostrarFormTienda(false)
  }

  function toggleNecesito(id) {
    setProductos(productos.map(p => p.id === id ? { ...p, necesito: !p.necesito } : p))
  }

  return (
    <div className="min-h-screen bg-teal-50 px-4 pt-8 pb-24">

      {/* Cabecera */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-teal-700">Compra</h1>
      </div>

      {/* Selector de vista */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setVista('lista')}
          className={`flex-1 py-2 rounded-xl font-semibold ${vista === 'lista' ? 'bg-teal-500 text-white' : 'bg-white text-teal-500 border border-teal-300'}`}
        >
          🛒 Lista de la compra
        </button>
        <button
          onClick={() => setVista('productos')}
          className={`flex-1 py-2 rounded-xl font-semibold ${vista === 'productos' ? 'bg-teal-500 text-white' : 'bg-white text-teal-500 border border-teal-300'}`}
        >
          📦 Mis productos
        </button>
      </div>

      {/* VISTA — Mis productos */}
      {vista === 'productos' && (
        <div>
          {CATEGORIAS.map(categoria => {
            const productosFiltrados = productos.filter(p => p.categoria === categoria)
            if (productosFiltrados.length === 0) return null
            return (
              <div key={categoria} className="mb-6">
                <h2 className="text-md font-semibold text-teal-600 mb-2">{categoria}</h2>
                {productosFiltrados.map(producto => (
                  <div key={producto.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-3 mb-2 shadow-sm">
                    <div>
                      <p className="text-teal-700 font-medium">{producto.nombre}</p>
                      <p className="text-xs text-teal-400">{producto.tienda}</p>
                    </div>
                    <button
                      onClick={() => toggleNecesito(producto.id)}
                      className={`text-xs px-3 py-1 rounded-full font-semibold ${producto.necesito ? 'bg-teal-500 text-white' : 'bg-teal-100 text-teal-500'}`}
                    >
                      {producto.necesito ? '✅ En lista' : '+ Añadir'}
                    </button>
                  </div>
                ))}
              </div>
            )
          })}

          {/* Formulario nuevo producto */}
          {mostrarFormProducto && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <input
                type="text"
                placeholder="Nombre del producto"
                value={nuevoProducto.nombre}
                onChange={e => setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })}
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              />
              <select
                value={nuevoProducto.categoria}
                onChange={e => setNuevoProducto({ ...nuevoProducto, categoria: e.target.value })}
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              >
                {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={nuevoProducto.tienda}
                onChange={e => setNuevoProducto({ ...nuevoProducto, tienda: e.target.value })}
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              >
                {tiendas.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="flex gap-2">
                <button onClick={guardarProducto} className="flex-1 bg-teal-500 text-white rounded-xl py-2 font-semibold">Guardar</button>
                <button onClick={() => setMostrarFormProducto(false)} className="flex-1 border border-teal-300 text-teal-500 rounded-xl py-2">Cancelar</button>
              </div>
            </div>
          )}

          {/* Formulario nueva tienda */}
          {mostrarFormTienda && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <input
                type="text"
                placeholder="Nombre de la tienda"
                value={nuevaTienda}
                onChange={e => setNuevaTienda(e.target.value)}
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              />
              <div className="flex gap-2">
                <button onClick={guardarTienda} className="flex-1 bg-teal-500 text-white rounded-xl py-2 font-semibold">Guardar</button>
                <button onClick={() => setMostrarFormTienda(false)} className="flex-1 border border-teal-300 text-teal-500 rounded-xl py-2">Cancelar</button>
              </div>
            </div>
          )}

          {/* Botones fijos */}
          <div className="fixed bottom-20 right-4 flex flex-col gap-2">
            <button
              onClick={() => setMostrarFormTienda(true)}
              className="bg-white border border-teal-400 text-teal-500 rounded-full w-14 h-14 text-xl shadow-lg"
            >
              🏪
            </button>
            <button
              onClick={() => setMostrarFormProducto(true)}
              className="bg-teal-500 text-white rounded-full w-14 h-14 text-2xl shadow-lg"
            >
              +
            </button>
          </div>
        </div>
      )}

      {/* VISTA — Lista de la compra */}
      {vista === 'lista' && (
        <div>
          <p className="text-teal-400 text-sm text-center">Aquí saldrán los productos que hayas marcado como "necesito" 🛒</p>
        </div>
      )}

    </div>
  )
}

export default Compra
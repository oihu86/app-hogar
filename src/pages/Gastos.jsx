import { useState, useEffect } from "react";
import { supabase } from "../supabase";

function Gastos() {
  const [mesSeleccionado, setMesSeleccionado] = useState("Marzo");
  const [anioSeleccionado, setAnioSeleccionado] = useState("2026");
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [mostrarCategorias, setMostrarCategorias] = useState(false);
  const [categorias, setCategorias] = useState([
    "Comida",
    "Gastos hogar",
    "Suscripciones",
    "Gasoil",
    "Ocio",
    "Coches",
    "Varios",
    "Efectivo",
  ]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");
  const [mostrarNuevoGasto, setMostrarNuevoGasto] = useState(false);
  const [nuevoGasto, setNuevoGasto] = useState({
    fecha: "",
    categoria: "",
    importe: "",
    descripcion: "",
  });
  const [mostrarDescripciones, setMostrarDescripciones] = useState(false);
  const [nuevaDescripcion, setNuevaDescripcion] = useState({
    nombre: "",
    categoria: "",
  });
  const [descripciones, setDescripciones] = useState([
    { nombre: "Eroski", categoria: "Comida" },
    { nombre: "Mercadona", categoria: "Comida" },
    { nombre: "Lidl", categoria: "Comida" },
    { nombre: "Claude", categoria: "Suscripciones" },
    { nombre: "Amazon Prime", categoria: "Suscripciones" },
    { nombre: "Disney+", categoria: "Suscripciones" },
    { nombre: "Apple", categoria: "Suscripciones" },
    { nombre: "Hipoteca", categoria: "Gastos hogar" },
    { nombre: "Préstamos", categoria: "Gastos hogar" },
    { nombre: "Luz", categoria: "Gastos hogar" },
    { nombre: "Teléfono", categoria: "Gastos hogar" },
    { nombre: "Ayuntamiento Berriozar", categoria: "Gastos hogar" },
    { nombre: "Mancomunidad de Pamplona", categoria: "Gastos hogar" },
    { nombre: "Hacienda", categoria: "Gastos hogar" },
    { nombre: "Gasoil", categoria: "Coches" },
    { nombre: "ITV", categoria: "Coches" },
    { nombre: "Taller", categoria: "Coches" },
    { nombre: "Impuesto", categoria: "Coches" },
    { nombre: "Tabaco", categoria: "Ocio" },
    { nombre: "Fiesta", categoria: "Ocio" },
    { nombre: "Amazon", categoria: "Varios" },
    { nombre: "Chinos", categoria: "Varios" },
    { nombre: "Otros", categoria: "Varios" },
    { nombre: "Efectivo", categoria: "Varios" },
  ]);
  const [gastos, setGastos] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState({
    descripcion: "",
    categoria: "",
    importeMin: "",
    importeMax: "",
    fechaDesde: "",
    fechaHasta: "",
    mes: "",
    anio: "",
  });

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
    "Todos",
  ];
  const anios = ["2024", "2025", "2026"];

  const total = gastos.reduce((acc, g) => acc + g.importe, 0);

  const gastosFiltrados = gastos.filter((g) => {
    if (
      filtroBusqueda.descripcion &&
      g.descripcion !== filtroBusqueda.descripcion
    )
      return false;
    if (filtroBusqueda.categoria && g.categoria !== filtroBusqueda.categoria)
      return false;
    if (
      filtroBusqueda.importeMin &&
      g.importe < parseFloat(filtroBusqueda.importeMin)
    )
      return false;
    if (
      filtroBusqueda.importeMax &&
      g.importe > parseFloat(filtroBusqueda.importeMax)
    )
      return false;
    if (filtroBusqueda.fechaDesde && g.fecha < filtroBusqueda.fechaDesde)
      return false;
    if (filtroBusqueda.fechaHasta && g.fecha > filtroBusqueda.fechaHasta)
      return false;
    if (
      filtroBusqueda.mes &&
      new Date(g.fecha).getMonth() + 1 !== parseInt(filtroBusqueda.mes)
    )
      return false;
    if (
      filtroBusqueda.anio &&
      new Date(g.fecha).getFullYear() !== parseInt(filtroBusqueda.anio)
    )
      return false;
    return true;
  });

  function añadirCategoria() {
    if (nuevaCategoria.trim() === "") return;
    setCategorias([...categorias, nuevaCategoria.trim()]);
    setNuevaCategoria("");
  }

  async function añadirGasto() {
    if (!nuevoGasto.fecha || !nuevoGasto.categoria || !nuevoGasto.importe)
      return;
    const { error } = await supabase.from("gastos").insert({
      fecha: nuevoGasto.fecha,
      categoria: nuevoGasto.categoria,
      importe: parseFloat(nuevoGasto.importe),
      descripcion: nuevoGasto.descripcion,
    });
    if (error) console.error(error);
    else {
      await cargarGastos();
      setNuevoGasto({ fecha: "", categoria: "", importe: "", descripcion: "" });
      setMostrarNuevoGasto(false);
    }
  }

  async function cargarCategorias() {
    const { data, error } = await supabase.from("categorias").select("*");
    if (error) console.error(error);
    else {
      console.log("categorias:", data);
      setCategorias(data.map((c) => c.nombre));
    }
  }

  async function cargarDescripciones() {
    const { data, error } = await supabase.from("descripciones").select("*");
    if (error) console.error(error);
    else
      setDescripciones(
        data.map((d) => ({ nombre: d.nombre, categoria: d.categoria })),
      );
  }

  async function cargarGastos() {
    const { data, error } = await supabase
      .from("gastos")
      .select("*")
      .order("fecha", { ascending: false })
      .limit(20);
    if (error) console.error(error);
    else setGastos(data);
  }

  useEffect(() => {
    cargarCategorias();
    cargarDescripciones();
    cargarGastos();
  }, []);

  return (
    <div className="min-h-screen bg-teal-50 px-4 pt-8 pb-24">
      {/* Cabecera */}
      <h1 className="text-2xl font-bold text-teal-700 text-center mb-6">
        Gastos
      </h1>

      {/* Layout dos columnas */}
      <div className="flex gap-3 mb-6 items-start">
        {/* Columna izquierda - tarjetas */}
        <div className="flex flex-col gap-3 w-1/2">
          {/* 1. Total mes */}
          <div className="bg-white rounded-2xl border border-teal-200 px-4 py-2 shadow-sm flex items-center justify-between">
            <p className="text-xs text-teal-500">Gastado</p>
            <p className="text-sm font-bold text-teal-700">
              {total.toFixed(2)}€
            </p>
            <button
              onClick={() => setMostrarFiltros(!mostrarFiltros)}
              className="text-xs text-teal-400"
            >
              {mesSeleccionado} {anioSeleccionado} ▾
            </button>
            {mostrarFiltros && (
              <div className="absolute mt-16 flex gap-2 bg-white border border-teal-200 rounded-xl p-2 shadow z-10">
                <select
                  value={mesSeleccionado}
                  onChange={(e) => setMesSeleccionado(e.target.value)}
                  className="text-xs border rounded p-1"
                >
                  {meses.map((m) => (
                    <option key={m}>{m}</option>
                  ))}
                </select>
                <select
                  value={anioSeleccionado}
                  onChange={(e) => setAnioSeleccionado(e.target.value)}
                  className="text-xs border rounded p-1"
                >
                  {anios.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* 2. Descripciones */}
          <div
            onClick={() => setMostrarDescripciones(true)}
            className="bg-white rounded-2xl border border-teal-200 p-2 shadow-sm flex flex-col justify-center items-center cursor-pointer"
          >
            <span className="text-lg">📝</span>
            <p className="text-xs text-teal-500 mt-1">Descripciones</p>
          </div>

          {/* 3. Nuevo gasto */}
          <div
            onClick={() => setMostrarNuevoGasto(true)}
            className="bg-white rounded-2xl border border-teal-200 p-2 shadow-sm flex flex-col justify-center items-center cursor-pointer"
          >
            <span className="text-lg">➕</span>
            <p className="text-xs text-teal-500 mt-1">Nuevo gasto</p>
          </div>

          {/* 4. Categorías */}
          <div
            onClick={() => setMostrarCategorias(true)}
            className="bg-white rounded-2xl border border-teal-200 p-2 shadow-sm flex flex-col justify-center items-center cursor-pointer"
          >
            <span className="text-lg">🏷️</span>
            <p className="text-xs text-teal-500 mt-1">Categorías</p>
          </div>
        </div>

        {/* Columna derecha - filtros */}
        <div className="w-1/2">
          <div className="bg-white rounded-2xl border border-teal-200 p-3 shadow-sm flex flex-col gap-2 h-full">
            <p className="text-xs font-bold text-teal-500 uppercase mb-1">
              Filtros
            </p>

            <select
              value={filtroBusqueda.descripcion}
              onChange={(e) =>
                setFiltroBusqueda({
                  ...filtroBusqueda,
                  descripcion: e.target.value,
                })
              }
              className="border border-teal-200 rounded-xl px-2 py-1 text-xs outline-none"
            >
              <option value="">Todas las descripciones</option>
              {descripciones.map((desc, i) => (
                <option key={i}>{desc.nombre}</option>
              ))}
            </select>

            <select
              value={filtroBusqueda.categoria}
              onChange={(e) =>
                setFiltroBusqueda({
                  ...filtroBusqueda,
                  categoria: e.target.value,
                })
              }
              className="border border-teal-200 rounded-xl px-2 py-1 text-xs outline-none"
            >
              <option value="">Todas las categorías</option>
              {categorias.map((cat, i) => (
                <option key={i}>{cat}</option>
              ))}
            </select>

            <div className="flex gap-1">
              <input
                type="number"
                placeholder="Min €"
                value={filtroBusqueda.importeMin}
                onChange={(e) =>
                  setFiltroBusqueda({
                    ...filtroBusqueda,
                    importeMin: e.target.value,
                  })
                }
                className="border border-teal-200 rounded-xl px-2 py-1 text-xs outline-none w-1/2"
              />
              <input
                type="number"
                placeholder="Max €"
                value={filtroBusqueda.importeMax}
                onChange={(e) =>
                  setFiltroBusqueda({
                    ...filtroBusqueda,
                    importeMax: e.target.value,
                  })
                }
                className="border border-teal-200 rounded-xl px-2 py-1 text-xs outline-none w-1/2"
              />
            </div>

            <input
              type="date"
              value={filtroBusqueda.fechaDesde}
              onChange={(e) =>
                setFiltroBusqueda({
                  ...filtroBusqueda,
                  fechaDesde: e.target.value,
                })
              }
              className="border border-teal-200 rounded-xl px-2 py-1 text-xs outline-none"
            />
            <input
              type="date"
              value={filtroBusqueda.fechaHasta}
              onChange={(e) =>
                setFiltroBusqueda({
                  ...filtroBusqueda,
                  fechaHasta: e.target.value,
                })
              }
              className="border border-teal-200 rounded-xl px-2 py-1 text-xs outline-none"
            />

            <div className="flex gap-1">
              <select
                value={filtroBusqueda.mes}
                onChange={(e) =>
                  setFiltroBusqueda({ ...filtroBusqueda, mes: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-2 py-1 text-xs outline-none w-1/2"
              >
                <option value="">Mes</option>
                {meses
                  .filter((m) => m !== "Todos")
                  .map((m, i) => (
                    <option key={i} value={i + 1}>
                      {m}
                    </option>
                  ))}
              </select>
              <select
                value={filtroBusqueda.anio}
                onChange={(e) =>
                  setFiltroBusqueda({ ...filtroBusqueda, anio: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-2 py-1 text-xs outline-none w-1/2"
              >
                <option value="">Año</option>
                {anios.map((a, i) => (
                  <option key={i}>{a}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() =>
                setFiltroBusqueda({
                  descripcion: "",
                  categoria: "",
                  importeMin: "",
                  importeMax: "",
                  fechaDesde: "",
                  fechaHasta: "",
                  mes: "",
                  anio: "",
                })
              }
              className="text-xs text-red-400 text-right mt-1"
            >
              Limpiar ✕
            </button>
          </div>
        </div>
      </div>

      {/* Lista de movimientos */}
      <h2 className="text-sm font-semibold text-teal-600 mb-3">
        Últimos movimientos
      </h2>
      <div className="flex flex-col gap-2">
        {gastosFiltrados.map((gasto) => (
          <div
            key={gasto.id}
            className="bg-white rounded-2xl border border-teal-200 px-4 py-3 shadow-sm flex justify-between items-center w-full text-xs group"
          >
            <span className="text-teal-400 w-16">
              {new Date(gasto.fecha).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "short",
                year: "2-digit",
              })}
            </span>
            <span className="text-teal-700 font-medium flex-1 px-2 truncate">
              {gasto.descripcion}
            </span>
            <span className="text-teal-400 w-20 truncate">
              {gasto.categoria}
            </span>
            <span className="text-teal-700 font-bold w-16 text-right">
              {gasto.importe.toFixed(2)}€
            </span>
            <button
              onClick={async () => {
                const { error } = await supabase
                  .from("gastos")
                  .delete()
                  .eq("id", gasto.id);
                if (error) console.error(error);
                else await cargarGastos();
              }}
              className="text-red-400 ml-2"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* Modal categorías */}
      {mostrarCategorias && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-end justify-center z-50">
          <div className="bg-white w-full rounded-t-3xl p-6 pb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-teal-700">Categorías</h2>
              <button
                onClick={() => setMostrarCategorias(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-2 mb-6">
              {categorias.map((cat, index) => (
                <div
                  key={index}
                  className="bg-teal-50 rounded-xl px-4 py-3 text-teal-700 font-medium flex justify-between items-center group"
                >
                  <span>{cat}</span>
                  <button
                    onClick={() =>
                      setCategorias(categorias.filter((_, i) => i !== index))
                    }
                    className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    🗑️
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Nueva categoría..."
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
                className="flex-1 border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={añadirCategoria}
                className="bg-teal-500 text-white rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal descripciones */}
      {mostrarDescripciones && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-teal-700">Descripciones</h2>
              <button
                onClick={() => setMostrarDescripciones(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            {categorias.map((cat) => {
              const items = descripciones.filter((d) => d.categoria === cat);
              if (items.length === 0) return null;
              return (
                <div key={cat} className="mb-4">
                  <p className="text-xs font-bold text-teal-400 uppercase mb-2">
                    {cat}
                  </p>
                  {items.map((desc, i) => (
                    <div
                      key={i}
                      className="bg-teal-50 rounded-xl px-4 py-2 mb-1 text-teal-700 text-sm flex justify-between items-center group"
                    >
                      <span>{desc.nombre}</span>
                      <button
                        onClick={() =>
                          setDescripciones(
                            descripciones.filter(
                              (_, idx) => descripciones.indexOf(desc) !== idx,
                            ),
                          )
                        }
                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              );
            })}
            <div className="flex flex-col gap-2 mt-4">
              <input
                type="text"
                placeholder="Nombre..."
                value={nuevaDescripcion.nombre}
                onChange={(e) =>
                  setNuevaDescripcion({
                    ...nuevaDescripcion,
                    nombre: e.target.value,
                  })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              />
              <select
                value={nuevaDescripcion.categoria}
                onChange={(e) =>
                  setNuevaDescripcion({
                    ...nuevaDescripcion,
                    categoria: e.target.value,
                  })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              >
                <option value="">Selecciona categoría...</option>
                {categorias.map((cat, i) => (
                  <option key={i}>{cat}</option>
                ))}
              </select>
              <button
                onClick={() => {
                  if (!nuevaDescripcion.nombre || !nuevaDescripcion.categoria)
                    return;
                  setDescripciones([...descripciones, nuevaDescripcion]);
                  setNuevaDescripcion({ nombre: "", categoria: "" });
                }}
                className="bg-teal-500 text-white rounded-xl px-4 py-2 text-sm font-semibold"
              >
                Añadir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal nuevo gasto */}
      {mostrarNuevoGasto && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-teal-700">Nuevo gasto</h2>
              <button
                onClick={() => setMostrarNuevoGasto(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-3">
              <input
                type="date"
                value={nuevoGasto.fecha}
                onChange={(e) =>
                  setNuevoGasto({ ...nuevoGasto, fecha: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              />
              <select
                value={nuevoGasto.descripcion}
                onChange={(e) => {
                  const desc = descripciones.find(
                    (d) => d.nombre === e.target.value,
                  );
                  setNuevoGasto({
                    ...nuevoGasto,
                    descripcion: e.target.value,
                    categoria: desc ? desc.categoria : nuevoGasto.categoria,
                  });
                }}
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              >
                <option value="">Selecciona descripción...</option>
                {descripciones.map((desc, i) => (
                  <option key={i}>{desc.nombre}</option>
                ))}
              </select>
              <select
                value={nuevoGasto.categoria}
                onChange={(e) =>
                  setNuevoGasto({ ...nuevoGasto, categoria: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              >
                <option value="">Selecciona categoría...</option>
                {categorias.map((cat, i) => (
                  <option key={i}>{cat}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Importe (€)"
                value={nuevoGasto.importe}
                onChange={(e) =>
                  setNuevoGasto({ ...nuevoGasto, importe: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={añadirGasto}
                className="bg-teal-500 text-white rounded-xl px-4 py-3 font-semibold"
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Gastos;

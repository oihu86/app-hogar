import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const DIAS = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function Tareas() {
  const hoy = new Date().getDay();

  // ============ ESTADO ============
  const [pestanaActiva, setPestanaActiva] = useState("haizea");

  // Rutina Haizea
  const [rutinaHaizea, setRutinaHaizea] = useState([]);
  const [mostrarFormHaizea, setMostrarFormHaizea] = useState(false);
  const [nuevaRutinaHaizea, setNuevaRutinaHaizea] = useState({
    hora: "",
    descripcion: "",
    dias_semana: [],
  });

  // Rutina Iosu
  const [rutinaIosu, setRutinaIosu] = useState([]);
  const [mostrarFormIosu, setMostrarFormIosu] = useState(false);
  const [nuevaRutinaIosu, setNuevaRutinaIosu] = useState({
    hora: "",
    descripcion: "",
    dias_semana: [],
  });

  // Tareas Hogar
  const [tareasHogar, setTareasHogar] = useState([]);
  const [mostrarFormHogar, setMostrarFormHogar] = useState(false);
  const [nuevaTareaHogar, setNuevaTareaHogar] = useState({ nombre: "" });

  // ============ FUNCIONES ASYNC ============
  async function cargarDatos() {
    const { data: dataHaizea } = await supabase
      .from("rutina_mi")
      .select("*")
      .order("hora", { ascending: true });
    if (dataHaizea) setRutinaHaizea(dataHaizea);

    const { data: dataIosu } = await supabase
      .from("rutina_iosu")
      .select("*")
      .order("hora", { ascending: true });
    if (dataIosu) setRutinaIosu(dataIosu);

    const { data: dataHogar } = await supabase
      .from("tareas_hogar")
      .select("*")
      .order("hecha", { ascending: true })
      .order("created_at", { ascending: true });
    if (dataHogar) setTareasHogar(dataHogar);
  }

  // ============ useEffect ============
  useEffect(() => {
    const loadData = async () => {
      await cargarDatos();
    };
    loadData();
  }, []);

  // ============ FUNCIONES RUTINA HAIZEA ============
  async function guardarRutinaHaizea() {
    if (
      !nuevaRutinaHaizea.hora.trim() ||
      !nuevaRutinaHaizea.descripcion.trim() ||
      nuevaRutinaHaizea.dias_semana.length === 0
    )
      return;

    const { error } = await supabase.from("rutina_mi").insert({
      hora: nuevaRutinaHaizea.hora,
      descripcion: nuevaRutinaHaizea.descripcion,
      dias_semana: nuevaRutinaHaizea.dias_semana,
    });

    if (!error) {
      await cargarDatos();
      setNuevaRutinaHaizea({ hora: "", descripcion: "", dias_semana: [] });
      setMostrarFormHaizea(false);
    }
  }

  async function eliminarRutinaHaizea(id) {
    await supabase.from("rutina_mi").delete().eq("id", id);
    await cargarDatos();
  }

  function toggleDiaHaizea(dia) {
    const dias = nuevaRutinaHaizea.dias_semana;
    if (dias.includes(dia)) {
      setNuevaRutinaHaizea({
        ...nuevaRutinaHaizea,
        dias_semana: dias.filter((d) => d !== dia),
      });
    } else {
      setNuevaRutinaHaizea({
        ...nuevaRutinaHaizea,
        dias_semana: [...dias, dia],
      });
    }
  }

  // ============ FUNCIONES RUTINA IOSU ============
  async function guardarRutinaIosu() {
    if (
      !nuevaRutinaIosu.hora.trim() ||
      !nuevaRutinaIosu.descripcion.trim() ||
      nuevaRutinaIosu.dias_semana.length === 0
    )
      return;

    const { error } = await supabase.from("rutina_iosu").insert({
      hora: nuevaRutinaIosu.hora,
      descripcion: nuevaRutinaIosu.descripcion,
      dias_semana: nuevaRutinaIosu.dias_semana,
    });

    if (!error) {
      await cargarDatos();
      setNuevaRutinaIosu({ hora: "", descripcion: "", dias_semana: [] });
      setMostrarFormIosu(false);
    }
  }

  async function eliminarRutinaIosu(id) {
    await supabase.from("rutina_iosu").delete().eq("id", id);
    await cargarDatos();
  }

  function toggleDiaIosu(dia) {
    const dias = nuevaRutinaIosu.dias_semana;
    if (dias.includes(dia)) {
      setNuevaRutinaIosu({
        ...nuevaRutinaIosu,
        dias_semana: dias.filter((d) => d !== dia),
      });
    } else {
      setNuevaRutinaIosu({
        ...nuevaRutinaIosu,
        dias_semana: [...dias, dia],
      });
    }
  }

  // ============ FUNCIONES TAREAS HOGAR ============
  async function guardarTareaHogar() {
    if (!nuevaTareaHogar.nombre.trim()) return;

    const { error } = await supabase.from("tareas_hogar").insert({
      nombre: nuevaTareaHogar.nombre,
      hecha: false,
    });

    if (!error) {
      await cargarDatos();
      setNuevaTareaHogar({ nombre: "" });
      setMostrarFormHogar(false);
    }
  }

  async function toggleTareaHogar(id, hechaActual) {
    await supabase
      .from("tareas_hogar")
      .update({ hecha: !hechaActual })
      .eq("id", id);
    await cargarDatos();
  }

  async function eliminarTareaHogar(id) {
    await supabase.from("tareas_hogar").delete().eq("id", id);
    await cargarDatos();
  }

  // ============ HELPERS ============
  function rutinasDelDia(lista, dia) {
    return lista.filter((item) => item.dias_semana.includes(dia));
  }

  function renderizarRutina(lista, dia, esIosu = false) {
    const delDia = rutinasDelDia(lista, dia);

    if (delDia.length === 0) {
      return <p className="text-sm text-teal-400 ml-4">Nada programado</p>;
    }

    return delDia.map((item) => (
      <div
        key={item.id}
        className="bg-white rounded-xl px-4 py-3 mb-2 shadow-sm flex justify-between items-center"
      >
        <div>
          <p className="font-semibold text-teal-700">{item.hora}</p>
          <p className="text-sm text-teal-600">{item.descripcion}</p>
        </div>
        <button
          onClick={() =>
            esIosu ? eliminarRutinaIosu(item.id) : eliminarRutinaHaizea(item.id)
          }
          className="text-red-500 hover:text-red-700 text-sm"
        >
          ✕
        </button>
      </div>
    ));
  }

  // ============ RENDER ============
  return (
    <div className="min-h-screen bg-teal-50 px-4 pt-8 pb-24">
      {/* Cabecera */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-teal-700">Tareas & Rutinas</h1>
        <p className="text-sm text-teal-500 mt-1">{DIAS[hoy]}</p>
      </div>

      {/* Pestañas */}
      <div className="flex gap-2 mb-6 bg-white rounded-xl p-1 shadow-sm">
        <button
          onClick={() => setPestanaActiva("haizea")}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            pestanaActiva === "haizea"
              ? "bg-teal-500 text-white"
              : "text-teal-600"
          }`}
        >
          Mi rutina
        </button>
        <button
          onClick={() => setPestanaActiva("iosu")}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            pestanaActiva === "iosu"
              ? "bg-teal-500 text-white"
              : "text-teal-600"
          }`}
        >
          Rutina Iosu
        </button>
        <button
          onClick={() => setPestanaActiva("hogar")}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            pestanaActiva === "hogar"
              ? "bg-teal-500 text-white"
              : "text-teal-600"
          }`}
        >
          Tareas hogar
        </button>
      </div>

      {/* ============ PESTAÑA 1: MI RUTINA ============ */}
      {pestanaActiva === "haizea" && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 mb-3">
              Hoy — {DIAS[hoy]}
            </h2>
            {renderizarRutina(rutinaHaizea, hoy, false)}
          </div>

          {mostrarFormHaizea && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <input
                type="time"
                value={nuevaRutinaHaizea.hora}
                onChange={(e) =>
                  setNuevaRutinaHaizea({
                    ...nuevaRutinaHaizea,
                    hora: e.target.value,
                  })
                }
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              />
              <input
                type="text"
                placeholder="Descripción (ej: Desayunar)"
                value={nuevaRutinaHaizea.descripcion}
                onChange={(e) =>
                  setNuevaRutinaHaizea({
                    ...nuevaRutinaHaizea,
                    descripcion: e.target.value,
                  })
                }
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              />

              {/* Checkboxes para días */}
              <p className="text-sm font-semibold text-teal-600 mb-2">
                ¿Qué días?
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {DIAS.map((dia, index) => (
                  <label key={dia} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={nuevaRutinaHaizea.dias_semana.includes(index)}
                      onChange={() => toggleDiaHaizea(index)}
                      className="accent-teal-500"
                    />
                    <span className="text-sm text-teal-700">{dia}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={guardarRutinaHaizea}
                  className="flex-1 bg-teal-500 text-white rounded-xl py-2 font-semibold disabled:opacity-50"
                  disabled={nuevaRutinaHaizea.dias_semana.length === 0}
                >
                  Guardar
                </button>
                <button
                  onClick={() => setMostrarFormHaizea(false)}
                  className="flex-1 border border-teal-300 text-teal-500 rounded-xl py-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {!mostrarFormHaizea && (
            <button
              onClick={() => setMostrarFormHaizea(true)}
              className="w-full bg-teal-500 text-white rounded-xl py-3 font-semibold"
            >
              + Añadir a mi rutina
            </button>
          )}
        </div>
      )}

      {/* ============ PESTAÑA 2: RUTINA IOSU ============ */}
      {pestanaActiva === "iosu" && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 mb-3">
              Hoy — {DIAS[hoy]}
            </h2>
            {renderizarRutina(rutinaIosu, hoy, true)}
          </div>

          {mostrarFormIosu && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <input
                type="time"
                value={nuevaRutinaIosu.hora}
                onChange={(e) =>
                  setNuevaRutinaIosu({
                    ...nuevaRutinaIosu,
                    hora: e.target.value,
                  })
                }
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              />
              <input
                type="text"
                placeholder="Descripción (ej: Gym)"
                value={nuevaRutinaIosu.descripcion}
                onChange={(e) =>
                  setNuevaRutinaIosu({
                    ...nuevaRutinaIosu,
                    descripcion: e.target.value,
                  })
                }
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              />

              {/* Checkboxes para días */}
              <p className="text-sm font-semibold text-teal-600 mb-2">
                ¿Qué días?
              </p>
              <div className="grid grid-cols-2 gap-2 mb-3">
                {DIAS.map((dia, index) => (
                  <label key={dia} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={nuevaRutinaIosu.dias_semana.includes(index)}
                      onChange={() => toggleDiaIosu(index)}
                      className="accent-teal-500"
                    />
                    <span className="text-sm text-teal-700">{dia}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={guardarRutinaIosu}
                  className="flex-1 bg-teal-500 text-white rounded-xl py-2 font-semibold disabled:opacity-50"
                  disabled={nuevaRutinaIosu.dias_semana.length === 0}
                >
                  Guardar
                </button>
                <button
                  onClick={() => setMostrarFormIosu(false)}
                  className="flex-1 border border-teal-300 text-teal-500 rounded-xl py-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {!mostrarFormIosu && (
            <button
              onClick={() => setMostrarFormIosu(true)}
              className="w-full bg-teal-500 text-white rounded-xl py-3 font-semibold"
            >
              + Añadir a rutina de Iosu
            </button>
          )}
        </div>
      )}

      {/* ============ PESTAÑA 3: TAREAS HOGAR ============ */}
      {pestanaActiva === "hogar" && (
        <div>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-teal-600 mb-3">
              Tareas del hogar
            </h2>
            {tareasHogar.length === 0 ? (
              <p className="text-sm text-teal-400">No hay tareas</p>
            ) : (
              tareasHogar.map((tarea) => (
                <div
                  key={tarea.id}
                  className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 mb-2 shadow-sm"
                >
                  <input
                    type="checkbox"
                    checked={tarea.hecha}
                    onChange={() => toggleTareaHogar(tarea.id, tarea.hecha)}
                    className="accent-teal-500 w-5 h-5"
                  />
                  <span
                    className={
                      tarea.hecha
                        ? "line-through text-gray-400 flex-1"
                        : "text-teal-700 flex-1"
                    }
                  >
                    {tarea.nombre}
                  </span>
                  <button
                    onClick={() => eliminarTareaHogar(tarea.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>

          {mostrarFormHogar && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <input
                type="text"
                placeholder="Nombre de la tarea"
                value={nuevaTareaHogar.nombre}
                onChange={(e) => setNuevaTareaHogar({ nombre: e.target.value })}
                className="w-full border border-teal-200 rounded-xl px-3 py-2 mb-3 text-teal-700 outline-none focus:ring-2 focus:ring-teal-300"
              />
              <div className="flex gap-2">
                <button
                  onClick={guardarTareaHogar}
                  className="flex-1 bg-teal-500 text-white rounded-xl py-2 font-semibold"
                >
                  Guardar
                </button>
                <button
                  onClick={() => setMostrarFormHogar(false)}
                  className="flex-1 border border-teal-300 text-teal-500 rounded-xl py-2"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {!mostrarFormHogar && (
            <button
              onClick={() => setMostrarFormHogar(true)}
              className="w-full bg-teal-500 text-white rounded-xl py-3 font-semibold"
            >
              + Añadir tarea
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Tareas;

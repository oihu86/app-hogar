import { useState, useEffect } from "react";
import { supabase } from "../supabase";

function Calendario() {
  const hoy = new Date();

  const [mesActual, setMesActual] = useState(hoy.getMonth());
  const [anioActual, setAnioActual] = useState(hoy.getFullYear());
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    fecha: "",
    hora: "",
    categoria: "",
    descripcion: "",
  });
  const [eventos, setEventos] = useState([]);

  const categorias = [
    { nombre: "Cita médica", color: "bg-blue-400", texto: "text-blue-400" },
    { nombre: "Comida", color: "bg-green-400", texto: "text-green-400" },
    { nombre: "Concierto", color: "bg-teal-400", texto: "text-teal-400" },
    { nombre: "Pago", color: "bg-red-400", texto: "text-red-400" },
    { nombre: "Cumpleaños", color: "bg-pink-400", texto: "text-pink-400" },
    { nombre: "Reuniones", color: "bg-orange-400", texto: "text-orange-400" },
    { nombre: "Viajes", color: "bg-yellow-400", texto: "text-yellow-400" },
  ];

  const diasEnMes = new Date(anioActual, mesActual + 1, 0).getDate();
  const primerDiaMes = new Date(anioActual, mesActual, 1).getDay();
  const nombresMeses = [
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
  ];
  const nombresDias = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"];

  function eventosDelDia(dia) {
    const fecha = `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
    return eventos.filter((e) => e.fecha === fecha);
  }

  function colorCategoria(nombreCat) {
    const cat = categorias.find((c) => c.nombre === nombreCat);
    return cat ? cat.color : "bg-gray-400";
  }

  useEffect(() => {
    cargarEventos();
  }, []);

  async function cargarEventos() {
    const { data, error } = await supabase
      .from("eventos")
      .select("*")
      .order("fecha", { ascending: true });
    if (error) console.error(error);
    else setEventos(data);
  }

  async function guardarCita() {
    if (!nuevaCita.fecha || !nuevaCita.categoria) return;
    const { error } = await supabase.from("eventos").insert({
      fecha: nuevaCita.fecha,
      hora: nuevaCita.hora,
      categoria: nuevaCita.categoria,
      descripcion: nuevaCita.descripcion,
    });
    if (error) console.error(error);
    else {
      await cargarEventos();
      setNuevaCita({ fecha: "", hora: "", categoria: "", descripcion: "" });
      setMostrarModal(false);
    }
  }

  return (
    <div className="min-h-screen bg-teal-50 px-4 pt-8 pb-24">
      <h1 className="text-2xl font-bold text-teal-700 text-center mb-4">
        Calendario
      </h1>
      {/* Navegación mes */}
      <div className="flex justify-between items-center mb-6 w-1/2">
        <button
          onClick={() => {
            if (mesActual === 0) {
              setMesActual(11);
              setAnioActual(anioActual - 1);
            } else setMesActual(mesActual - 1);
          }}
          className="text-teal-500 font-bold text-xl px-2"
        >
          ◀
        </button>
        <p className="font-bold text-teal-700">
          {nombresMeses[mesActual]} {anioActual}
        </p>
        <button
          onClick={() => {
            if (mesActual === 11) {
              setMesActual(0);
              setAnioActual(anioActual + 1);
            } else setMesActual(mesActual + 1);
          }}
          className="text-teal-500 font-bold text-xl px-2"
        >
          ▶
        </button>
      </div>

      {/* Días de la semana */}
      {/* Días de la semana */}
      <div className="w-1/2 grid grid-cols-7 mb-3">
        {nombresDias.map((d) => (
          <p key={d} className="text-center text-xs font-bold text-teal-400">
            {d}
          </p>
        ))}
      </div>

      {/* Días del mes */}
      {/* Layout dos columnas */}
      <div className="flex gap-3 items-start">
        {/* Columna izquierda - calendario */}
        <div className="w-1/2">
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: (primerDiaMes + 6) % 7 }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: diasEnMes }).map((_, i) => {
              const dia = i + 1;
              const eventosHoy = eventosDelDia(dia);
              const esHoy =
                dia === hoy.getDate() &&
                mesActual === hoy.getMonth() &&
                anioActual === hoy.getFullYear();
              return (
                <div
                  key={dia}
                  className={`rounded-xl p-1 text-center ${esHoy ? "bg-teal-500 text-white" : "bg-white"}`}
                >
                  <p
                    className={`text-xs font-medium ${esHoy ? "text-white" : "text-teal-700"}`}
                  >
                    {dia}
                  </p>
                  <div className="flex flex-wrap justify-center gap-0.5 mt-0.5">
                    {eventosHoy.map((e, idx) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${colorCategoria(e.categoria)}`}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Columna derecha - próximos eventos */}
        <div className="w-1/2">
          <h2 className="text-sm font-semibold text-teal-600 mb-3">
            Próximos eventos
          </h2>
          <div className="flex flex-col gap-2">
            {eventos
              .filter(
                (e) =>
                  e.fecha >=
                  `${anioActual}-${String(mesActual + 1).padStart(2, "0")}-01`,
              )
              .sort((a, b) => a.fecha.localeCompare(b.fecha))
              .map((e) => {
                const cat = categorias.find((c) => c.nombre === e.categoria);
                return (
                  <div
                    key={e.id}
                    className="bg-white rounded-2xl border border-teal-200 px-3 py-2 flex items-center gap-2"
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${cat ? cat.color : "bg-gray-400"} shrink-0`}
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-teal-700">
                        {e.descripcion}
                      </p>
                      <p className="text-xs text-teal-400">
                        {e.categoria} ·{" "}
                        {new Date(e.fecha).toLocaleDateString("es-ES", {
                          day: "2-digit",
                          month: "short",
                        })}{" "}
                        · {e.hora}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
      {/* Botón añadir */}
      <button
        onClick={() => setMostrarModal(true)}
        className="fixed bottom-20 right-6 bg-teal-500 text-white rounded-full w-12 h-12 text-2xl shadow-lg flex items-center justify-center"
      >
        +
      </button>

      {/* Modal nueva cita */}
      {mostrarModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-80 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-teal-700">Nueva cita</h2>
              <button
                onClick={() => setMostrarModal(false)}
                className="text-gray-400 text-xl"
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <input
                type="date"
                value={nuevaCita.fecha}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, fecha: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              />
              <input
                type="time"
                value={nuevaCita.hora}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, hora: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              />
              <select
                value={nuevaCita.categoria}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, categoria: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              >
                <option value="">Selecciona categoría...</option>
                {categorias.map((cat, i) => (
                  <option key={i}>{cat.nombre}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Descripción..."
                value={nuevaCita.descripcion}
                onChange={(e) =>
                  setNuevaCita({ ...nuevaCita, descripcion: e.target.value })
                }
                className="border border-teal-200 rounded-xl px-4 py-2 text-sm outline-none"
              />
              <button
                onClick={guardarCita}
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

export default Calendario;

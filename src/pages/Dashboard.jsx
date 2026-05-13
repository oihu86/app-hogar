import { useNavigate } from "react-router-dom";
function Dashboard() {
  const navigate = useNavigate();
  const resumen = [
    {
      icono: "📋",
      titulo: "Tareas",
      dato: "3 pendientes",
      ruta: "/tareas",
      color: "bg-teal-50 border-teal-200",
    },
    {
      icono: "💰",
      titulo: "Gastos",
      dato: "245€ este mes",
      ruta: "/gastos",
      color: "bg-teal-50 border-teal-200",
    },
    {
      icono: "🛒",
      titulo: "Compra",
      dato: "5 productos",
      ruta: "/compra",
      color: "bg-teal-50 border-teal-200",
    },
    {
      icono: "📅",
      titulo: "Calendario",
      dato: "Hoy: sin eventos",
      ruta: "/calendario",
      color: "bg-teal-50 border-teal-200",
    },
  ];

  return (
    <div className="min-h-screen bg-teal-50 px-4 pt-8 pb-24">
      {/* Cabecera */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-teal-700">Iosu eta Haizea</h1>
        <p className="text-teal-500 text-sm">etxeko gauzak 🏠</p>
      </div>

      {/* Tarjetas */}
      <div className="grid grid-cols-2 gap-4">
        {resumen.map((tarjeta) => (
          <div
            key={tarjeta.ruta}
            onClick={() => {
              navigate(tarjeta.ruta);
            }}
            className={`rounded-2xl border p-4 shadow-sm cursor-pointer ${tarjeta.color}`}
          >
            <div className="text-3xl mb-2">{tarjeta.icono}</div>
            <h2 className="font-semibold text-teal-700">{tarjeta.titulo}</h2>
            <p className="text-sm text-teal-500 mt-1">{tarjeta.dato}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;

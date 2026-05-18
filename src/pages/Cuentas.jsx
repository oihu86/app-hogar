const [ingresos, setIngresos] = useState([]);
const [gastos, setGastos] = useState([]);
const [mostrarModalIngreso, setMostrarModalIngreso] = useState(false);
const [mostrarModalGasto, setMostrarModalGasto] = useState(false);
const [mostrarModalBuscar, setMostrarModalBuscar] = useState(false);


useEffect(() => {
  (async () => {
    await cargarIngresos();
    await cargarGastos();
  })();
}, []);
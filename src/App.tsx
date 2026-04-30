import { useState, useEffect } from 'react'

interface Bus {
  id: number
  numeroBus: string
  placa: string
  fechaCreacion: string
  caracteristicas: string
  marca: string
  activo: boolean
}

interface PageResponse {
  content: Bus[]
  totalPages: number
}

const API_URL = 'http://localhost:8080/bus'
const AUTH = 'Basic ' + btoa('admin:admin123')

function App() {
  const [buses, setBuses] = useState<Bus[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState<number>(0)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}?page=${page}&size=5`, {
      headers: { 'Authorization': AUTH }
    })
      .then(res => res.json())
      .then((data: PageResponse) => {
        setBuses(data.content)
        setTotalPages(data.totalPages)
        setLoading(false)
      })
      .catch(() => {
        setError('Error al cargar los buses')
        setLoading(false)
      })
  }, [page])

  const handleVerDetalle = (id: number): void => {
    fetch(`${API_URL}/${id}`, {
      headers: { 'Authorization': AUTH }
    })
      .then(res => res.json())
      .then((data: Bus) => setSelectedBus(data))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Lista de Buses - Civa</h1>

      {loading && <p>Cargando...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && (
        <table border={1} cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#003087', color: 'white' }}>
            <tr>
              <th>ID</th>
              <th>N° Bus</th>
              <th>Placa</th>
              <th>Marca</th>
              <th>Características</th>
              <th>Estado</th>
              <th>Fecha Creación</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody>
            {buses.map(bus => (
              <tr key={bus.id}>
                <td>{bus.id}</td>
                <td>{bus.numeroBus}</td>
                <td>{bus.placa}</td>
                <td>{bus.marca}</td>
                <td>{bus.caracteristicas}</td>
                <td style={{ color: bus.activo ? 'green' : 'red' }}>
                  {bus.activo ? 'Activo' : 'Inactivo'}
                </td>
                <td>{new Date(bus.fechaCreacion).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleVerDetalle(bus.id)}>Ver</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ marginTop: '1rem' }}>
        <button onClick={() => setPage(p => p - 1)} disabled={page === 0}>← Anterior</button>
        <span style={{ margin: '0 1rem' }}>Página {page + 1} de {totalPages}</span>
        <button onClick={() => setPage(p => p + 1)} disabled={page + 1 >= totalPages}>Siguiente →</button>
      </div>

      {selectedBus && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ background: '#1a1a2e', color: 'white', padding: '2rem', borderRadius: '8px', minWidth: '300px' }}>
            <h2>Detalle del Bus</h2>
            <p><b>ID:</b> {selectedBus.id}</p>
            <p><b>N° Bus:</b> {selectedBus.numeroBus}</p>
            <p><b>Placa:</b> {selectedBus.placa}</p>
            <p><b>Marca:</b> {selectedBus.marca}</p>
            <p><b>Características:</b> {selectedBus.caracteristicas}</p>
            <p><b>Estado:</b> {selectedBus.activo ? 'Activo' : 'Inactivo'}</p>
            <button onClick={() => setSelectedBus(null)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
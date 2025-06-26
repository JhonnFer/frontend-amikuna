import { Link } from 'react-router-dom'

const Dashboard = () => {
  // Si no usas clearToken, simplemente elimínalo
  // const clearToken = () => { ... } // Puedes agregar lógica si lo necesitas

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido</h1>
      <p className="text-gray-600 text-xl mb-8">Esta página está en construcción.</p>
      <Link
        to="/"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Regresar al inicio
      </Link>
    </div>
  )
}

export default Dashboard

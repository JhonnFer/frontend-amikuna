import { Link } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">Bienvenido</h1>
      <p className="text-lg mb-6">Esta página está en construcción.</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
      >
        Regresar al inicio
      </Link>
    </div>
  )
}

export default Dashboard

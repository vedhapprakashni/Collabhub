import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                CollabHub
              </Link>
              <div className="ml-10 flex items-baseline space-x-6">
                <Link
                  to="/"
                  className="text-gray-800 hover:text-indigo-600 hover:bg-white/40 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Dashboard
                </Link>
                <Link
                  to="/projects/new"
                  className="text-gray-800 hover:text-indigo-600 hover:bg-white/40 px-3 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Create Project
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-800 text-sm font-medium">{user?.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white px-5 py-2 rounded-full text-sm font-medium shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}


import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { user, signInWithGoogle, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Error signing in:', error)
      alert(error.message || 'Failed to sign in. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/40 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20">
        <div>
          <h2 className="mt-6 text-center text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
            CollabHub
          </h2>
          <p className="mt-2 text-center text-lg text-gray-700 font-medium">
            Connect, Collaborate, Create
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-full text-white bg-pastel-button shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  )
}


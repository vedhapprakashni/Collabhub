import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [project, setProject] = useState(null)
  const [team, setTeam] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [requestMessage, setRequestMessage] = useState('')
  const [isRequesting, setIsRequesting] = useState(false)
  const [hasRequested, setHasRequested] = useState(false)

  useEffect(() => {
    fetchProjectData()
  }, [id])

  const fetchProjectData = async () => {
    try {
      setLoading(true)
      const [projectRes, teamRes, requestsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/projects/${id}/team`).catch(() => ({ data: [] })),
        api.get('/collaboration-requests').catch(() => ({ data: [] })),
      ])

      setProject(projectRes.data)
      setTeam(teamRes.data || [])
      
      // Check if user has already requested
      const myRequests = requestsRes.data || []
      const myRequest = myRequests.find((req) => req.project_id === id)
      setHasRequested(!!myRequest)
    } catch (error) {
      console.error('Error fetching project:', error)
      alert('Failed to load project')
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleRequestToJoin = async (e) => {
    e.preventDefault()

    setIsRequesting(true)
    try {
      await api.post('/collaboration-requests', {
        project_id: id,
        message: requestMessage || null,
      })
      alert('Request sent successfully!')
      setHasRequested(true)
      setRequestMessage('')
    } catch (error) {
      console.error('Error sending request:', error)
      alert(error.response?.data?.detail || 'Failed to send request')
    } finally {
      setIsRequesting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!project) {
    return <div className="text-center py-12">Project not found</div>
  }

  const isOwner = user?.id === project.owner_id
  const isMember = team.some((member) => member.user_id === user?.id)

  return (
    <div className="px-4 py-8 sm:px-0">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-purple-600 hover:text-purple-800 font-bold transition-all"
        >
          <span className="mr-2">←</span> Back to Dashboard
        </button>

        <div className="bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-10 border border-white/40">
          <div className="flex justify-between items-start mb-8">
            <h1 className="text-4xl font-extrabold text-gray-900">{project.title}</h1>
            {isOwner && (
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-bold">
                Owner
              </span>
            )}
          </div>
          
          {project.description && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">{project.description}</p>
            </div>
          )}

          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Tech Stack</h2>
              <div className="flex flex-wrap gap-3">
                {project.tech_stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-blue-100 text-blue-800 shadow-sm"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.looking_for && project.looking_for.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Looking For</h2>
              <div className="flex flex-wrap gap-3">
                {project.looking_for.map((role, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-4 py-2 rounded-full text-sm font-bold bg-green-100 text-green-800 shadow-sm"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Team Members */}
          <div className="mb-10">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Members ({team.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {team.map((member) => (
                <div key={member.id} className="bg-white/50 rounded-xl p-4 flex items-center space-x-3 shadow-sm border border-white/30">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                    {member.user?.email?.[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{member.user?.email}</p>
                    <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Request Section */}
          {!isOwner && !isMember && (
            <div className="border-t border-gray-200 pt-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Join This Project</h2>
              {hasRequested ? (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-xl">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700 font-bold">
                        Request Pending
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        You have already sent a request to join this project. Please wait for the owner to respond.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRequestToJoin} className="space-y-6">
                  <div>
                    <label htmlFor="message" className="block text-sm font-bold text-gray-700 mb-2">
                      Message to Project Owner (Optional)
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base px-4 py-3 bg-white/50"
                      placeholder="Introduce yourself and explain why you'd like to join..."
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRequesting}
                    className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-pastel-button hover:shadow-xl transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                      isRequesting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isRequesting ? 'Sending Request...' : 'Send Join Request'}
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


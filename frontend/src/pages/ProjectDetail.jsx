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
    <div className="px-4 py-6 sm:px-0">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/')}
          className="mb-4 text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white shadow rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
          
          {project.description && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">{project.description}</p>
            </div>
          )}

          {project.tech_stack && project.tech_stack.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Tech Stack</h2>
              <div className="flex flex-wrap gap-2">
                {project.tech_stack.map((tech, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {project.looking_for && project.looking_for.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Looking For</h2>
              <div className="flex flex-wrap gap-2">
                {project.looking_for.map((role, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Team Members</h2>
            {team.length === 0 ? (
              <p className="text-gray-500">No team members yet</p>
            ) : (
              <div className="space-y-2">
                {team.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-gray-700">{member.user_id}</span>
                    {member.role && (
                      <span className="text-sm text-gray-500">{member.role}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Request to Join Section */}
          {!isOwner && !isMember && project.is_open && (
            <div className="mt-8 border-t pt-6">
              {hasRequested ? (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <p className="text-blue-800">You have already sent a collaboration request for this project.</p>
                </div>
              ) : (
                <form onSubmit={handleRequestToJoin} className="space-y-4">
                  <div>
                    <label htmlFor="requestMessage" className="block text-sm font-medium text-gray-700 mb-2">
                      Message (Optional)
                    </label>
                    <textarea
                      id="requestMessage"
                      value={requestMessage}
                      onChange={(e) => setRequestMessage(e.target.value)}
                      rows={4}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                      placeholder="Tell the project owner why you'd like to collaborate..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isRequesting}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md font-medium disabled:opacity-50"
                  >
                    {isRequesting ? 'Sending...' : 'Request to Join'}
                  </button>
                </form>
              )}
            </div>
          )}

          {!project.is_open && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800">This project is no longer accepting new collaborators.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


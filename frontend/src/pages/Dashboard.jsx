import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

export default function Dashboard() {
  const [projects, setProjects] = useState([])
  const [myProjects, setMyProjects] = useState([])
  const [joinedProjects, setJoinedProjects] = useState([])
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('browse')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [projectsRes, myProjectsRes, joinedProjectsRes, requestsRes] = await Promise.all([
        api.get('/projects?is_open=true'),
        api.get('/my-projects'),
        api.get('/joined-projects'),
        api.get('/collaboration-requests'),
      ])

      setProjects(projectsRes.data)
      setMyProjects(myProjectsRes.data)
      setJoinedProjects(joinedProjectsRes.data)
      setRequests(requestsRes.data)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      await api.put(`/collaboration-requests/${requestId}/accept`)
      alert('Request accepted!')
      fetchData()
    } catch (error) {
      console.error('Error accepting request:', error)
      alert('Failed to accept request')
    }
  }

  const handleRejectRequest = async (requestId) => {
    try {
      await api.put(`/collaboration-requests/${requestId}/reject`)
      alert('Request rejected')
      fetchData()
    } catch (error) {
      console.error('Error rejecting request:', error)
      alert('Failed to reject request')
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  const receivedRequests = requests.filter(
    (req) => req.status === 'pending' && myProjects.some((p) => p.id === req.project_id)
  )

  return (
    <div className="px-4 py-8 sm:px-0">
      <div className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">Dashboard</h1>
        <p className="mt-2 text-xl text-gray-700">Discover projects and manage your collaborations</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-10 overflow-x-auto">
        <nav className="flex space-x-2 bg-white/30 backdrop-blur-md p-1.5 rounded-full shadow-inner min-w-max">
          <button
            onClick={() => setActiveTab('browse')}
            className={`${
              activeTab === 'browse'
                ? 'bg-pastel-button text-white shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            } px-6 py-3 rounded-full text-sm font-bold transition-all`}
          >
            Browse Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`${
              activeTab === 'my-projects'
                ? 'bg-pastel-button text-white shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            } px-6 py-3 rounded-full text-sm font-bold transition-all`}
          >
            My Projects ({myProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`${
              activeTab === 'joined'
                ? 'bg-pastel-button text-white shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            } px-6 py-3 rounded-full text-sm font-bold transition-all`}
          >
            Joined Projects ({joinedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`${
              activeTab === 'requests'
                ? 'bg-pastel-button text-white shadow-md'
                : 'text-gray-600 hover:bg-white/50'
            } px-6 py-3 rounded-full text-sm font-bold transition-all`}
          >
            Requests ({receivedRequests.length})
          </button>
        </nav>
      </div>

      {/* Browse Projects Tab */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white/30 backdrop-blur-md rounded-2xl">
              No open projects found
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-1 border border-white/40 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                  {project.tech_stack && project.tech_stack.length > 0 && (
                    <div className="mb-6">
                      <div className="flex flex-wrap gap-2">
                        {project.tech_stack.map((tech, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold shadow-md hover:shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* My Projects Tab */}
      {activeTab === 'my-projects' && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {myProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white/30 backdrop-blur-md rounded-2xl">
              You haven't created any projects yet.{' '}
              <Link to="/projects/new" className="text-purple-600 hover:underline font-bold">
                Create one now
              </Link>
            </div>
          ) : (
            myProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-1 border border-white/40 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold shadow-md hover:shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Joined Projects Tab */}
      {activeTab === 'joined' && (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {joinedProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white/30 backdrop-blur-md rounded-2xl">
              You haven't joined any projects yet
            </div>
          ) : (
            joinedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 hover:shadow-2xl transition-all hover:-translate-y-1 border border-white/40 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{project.title}</h3>
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">{project.description}</p>
                </div>
                <Link
                  to={`/projects/${project.id}`}
                  className="block w-full text-center py-3 rounded-xl bg-gradient-to-r from-blue-400 to-purple-400 text-white font-bold shadow-md hover:shadow-lg hover:from-blue-500 hover:to-purple-500 transition-all"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-6">
          {receivedRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500 bg-white/30 backdrop-blur-md rounded-2xl">No pending requests</div>
          ) : (
            receivedRequests.map((request) => {
              const project = myProjects.find((p) => p.id === request.project_id)
              return (
                <div key={request.id} className="bg-white/60 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-white/40">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900">
                        Request for: <span className="text-purple-600">{project?.title}</span>
                      </h3>
                      {request.message && (
                        <p className="mt-3 text-gray-700 bg-white/50 p-4 rounded-xl">{request.message}</p>
                      )}
                      <p className="mt-3 text-sm font-medium text-gray-500">
                        Requested by: {request.requester_id}
                      </p>
                    </div>
                    <div className="flex space-x-3 w-full md:w-auto">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex-1 md:flex-none bg-gradient-to-r from-green-400 to-teal-400 hover:from-green-500 hover:to-teal-500 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex-1 md:flex-none bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}


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
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Discover projects and manage your collaborations</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('browse')}
            className={`${
              activeTab === 'browse'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Browse Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('my-projects')}
            className={`${
              activeTab === 'my-projects'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            My Projects ({myProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('joined')}
            className={`${
              activeTab === 'joined'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Joined Projects ({joinedProjects.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`${
              activeTab === 'requests'
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Requests ({receivedRequests.length})
          </button>
        </nav>
      </div>

      {/* Browse Projects Tab */}
      {activeTab === 'browse' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No open projects found
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                {project.tech_stack && project.tech_stack.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {project.tech_stack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <Link
                  to={`/projects/${project.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* My Projects Tab */}
      {activeTab === 'my-projects' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {myProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              You haven't created any projects yet.{' '}
              <Link to="/projects/new" className="text-indigo-600 hover:underline">
                Create one now
              </Link>
            </div>
          ) : (
            myProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Joined Projects Tab */}
      {activeTab === 'joined' && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {joinedProjects.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              You haven't joined any projects yet
            </div>
          ) : (
            joinedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                <Link
                  to={`/projects/${project.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  View Details →
                </Link>
              </div>
            ))
          )}
        </div>
      )}

      {/* Requests Tab */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          {receivedRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No pending requests</div>
          ) : (
            receivedRequests.map((request) => {
              const project = myProjects.find((p) => p.id === request.project_id)
              return (
                <div key={request.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Request for: {project?.title}
                      </h3>
                      {request.message && (
                        <p className="mt-2 text-gray-600">{request.message}</p>
                      )}
                      <p className="mt-2 text-sm text-gray-500">
                        Requested by: {request.requester_id}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
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


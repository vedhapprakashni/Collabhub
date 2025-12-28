import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../lib/api'

export default function CreateProject() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tech_stack: '',
    looking_for: '',
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        title: formData.title,
        description: formData.description || null,
        tech_stack: formData.tech_stack
          ? formData.tech_stack.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
        looking_for: formData.looking_for
          ? formData.looking_for.split(',').map((t) => t.trim()).filter(Boolean)
          : [],
      }

      const response = await api.post('/projects', payload)
      navigate(`/projects/${response.data.id}`)
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="px-4 py-8 sm:px-0">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-8 text-center">Create New Project</h1>

        <form onSubmit={handleSubmit} className="bg-white/60 backdrop-blur-md shadow-xl rounded-3xl p-10 border border-white/40 space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-lg px-4 py-3 bg-white/50"
              placeholder="Enter project title"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-bold text-gray-700 mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              value={formData.description}
              onChange={handleChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base px-4 py-3 bg-white/50"
              placeholder="Describe your project idea..."
            />
          </div>

          <div>
            <label htmlFor="tech_stack" className="block text-sm font-bold text-gray-700 mb-2">
              Tech Stack
            </label>
            <input
              type="text"
              id="tech_stack"
              name="tech_stack"
              value={formData.tech_stack}
              onChange={handleChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base px-4 py-3 bg-white/50"
              placeholder="React, Node.js, Python (comma-separated)"
            />
            <p className="mt-2 text-sm text-gray-500">Separate technologies with commas</p>
          </div>

          <div>
            <label htmlFor="looking_for" className="block text-sm font-bold text-gray-700 mb-2">
              Looking For
            </label>
            <input
              type="text"
              id="looking_for"
              name="looking_for"
              value={formData.looking_for}
              onChange={handleChange}
              className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 text-base px-4 py-3 bg-white/50"
              placeholder="Frontend Developer, UX Designer (comma-separated)"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center py-4 px-4 border border-transparent rounded-full shadow-lg text-lg font-bold text-white bg-pastel-button hover:shadow-xl transform hover:-translate-y-1 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${
                loading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


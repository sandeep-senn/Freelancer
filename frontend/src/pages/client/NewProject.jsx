import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import {toast} from 'react-toastify'

const NewProject = () => {
  const navigate = useNavigate()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [skills, setSkills] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !budget || !skills) {
      toast.warning('Please fill all fields')
      return
    }

const payload = {
  title,
  description,
  budget,
  skills: skills
  .split(',')
  .map(s => s.trim())
  .join(','),
  clientId: localStorage.getItem('userId'),
  clientName: localStorage.getItem('username'),
  clientEmail: localStorage.getItem('email')
}

    try {
      await api.post('/project/create', payload)
      toast.success('✅ Project created successfully')
      navigate('/client')
    } catch (error) {
      console.error(error)
      toast.error('❌ Project creation failed')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">
        Post New Project
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow space-y-4"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Project Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project title"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the project"
          />
        </div>

        {/* Budget */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Budget (₹)
          </label>
          <input
            type="number"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter budget"
          />
        </div>

        {/* Skills */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Required Skills
          </label>
          <input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="React, Node, MongoDB"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate skills with commas
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  )
}

export default NewProject

import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import {toast} from 'react-toastify'

const Freelancer = () => {
  const navigate = useNavigate()

  const [freelancer, setFreelancer] = useState(null)
  const [applicationsCount] = useState(0)

  const [editOpen, setEditOpen] = useState(false)
  const [editSkills, setEditSkills] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const userId = localStorage.getItem('userId')

  // ---------------- LOAD DATA ----------------
const loadFreelancer = async () => {
  try {
    const { data } = await api.get(`/freelancer/${userId}`)
    setFreelancer(data)
    setEditSkills(data.skills.join(', '))
    setEditDescription(data.description || '')
  } catch (err) {
    console.error(err)
  }
}

const loadApplications = async () => {
  try {
    // logic here
  } catch (err) {
    console.error(err)
  }
}

useEffect(() => {
  if (!userId) return

  const fetchData = async () => {
    await loadFreelancer()
    await loadApplications()
  }

  fetchData()
}, [userId])

  // ---------------- UPDATE PROFILE ----------------
  const updateProfile = async () => {
    try {
      await api.post('/freelancer/update', {
        freelancerId: userId,
        updateSkills: editSkills.split(',').map(s => s.trim()),
        description: editDescription
      })
      toast.success('Profile updated')
      setEditOpen(false)
      loadFreelancer()
    } catch (err) {
      console.error(err)
      toast.error('Update failed')
    }
  }

  if (!freelancer) return null

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">

      {/* DASHBOARD CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <DashboardCard
          title="Current Projects"
          value={freelancer.currentProjects.length}
          onClick={() => navigate('/my-projects')}
        />
        <DashboardCard
          title="Completed Projects"
          value={freelancer.completedProjects.length}
          onClick={() => navigate('/my-projects')}
        />
        <DashboardCard
          title="Applications"
          value={applicationsCount}
          onClick={() => navigate('/myApplications')}
        />
        <DashboardCard
          title="Funds"
          value={`₹ ${freelancer.funds}`}
        />
      </div>

      {/* PROFILE */}
      <div className="bg-white p-6 rounded-xl shadow">
        {!editOpen ? (
          <>
            <h3 className="text-xl font-semibold mb-3">My Profile</h3>

            <div className="mb-4">
              <h4 className="font-medium">Skills</h4>
              <div className="flex gap-2 flex-wrap mt-1">
                {freelancer.skills.length > 0 ? (
                  freelancer.skills.map(skill => (
                    <span
                      key={skill}
                      className="bg-gray-100 px-3 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <p className="text-gray-500">No skills added</p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <h4 className="font-medium">Description</h4>
              <p className="text-gray-600">
                {freelancer.description || 'No description added'}
              </p>
            </div>

            <button
              onClick={() => setEditOpen(true)}
              className="border border-green-600 text-green-600 px-4 py-1 rounded hover:bg-green-50"
            >
              Update Profile
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold mb-3">Update Profile</h3>

            <div className="mb-3">
              <label className="block text-sm font-medium">Skills</label>
              <input
                value={editSkills}
                onChange={(e) => setEditSkills(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                placeholder="React, Node, MongoDB"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full border px-3 py-2 rounded"
                rows="4"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={updateProfile}
                className="bg-green-600 text-white px-4 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditOpen(false)}
                className="border px-4 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ---------------- SMALL COMPONENT ----------------
const DashboardCard = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
  >
    <h4 className="text-gray-600">{title}</h4>
    <p className="text-2xl font-bold mt-2">{value}</p>
  </div>
)

export default Freelancer

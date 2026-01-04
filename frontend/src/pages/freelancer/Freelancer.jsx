import { useEffect, useState } from 'react'
import api from '../../services/api'

const Freelancer = () => {
  const userId = localStorage.getItem('userId')

  const [skills, setSkills] = useState([])
  const [description, setDescription] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)

  // load freelancer data
  useEffect(() => {
    const loadFreelancer = async () => {
      const { data } = await api.get(`/freelancer/${userId}`)
      setSkills(data.skills || [])
      setDescription(data.description || '')
    }
    loadFreelancer()
  }, [userId])

  // 🔥 AI BIO GENERATOR
  const generateBio = async () => {
    try {
      setLoadingAI(true)

      const res = await api.post('/ai/freelancer-description', {
        role: 'Freelancer',
        skills: skills.join(','),
        experience: 'Fresher'
      })

      setDescription(res.data.description)
    } catch (err) {
      alert('AI generation failed', err)
    } finally {
      setLoadingAI(false)
    }
  }

  // save profile
  const saveProfile = async () => {
    await api.post('/freelancer/update', {
      freelancerId: userId,
      updateSkills: skills.join(','),
      description
    })
    alert('Profile updated')
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">

      <h2 className="text-2xl font-semibold">Freelancer Profile</h2>

      <input
        value={skills.join(',')}
        onChange={e => setSkills(e.target.value.split(','))}
        placeholder="Skills (comma separated)"
        className="w-full border p-2 rounded"
      />

      <textarea
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Describe yourself..."
        className="w-full border p-3 rounded min-h-[120px]"
      />

      <button
        onClick={generateBio}
        disabled={loadingAI}
        className="text-blue-600 text-sm underline"
      >
        ✨ {loadingAI ? 'Generating...' : 'Generate with AI'}
      </button>

      <button
        onClick={saveProfile}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Profile
      </button>
    </div>
  )
}

export default Freelancer

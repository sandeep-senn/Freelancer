import { useEffect, useState } from 'react'
import api from '../../services/api'

const AdminProjects = () => {
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [filters, setFilters] = useState([])

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/project')
        setProjects(data)
        const uniqueSkills = [...new Set(data.flatMap(p => p.skills))]
        setSkills(uniqueSkills)
      } catch (err) {
        console.error(err)
      }
    }
    fetchProjects()
  }, [])

  const displayProjects = filters.length === 0
    ? projects
    : projects.filter(p =>
        filters.every(skill => p.skills.includes(skill))
      )

  const toggleSkill = (skill) => {
    setFilters(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  return (
    <div className="flex gap-6 p-6">
      <aside className="w-64 bg-white p-4 rounded-xl shadow">
        <h4 className="font-semibold mb-4">Filters</h4>
        {skills.map(skill => (
          <label key={skill} className="block text-sm">
            <input
              type="checkbox"
              className="mr-2"
              onChange={() => toggleSkill(skill)}
            />
            {skill}
          </label>
        ))}
      </aside>

      <main className="flex-1 space-y-4">
        {displayProjects.map(project => (
          <div key={project._id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="text-lg font-semibold">{project.title}</h3>
            <p className="text-sm text-gray-500">{project.description}</p>
            <p className="mt-2">Budget: ₹{project.budget}</p>
            <p>Status: {project.status}</p>
          </div>
        ))}
      </main>
    </div>
  )
}

export default AdminProjects

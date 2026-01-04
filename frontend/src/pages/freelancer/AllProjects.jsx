import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

const AllProjects = () => {
  const navigate = useNavigate()

  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [filters, setFilters] = useState([])

  // ---------------- FETCH PROJECTS ----------------
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/project')
        setProjects(data)

        // unique skills (safe)
        const uniqueSkills = [
          ...new Set(
            data.flatMap(project => project.skills || [])
          )
        ]
        setSkills(uniqueSkills)
      } catch (err) {
        console.error(err)
      }
    }

    fetchProjects()
  }, [])

  // ---------------- DERIVED PROJECT LIST ----------------
  const displayProjects = useMemo(() => {
    let filtered = projects

    if (filters.length > 0) {
      filtered = projects.filter(project =>
        filters.every(skill =>
          project.skills?.includes(skill)
        )
      )
    }

    return [...filtered].reverse()
  }, [projects, filters])

  // ---------------- FILTER TOGGLE ----------------
  const toggleSkill = (skill) => {
    setFilters(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  return (
    <div className="flex gap-6 p-6 max-w-7xl mx-auto">

      {/* FILTERS */}
      <aside className="w-64 bg-white p-4 rounded-xl shadow">
        <h3 className="font-semibold mb-3">Filters</h3>

        <h5 className="text-sm font-medium mb-2">Skills</h5>
        {skills.map(skill => (
          <label key={skill} className="block text-sm mb-1">
            <input
              type="checkbox"
              className="mr-2"
              checked={filters.includes(skill)}
              onChange={() => toggleSkill(skill)}
            />
            {skill}
          </label>
        ))}
      </aside>

      {/* PROJECTS */}
      <main className="flex-1 space-y-4">
        <h2 className="text-xl font-semibold mb-2">
          All Projects
        </h2>

        {displayProjects.map(project => {
          const bidsCount = project.bids?.length || 0

          const avgBid =
            project.bidAmounts?.length > 0
              ? (
                  project.bidAmounts.reduce((a, b) => a + b, 0) /
                  project.bidAmounts.length
                ).toFixed(0)
              : 0

          return (
            <div
              key={project._id}
              onClick={() => navigate(`/project/${project._id}`)}
              className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
            >
              <div className="flex justify-between mb-2">
                <h3 className="text-lg font-semibold">
                  {project.title}
                </h3>
                <span className="text-sm text-gray-500">
                  {new Date(project.postedDate).toLocaleDateString()}
                </span>
              </div>

              <p className="text-gray-600 mb-2">
                {project.description}
              </p>

              <p className="font-medium mb-2">
                Budget: ₹{project.budget}
              </p>

              <div className="flex flex-wrap gap-2 mb-2">
                {(project.skills || []).map(skill => (
                  <span
                    key={skill}
                    className="bg-gray-100 px-2 py-1 rounded text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between text-sm text-gray-700">
                <span>{bidsCount} bids</span>
                <span>Avg bid: ₹{avgBid}</span>
              </div>
            </div>
          )
        })}

        {displayProjects.length === 0 && (
          <p className="text-gray-500 text-center">
            No projects found
          </p>
        )}
      </main>
    </div>
  )
}

export default AllProjects

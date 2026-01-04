import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useContext(GeneralContext)

  const usertype = localStorage.getItem('usertype')
  if (!usertype) return null

  const navLinks = {
    freelancer: [
      { label: 'Dashboard', path: '/freelancer' },
      { label: 'All Projects', path: '/all-projects' },
      { label: 'My Projects', path: '/my-projects' },
      { label: 'Applications', path: '/myApplications' }
    ],
    client: [
      { label: 'Dashboard', path: '/client' },
      { label: 'New Project', path: '/new-project' },
      { label: 'Applications', path: '/project-applications' }
    ],
    admin: [
      { label: 'Home', path: '/admin' },
      { label: 'All Users', path: '/all-users' },
      { label: 'Projects', path: '/admin-projects' },
      { label: 'Applications', path: '/admin-applications' }
    ]
  }

  return (
    <div className="w-full flex justify-center mt-4">
      <nav
        className="flex items-center justify-between
                   bg-white shadow-lg
                   px-6 py-3
                   rounded-full
                   max-w-6xl w-full"
      >

        {/* BRAND */}
        <h3
          onClick={() => navigate(`/${usertype}`)}
          className="text-lg font-semibold text-blue-600 cursor-pointer whitespace-nowrap"
        >
          SB Works {usertype === 'admin' && '(Admin)'}
        </h3>

        {/* LINKS */}
        <div className="flex items-center gap-2">
          {navLinks[usertype].map((item) => {
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition
                  ${isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}
                `}
              >
                {item.label}
              </button>
            )
          })}

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="ml-2 px-4 py-2 rounded-full text-sm font-medium
                       text-red-600 hover:bg-red-50 transition"
          >
            Logout
          </button>
        </div>

      </nav>
    </div>
  )
}

export default Navbar

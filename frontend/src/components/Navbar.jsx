import { useContext, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { GeneralContext } from '../context/GeneralContext'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useContext(GeneralContext)
  const [open, setOpen] = useState(false)

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
    <div className="w-full flex justify-center mt-3 px-2">
      <nav className="bg-white shadow-lg rounded-2xl w-full max-w-6xl px-4 py-3">

        {/* TOP BAR */}
        <div className="flex items-center justify-between">
          <h3
            onClick={() => navigate(`/${usertype}`)}
            className="text-lg font-semibold text-blue-600 cursor-pointer"
          >
            SB Works {usertype === 'admin' && '(Admin)'}
          </h3>

          {/* MOBILE TOGGLE */}
          <button
            className="md:hidden text-gray-600"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* LINKS */}
        <div
          className={`
            flex flex-col md:flex-row md:items-center gap-2 mt-4 md:mt-0
            ${open ? 'flex' : 'hidden'} md:flex
          `}
        >
          {navLinks[usertype].map((item) => {
            const isActive = location.pathname === item.path

            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.path)
                  setOpen(false)
                }}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition text-left
                  ${isActive
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'}
                `}
              >
                {item.label}
              </button>
            )
          })}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-full text-sm font-medium
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

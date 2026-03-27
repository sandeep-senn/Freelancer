import { useContext, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { GeneralContext } from '../context/general-context';

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
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(GeneralContext);
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const links = navLinks[user.usertype] || [];

  return (
    <div className="w-full flex justify-center mt-4 px-4">
      <nav className="bg-white shadow-md rounded-full w-full max-w-6xl px-6 py-3">
        <div className="flex items-center justify-between">
          <h3
            onClick={() => navigate(`/${user.usertype}`)}
            className="text-lg font-semibold text-blue-600 cursor-pointer"
          >
            SB Works {user.usertype === 'admin' && '(Admin)'}
          </h3>

          <div className="hidden md:flex items-center gap-2">
            {links.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-gray-600 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={logout}
              className="ml-2 px-4 py-2 rounded-full text-sm font-medium text-red-600 hover:bg-red-50 transition"
            >
              Logout
            </button>
          </div>

          <button
            className="md:hidden text-gray-600"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden mt-4 flex flex-col gap-2">
            {links.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium ${
                    isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-blue-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={logout}
              className="w-full text-left px-4 py-2 rounded-lg text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;

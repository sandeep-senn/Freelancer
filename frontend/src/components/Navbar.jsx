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
    <div className="w-full flex justify-center px-4 pt-4">
      <nav className="panel w-full max-w-6xl rounded-[28px] px-4 py-4 md:px-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate(`/${user.usertype}`)}
            className="flex items-center gap-3 text-left"
          >
            <img
              src="/logo.png"
              alt="Syncora Logo"
              className="h-11 w-11 object-contain rounded-xl"
            />
            <span>
              <span className="block font-sans text-[0.7rem] uppercase tracking-[0.28em] text-[#7a867d]">
                Workspace
              </span>
              <span className="block text-lg font-semibold text-[#0d1e36]">
                Syncora {user.usertype === 'admin' && '(Admin)'}
              </span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-[#0d1e36]/8 bg-white/60 p-1.5">
            {links.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => navigate(item.path)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                    isActive
                      ? 'brand-button'
                      : 'text-[#56645c] hover:bg-[#0d1e36]/6 hover:text-[#0d1e36]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={logout}
              className="ml-2 rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
            >
              Logout
            </button>
          </div>

          <button
            className="rounded-2xl border border-[#0d1e36]/10 bg-white/70 p-2 text-[#0d1e36] md:hidden"
            onClick={() => setOpen((prevOpen) => !prevOpen)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="mt-4 flex flex-col gap-2 border-t border-[#0d1e36]/10 pt-4 md:hidden">
            {links.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.path);
                    setOpen(false);
                  }}
                  className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium ${
                    isActive
                      ? 'brand-button'
                      : 'bg-white/70 text-[#56645c] hover:bg-[#0d1e36]/6 hover:text-[#0d1e36]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={logout}
              className="w-full rounded-2xl border border-red-200 px-4 py-3 text-left text-red-700 hover:bg-red-50"
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

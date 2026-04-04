import { useEffect, useState } from 'react';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const ROLE_OPTIONS = ['client', 'freelancer', 'admin'];

// Dummy currentUser for role-based UI (replace with your own auth state logic)
const currentUser = JSON.parse(localStorage.getItem('user')) || { usertype: 'admin' };

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingUser, setUpdatingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      try {
        const { data } = await api.get('/user');
        if (isMounted) {
          setUsers([...data].reverse());
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
    return () => { isMounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setDeletingUser(id);
    try {
      await api.delete(`/user/${id}`);
      setUsers((prev) => prev.filter((user) => user._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    } finally {
      setDeletingUser(null);
    }
  };

  const handleRoleChange = async (id, newRole) => {
    setUpdatingUser(id);
    try {
      await api.patch(`/user/${id}/role`, { usertype: newRole });
      setUsers((prev) => prev.map((user) => (
        user._id === id ? { ...user, usertype: newRole } : user
      )));
    } catch (err) {
      alert('Failed to update role');
    } finally {
      setUpdatingUser(null);
    }
  };

  if (loading) {
    return <AppLoader label="Loading users..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <span className="eyebrow">User Directory</span>
        <h2 className="mt-4 text-xl font-semibold text-[#123c33] md:text-2xl">Review platform members with clarity.</h2>
      </div>

      <div className="panel mt-6 overflow-x-auto rounded-[30px] p-3">
        <table className="w-full min-w-[640px] text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-[#123c33]/10 text-[#6a746d]">
              <th className="px-4 py-4 font-semibold">Username</th>
              <th className="px-4 py-4 font-semibold">Email</th>
              <th className="px-4 py-4 font-semibold">Role</th>
              {currentUser.usertype === 'admin' && <th className="px-4 py-4 font-semibold">Admin Actions</th>}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-[#123c33]/8 last:border-b-0">
                <td className="px-4 py-4 font-medium text-[#123c33]">{user.username}</td>
                <td className="px-4 py-4 text-[#516056]">{user.email}</td>
                <td className="px-4 py-4">
                  {/* Show select if admin, otherwise just a span */}
                  {currentUser.usertype === 'admin' ? (
                    <select
                      value={user.usertype}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={updatingUser === user._id}
                      className="metric-chip outline-none bg-[#f4f6f5] rounded px-2 py-1"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option value={role} key={role}>{role}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="metric-chip">{user.usertype}</span>
                  )}
                </td>
                {/* Only admins see delete button and role changer */}
                {currentUser.usertype === 'admin' && (
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleDelete(user._id)}
                      disabled={deletingUser === user._id}
                      className="text-red-600 hover:underline mr-2"
                    >
                      {deletingUser === user._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { GeneralContext } from '../../context/general-context';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const ROLE_OPTIONS = [
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'client', label: 'Client' },
  { value: 'admin', label: 'Admin' }
];

const AllUsers = () => {
  const { user: currentUser } = useContext(GeneralContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyUserId, setBusyUserId] = useState('');

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

    return () => {
      isMounted = false;
    };
  }, []);

  const handleRoleChange = async (userId, usertype) => {
    setBusyUserId(userId);

    try {
      const { data } = await api.put(`/user/${userId}/role`, { usertype });
      setUsers((prevUsers) =>
        prevUsers.map((entry) => (entry._id === userId ? data.user : entry))
      );
      toast.success('User role updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update user role');
    } finally {
      setBusyUserId('');
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmed = window.confirm('Delete this user account? This action cannot be undone.');
    if (!confirmed) {
      return;
    }

    setBusyUserId(userId);

    try {
      await api.delete(`/user/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((entry) => entry._id !== userId));
      toast.success('User deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to delete user');
    } finally {
      setBusyUserId('');
    }
  };

  if (loading) {
    return <AppLoader label="Loading users..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <span className="eyebrow">User Directory</span>
        <h2 className="mt-4 text-xl font-semibold text-[#123c33] md:text-2xl">
          Review platform members with clarity.
        </h2>
      </div>

      <div className="panel mt-6 overflow-x-auto rounded-[30px] p-3">
        <table className="w-full min-w-[640px] text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-[#123c33]/10 text-[#6a746d]">
              <th className="px-4 py-4 font-semibold">Username</th>
              <th className="px-4 py-4 font-semibold">Email</th>
              <th className="px-4 py-4 font-semibold">Role</th>
              <th className="px-4 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-[#123c33]/8 last:border-b-0">
                <td className="px-4 py-4 font-medium text-[#123c33]">{user.username}</td>
                <td className="px-4 py-4 text-[#516056]">{user.email}</td>
                <td className="px-4 py-4">
                  <select
                    value={user.usertype}
                    onChange={(event) => handleRoleChange(user._id, event.target.value)}
                    disabled={busyUserId === user._id || currentUser?._id === user._id}
                    className="rounded-full border border-[#123c33]/10 bg-white px-3 py-2 text-sm text-[#123c33] outline-none disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {ROLE_OPTIONS.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-4">
                  <button
                    type="button"
                    onClick={() => handleDeleteUser(user._id)}
                    disabled={busyUserId === user._id || currentUser?._id === user._id}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllUsers;

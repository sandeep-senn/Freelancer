import { useEffect, useState } from 'react';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return <AppLoader label="Loading users..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <span className="eyebrow">User Directory</span>
        <h2 className="mt-4 text-4xl font-semibold text-[#123c33]">Review platform members with clarity.</h2>
      </div>

      <div className="panel mt-6 overflow-x-auto rounded-[30px] p-3">
        <table className="w-full min-w-[640px] text-left font-sans text-sm">
          <thead>
            <tr className="border-b border-[#123c33]/10 text-[#6a746d]">
              <th className="px-4 py-4 font-semibold">Username</th>
              <th className="px-4 py-4 font-semibold">Email</th>
              <th className="px-4 py-4 font-semibold">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-[#123c33]/8 last:border-b-0">
                <td className="px-4 py-4 font-medium text-[#123c33]">{user.username}</td>
                <td className="px-4 py-4 text-[#516056]">{user.email}</td>
                <td className="px-4 py-4">
                  <span className="metric-chip">{user.usertype}</span>
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

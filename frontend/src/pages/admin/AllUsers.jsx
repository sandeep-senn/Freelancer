import { useEffect, useState } from 'react'
import api from '../../services/api'

const AllUsers = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    let isMounted = true

    const loadUsers = async () => {
      try {
        const { data } = await api.get('/user')
        if (isMounted) {
          setUsers([...data].reverse())
        }
      } catch (err) {
        console.error(err)
      }
    }

    loadUsers()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Username</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.usertype}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AllUsers

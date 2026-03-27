import { useEffect, useState } from 'react'
import api from '../../services/api'
import AppLoader from '../../components/AppLoader'

const AllApplications = () => {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadApplications = async () => {
      try {
        const { data } = await api.get('/application')
        if (isMounted) {
          setApplications([...data].reverse())
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadApplications()

    return () => {
      isMounted = false
    }
  }, [])

  if (loading) {
    return <AppLoader label="Loading applications..." />
  }

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-xl font-semibold">All Applications</h2>

      {applications.map(app => (
        <div key={app._id} className="bg-white p-4 rounded-xl shadow">
          <h3 className="font-semibold">{app.title}</h3>
          <p className="text-sm">{app.description}</p>

          <div className="mt-2 flex justify-between text-sm">
            <span>Client: {app.clientName}</span>
            <span>Status: {app.status}</span>
          </div>

          <p className="mt-2">Bid Amount: ₹{app.bidAmount}</p>
        </div>
      ))}
    </div>
  )
}

export default AllApplications

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Login from '../components/Login'
import Register from '../components/Register'

const Authenticate = () => {
  const [authType, setAuthType] = useState('login')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-6 py-4 bg-white shadow">
        <h3
          onClick={() => navigate('/')}
          className="text-xl font-semibold cursor-pointer text-blue-600"
        >
          SB Works
        </h3>
        <button
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-blue-600"
        >
          Home
        </button>
      </div>

      {/* AUTH FORM */}
      <div className="flex-1 flex items-center justify-center">
        {authType === 'login' ? (
          <Login setAuthType={setAuthType} />
        ) : (
          <Register setAuthType={setAuthType} />
        )}
      </div>
    </div>
  )
}

export default Authenticate

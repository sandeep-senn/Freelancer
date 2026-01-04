import { useContext } from 'react'
import { GeneralContext } from '../context/GeneralContext'

const Register = ({ setAuthType }) => {
  const {
    setUsername,
    setEmail,
    setPassword,
    setUsertype,
    register
  } = useContext(GeneralContext)

  const handleRegister = async (e) => {
    e.preventDefault()
    await register()
  }

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-md bg-white p-6 rounded-xl shadow-md"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        Register
      </h2>

      {/* Username */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          type="text"
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email address
        </label>
        <input
          type="email"
          placeholder="name@example.com"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* Password */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      {/* User Type */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          User Type
        </label>
        <select
          onChange={(e) => setUsertype(e.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">Select user type</option>
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Sign up
      </button>

      {/* Switch */}
      <p className="text-center text-sm mt-4">
        Already registered?{' '}
        <span
          onClick={() => setAuthType('login')}
          className="text-blue-600 cursor-pointer hover:underline"
        >
          Login
        </span>
      </p>
    </form>
  )
}

export default Register

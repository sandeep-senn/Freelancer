import { useContext } from 'react';
import { toast } from 'react-toastify';
import { GeneralContext } from '../context/general-context';

const Register = ({ setAuthType }) => {
  const { setUsername, setEmail, setPassword, setUsertype, register } = useContext(GeneralContext);

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      await register();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} className="w-full max-w-md bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
        <input
          type="text"
          placeholder="Username"
          onChange={(event) => setUsername(event.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
          type="email"
          placeholder="name@example.com"
          onChange={(event) => setEmail(event.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="At least 8 characters"
          onChange={(event) => setPassword(event.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">User Type</label>
        <select
          onChange={(event) => setUsertype(event.target.value)}
          className="w-full px-4 py-2 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          required
        >
          <option value="">Select user type</option>
          <option value="freelancer">Freelancer</option>
          <option value="client">Client</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Sign up
      </button>

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
  );
};

export default Register;

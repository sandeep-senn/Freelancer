import { useContext } from 'react';
import { toast } from 'react-toastify';
import { GeneralContext } from '../context/general-context';

const Login = ({ setAuthType }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-gray-100"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Welcome back</h2>
        <p className="text-sm text-gray-500 mt-1">Sign in to continue to SB Works</p>
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
          type="email"
          placeholder="you@example.com"
          onChange={(event) => setEmail(event.target.value)}
          className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          placeholder="Enter password"
          onChange={(event) => setPassword(event.target.value)}
          className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          required
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2.5 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition font-medium"
      >
        Sign In
      </button>

      <p className="text-center text-sm text-gray-600 mt-6">
        Do not have an account?{' '}
        <span
          onClick={() => setAuthType('register')}
          className="text-blue-600 cursor-pointer font-medium hover:underline"
        >
          Create one
        </span>
      </p>
    </form>
  );
};

export default Login;

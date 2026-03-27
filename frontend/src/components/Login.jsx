import { useContext, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { GeneralContext } from '../context/general-context';

const Login = ({ setAuthType }) => {
  const { setEmail, setPassword, login } = useContext(GeneralContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      await login();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className="panel w-full max-w-lg rounded-[34px] p-8 md:p-10">
      <span className="eyebrow">Secure Access</span>
      <h2 className="mt-5 text-xl font-semibold text-[#123c33] md:text-2xl">Welcome back</h2>
      <p className="muted-copy mt-3 text-base leading-7">
        Sign in to continue managing projects, conversations, and approvals inside SB Works.
      </p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Email address</span>
          <input
            type="email"
            placeholder="you@example.com"
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans text-[#123c33] outline-none transition focus:border-[#123c33]/30"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Password</span>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter password"
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 pr-12 font-sans text-[#123c33] outline-none transition focus:border-[#123c33]/30"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute inset-y-0 right-0 flex items-center px-4 text-[#5f6d63]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </label>
      </div>

      <button
        type="submit"
        className="brand-button mt-8 w-full rounded-full py-3.5 font-sans text-sm font-semibold"
      >
        Sign In
      </button>

      <p className="muted-copy mt-6 text-center text-sm">
        Do not have an account?{' '}
        <button
          type="button"
          onClick={() => setAuthType('register')}
          className="font-semibold text-[#123c33] underline underline-offset-4"
        >
          Create one
        </button>
      </p>
    </form>
  );
};

export default Login;

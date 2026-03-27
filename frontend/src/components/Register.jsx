import { useContext, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { GeneralContext } from '../context/general-context';

const Register = ({ setAuthType }) => {
  const { setUsername, setEmail, setPassword, setUsertype, register } = useContext(GeneralContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      await register();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleRegister} className="panel w-full max-w-lg rounded-[34px] p-8 md:p-10">
      <span className="eyebrow">Create Account</span>
      <h2 className="mt-5 text-xl font-semibold text-[#123c33] md:text-2xl">Join the workspace</h2>
      <p className="muted-copy mt-3 text-base leading-7">
        Build a cleaner workflow from day one, whether you are hiring, delivering, or overseeing the platform.
      </p>

      <div className="mt-8 space-y-5">
        <label className="block">
          <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Username</span>
          <input
            type="text"
            placeholder="Your professional name"
            onChange={(event) => setUsername(event.target.value)}
            className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans text-[#123c33] outline-none transition focus:border-[#123c33]/30"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Email address</span>
          <input
            type="email"
            placeholder="name@example.com"
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
              placeholder="At least 8 characters"
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

        <label className="block">
          <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">User type</span>
          <select
            onChange={(event) => setUsertype(event.target.value)}
            className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans text-[#123c33] outline-none transition focus:border-[#123c33]/30"
            required
          >
            <option value="">Select user type</option>
            <option value="freelancer">Freelancer</option>
            <option value="client">Client</option>
            <option value="admin">Admin</option>
          </select>
        </label>
      </div>

      <button
        type="submit"
        className="brand-button mt-8 w-full rounded-full py-3.5 font-sans text-sm font-semibold"
      >
        Create Account
      </button>

      <p className="muted-copy mt-6 text-center text-sm">
        Already registered?{' '}
        <button
          type="button"
          onClick={() => setAuthType('login')}
          className="font-semibold text-[#123c33] underline underline-offset-4"
        >
          Login
        </button>
      </p>
    </form>
  );
};

export default Register;

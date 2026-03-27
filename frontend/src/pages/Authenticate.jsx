import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import { GeneralContext } from '../context/general-context';

const Authenticate = () => {
  const [authType, setAuthType] = useState('login');
  const navigate = useNavigate();
  const { user, authReady } = useContext(GeneralContext);

  useEffect(() => {
    if (authReady && user) {
      navigate(`/${user.usertype}`);
    }
  }, [authReady, navigate, user]);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-96px)] max-w-6xl items-center px-4 py-8">
      <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="panel rounded-[36px] px-6 py-8 md:px-10 md:py-10">
          <span className="eyebrow">Private Workspace Access</span>
          <h1 className="section-title mt-6 max-w-xl">Structured freelance work, without the platform noise.</h1>
          <p className="muted-copy mt-6 max-w-xl text-lg leading-8">
            Sign in to manage delivery, conversations, and approvals in one place. Everything stays visible, professional, and easier to trust.
          </p>

          <div className="mt-10 grid gap-4">
            <AuthFeature
              title="For clients"
              text="Track projects, compare applications, and approve final delivery with much better clarity."
            />
            <AuthFeature
              title="For freelancers"
              text="Keep your profile sharp, manage bids, and handle delivery inside a calmer workflow."
            />
            <AuthFeature
              title="For admins"
              text="Review platform activity from one clean control layer with better visibility over users and projects."
            />
          </div>
        </div>

        <div className="flex items-center justify-center">
          {authType === 'login' ? (
            <Login setAuthType={setAuthType} />
          ) : (
            <Register setAuthType={setAuthType} />
          )}
        </div>
      </div>
    </div>
  );
};

const AuthFeature = ({ title, text }) => (
  <div className="rounded-[26px] border border-[#123c33]/10 bg-white/68 p-5">
    <h3 className="text-xl font-semibold text-[#123c33]">{title}</h3>
    <p className="muted-copy mt-3 leading-7">{text}</p>
  </div>
);

export default Authenticate;

import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/general-context';

const logos = [
  'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_TV_2015.png',
  'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg',
  'https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg'
];

const Landing = () => {
  const navigate = useNavigate();
  const { user, authReady } = useContext(GeneralContext);

  useEffect(() => {
    if (authReady && user) {
      navigate(`/${user.usertype}`);
    }
  }, [authReady, navigate, user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white overflow-hidden">
      <div className="flex justify-between items-center px-8 py-5">
        <h2 className="text-2xl font-bold text-blue-600">SB Works</h2>
        <button
          onClick={() => navigate('/authenticate')}
          className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
        >
          Sign In
        </button>
      </div>

      <section className="text-center px-6 mt-24">
        <h1 className="text-4xl md:text-6xl font-bold max-w-4xl mx-auto">
          Where Talent Meets <span className="text-blue-600">Real Opportunities</span>
        </h1>

        <p className="text-gray-600 max-w-2xl mx-auto mt-6 text-lg">
          SB Works is built for serious freelancers and genuine clients. No spam. No fake
          projects. Just focused collaboration.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <button
            onClick={() => navigate('/authenticate')}
            className="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700"
          >
            Start as Client
          </button>
          <button
            onClick={() => navigate('/authenticate')}
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50"
          >
            Start as Freelancer
          </button>
        </div>
      </section>

      <section className="mt-28 overflow-hidden">
        <h3 className="text-center text-gray-600 mb-6">Used by modern teams and professionals</h3>
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-16 w-max px-8">
            {[...logos, ...logos].map((logo, index) => (
              <img
                key={index}
                src={logo}
                alt="company logo"
                className="h-10 grayscale hover:grayscale-0 transition"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="mt-32 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Freelancing today is broken</h2>
        <p className="text-gray-600">
          Clients face unreliable delivery and unclear proposals. Freelancers waste time on
          low-quality projects and price wars. SB Works fixes this with clarity and structure.
        </p>
      </section>

      <section className="mt-32 max-w-6xl mx-auto px-8 grid md:grid-cols-3 gap-8">
        <Card
          title="Verified Projects"
          text="Every project is reviewed to ensure clarity and genuine intent."
        />
        <Card title="Smart Communication" text="All discussions stay in one place with clear history." />
        <Card title="Structured Workflow" text="Clear steps from application to final delivery." />
      </section>

      <section className="mt-32 bg-white py-24">
        <h2 className="text-3xl font-semibold text-center mb-6">How SB Works</h2>
        <p className="text-gray-600 text-center max-w-3xl mx-auto mb-16">
          A simple, transparent workflow designed to remove confusion and help both clients and
          freelancers focus on real work.
        </p>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-12 px-8">
          <Step
            step="1"
            title="Create and Explore"
            desc="Clients post detailed projects. Freelancers explore verified listings and apply with focused proposals."
          />
          <Step
            step="2"
            title="Connect and Assign"
            desc="Both sides discuss scope, timelines, and expectations before final project assignment."
          />
          <Step
            step="3"
            title="Deliver and Complete"
            desc="Work is submitted, reviewed, and approved through a clear and structured process."
          />
        </div>
      </section>

      <section className="mt-32 mb-24 text-center px-6">
        <h2 className="text-3xl font-semibold">One platform. Clear workflow. Real results.</h2>
        <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
          If you want a focused, professional freelancing experience, SB Works is built for you.
        </p>

        <button
          onClick={() => navigate('/authenticate')}
          className="mt-8 bg-blue-600 text-white px-10 py-3 rounded-lg hover:bg-blue-700"
        >
          Get Started with SB Works
        </button>
      </section>
    </div>
  );
};

const Card = ({ title, text }) => (
  <div className="bg-white p-8 rounded-2xl shadow text-center">
    <h3 className="font-semibold text-lg mb-3">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

const Step = ({ step, title, desc }) => (
  <div className="text-center">
    <div className="w-14 h-14 mx-auto rounded-full bg-blue-600 text-white flex items-center justify-center font-bold mb-4">
      {step}
    </div>
    <h4 className="font-semibold text-lg">{title}</h4>
    <p className="text-gray-600 mt-2">{desc}</p>
  </div>
);

export default Landing;

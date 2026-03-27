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
    <div className="overflow-hidden px-4 pb-20 pt-5 md:px-8">
      <div className="panel mx-auto flex max-w-6xl items-center justify-between rounded-[30px] px-5 py-4 md:px-7">
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#123c33] text-sm font-semibold text-white">
            SB
          </span>
          <div>
            <p className="font-sans text-[0.72rem] uppercase tracking-[0.28em] text-[#7f857e]">
              Talent Platform
            </p>
            <h2 className="text-2xl font-semibold text-[#123c33]">SB Works</h2>
          </div>
        </div>
        <button
          onClick={() => navigate('/authenticate')}
          className="brand-button rounded-full px-5 py-2.5 font-sans text-sm font-semibold"
        >
          Sign In
        </button>
      </div>

      <section className="mx-auto mt-10 max-w-6xl">
        <div className="hero-grid">
          <div className="panel rounded-[36px] px-6 py-8 md:px-10 md:py-12">
            <span className="eyebrow">Professional Freelance Operations</span>
            <h1 className="section-title mt-6 max-w-4xl">
              Premium project execution for clients who want clarity and freelancers who deliver.
            </h1>

            <p className="muted-copy mt-6 max-w-2xl text-lg leading-8">
              SB Works turns noisy freelance work into a structured operating system with better
              briefs, cleaner communication, and approval flows that feel reliable.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/authenticate')}
                className="brand-button rounded-full px-7 py-3.5 font-sans text-sm font-semibold"
              >
                Enter Workspace
              </button>
              <button
                onClick={() => navigate('/authenticate')}
                className="ghost-button rounded-full px-7 py-3.5 font-sans text-sm font-semibold"
              >
                Explore Roles
              </button>
            </div>

            <div className="mt-10 grid gap-4 md:grid-cols-3">
              <Metric
                title="Review-driven projects"
                value="100%"
                text="Projects are screened before serious work begins."
              />
              <Metric
                title="Shared visibility"
                value="1 flow"
                text="Bids, delivery, and chat stay inside one workspace."
              />
              <Metric
                title="Faster decisions"
                value="Clear"
                text="Clients compare proposals with better structure and context."
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="panel rounded-[32px] p-6">
              <p className="font-sans text-sm uppercase tracking-[0.24em] text-[#7b837d]">
                Operational Advantages
              </p>
              <div className="mt-5 space-y-4">
                <Insight
                  title="Verified demand"
                  text="Clients start with a cleaner brief so freelancers spend less time decoding intent."
                />
                <Insight
                  title="Structured communication"
                  text="Conversations stay attached to the project instead of getting buried across tools."
                />
                <Insight
                  title="Controlled approvals"
                  text="Submission and sign-off are visible, documented, and much easier to track."
                />
              </div>
            </div>

            <div className="panel rounded-[32px] p-6">
              <p className="font-sans text-sm uppercase tracking-[0.24em] text-[#7b837d]">
                Trusted By Teams
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {logos.map((logo) => (
                  <div key={logo} className="rounded-2xl border border-[#123c33]/8 bg-white/70 p-4">
                    <img src={logo} alt="company logo" className="mx-auto h-7 grayscale" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl grid gap-4 md:grid-cols-3">
        <Card
          title="Verified Projects"
          text="Every brief enters a cleaner, more serious pipeline before execution begins."
        />
        <Card
          title="Decision Support"
          text="Clients compare proposals with context instead of scanning shallow bids."
        />
        <Card
          title="Professional Delivery"
          text="Submission, review, and completion move through a visible workflow."
        />
      </section>

      <section className="mx-auto mt-12 max-w-6xl panel rounded-[36px] px-6 py-10 md:px-10">
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-5 text-4xl font-semibold text-[#123c33]">
              A cleaner operating rhythm for both sides.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Step
              step="01"
              title="Scope"
              desc="Clients publish projects with a stronger structure and clearer expectations."
            />
            <Step
              step="02"
              title="Select"
              desc="Freelancers apply with focused proposals, better fit, and less confusion."
            />
            <Step
              step="03"
              title="Deliver"
              desc="Work, messages, submission, and approval stay connected from start to finish."
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const Card = ({ title, text }) => (
  <div className="panel rounded-[30px] p-8">
    <div className="mb-5 h-12 w-12 rounded-2xl bg-[#f6e7d2]" />
    <h3 className="text-2xl font-semibold text-[#123c33]">{title}</h3>
    <p className="muted-copy mt-3 leading-7">{text}</p>
  </div>
);

const Step = ({ step, title, desc }) => (
  <div className="rounded-[28px] border border-[#123c33]/10 bg-white/60 p-5">
    <p className="font-sans text-xs font-semibold uppercase tracking-[0.22em] text-[#ba7c32]">
      {step}
    </p>
    <h4 className="mt-3 text-2xl font-semibold text-[#123c33]">{title}</h4>
    <p className="muted-copy mt-3 leading-7">{desc}</p>
  </div>
);

const Metric = ({ title, value, text }) => (
  <div className="rounded-[24px] border border-[#123c33]/10 bg-white/68 p-5">
    <p className="font-sans text-sm text-[#6d776f]">{title}</p>
    <p className="mt-2 text-3xl font-semibold text-[#123c33]">{value}</p>
    <p className="muted-copy mt-2 text-sm leading-6">{text}</p>
  </div>
);

const Insight = ({ title, text }) => (
  <div className="rounded-[24px] border border-[#123c33]/10 bg-white/65 p-4">
    <h3 className="text-xl font-semibold text-[#123c33]">{title}</h3>
    <p className="muted-copy mt-2 text-sm leading-6">{text}</p>
  </div>
);

export default Landing;

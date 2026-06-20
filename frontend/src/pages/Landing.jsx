import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GeneralContext } from '../context/general-context';
import { 
  Shield, 
  BarChart3, 
  Rocket, 
  Activity, 
  CheckCircle2, 
  Search, 
  ArrowRight, 
  Zap, 
  Target 
} from 'lucide-react';

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
          <img
            src="/logo.png"
            alt="Syncora Logo"
            className="h-12 w-12 object-contain rounded-xl"
          />
          <div>
            <p className="font-sans text-[0.72rem] uppercase tracking-[0.28em] text-[#7f857e]">
              Talent Platform
            </p>
            <h2 className="text-2xl font-semibold text-[#0d1e36]">Syncora</h2>
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
              Syncora turns noisy freelance work into a structured operating system with better
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
                icon={Shield}
              />
              <Metric
                title="Shared visibility"
                value="1 flow"
                text="Bids, delivery, and chat stay inside one workspace."
                icon={Activity}
              />
              <Metric
                title="Faster decisions"
                value="Clear"
                text="Clients compare proposals with better structure and context."
                icon={Zap}
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
                  icon={Shield}
                />
                <Insight
                  title="Structured communication"
                  text="Conversations stay attached to the project instead of getting buried across tools."
                  icon={Activity}
                />
                <Insight
                  title="Controlled approvals"
                  text="Submission and sign-off are visible, documented, and much easier to track."
                  icon={CheckCircle2}
                />
              </div>
            </div>

            <div className="panel rounded-[32px] p-6">
              <p className="font-sans text-sm uppercase tracking-[0.24em] text-[#7b837d]">
                Trusted By Teams
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {logos.map((logo) => (
                  <div key={logo} className="rounded-2xl border border-[#0d1e36]/8 bg-white/70 p-4 transition-all hover:border-[#c5a059]/30">
                    <img src={logo} alt="company logo" className="mx-auto h-7 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-6xl grid gap-6 md:grid-cols-3">
        <Card
          title="Verified Projects"
          text="Every brief enters a cleaner, more serious pipeline before execution begins."
          icon={Shield}
        />
        <Card
          title="Decision Support"
          text="Clients compare proposals with context instead of scanning shallow bids."
          icon={BarChart3}
        />
        <Card
          title="Professional Delivery"
          text="Submission, review, and completion move through a visible workflow."
          icon={Rocket}
        />
      </section>

      <section className="mx-auto mt-12 max-w-6xl panel rounded-[36px] px-6 py-10 md:px-10">
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.3fr]">
          <div>
            <span className="eyebrow">How It Works</span>
            <h2 className="mt-5 text-xl font-semibold text-[#0d1e36] md:text-2xl">
              A cleaner operating rhythm for both sides.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Step
              step="01"
              title="Scope"
              desc="Clients publish projects with a stronger structure and clearer expectations."
              icon={Target}
            />
            <Step
              step="02"
              title="Select"
              desc="Freelancers apply with focused proposals, better fit, and less confusion."
              icon={Search}
            />
            <Step
              step="03"
              title="Deliver"
              desc="Work, messages, submission, and approval stay connected from start to finish."
              icon={CheckCircle2}
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const Card = ({ title, text, icon: Icon }) => (
  <div className="panel rounded-[30px] p-8 flex flex-col justify-between min-h-[220px]">
    <div>
      <div className="mb-5 h-12 w-12 rounded-2xl bg-[#fef6e0] flex items-center justify-center text-[#c5a059]">
        <Icon size={24} />
      </div>
      <h3 className="text-xl font-semibold text-[#0d1e36]">{title}</h3>
      <p className="muted-copy mt-3 leading-7 text-sm">{text}</p>
    </div>
    <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-[#c5a059] cursor-pointer hover:underline">
      Learn more <ArrowRight size={14} />
    </div>
  </div>
);

const Step = ({ step, title, desc, icon: Icon }) => (
  <div className="panel rounded-[28px] border border-[#0d1e36]/10 bg-white/60 p-6 flex flex-col justify-between min-h-[200px]">
    <div>
      <div className="flex items-center justify-between">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.22em] text-[#c5a059]">
          {step}
        </p>
        {Icon && <Icon size={20} className="text-[#0d1e36]/40" />}
      </div>
      <h4 className="mt-4 text-xl font-semibold text-[#0d1e36]">{title}</h4>
      <p className="muted-copy mt-2 text-sm leading-6">{desc}</p>
    </div>
  </div>
);

const Metric = ({ title, value, text, icon: Icon }) => (
  <div className="panel rounded-[24px] border border-[#0d1e36]/10 bg-white/68 p-5 flex flex-col justify-between">
    <div>
      <div className="flex items-center gap-2 text-sm text-[#475569]">
        {Icon && <Icon size={16} className="text-[#c5a059]" />}
        <p className="font-sans font-medium">{title}</p>
      </div>
      <p className="mt-3 text-2xl font-bold text-[#0d1e36]">{value}</p>
      <p className="muted-copy mt-2 text-xs leading-5">{text}</p>
    </div>
  </div>
);

const Insight = ({ title, text, icon: Icon }) => (
  <div className="panel rounded-[24px] border border-[#0d1e36]/10 bg-white/65 p-4 flex gap-4 items-start">
    <div className="h-8 w-8 rounded-xl bg-[#e2e8f0] flex items-center justify-center text-[#0d1e36] shrink-0">
      {Icon && <Icon size={16} />}
    </div>
    <div>
      <h3 className="text-base font-semibold text-[#0d1e36]">{title}</h3>
      <p className="muted-copy mt-1 text-xs leading-5">{text}</p>
    </div>
  </div>
);

export default Landing;

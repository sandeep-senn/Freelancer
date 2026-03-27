import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import AppLoader from '../../components/AppLoader';

const NewProject = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [skills, setSkills] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title || !description || !budget || !skills) {
      toast.warning('Please fill all fields');
      return;
    }

    try {
      setSubmitting(true);
      await api.post('/project/create', {
        title,
        description,
        budget,
        skills: skills.split(',').map((skill) => skill.trim()).filter(Boolean)
      });

      toast.success('Project created successfully');
      navigate('/client');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Project creation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return <AppLoader label="Creating project..." />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="panel rounded-[34px] p-6 md:p-8">
        <span className="eyebrow">Create Project</span>
        <h2 className="mt-4 text-4xl font-semibold text-[#123c33]">Publish a stronger project brief.</h2>
        <p className="muted-copy mt-3 max-w-3xl">
          Define the outcome, budget, and required skills clearly so applications come in with better fit and less noise.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
          <label className="block">
            <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Project title</span>
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
              placeholder="Build an internal analytics dashboard"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Description</span>
            <textarea
              rows="6"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
              placeholder="Describe deliverables, scope, expectations, and review process."
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Budget (Rs)</span>
              <input
                type="number"
                value={budget}
                onChange={(event) => setBudget(event.target.value)}
                className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                placeholder="50000"
              />
            </label>

            <label className="block">
              <span className="mb-2 block font-sans text-sm font-medium text-[#123c33]">Required skills</span>
              <input
                type="text"
                value={skills}
                onChange={(event) => setSkills(event.target.value)}
                className="w-full rounded-2xl border border-[#123c33]/10 bg-white/80 px-4 py-3 font-sans"
                placeholder="React, Node, MongoDB"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-[#123c33]/10 bg-white/60 p-5">
            <p className="muted-copy max-w-xl text-sm leading-6">
              Well-scoped projects attract better proposals and make approval much smoother later.
            </p>
            <button
              type="submit"
              className="brand-button rounded-full px-6 py-3 font-sans text-sm font-semibold"
            >
              Publish Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProject;

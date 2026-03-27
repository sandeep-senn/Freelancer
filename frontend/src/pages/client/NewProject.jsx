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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Post New Project</h2>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Project Title</label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter project title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows="4"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Describe the project"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Budget (Rs)</label>
          <input
            type="number"
            value={budget}
            onChange={(event) => setBudget(event.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter budget"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Required Skills</label>
          <input
            type="text"
            value={skills}
            onChange={(event) => setSkills(event.target.value)}
            className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="React, Node, MongoDB"
          />
          <p className="text-xs text-gray-500 mt-1">Separate skills with commas</p>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Submit Project
        </button>
      </form>
    </div>
  );
};

export default NewProject;

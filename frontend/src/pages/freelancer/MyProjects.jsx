import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { GeneralContext } from '../../context/general-context';

const MyProjects = () => {
  const navigate = useNavigate();
  const { user } = useContext(GeneralContext);
  const [projects, setProjects] = useState([]);
  const [displayProjects, setDisplayProjects] = useState([]);

  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const { data } = await api.get('/project');

        const myProjects = data.filter(
          (project) => String(project.freelancerId || '') === user?._id
        );

        setProjects(myProjects);
        setDisplayProjects([...myProjects].reverse());
      } catch (error) {
        console.error(error);
      }
    };

    fetchMyProjects();
  }, [user?._id]);

  const handleFilterChange = (value) => {
    if (!value) {
      setDisplayProjects([...projects].reverse());
      return;
    }

    setDisplayProjects(projects.filter((project) => project.status === value).reverse());
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Projects</h2>

        <select
          onChange={(event) => handleFilterChange(event.target.value)}
          className="border px-3 py-2 rounded-lg"
        >
          <option value="">All Status</option>
          <option value="Assigned">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div className="space-y-4">
        {displayProjects.map((project) => (
          <div
            key={project._id}
            onClick={() => navigate(`/project/${project._id}`)}
            className="bg-white p-5 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
          >
            <div className="flex justify-between mb-2">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <span className="text-sm text-gray-500">
                {new Date(project.postedDate).toLocaleDateString()}
              </span>
            </div>

            <p className="text-gray-600 mb-2">{project.description}</p>

            <div className="flex justify-between text-sm">
              <span className="font-medium">Budget: Rs {project.budget}</span>
              <span
                className={`font-semibold ${
                  project.status === 'Completed' ? 'text-green-600' : 'text-blue-600'
                }`}
              >
                {project.status}
              </span>
            </div>
          </div>
        ))}

        {displayProjects.length === 0 && (
          <p className="text-center text-gray-500">No projects found</p>
        )}
      </div>
    </div>
  );
};

export default MyProjects;

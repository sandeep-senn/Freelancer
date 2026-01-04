import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Admin = () => {
  const navigate = useNavigate();

  const [projectsCount, setProjectsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, applicationsRes, usersRes] = await Promise.all([
        api.get("/project"),
        api.get("/application"),
        api.get("/user"),
      ]);

      setProjectsCount(projectsRes.data.length);

      setCompletedCount(
        projectsRes.data.filter((p) => p.status === "Completed").length
      );

      setApplicationsCount(applicationsRes.data.length);
      setUsersCount(usersRes.data.length);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchDashboardData();
    };
    loadData();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="All Projects"
          value={projectsCount}
          onClick={() => navigate("/admin-projects")}
        />
        <StatCard
          title="Completed Projects"
          value={completedCount}
          onClick={() => navigate("/admin-projects")}
        />
        <StatCard
          title="Applications"
          value={applicationsCount}
          onClick={() => navigate("/admin-applications")}
        />
        <StatCard
          title="Users"
          value={usersCount}
          onClick={() => navigate("/all-users")}
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
  >
    <h4 className="text-gray-600">{title}</h4>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default Admin;

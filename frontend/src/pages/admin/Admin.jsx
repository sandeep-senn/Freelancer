import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import AppLoader from "../../components/AppLoader";

const Admin = () => {
  const navigate = useNavigate();

  const [projectsCount, setProjectsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [applicationsCount, setApplicationsCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, applicationsRes, usersRes] = await Promise.all([
        api.get("/project"),
        api.get("/application"),
        api.get("/user"),
      ]);

      setProjectsCount(projectsRes.data.length);
      setCompletedCount(projectsRes.data.filter((project) => project.status === "Completed").length);
      setApplicationsCount(applicationsRes.data.length);
      setUsersCount(usersRes.data.length);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchDashboardData();
    };
    loadData();
  }, []);

  if (loading) {
    return <AppLoader label="Loading admin dashboard..." />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="panel rounded-[32px] p-6 md:p-8">
        <span className="eyebrow">Admin Overview</span>
        <h2 className="mt-4 text-xl font-semibold text-[#0d1e36] md:text-2xl">
          Monitor platform health at a glance.
        </h2>
        <p className="muted-copy mt-3 max-w-2xl">
          Track the marketplace supply, review completion velocity, and stay ahead of platform
          activity from one executive dashboard.
        </p>
      </div>

      <div className="dashboard-grid mt-6">
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
        <StatCard title="Users" value={usersCount} onClick={() => navigate("/all-users")} />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, onClick }) => (
  <div
    onClick={onClick}
    className="panel stat-card cursor-pointer rounded-[28px] p-6 transition hover:-translate-y-1"
  >
    <p className="font-sans text-xs uppercase tracking-[0.22em] text-[#8b775f]">{title}</p>
    <p className="mt-4 text-xl font-semibold text-[#0d1e36] md:text-2xl">{value}</p>
    <p className="muted-copy mt-3 text-sm">Review details</p>
  </div>
);

export default Admin;

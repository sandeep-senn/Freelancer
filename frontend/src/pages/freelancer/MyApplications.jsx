import { useEffect, useState } from "react";
import api from "../../services/api";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMyApplications = async () => {
      try {
        const { data } = await api.get("/application");

        // ✅ filter at fetch time
        const myApps = data.filter((app) => app.freelancerId === userId);

        setApplications([...myApps].reverse());
      } catch (err) {
        console.error(err);
      }
    };
    fetchMyApplications();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">My Applications</h2>

      <div className="space-y-6">
        {applications.map((app) => (
          <div key={app._id} className="bg-white p-6 rounded-xl shadow">
            <div className="grid md:grid-cols-2 gap-6">
              {/* PROJECT SIDE */}
              <div>
                <h3 className="text-lg font-semibold">{app.title}</h3>
                <p className="text-gray-600">{app.description}</p>

                <p className="mt-2 font-medium">Budget: ₹{app.budget}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {app.requiredSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-gray-100 px-2 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* FREELANCER SIDE */}
              <div>
                <h4 className="font-medium">My Proposal</h4>
                <p className="text-gray-600">{app.proposal}</p>

                <p className="mt-2">Proposed: ₹{app.bidAmount}</p>

                <div className="flex flex-wrap gap-2 mt-2">
                  {app.freelancerSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-100 px-2 py-1 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <p className="mt-3 font-semibold">
                  Status:{" "}
                  <span
                    className={
                      app.status === "Accepted"
                        ? "text-green-600"
                        : app.status === "Rejected"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }
                  >
                    {app.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}

        {applications.length === 0 && (
          <p className="text-center text-gray-500">
            You have not applied to any projects yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default MyApplications;

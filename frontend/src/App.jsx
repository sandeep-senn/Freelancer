import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Authenticate from './pages/Authenticate';
import Freelancer from './pages/freelancer/Freelancer';
import AllProjects from './pages/freelancer/AllProjects';
import MyProjects from './pages/freelancer/MyProjects';
import MyApplications from './pages/freelancer/MyApplications';
import ProjectData from './pages/freelancer/ProjectData';
import Client from './pages/client/Client';
import ProjectApplications from './pages/client/ProjectApplications';
import NewProject from './pages/client/NewProject';
import ProjectWorking from './pages/client/ProjectWorking';
import Admin from './pages/admin/Admin';
import AdminProjects from './pages/admin/AdminProjects';
import AllApplications from './pages/admin/AllApplications';
import AllUsers from './pages/admin/AllUsers';

function App() {
  return (
    <div className="min-h-screen app-shell">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <Navbar />

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/authenticate" element={<Authenticate />} />

        <Route
          path="/freelancer"
          element={
            <ProtectedRoute roles={['freelancer']}>
              <Freelancer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-projects"
          element={
            <ProtectedRoute roles={['freelancer']}>
              <AllProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-projects"
          element={
            <ProtectedRoute roles={['freelancer']}>
              <MyProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myApplications"
          element={
            <ProtectedRoute roles={['freelancer']}>
              <MyApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project/:id"
          element={
            <ProtectedRoute roles={['freelancer']}>
              <ProjectData />
            </ProtectedRoute>
          }
        />

        <Route
          path="/client"
          element={
            <ProtectedRoute roles={['client']}>
              <Client />
            </ProtectedRoute>
          }
        />
        <Route
          path="/project-applications"
          element={
            <ProtectedRoute roles={['client']}>
              <ProjectApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/new-project"
          element={
            <ProtectedRoute roles={['client']}>
              <NewProject />
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-project/:id"
          element={
            <ProtectedRoute roles={['client']}>
              <ProjectWorking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-projects"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminProjects />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin-applications"
          element={
            <ProtectedRoute roles={['admin']}>
              <AllApplications />
            </ProtectedRoute>
          }
        />
        <Route
          path="/all-users"
          element={
            <ProtectedRoute roles={['admin']}>
              <AllUsers />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;

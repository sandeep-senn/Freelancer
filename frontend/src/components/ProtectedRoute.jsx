import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GeneralContext } from '../context/general-context';
import AppLoader from './AppLoader';

const ProtectedRoute = ({ children, roles }) => {
  const { user, authReady } = useContext(GeneralContext);

  if (!authReady) {
    return <AppLoader label="Loading dashboard..." />;
  }

  if (!user) {
    return <Navigate to="/authenticate" replace />;
  }

  if (roles?.length && !roles.includes(user.usertype)) {
    return <Navigate to={`/${user.usertype}`} replace />;
  }

  return children;
};

export default ProtectedRoute;

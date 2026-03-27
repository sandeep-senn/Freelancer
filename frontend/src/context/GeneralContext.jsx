import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { GeneralContext } from './general-context';
import { clearStoredAuth, loadStoredAuth, saveStoredAuth } from '../utils/auth';

const GeneralContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [usertype, setUsertype] = useState('');

  useEffect(() => {
    const syncSession = async () => {
      const storedAuth = loadStoredAuth();

      if (!storedAuth?.token) {
        setAuthReady(true);
        return;
      }

      setToken(storedAuth.token);
      if (storedAuth.user) {
        setUser(storedAuth.user);
      }

      try {
        const { data } = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${storedAuth.token}`
          }
        });

        setUser(data.user);
        saveStoredAuth({ token: storedAuth.token, user: data.user });
      } catch (error) {
        if (error.response?.status === 401) {
          clearStoredAuth();
          setToken('');
          setUser(null);
        } else if (storedAuth.user) {
          setUser(storedAuth.user);
        }
      } finally {
        setAuthReady(true);
      }
    };

    syncSession();
  }, []);

  const persistSession = ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);
    saveStoredAuth({ user: nextUser, token: nextToken });
  };

  const login = async () => {
    const { data } = await api.post('/auth/login', { email, password });
    persistSession(data);
    navigate(`/${data.user.usertype}`);
  };

  const register = async () => {
    const { data } = await api.post('/auth/register', {
      username,
      email,
      password,
      usertype
    });

    persistSession(data);
    navigate(`/${data.user.usertype}`);
  };

  const logout = () => {
    clearStoredAuth();
    setToken('');
    setUser(null);
    navigate('/');
  };

  return (
    <GeneralContext.Provider
      value={{
        authReady,
        user,
        token,
        login,
        register,
        logout,
        username,
        setUsername,
        email,
        setEmail,
        password,
        setPassword,
        usertype,
        setUsertype
      }}
    >
      {children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;

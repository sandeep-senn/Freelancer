import { createContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'

export const GeneralContext = createContext()

const GeneralContextProvider = ({ children }) => {
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [usertype, setUsertype] = useState('')

  // ---------------- LOGIN ----------------
  const login = async () => {
    try {
      const { data } = await api.post('/auth/login', {
        email,
        password
      })

      localStorage.setItem('userId', data._id)
      localStorage.setItem('usertype', data.usertype)
      localStorage.setItem('username', data.username)
      localStorage.setItem('email', data.email)

      navigate(`/${data.usertype}`)
    } catch (error) {
      alert('Login failed')
      console.error(error)
    }
  }

  // ---------------- REGISTER ----------------
  const register = async () => {
    try {
      const { data } = await api.post('/auth/register', {
        username,
        email,
        password,
        usertype
      })

      localStorage.setItem('userId', data._id)
      localStorage.setItem('usertype', data.usertype)
      localStorage.setItem('username', data.username)
      localStorage.setItem('email', data.email)

      navigate(`/${data.usertype}`)
    } catch (error) {
      alert('Registration failed')
      console.error(error)
    }
  }

  // ---------------- LOGOUT ----------------
  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <GeneralContext.Provider
      value={{
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
  )
}

export default GeneralContextProvider

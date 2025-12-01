import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const raw = localStorage.getItem('auth_user')
    if(raw) setUser(JSON.parse(raw))
  },[])

  function login({ email, password }){
    const logged = { email, role: 'admin' }
    setUser(logged)
    localStorage.setItem('auth_user', JSON.stringify(logged))
    return true
  }

  function logout(){
    setUser(null)
    localStorage.removeItem('auth_user')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(){
  return useContext(AuthContext)
}

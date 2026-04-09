import { Route, Routes } from 'react-router'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useEffect } from 'react'
import useAuthStore from './stores/auth'



function App() {

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username') 
    if (token) {
      // If token exists, set the auth data in the store
      useAuthStore.getState().setAuthData(token, username)
    }}, [])


  return (

    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route  path="/" element={<MainPage />} />
      </Route>
      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/signup' element={<SignupPage />}></Route>
        
    </Routes>
  )
}

export default App

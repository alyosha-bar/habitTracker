import { Route, Routes } from 'react-router'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { useEffect } from 'react'
import useAuthStore from './stores/auth'
import Hyperfocus from './pages/Hyperfocus'



function App() {
  const setAuthData = useAuthStore((state) => state.setAuthData);
  const finishHydration = useAuthStore((state) => state.finishHydration); // You'll need to add this action

  useEffect(() => {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      
      if (token) {
          setAuthData(token, username);
      }
      
      finishHydration();
  }, [setAuthData, finishHydration]); 


  return (

    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route  path="/" element={<MainPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route  path="/hyperfocus" element={<Hyperfocus />} />
      </Route>

      <Route path='/login' element={<LoginPage />}></Route>
      <Route path='/signup' element={<SignupPage />}></Route>
        
    </Routes>
  )
}

export default App

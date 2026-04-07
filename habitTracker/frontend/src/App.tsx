import { Route, Routes } from 'react-router'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { ProtectedRoute } from './components/ProtectedRoute'



function App() {



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

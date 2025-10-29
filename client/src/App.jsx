import { BrowserRouter, Routes, Route } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import Register from './components/Register/Register'
import Login from './components/Login/Login'
import MainPage from './components/MainPage/MainPage'

import './App.css'

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <div className='main-page-wrapper'>
            <Routes>
              <Route path='/' element={<MainPage />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<Login />} />
            </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

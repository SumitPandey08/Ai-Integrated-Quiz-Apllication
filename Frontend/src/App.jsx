import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import {Route , Routes , BrowserRouter} from 'react-router-dom'
import QuizHome from './pages/QuizHome'
import QuizStart from './pages/QuizStart'
import LogoutPage from './pages/LogOut'
function App() {
  

  return (
    <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/signup' element={<SignUp/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/quiz' element={<QuizHome/>}/>
      <Route path='/quizid' element={<QuizStart/>} />
      <Route path='/logout' element={<LogoutPage/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App

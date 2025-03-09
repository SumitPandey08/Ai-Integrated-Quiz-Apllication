import './App.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import {Route , Routes , BrowserRouter} from 'react-router-dom'
import QuizHome from './pages/QuizHome'
import QuizStart from './pages/QuizStart'
import LogoutPage from './pages/LogOut'
import Profile from './pages/Profile'
import About from './pages/About'
import Contact from './pages/Contact'
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
      <Route path='/profile' element={<Profile/>} />
      <Route path='/about' element={<About/>} />
      <Route path='/contact' element={<Contact/>}/>
    </Routes>
    
    </BrowserRouter>
  )
}

export default App

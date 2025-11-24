import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Login from './pages/Login'
import Register from './pages/register'
import NotFound from './pages/NotFound'
import '../styles/global.css'

function App() {

  return (
    <>
    <Router>
      <div className='app'>
        <Routes>
          <Route path='/register' 
          element={
            <Register/>
          } />
          <Route path='/login' 
          element={
            <Login/>
          } />
          <Route path='*' 
          element={
            <NotFound/>
          } />
        </Routes>
      </div>
    </Router>
    <ToastContainer position="top-right" autoClose={1000} />
    </>
  )
}

export default App

import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import '../styles/global.css'
import { AuthProvider } from './context/AuthContext'
import React from 'react'

const Login = React.lazy(()=> import('./pages/Login'))
const Register = React.lazy(()=> import('./pages/register'))
const NotFound = React.lazy(()=> import('./pages/NotFound'))
const ForgotPassword = React.lazy(()=> import('./pages/ForgotPassword'))

function App() {

  return (
    <>
    <AuthProvider>
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
          <Route path='/forgot-password' 
          element={
            <ForgotPassword/>
          } />
          <Route path='*' 
          element={
            <NotFound/>
          } />
        </Routes>
      </div>
    </Router>
    </AuthProvider>
    <ToastContainer position="top-right" autoClose={1000} />
    </>
  )
}

export default App

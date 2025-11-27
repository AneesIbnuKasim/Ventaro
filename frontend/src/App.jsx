import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import '../styles/global.css'
import { AuthProvider } from './context/AuthContext'
import React from 'react'
import ResetPassword from './pages/ResetPassword'

const Login = React.lazy(()=> import('./pages/Login'))
const Register = React.lazy(()=> import('./pages/register'))
const NotFound = React.lazy(()=> import('./pages/NotFound'))
const ForgotPassword = React.lazy(()=> import('./pages/ForgotPassword'))
const SubmitOtp = React.lazy(()=> import('./pages/SubmitOtp'))
const AdminLogin = React.lazy(()=> import('./pages/AdminLogin'))

function App() {

  return (
    <>
    <AuthProvider>
      <Router>
      <div className='app'>
        <Routes>
          <Route path='/admin'>
            <Route index path='login' element={<AdminLogin/>} />
          </Route>
          <Route path='/auth' element=''>
              <Route index path='register' 
          element={
            <Register/>
          } />
          <Route path='login' 
          element={
            <Login/>
          } />
          <Route path='forgot-password' 
          element={
            <ForgotPassword/>
          } />
          <Route path='verify-otp' 
          element={
            <SubmitOtp/>
          } />
          <Route path='reset-password' 
          element={
            <ResetPassword/>
          } />
          </Route>
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

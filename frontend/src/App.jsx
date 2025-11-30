import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import '../styles/global.css'
import { AuthProvider } from './context/AuthContext'
import React from 'react'
import ResetPassword from './pages/ResetPassword'
import { PublicRoute } from './components/ProtectedRoute'
import AppLayout from './components/AppLayout'
import Users from './pages/Users'
import Categories from './pages/Categories'

const Login = React.lazy(()=> import('./pages/Login'))
const Register = React.lazy(()=> import('./pages/register'))
const NotFound = React.lazy(()=> import('./pages/NotFound'))
const ForgotPassword = React.lazy(()=> import('./pages/ForgotPassword'))
const SubmitOtp = React.lazy(()=> import('./pages/SubmitOtp'))
const AdminLogin = React.lazy(()=> import('./pages/AdminLogin'))
const AdminHeader = React.lazy(()=> import('./components/ui/AdminHeader'))
const AdminDashboard = React.lazy(()=> import('./pages/AdminDashboard'))

function App() {

  return (
    <>
    <AuthProvider>
      <Router>
      <div className='app'>
        <Routes>
            <Route path='login' element={<AdminLogin/>} />
            <Route path='/app' element={<AppLayout/>} />
            <Route path='/dash' element={<AdminDashboard/>} />
            <Route path='/users' element={<Users/>} />
            <Route path='/categories' element={<Categories/>} />

              <Route index path='register' 
          element={
            <PublicRoute>
              <Register/>
            </PublicRoute>
          } />
          <Route path='login' 
          element={
            <PublicRoute>
              <Login/>
            </PublicRoute>
          } />
          <Route path='forgot-password' 
          element={
            <PublicRoute>
              <ForgotPassword/>
            </PublicRoute>
          } />
          <Route path='verify-otp' 
          element={
            <PublicRoute>
              <SubmitOtp/>
            </PublicRoute>
          } />
          <Route path='reset-password' 
          element={
            <PublicRoute>
              <ResetPassword/>
            </PublicRoute>
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


import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile";
import Dashoboard from "./pages/Dashoboard";
import ResetPassword from "./pages/ResetPassword";
import ForgotPassword from "./pages/ForgotPassword";
import SubmitOtp from "./pages/SubmitOtp";
import Users from "./pages/Users";
import AdminLogin from "./pages/AdminLogin";
import Categories from "./pages/Categories";
import AdminLayout from "./components/AdminLayout";
import NotFound from "./pages/NotFound";
import { AdminProvider } from './context/AdminContext'
import { AdminRoute, ProtectedRoute, PublicRoute } from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify"
import { AuthProvider } from "./context/AuthContext";

const App = () => (
  <AdminProvider>
      <AuthProvider>
        <BrowserRouter>

        <Routes>

        Public Auth Routes
   <Route
      path='/login'
      element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      
        <Route
          path='/register'
          element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
        
          <Route
            path='/forgot-password'
            element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />
          
            <Route
              path='/verify-otp'
              element={
                  <PublicRoute>
                    <SubmitOtp />
                  </PublicRoute>
                }
              />
            
              <Route
                path='/reset-password'
                element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  }
                />
            

          {/*         protected user routes        */}
          <Route path="/auth" element={
            <ProtectedRoute>
              {/* prtoected page layout */}
            </ProtectedRoute>
          } >
            {/* Protected pages */}
          </Route>

{/*         ADMIN PUBLIC ROUTE              */}
          <Route path="/admin/login" element={
            <PublicRoute>
              <AdminLogin/>
            </PublicRoute>
          } 
            />

          {/*       ADMIN PROTECTED ROUTE       */}
          <Route path="/" element={
            <AdminRoute >
              <AdminLayout />
            </AdminRoute>
            }>
            <Route index element={<Dashoboard />} />
            <Route path="users" element={<Users />} />
            <Route path="categories" element={<Categories />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={1000} />
      </BrowserRouter>
      </AuthProvider>
  </AdminProvider>

);

export default App;
